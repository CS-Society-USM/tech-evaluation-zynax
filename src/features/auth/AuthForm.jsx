import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/shared/Button.jsx'
import { InputField } from '../../components/shared/InputField.jsx'
import { useAuthForm } from '../../hooks/useAuthForm.js'

/**
 * Renders the shared login or registration form.
 *
 * @param {{mode: 'login'|'register', onSubmit: Function}} props Form mode and authentication action.
 * @returns {JSX.Element} Authentication form.
 * @example
 * <AuthForm mode="login" onSubmit={login} />
 */
export function AuthForm({ mode, onSubmit }) {
  const form = useAuthForm({ mode, submit: onSubmit })
  const isRegister = mode === 'register'

  return (
    <form className="auth-form" onSubmit={form.handleSubmit} noValidate>
      {isRegister && (
        <InputField
          label="Your name"
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          error={form.fieldErrors.name}
          autoComplete="name"
          placeholder="Alex Morgan"
          required
        />
      )}
      <InputField
        label="Email address"
        name="email"
        type="email"
        value={form.values.email}
        onChange={form.handleChange}
        error={form.fieldErrors.email}
        autoComplete="email"
        placeholder="alex@example.com"
        required
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange}
        error={form.fieldErrors.password}
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        hint={isRegister ? 'Use at least 8 characters.' : undefined}
        required
      />
      {form.error && <p className="form-error" role="alert">{form.error}</p>}
      <Button type="submit" variant="accent" size="large" isLoading={form.isSubmitting} icon={<ArrowRight size={18} />}>
        {isRegister ? 'Create my space' : 'Enter my space'}
      </Button>
    </form>
  )
}
