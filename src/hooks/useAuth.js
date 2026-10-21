import { useContext } from 'react'
import { AuthContext } from '../features/auth/authContext.js'

/**
 * Returns the current authentication context.
 *
 * @returns {{user: object|null, isLoading: boolean, login: Function, register: Function, logout: Function}} Auth state and actions.
 * @throws {Error} When called outside `AuthProvider`.
 * @example
 * const { user, logout } = useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return context
}
