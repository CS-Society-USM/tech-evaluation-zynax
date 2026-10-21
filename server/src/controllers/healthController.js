/**
 * Reports API availability for local tooling and deployment health checks.
 *
 * @type {import('express').RequestHandler}
 * @example
 * router.get('/health', getHealth)
 */
export function getHealth(_request, response) {
  response.json({ success: true, data: { status: 'ok' } })
}
