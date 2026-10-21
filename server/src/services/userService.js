import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/appError.js'

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
}

/**
 * Creates a user with a securely hashed password.
 *
 * @param {{name: string, email: string, password: string}} input Registration data.
 * @returns {Promise<{id: string, name: string, email: string, createdAt: Date}>} Safe user record.
 * @example
 * const user = await createUser({ name, email, password })
 */
export async function createUser(input) {
  const passwordHash = await bcrypt.hash(input.password, 12)

  try {
    return await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash },
      select: publicUserSelect,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError(409, 'An account with this email already exists.')
    }
    throw error
  }
}

/**
 * Authenticates an email and password pair.
 *
 * @param {{email: string, password: string}} input Login data.
 * @returns {Promise<{id: string, name: string, email: string, createdAt: Date}>} Safe user record.
 * @example
 * const user = await authenticateUser({ email, password })
 */
export async function authenticateUser(input) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  const isValid = user ? await bcrypt.compare(input.password, user.passwordHash) : false

  if (!user || !isValid) {
    throw new AppError(401, 'Email or password is incorrect.')
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

/**
 * Returns a safe user record by identifier.
 *
 * @param {string} userId User identifier.
 * @returns {Promise<{id: string, name: string, email: string, createdAt: Date}>} Safe user record.
 * @example
 * const user = await getUserById(request.userId)
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: publicUserSelect })

  if (!user) {
    throw new AppError(401, 'Your account is no longer available.')
  }

  return user
}
