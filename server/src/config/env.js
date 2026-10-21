import 'dotenv/config'

/**
 * Reads and validates runtime configuration used by the API.
 *
 * @returns {{clientOrigin: string, isProduction: boolean, jwtSecret: string, port: number}} Validated runtime values.
 * @throws {Error} When JWT_SECRET is unavailable.
 * @example
 * const env = getEnv()
 * app.listen(env.port)
 */
export function getEnv() {
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required.')
  }

  return {
    clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    isProduction: process.env.NODE_ENV === 'production',
    jwtSecret,
    port: Number(process.env.PORT ?? 3001),
  }
}
