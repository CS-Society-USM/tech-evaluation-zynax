/**
 * Represents an operational API error that can safely be returned to a client.
 *
 * @example
 * throw new AppError(404, 'Note not found.')
 */
export class AppError extends Error {
  /**
   * Creates an API error.
   *
   * @param {number} statusCode HTTP status code.
   * @param {string} message Safe client-facing message.
   * @param {unknown} [details] Optional structured validation details.
   */
  constructor(statusCode, message, details) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.details = details
  }
}
