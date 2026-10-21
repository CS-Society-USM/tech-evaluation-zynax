import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand.jsx'
import { PhoneMockup } from './PhoneMockup.jsx'

/**
 * Shared two-column frame used by login and registration pages.
 *
 * @param {{eyebrow: string, title: string, description: string, step?: number, children: import('react').ReactNode, footer: import('react').ReactNode}} props Panel content.
 * @returns {JSX.Element} Authentication page frame.
 * @example
 * <AuthPanel title="Welcome back" footer={<Link to="/register">Register</Link>}>...</AuthPanel>
 */
export function AuthPanel({ eyebrow, title, description, step = 1, children, footer }) {
  return (
    <main className="auth-page">
      <section className="auth-page__form-panel">
        <div className="auth-page__top">
          <Link className="icon-button" to="/" aria-label="Back home"><ArrowLeft size={18} /></Link>
          <div className="auth-progress" aria-hidden="true">
            {[1, 2, 3].map((index) => <span key={index} className={index <= step ? 'is-active' : ''} />)}
          </div>
        </div>
        <div className="auth-page__form-wrap">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-page__description">{description}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </section>
      <section className="auth-page__story" aria-label="Product preview">
        <Brand />
        <PhoneMockup variant="light" className="auth-page__phone" />
        <p className="auth-page__quote">“A quiet place for ideas that deserve to stay.”</p>
      </section>
    </main>
  )
}
