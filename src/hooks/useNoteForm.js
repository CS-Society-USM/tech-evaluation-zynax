import { useState } from 'react'

/**
 * Manages note editor values, client validation, and submission state.
 *
 * @param {{note?: object|null, onSave: Function}} options Editor configuration.
 * @returns {object} Controlled note form state and handlers.
 * @example
 * const form = useNoteForm({ note, onSave })
 */
export function useNoteForm({ note, onSave }) {
  const [values, setValues] = useState({ title: note?.title ?? '', content: note?.content ?? '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  /** Updates a controlled editor value. */
  function handleChange(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  /** Validates and submits the note editor. */
  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {
      ...(values.title.trim() ? {} : { title: 'Title is required.' }),
      ...(values.content.trim() ? {} : { content: 'Content is required.' }),
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setError('')
    try {
      await onSave(values)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return { values, errors, error, isSubmitting, handleChange, handleSubmit }
}
