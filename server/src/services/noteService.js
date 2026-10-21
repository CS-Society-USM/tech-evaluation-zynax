import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/appError.js'
import { removeStoredImages } from './imageService.js'

const noteInclude = { images: { orderBy: { createdAt: 'asc' } } }

/**
 * Converts a database note into the public API shape, exposing image URLs instead of file names.
 *
 * @param {object} note Prisma note including its images.
 * @returns {object} Client-safe note.
 * @example
 * response.json({ note: serializeNote(note) })
 */
export function serializeNote(note) {
  const { images = [], ownerId, ...fields } = note
  void ownerId
  return {
    ...fields,
    images: images.map((image) => ({ id: image.id, url: `/api/v1/notes/${note.id}/images/${image.id}` })),
  }
}

/**
 * Loads one note only when it belongs to the user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @returns {Promise<object>} Owned note including images.
 * @throws {AppError} 404 when the note does not exist or belongs to someone else.
 * @example
 * const note = await findOwnedNote(userId, noteId)
 */
export async function findOwnedNote(ownerId, noteId) {
  const note = await prisma.note.findFirst({ where: { id: noteId, ownerId }, include: noteInclude })

  if (!note) {
    throw new AppError(404, 'Note not found.')
  }

  return note
}

/**
 * Lists every note owned by a user, including starred, archived, and trashed notes, newest updates first.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @returns {Promise<Array>} User-owned notes.
 * @example
 * const notes = await listNotesForUser(request.userId)
 */
export async function listNotesForUser(ownerId) {
  const notes = await prisma.note.findMany({ where: { ownerId }, include: noteInclude, orderBy: { updatedAt: 'desc' } })
  return notes.map(serializeNote)
}

/**
 * Creates a note owned by the authenticated user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {{title: string, content: string}} input Validated note data.
 * @returns {Promise<object>} Created note.
 * @example
 * const note = await createNoteForUser(userId, { title, content })
 */
export async function createNoteForUser(ownerId, input) {
  const note = await prisma.note.create({ data: { ...input, ownerId }, include: noteInclude })
  return serializeNote(note)
}

/**
 * Updates a note's title and content only when it belongs to the authenticated user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @param {{title: string, content: string}} input Validated note data.
 * @returns {Promise<object>} Updated note.
 * @example
 * const note = await updateNoteForUser(userId, noteId, input)
 */
export async function updateNoteForUser(ownerId, noteId, input) {
  const result = await prisma.note.updateMany({ where: { id: noteId, ownerId }, data: input })

  if (result.count === 0) {
    throw new AppError(404, 'Note not found.')
  }

  return serializeNote(await findOwnedNote(ownerId, noteId))
}

/**
 * Stars, archives, or trashes a note owned by the authenticated user.
 * Archiving and trashing store a timestamp; passing false restores the note. The note's updatedAt is preserved.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @param {{isStarred?: boolean, archived?: boolean, trashed?: boolean}} input Validated state changes.
 * @returns {Promise<object>} Updated note.
 * @example
 * await updateNoteStateForUser(userId, noteId, { trashed: true })
 */
export async function updateNoteStateForUser(ownerId, noteId, input) {
  const note = await findOwnedNote(ownerId, noteId)
  const now = new Date()
  const data = {
    ...(input.isStarred === undefined ? {} : { isStarred: input.isStarred }),
    ...(input.archived === undefined ? {} : { archivedAt: input.archived ? now : null }),
    ...(input.trashed === undefined ? {} : { trashedAt: input.trashed ? now : null }),
    // State changes are not edits, so keep the original "last edited" time.
    updatedAt: note.updatedAt,
  }
  const updated = await prisma.note.update({ where: { id: note.id }, data, include: noteInclude })
  return serializeNote(updated)
}

/**
 * Permanently deletes a note and its stored images only when it belongs to the authenticated user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @returns {Promise<void>}
 * @example
 * await deleteNoteForUser(userId, noteId)
 */
export async function deleteNoteForUser(ownerId, noteId) {
  const note = await findOwnedNote(ownerId, noteId)
  await prisma.note.delete({ where: { id: note.id } })
  await removeStoredImages(note.images.map((image) => image.fileName))
}

/**
 * Permanently deletes every trashed note owned by the user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @returns {Promise<number>} Number of deleted notes.
 * @example
 * const removed = await emptyTrashForUser(userId)
 */
export async function emptyTrashForUser(ownerId) {
  const trashed = await prisma.note.findMany({ where: { ownerId, trashedAt: { not: null } }, include: noteInclude })
  await prisma.note.deleteMany({ where: { ownerId, trashedAt: { not: null } } })
  await removeStoredImages(trashed.flatMap((note) => note.images.map((image) => image.fileName)))
  return trashed.length
}
