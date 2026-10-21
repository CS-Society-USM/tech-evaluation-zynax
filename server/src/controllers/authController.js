import { authenticateUser, createUser, getUserById } from '../services/userService.js'
import { AUTH_COOKIE_NAME, createAuthToken, getAuthCookieOptions } from '../utils/token.js'

/**
 * Registers a user, creates a session, and returns the safe user record.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.post('/register', register)
 */
export async function register(request, response) {
  const user = await createUser(request.validatedBody)
  response.cookie(AUTH_COOKIE_NAME, createAuthToken(user.id), getAuthCookieOptions())
  response.status(201).json({ success: true, data: { user } })
}

/**
 * Authenticates a user and creates a session cookie.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.post('/login', login)
 */
export async function login(request, response) {
  const user = await authenticateUser(request.validatedBody)
  response.cookie(AUTH_COOKIE_NAME, createAuthToken(user.id), getAuthCookieOptions())
  response.json({ success: true, data: { user } })
}

/**
 * Clears the current authentication session.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.post('/logout', logout)
 */
export function logout(_request, response) {
  response.clearCookie(AUTH_COOKIE_NAME, { ...getAuthCookieOptions(), maxAge: undefined })
  response.status(204).send()
}

/**
 * Returns the currently authenticated user.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.get('/me', authenticate, getCurrentUser)
 */
export async function getCurrentUser(request, response) {
  const user = await getUserById(request.userId)
  response.json({ success: true, data: { user } })
}
