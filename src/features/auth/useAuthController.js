import { useEffect, useState } from 'react'
import { getCurrentAccount, loginAccount, logoutAccount, registerAccount } from '../../services/api.js'

/**
 * Loads the current session while treating an unauthenticated response as a guest state.
 *
 * @param {(user: object|null) => void} setUser User state setter.
 * @param {(loading: boolean) => void} setLoading Loading state setter.
 * @returns {Promise<void>}
 */
async function initializeSession(setUser, setLoading) {
  try {
    const data = await getCurrentAccount()
    setUser(data.user)
  } catch {
    setUser(null)
  } finally {
    setLoading(false)
  }
}

/**
 * Owns application authentication state and server actions.
 *
 * @returns {{user: object|null, isLoading: boolean, login: Function, register: Function, logout: Function}} Auth controller.
 * @example
 * const { user, login } = useAuthController()
 */
export function useAuthController() {
  const [user, setUser] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    initializeSession(setUser, setLoading)
  }, [])

  return {
    user,
    isLoading,
    login: async (credentials) => {
      const data = await loginAccount(credentials)
      setUser(data.user)
    },
    register: async (credentials) => {
      const data = await registerAccount(credentials)
      setUser(data.user)
    },
    logout: async () => {
      await logoutAccount()
      setUser(null)
    },
  }
}
