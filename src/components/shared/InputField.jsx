/**
 * Accessible shared input with label, hint, and validation message.
 *
 * @param {import('react').InputHTMLAttributes<HTMLInputElement> & {label: string, error?: string, hint?: string, hideLabel?: boolean, variant?: 'boxed'|'bare'}} props Input props.
 * @returns {JSX.Element} Labeled input field.
 * @example
 * <InputField label="Email" name="email" type="email" />
 * <InputField label="Title" name="title" hideLabel variant="bare" />
 */
export function InputField({ label, error, hint, id, hideLabel = false, variant = 'boxed', ...props }) {
  const inputId = id ?? props.name
  const descriptionId = error || hint ? `${inputId}-description` : undefined
  const controlClass = ['field__control', `field__control--${variant}`, error && 'field__control--error'].filter(Boolean).join(' ')

  return (
    <label className="field" htmlFor={inputId}>
      <span className={hideLabel ? 'sr-only' : 'field__label'}>{label}</span>
      <input id={inputId} className={controlClass} aria-invalid={Boolean(error)} aria-describedby={descriptionId} {...props} />
      {(error || hint) && <span id={descriptionId} className={error ? 'field__message field__message--error' : 'field__message'}>{error ?? hint}</span>}
    </label>
  )
}
