/**
 * Error returned by the Notes API with optional field-level details.
 *
 * @example
 * throw new ApiError('Unable to save note.', [{ field: 'title', message: 'Required' }])
 */
export class ApiError extends Error {
  /**
   * Creates a client-safe API error.
   *
   * @param {string} message Human-readable error message.
   * @param {Array<{field: string, message: string}>} [details] Field errors.
   */
  constructor(message, details = []) {
    super(message)
    this.name = 'ApiError'
    this.details = details
  }
}

/**
 * Sends an authenticated JSON request to the API.
 *
 * @param {string} path API path beginning with `/api`.
 * @param {RequestInit} [options] Fetch options.
 * @returns {Promise<unknown>} Parsed response data, or null for empty responses.
 * @example
 * const data = await request('/api/v1/notes')
 */
export async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(body.error ?? 'Unable to complete the request.', body.details)
  }

  return body.data
}

/** Registers a user and returns the authenticated account. */
export function registerAccount(credentials) {
  return request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(credentials) })
}

/** Authenticates a user and returns the account. */
export function loginAccount(credentials) {
  return request('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
}

/** Clears the active server session. */
export function logoutAccount() {
  return request('/api/v1/auth/logout', { method: 'POST' })
}

/** Returns the current authenticated account. */
export function getCurrentAccount() {
  return request('/api/v1/auth/me')
}

/** Returns all notes owned by the active user. */
export function getNotes() {
  return request('/api/v1/notes')
}

/** Creates a note owned by the active user. */
export function createNote(input) {
  return request('/api/v1/notes', { method: 'POST', body: JSON.stringify(input) })
}

/** Updates one note owned by the active user. */
export function updateNote(noteId, input) {
  return request(`/api/v1/notes/${noteId}`, { method: 'PUT', body: JSON.stringify(input) })
}

/** Deletes one note owned by the active user. */
export function deleteNote(noteId) {
  return request(`/api/v1/notes/${noteId}`, { method: 'DELETE' })
}
