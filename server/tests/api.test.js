import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

process.env.DATABASE_URL = 'file:./test.db'
process.env.JWT_SECRET = 'integration-test-secret-with-sufficient-length'
process.env.CLIENT_ORIGIN = 'http://localhost:5173'
process.env.NODE_ENV = 'test'
process.env.UPLOAD_DIR = mkdtempSync(path.join(tmpdir(), 'mora-uploads-'))

const PNG_BYTES = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082', 'hex')

let app
let prisma

/**
 * Registers a test account and preserves its authentication cookie on the agent.
 *
 * @param {import('supertest').SuperAgentTest} agent Cookie-aware Supertest agent.
 * @param {string} email Unique test email.
 * @returns {Promise<import('supertest').Response>} Registration response.
 * @example
 * await registerTestAccount(agent, 'first@example.com')
 */
function registerTestAccount(agent, email) {
  return agent.post('/api/v1/auth/register').send({
    name: 'Test Writer',
    email,
    password: 'testing-password-123',
  })
}

beforeAll(async () => {
  const appModule = await import('../src/app.js')
  const prismaModule = await import('../src/config/prisma.js')
  app = appModule.createApp()
  prisma = prismaModule.prisma
  await prisma.note.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.note.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()
  rmSync(process.env.UPLOAD_DIR, { recursive: true, force: true })
})

describe('Notes API', () => {
  it('reports API health', async () => {
    const response = await request(app).get('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ success: true, data: { status: 'ok' } })
  })

  it('supports authentication and enforces note ownership for CRUD operations', async () => {
    const firstUser = request.agent(app)
    const secondUser = request.agent(app)

    expect((await registerTestAccount(firstUser, 'owner@example.com')).status).toBe(201)
    expect((await registerTestAccount(secondUser, 'other@example.com')).status).toBe(201)

    const createResponse = await firstUser.post('/api/v1/notes').send({
      title: 'Owned thought',
      content: 'Only the first account should be able to change this note.',
    })
    const noteId = createResponse.body.data.note.id

    expect(createResponse.status).toBe(201)
    expect((await firstUser.get('/api/v1/notes')).body.data.notes).toHaveLength(1)
    expect((await secondUser.get('/api/v1/notes')).body.data.notes).toHaveLength(0)

    const forbiddenUpdate = await secondUser.put(`/api/v1/notes/${noteId}`).send({
      title: 'Unauthorized update',
      content: 'This must not be persisted.',
    })
    expect(forbiddenUpdate.status).toBe(404)
    expect((await secondUser.delete(`/api/v1/notes/${noteId}`)).status).toBe(404)

    const ownerUpdate = await firstUser.put(`/api/v1/notes/${noteId}`).send({
      title: 'Updated by owner',
      content: 'This change is allowed.',
    })
    expect(ownerUpdate.status).toBe(200)
    expect(ownerUpdate.body.data.note.title).toBe('Updated by owner')
    expect((await firstUser.delete(`/api/v1/notes/${noteId}`)).status).toBe(204)
    expect((await firstUser.get('/api/v1/notes')).body.data.notes).toHaveLength(0)
  })

  it('rejects unauthenticated note access and invalid registration input', async () => {
    const sessionResponse = await request(app).get('/api/v1/auth/me')
    const noteResponse = await request(app).get('/api/v1/notes')
    const registrationResponse = await request(app).post('/api/v1/auth/register').send({
      name: 'A',
      email: 'not-an-email',
      password: 'short',
    })

    expect(sessionResponse.status).toBe(200)
    expect(sessionResponse.body.data.user).toBeNull()
    expect(noteResponse.status).toBe(401)
    expect(registrationResponse.status).toBe(400)
    expect(registrationResponse.body.details.length).toBeGreaterThan(0)
  })

  it('stars, archives, trashes, and restores notes only for their owner', async () => {
    const owner = request.agent(app)
    const intruder = request.agent(app)
    await registerTestAccount(owner, 'state-owner@example.com')
    await registerTestAccount(intruder, 'state-intruder@example.com')

    const created = (await owner.post('/api/v1/notes').send({ title: 'Stateful', content: 'Star me.' })).body.data.note
    const noteId = created.id

    expect((await intruder.patch(`/api/v1/notes/${noteId}`).send({ isStarred: true })).status).toBe(404)
    expect((await owner.patch(`/api/v1/notes/${noteId}`).send({})).status).toBe(400)

    const starred = await owner.patch(`/api/v1/notes/${noteId}`).send({ isStarred: true, archived: true })
    expect(starred.status).toBe(200)
    expect(starred.body.data.note.isStarred).toBe(true)
    expect(starred.body.data.note.archivedAt).not.toBeNull()
    expect(starred.body.data.note.updatedAt).toBe(created.updatedAt)

    const trashed = await owner.patch(`/api/v1/notes/${noteId}`).send({ archived: false, trashed: true })
    expect(trashed.body.data.note.archivedAt).toBeNull()
    expect(trashed.body.data.note.trashedAt).not.toBeNull()

    const restored = await owner.patch(`/api/v1/notes/${noteId}`).send({ trashed: false })
    expect(restored.body.data.note.trashedAt).toBeNull()

    await owner.patch(`/api/v1/notes/${noteId}`).send({ trashed: true })
    expect((await intruder.delete('/api/v1/notes/trash')).body.data.deleted).toBe(0)
    expect((await owner.delete('/api/v1/notes/trash')).body.data.deleted).toBe(1)
    expect((await owner.get('/api/v1/notes')).body.data.notes).toHaveLength(0)
  })

  it('stores private note images and rejects other accounts and invalid files', async () => {
    const owner = request.agent(app)
    const intruder = request.agent(app)
    await registerTestAccount(owner, 'image-owner@example.com')
    await registerTestAccount(intruder, 'image-intruder@example.com')

    const noteId = (await owner.post('/api/v1/notes').send({ title: 'With image', content: 'Look at this.' })).body.data.note.id
    const imagesPath = `/api/v1/notes/${noteId}/images`

    expect((await intruder.post(imagesPath).attach('image', PNG_BYTES, { filename: 'a.png', contentType: 'image/png' })).status).toBe(404)
    expect((await owner.post(imagesPath).attach('image', Buffer.from('not an image'), { filename: 'a.png', contentType: 'image/png' })).status).toBe(400)
    expect((await owner.post(imagesPath).attach('image', Buffer.from('<svg/>'), { filename: 'a.svg', contentType: 'image/svg+xml' })).status).toBe(400)

    const upload = await owner.post(imagesPath).attach('image', PNG_BYTES, { filename: 'a.png', contentType: 'image/png' })
    expect(upload.status).toBe(201)
    const { url } = upload.body.data.image

    const download = await owner.get(url)
    expect(download.status).toBe(200)
    expect(download.headers['content-type']).toContain('image/png')
    expect((await intruder.get(url)).status).toBe(404)
    expect((await request(app).get(url)).status).toBe(401)

    expect((await owner.get('/api/v1/notes')).body.data.notes[0].images).toHaveLength(1)
    expect((await intruder.delete(url)).status).toBe(404)
    expect((await owner.delete(url)).status).toBe(204)
    expect((await owner.get(url)).status).toBe(404)
  })
})
