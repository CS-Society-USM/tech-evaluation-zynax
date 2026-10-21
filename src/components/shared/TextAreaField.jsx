/**
 * Accessible shared textarea with label and validation message.
 *
 * @param {import('react').TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string, error?: string}} props Textarea props.
 * @returns {JSX.Element} Labeled textarea field.
 * @example
 * <TextAreaField label="Content" name="content" rows={8} />
 */
export function TextAreaField({ label, error, id, ...props }) {
  const inputId = id ?? props.name
  const descriptionId = error ? `${inputId}-description` : undefined

  return (
    <label className="field" htmlFor={inputId}>
      <span className="field__label">{label}</span>
      <textarea id={inputId} className={error ? 'field__control field__textarea field__control--error' : 'field__control field__textarea'} aria-invalid={Boolean(error)} aria-describedby={descriptionId} {...props} />
      {error && <span id={descriptionId} className="field__message field__message--error">{error}</span>}
    </label>
  )
}
