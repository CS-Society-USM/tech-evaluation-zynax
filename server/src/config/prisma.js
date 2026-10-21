import { PrismaClient } from '@prisma/client'

/**
 * Shared Prisma client used by all repository services.
 *
 * @example
 * const users = await prisma.user.findMany()
 */
export const prisma = new PrismaClient()
