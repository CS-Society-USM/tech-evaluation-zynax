import { Link } from 'react-router-dom'
import { AuthPanel } from '../components/shared/AuthPanel.jsx'
import { AuthForm } from '../features/auth/AuthForm.jsx'
import { useAuth } from '../hooks/useAuth.js'

/**
 * Login page for returning users.
 *
 * @returns {JSX.Element} Login experience.
 * @example
 * <Route path="login" element={<LoginPage />} />
 */
export function LoginPage() {
  const { login } = useAuth()

  return (
    <AuthPanel
      eyebrow="Welcome back"
      title="Pick up where you left off."
      description="Your notes are waiting—private, organized, and exactly where you put them."
      footer={<>New to Mora? <Link to="/register">Create an account</Link></>}
    >
      <AuthForm mode="login" onSubmit={login} />
    </AuthPanel>
  )
}

export default LoginPage
