import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '../../components/shared/PageLoader.jsx'
import { useAuth } from '../../hooks/useAuth.js'

/**
 * Keeps authenticated users out of login and registration pages.
 *
 * @returns {JSX.Element} Guest route outlet, loading screen, or redirect.
 * @example
 * <Route element={<GuestRoute />}><Route path="login" /></Route>
 */
export function GuestRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
