import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

process.env.DATABASE_URL = 'file:./test.db'
process.env.JWT_SECRET = 'integration-test-secret-with-sufficient-length'
process.env.CLIENT_ORIGIN = 'http://localhost:5173'
process.env.NODE_ENV = 'test'

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
})
