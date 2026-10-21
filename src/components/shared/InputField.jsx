/**
 * Accessible shared input with label, hint, and validation message.
 *
 * @param {import('react').InputHTMLAttributes<HTMLInputElement> & {label: string, error?: string, hint?: string}} props Input props.
 * @returns {JSX.Element} Labeled input field.
 * @example
 * <InputField label="Email" name="email" type="email" />
 */
export function InputField({ label, error, hint, id, ...props }) {
  const inputId = id ?? props.name
  const descriptionId = error || hint ? `${inputId}-description` : undefined

  return (
    <label className="field" htmlFor={inputId}>
      <span className="field__label">{label}</span>
      <input id={inputId} className={error ? 'field__control field__control--error' : 'field__control'} aria-invalid={Boolean(error)} aria-describedby={descriptionId} {...props} />
      {(error || hint) && <span id={descriptionId} className={error ? 'field__message field__message--error' : 'field__message'}>{error ?? hint}</span>}
    </label>
  )
}
