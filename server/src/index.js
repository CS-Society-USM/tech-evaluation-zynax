import { createApp } from './app.js'
import { getEnv } from './config/env.js'
import { prisma } from './config/prisma.js'

/**
 * Starts the HTTP server and installs a graceful shutdown handler.
 *
 * @returns {import('http').Server} Running HTTP server.
 * @example
 * startServer()
 */
export function startServer() {
  const env = getEnv()
  const server = createApp().listen(env.port, () => {
    console.log(`Notes API listening on http://localhost:${env.port}`)
  })

  process.once('SIGTERM', async () => {
    await prisma.$disconnect()
    server.close()
  })

  return server
}

startServer()
