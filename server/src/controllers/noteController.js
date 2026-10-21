import {
  createNoteForUser,
  deleteNoteForUser,
  listNotesForUser,
  updateNoteForUser,
} from '../services/noteService.js'

/**
 * Returns all notes owned by the authenticated user.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.get('/', listNotes)
 */
export async function listNotes(request, response) {
  const notes = await listNotesForUser(request.userId)
  response.json({ success: true, data: { notes } })
}

/**
 * Creates a note for the authenticated user.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.post('/', createNote)
 */
export async function createNote(request, response) {
  const note = await createNoteForUser(request.userId, request.validatedBody)
  response.status(201).json({ success: true, data: { note } })
}

/**
 * Updates an authenticated user's note.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.put('/:noteId', updateNote)
 */
export async function updateNote(request, response) {
  const note = await updateNoteForUser(request.userId, request.params.noteId, request.validatedBody)
  response.json({ success: true, data: { note } })
}

/**
 * Deletes an authenticated user's note.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.delete('/:noteId', deleteNote)
 */
export async function deleteNote(request, response) {
  await deleteNoteForUser(request.userId, request.params.noteId)
  response.status(204).send()
}
