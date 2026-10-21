import { z } from 'zod'

const noteFields = {
  title: z.string().trim().min(1, 'Title is required.').max(120, 'Title cannot exceed 120 characters.'),
  content: z.string().trim().min(1, 'Content is required.').max(10000, 'Content cannot exceed 10,000 characters.'),
}

/** Schema used to validate note creation payloads. */
export const createNoteSchema = z.object(noteFields)

/** Schema used to validate note update payloads. */
export const updateNoteSchema = z.object(noteFields)

/** Schema used to star, archive, trash, or restore a note. At least one field is required. */
export const noteStateSchema = z.object({
  isStarred: z.boolean().optional(),
  archived: z.boolean().optional(),
  trashed: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: 'Provide at least one state change.' })
