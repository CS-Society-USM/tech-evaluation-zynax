import { Router } from 'express'
import {
  addImage,
  createNote,
  deleteImage,
  deleteNote,
  emptyTrash,
  getImage,
  listNotes,
  updateNote,
  updateNoteState,
} from '../controllers/noteController.js'
import { authenticate } from '../middleware/authenticate.js'
import { uploadImage } from '../middleware/uploadImage.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createNoteSchema, noteStateSchema, updateNoteSchema } from '../validators/noteSchemas.js'

/** Note routes mounted at `/api/v1/notes`; every route requires authentication and enforces ownership. */
export const noteRouter = Router()

noteRouter.use(authenticate)
noteRouter.get('/', asyncHandler(listNotes))
noteRouter.post('/', validate(createNoteSchema), asyncHandler(createNote))
noteRouter.delete('/trash', asyncHandler(emptyTrash))
noteRouter.put('/:noteId', validate(updateNoteSchema), asyncHandler(updateNote))
noteRouter.patch('/:noteId', validate(noteStateSchema), asyncHandler(updateNoteState))
noteRouter.delete('/:noteId', asyncHandler(deleteNote))
noteRouter.post('/:noteId/images', uploadImage, asyncHandler(addImage))
noteRouter.get('/:noteId/images/:imageId', asyncHandler(getImage))
noteRouter.delete('/:noteId/images/:imageId', asyncHandler(deleteImage))
