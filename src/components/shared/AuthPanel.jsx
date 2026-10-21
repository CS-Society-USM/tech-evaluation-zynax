import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand.jsx'

/**
 * Shared two-column frame used by login and registration pages.
 *
 * @param {{eyebrow: string, title: string, description: string, children: import('react').ReactNode, footer: import('react').ReactNode}} props Panel content.
 * @returns {JSX.Element} Authentication page frame.
 * @example
 * <AuthPanel title="Welcome back" footer={<Link to="/register">Register</Link>}>...</AuthPanel>
 */
export function AuthPanel({ eyebrow, title, description, children, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-page__story" aria-label="Product message">
        <Brand />
        <blockquote>“A quiet place for ideas that deserve to stay.”</blockquote>
        <div className="auth-note-stack" aria-hidden="true"><span /><span /><span /></div>
      </section>
      <section className="auth-page__form-panel">
        <Link className="back-link" to="/"><ArrowLeft size={16} /> Back home</Link>
        <div className="auth-page__form-wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-page__description">{description}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </section>
    </main>
  )
}
