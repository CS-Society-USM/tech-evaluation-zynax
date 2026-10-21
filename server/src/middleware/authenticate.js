import { AppError } from '../utils/appError.js'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '../utils/token.js'

/**
 * Requires a valid session cookie and attaches the user identifier to the request.
 *
 * @param {import('express').Request} request Express request.
 * @param {import('express').Response} _response Express response.
 * @param {import('express').NextFunction} next Express continuation callback.
 * @returns {void}
 * @example
 * router.get('/notes', authenticate, listNotes)
 */
export function authenticate(request, _response, next) {
  const token = request.cookies[AUTH_COOKIE_NAME]

  if (!token) {
    next(new AppError(401, 'Authentication is required.'))
    return
  }

  try {
    request.userId = verifyAuthToken(token)
    next()
  } catch {
    next(new AppError(401, 'Your session is invalid or has expired.'))
  }
}
