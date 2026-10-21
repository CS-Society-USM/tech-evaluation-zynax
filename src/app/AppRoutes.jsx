import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoader } from '../components/shared/PageLoader.jsx'
import { ProtectedRoute } from '../features/auth/ProtectedRoute.jsx'
import { GuestRoute } from '../features/auth/GuestRoute.jsx'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { PublicLayout } from '../layouts/PublicLayout.jsx'

const DashboardPage = lazy(() => import('../pages/DashboardPage.jsx'))
const HomePage = lazy(() => import('../pages/HomePage.jsx'))
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'))

/**
 * Declares all public, guest-only, and authenticated application routes.
 *
 * @returns {JSX.Element} React Router route definitions.
 * @example
 * <BrowserRouter><AppRoutes /></BrowserRouter>
 */
export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route element={<GuestRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>
        </Route>
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
