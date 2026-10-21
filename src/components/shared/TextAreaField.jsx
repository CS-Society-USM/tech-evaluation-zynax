/**
 * Accessible shared textarea with label and validation message.
 *
 * @param {import('react').TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string, error?: string, hideLabel?: boolean, variant?: 'boxed'|'bare'}} props Textarea props.
 * @returns {JSX.Element} Labeled textarea field.
 * @example
 * <TextAreaField label="Content" name="content" rows={8} />
 */
export function TextAreaField({ label, error, id, hideLabel = false, variant = 'boxed', ...props }) {
  const inputId = id ?? props.name
  const descriptionId = error ? `${inputId}-description` : undefined
  const controlClass = ['field__control', 'field__textarea', `field__control--${variant}`, error && 'field__control--error'].filter(Boolean).join(' ')

  return (
    <label className="field" htmlFor={inputId}>
      <span className={hideLabel ? 'sr-only' : 'field__label'}>{label}</span>
      <textarea id={inputId} className={controlClass} aria-invalid={Boolean(error)} aria-describedby={descriptionId} {...props} />
      {error && <span id={descriptionId} className="field__message field__message--error">{error}</span>}
    </label>
  )
}
