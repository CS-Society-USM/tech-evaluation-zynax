import { Check } from 'lucide-react'

/**
 * Announces a short success message without interrupting the current task.
 *
 * @param {{message: string}} props Toast message.
 * @returns {JSX.Element|null} Live-region toast or null.
 * @example
 * <Toast message="Note saved." />
 */
export function Toast({ message }) {
  if (!message) return null
  return <div className="toast" role="status"><Check size={16} />{message}</div>
}
