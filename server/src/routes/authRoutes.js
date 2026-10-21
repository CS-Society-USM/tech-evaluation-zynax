import { Router } from 'express'
import { getCurrentUser, login, logout, register } from '../controllers/authController.js'
import { optionalAuthenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { loginSchema, registerSchema } from '../validators/authSchemas.js'

/** Authentication routes mounted at `/api/v1/auth`. */
export const authRouter = Router()

authRouter.post('/register', validate(registerSchema), asyncHandler(register))
authRouter.post('/login', validate(loginSchema), asyncHandler(login))
authRouter.post('/logout', logout)
authRouter.get('/me', optionalAuthenticate, asyncHandler(getCurrentUser))
