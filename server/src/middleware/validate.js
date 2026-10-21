import { AppError } from '../utils/appError.js'

/**
 * Validates request body data against a Zod schema.
 *
 * @param {import('zod').ZodType} schema Zod request body schema.
 * @returns {import('express').RequestHandler} Validation middleware.
 * @example
 * router.post('/notes', validate(createNoteSchema), createNote)
 */
export function validate(schema) {
  return function validateRequest(request, _response, next) {
    const result = schema.safeParse(request.body)

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))
      next(new AppError(400, 'Please correct the highlighted fields.', details))
      return
    }

    request.validatedBody = result.data
    next()
  }
}
