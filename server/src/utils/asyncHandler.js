/**
 * Converts an asynchronous Express controller into error-forwarding middleware.
 *
 * @param {import('express').RequestHandler} handler Async controller to wrap.
 * @returns {import('express').RequestHandler} Express-compatible request handler.
 * @example
 * router.get('/items', asyncHandler(listItems))
 */
export function asyncHandler(handler) {
  return function handledRequest(request, response, next) {
    Promise.resolve(handler(request, response, next)).catch(next)
  }
}
