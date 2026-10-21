import {
  createNoteForUser,
  deleteNoteForUser,
  emptyTrashForUser,
  listNotesForUser,
  updateNoteForUser,
  updateNoteStateForUser,
} from '../services/noteService.js'
import { addImageToNote, deleteImageFromNote, findOwnedImage, resolveStoredImage } from '../services/imageService.js'

/**
 * Returns all notes owned by the authenticated user, including starred, archived, and trashed notes.
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
 * Updates an authenticated user's note title and content.
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
 * Stars, archives, trashes, or restores an authenticated user's note.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.patch('/:noteId', updateNoteState)
 */
export async function updateNoteState(request, response) {
  const note = await updateNoteStateForUser(request.userId, request.params.noteId, request.validatedBody)
  response.json({ success: true, data: { note } })
}

/**
 * Permanently deletes an authenticated user's note.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.delete('/:noteId', deleteNote)
 */
export async function deleteNote(request, response) {
  await deleteNoteForUser(request.userId, request.params.noteId)
  response.status(204).send()
}

/**
 * Permanently deletes every trashed note owned by the authenticated user.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.delete('/trash', emptyTrash)
 */
export async function emptyTrash(request, response) {
  const deleted = await emptyTrashForUser(request.userId)
  response.json({ success: true, data: { deleted } })
}

/**
 * Attaches the uploaded image to an authenticated user's note.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.post('/:noteId/images', uploadImage, addImage)
 */
export async function addImage(request, response) {
  const image = await addImageToNote(request.userId, request.params.noteId, request.file)
  response.status(201).json({ success: true, data: { image } })
}

/**
 * Streams a private note image to its owner.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.get('/:noteId/images/:imageId', getImage)
 */
export async function getImage(request, response) {
  const image = await findOwnedImage(request.userId, request.params.noteId, request.params.imageId)
  response.set('Cache-Control', 'private, max-age=86400')
  response.type(image.mimeType)
  response.sendFile(resolveStoredImage(image.fileName))
}

/**
 * Removes one image from an authenticated user's note.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.delete('/:noteId/images/:imageId', deleteImage)
 */
export async function deleteImage(request, response) {
  await deleteImageFromNote(request.userId, request.params.noteId, request.params.imageId)
  response.status(204).send()
}
