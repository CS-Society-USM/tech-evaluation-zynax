import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { getEnv } from './config/env.js'
import { getHealth } from './controllers/healthController.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/authRoutes.js'
import { noteRouter } from './routes/noteRoutes.js'

/**
 * Creates the configured Express application without opening a network port.
 * This separation allows tests and alternative runtimes to reuse the same app.
 *
 * @returns {import('express').Express} Configured Express application.
 * @example
 * const app = createApp()
 * app.listen(3001)
 */
export function createApp() {
  const app = express()
  const env = getEnv()

  app.use(helmet())
  app.use(cors({ origin: env.clientOrigin, credentials: true }))
  app.use(express.json({ limit: '32kb' }))
  app.use(cookieParser())

  app.get('/api/v1/health', getHealth)
  app.use('/api/v1/auth', authRouter)
  app.use('/api/v1/notes', noteRouter)
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
