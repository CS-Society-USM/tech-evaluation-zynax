import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../services/api.js'

/**
 * Manages authentication form fields, submission, and server errors.
 *
 * @param {{mode: 'login'|'register', submit: Function}} options Form configuration.
 * @returns {object} Controlled form state and event handlers.
 * @example
 * const form = useAuthForm({ mode: 'login', submit: login })
 */
export function useAuthForm({ mode, submit }) {
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSubmitting(true)

    try {
      const payload = mode === 'register' ? values : { email: values.email, password: values.password }
      await submit(payload)
      navigate('/dashboard', { replace: true })
    } catch (submissionError) {
      setError(submissionError.message)
      if (submissionError instanceof ApiError) {
        setFieldErrors(Object.fromEntries(submissionError.details.map((detail) => [detail.field, detail.message])))
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return { values, error, fieldErrors, isSubmitting, handleSubmit, handleChange }
}
