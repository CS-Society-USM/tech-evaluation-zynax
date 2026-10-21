import { Link } from 'react-router-dom'
import { AuthPanel } from '../components/shared/AuthPanel.jsx'
import { AuthForm } from '../features/auth/AuthForm.jsx'
import { useAuth } from '../hooks/useAuth.js'

/**
 * Registration page for creating a private notes workspace.
 *
 * @returns {JSX.Element} Registration experience.
 * @example
 * <Route path="register" element={<RegisterPage />} />
 */
export function RegisterPage() {
  const { register } = useAuth()

  return (
    <AuthPanel
      eyebrow="Get started"
      title="Let’s personalise your notes."
      description="Create a private space for the plans, fragments, and bright ideas you want to keep."
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      <AuthForm mode="register" onSubmit={register} />
    </AuthPanel>
  )
}

export default RegisterPage
