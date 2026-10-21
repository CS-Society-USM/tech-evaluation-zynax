import { Router } from 'express'
import { createNote, deleteNote, listNotes, updateNote } from '../controllers/noteController.js'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createNoteSchema, updateNoteSchema } from '../validators/noteSchemas.js'

/** Note routes mounted at `/api/v1/notes`; every route requires authentication. */
export const noteRouter = Router()

noteRouter.use(authenticate)
noteRouter.get('/', asyncHandler(listNotes))
noteRouter.post('/', validate(createNoteSchema), asyncHandler(createNote))
noteRouter.put('/:noteId', validate(updateNoteSchema), asyncHandler(updateNote))
noteRouter.delete('/:noteId', asyncHandler(deleteNote))
