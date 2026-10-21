import { Link } from 'react-router-dom'

/**
 * Displays the shared Mora wordmark and links it to the public home page.
 *
 * @param {{compact?: boolean}} props Display options.
 * @returns {JSX.Element} Linked product brand.
 * @example
 * <Brand compact />
 */
export function Brand({ compact = false }) {
  return (
    <Link className={compact ? 'brand brand--compact' : 'brand'} to="/" aria-label="Mora home">
      <span className="brand__mark" aria-hidden="true"><i /></span>
      <span>mora</span>
    </Link>
  )
}
