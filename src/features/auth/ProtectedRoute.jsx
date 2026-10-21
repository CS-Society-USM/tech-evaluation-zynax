import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { PageLoader } from '../../components/shared/PageLoader.jsx'
import { useAuth } from '../../hooks/useAuth.js'

/**
 * Allows authenticated users through and redirects guests to the login page.
 *
 * @returns {JSX.Element} Route outlet, loading screen, or redirect.
 * @example
 * <Route element={<ProtectedRoute />}><Route path="dashboard" /></Route>
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
