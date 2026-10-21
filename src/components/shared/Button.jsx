/**
 * Shared button with consistent variants, sizes, loading state, and optional icon.
 *
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, size?: string, isLoading?: boolean, icon?: import('react').ReactNode}} props Button props.
 * @returns {JSX.Element} Styled button.
 * @example
 * <Button variant="primary" onClick={save}>Save note</Button>
 */
export function Button({ children, variant = 'primary', size = 'medium', isLoading = false, icon, className = '', ...props }) {
  return (
    <button className={`button button--${variant} button--${size} ${className}`} disabled={isLoading || props.disabled} {...props}>
      <span>{isLoading ? 'Please wait…' : children}</span>
      {!isLoading && icon}
    </button>
  )
}
