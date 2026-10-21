import { z } from 'zod'

/** Schema used to validate new user registration payloads. */
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must contain at least 8 characters.').max(72),
})

/** Schema used to validate login payloads. */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})
