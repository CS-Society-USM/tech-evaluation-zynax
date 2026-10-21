import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/appError.js'

/**
 * Lists notes owned by a user, newest updates first.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @returns {Promise<Array>} User-owned notes.
 * @example
 * const notes = await listNotesForUser(request.userId)
 */
export function listNotesForUser(ownerId) {
  return prisma.note.findMany({ where: { ownerId }, orderBy: { updatedAt: 'desc' } })
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
export function createNoteForUser(ownerId, input) {
  return prisma.note.create({ data: { ...input, ownerId } })
}

/**
 * Updates a note only when it belongs to the authenticated user.
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

  return prisma.note.findFirst({ where: { id: noteId, ownerId } })
}

/**
 * Deletes a note only when it belongs to the authenticated user.
 *
 * @param {string} ownerId Authenticated user's identifier.
 * @param {string} noteId Note identifier.
 * @returns {Promise<void>}
 * @example
 * await deleteNoteForUser(userId, noteId)
 */
export async function deleteNoteForUser(ownerId, noteId) {
  const result = await prisma.note.deleteMany({ where: { id: noteId, ownerId } })

  if (result.count === 0) {
    throw new AppError(404, 'Note not found.')
  }
}
