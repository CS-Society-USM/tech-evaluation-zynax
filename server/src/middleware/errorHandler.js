import { AppError } from '../utils/appError.js'

/**
 * Converts unmatched routes into a consistent API error.
 *
 * @param {import('express').Request} _request Express request.
 * @param {import('express').Response} _response Express response.
 * @param {import('express').NextFunction} next Express continuation callback.
 * @returns {void}
 * @example
 * app.use(notFoundHandler)
 */
export function notFoundHandler(_request, _response, next) {
  next(new AppError(404, 'Route not found.'))
}

/**
 * Sends operational errors in the shared API response format.
 *
 * @param {Error} error Error raised by a route or middleware.
 * @param {import('express').Request} _request Express request.
 * @param {import('express').Response} response Express response.
 * @param {import('express').NextFunction} _next Express continuation callback.
 * @returns {void}
 * @example
 * app.use(errorHandler)
 */
export function errorHandler(error, _request, response, _next) {
  void _next

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    })
    return
  }

  console.error(error)
  response.status(500).json({ success: false, error: 'An unexpected error occurred.' })
}
