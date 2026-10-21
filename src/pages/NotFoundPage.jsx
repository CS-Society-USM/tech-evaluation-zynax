import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/shared/Brand.jsx'

/**
 * Friendly fallback for unknown application routes.
 *
 * @returns {JSX.Element} Not-found page.
 * @example
 * <Route path="404" element={<NotFoundPage />} />
 */
export function NotFoundPage() {
  return <main className="not-found"><Brand /><span>404</span><h1>This page slipped away.</h1><p>The thought may be gone, but your notes are still safe.</p><Link to="/"><ArrowLeft size={16} /> Return home</Link></main>
}

export default NotFoundPage
