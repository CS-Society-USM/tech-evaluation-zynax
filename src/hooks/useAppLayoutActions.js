import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth.js'

/**
 * Provides authenticated layout actions without embedding behavior in the layout component.
 *
 * @returns {{user: object, handleLogout: Function, requestNewNote: Function}} Layout state and actions.
 * @example
 * const { user, handleLogout } = useAppLayoutActions()
 */
export function useAppLayoutActions() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  /** Logs out the account and returns to the landing page. */
  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  /** Asks the dashboard controller to open a fresh note editor. */
  function requestNewNote() {
    window.dispatchEvent(new CustomEvent('mora:new-note'))
  }

  return { user, handleLogout, requestNewNote }
}
