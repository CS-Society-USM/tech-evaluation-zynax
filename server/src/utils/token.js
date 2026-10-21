import jwt from 'jsonwebtoken'
import { getEnv } from '../config/env.js'

export const AUTH_COOKIE_NAME = 'notes_session'

/**
 * Creates a signed authentication token for a user.
 *
 * @param {string} userId Authenticated user's identifier.
 * @returns {string} Signed JWT valid for seven days.
 * @example
 * const token = createAuthToken(user.id)
 */
export function createAuthToken(userId) {
  return jwt.sign({ sub: userId }, getEnv().jwtSecret, { expiresIn: '7d' })
}

/**
 * Verifies an authentication token and returns its user identifier.
 *
 * @param {string} token Signed authentication token.
 * @returns {string} Authenticated user's identifier.
 * @example
 * const userId = verifyAuthToken(request.cookies.notes_session)
 */
export function verifyAuthToken(token) {
  const payload = jwt.verify(token, getEnv().jwtSecret)
  return payload.sub
}

/**
 * Returns secure cookie options shared by login and registration responses.
 *
 * @returns {import('express').CookieOptions} Cookie configuration.
 * @example
 * response.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions())
 */
export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: getEnv().isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  }
}
