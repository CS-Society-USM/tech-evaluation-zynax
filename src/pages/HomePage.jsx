import { ArrowRight, Check, LockKeyhole, PencilLine, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/shared/Brand.jsx'

const benefits = [
  { icon: PencilLine, number: '01', title: 'Write without friction', text: 'A focused editor that gets out of your way, so the thought stays louder than the tool.' },
  { icon: LockKeyhole, number: '02', title: 'Private by design', text: 'Every note belongs to you. Server-side ownership checks keep other accounts out.' },
  { icon: Sparkles, number: '03', title: 'Find your signal', text: 'Search across your workspace and bring the right idea back into focus in seconds.' },
]

/**
 * Public promotional landing page available to every guest.
 *
 * @returns {JSX.Element} Responsive Mora marketing page.
 * @example
 * <Route index element={<HomePage />} />
 */
export function HomePage() {
  return (
    <main className="landing-page">
      <header className="site-header container">
        <Brand />
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#features">Why Mora</a>
          <Link to="/login">Log in</Link>
          <Link className="nav-cta" to="/register">Start writing <ArrowRight size={16} /></Link>
        </nav>
      </header>

      <section className="hero container">
        <div className="hero__copy">
          <p className="eyebrow"><span /> A calmer place to think</p>
          <h1>Your thoughts,<br /><em>finally at home.</em></h1>
          <p className="hero__lead">Mora is a private writing space for unfinished ideas, daily observations, and everything worth remembering.</p>
          <div className="hero__actions">
            <Link className="button button--primary button--large" to="/register"><span>Open your notebook</span><ArrowRight size={18} /></Link>
            <span className="hero__promise"><Check size={15} /> Free to begin. Yours to keep.</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Preview of the Mora notes experience">
          <div className="orbit orbit--one" /><div className="orbit orbit--two" />
          <article className="paper-note paper-note--back"><span>BOOKS TO FIND</span><p>The Creative Act<br />On Writing Well</p></article>
          <article className="paper-note paper-note--main">
            <div className="paper-note__meta"><span>OCT 21</span><span>3 MIN READ</span></div>
            <h2>An idea about<br />slow mornings</h2>
            <p>Leave a little room before the world arrives. Coffee, an open window, and nowhere to be for a while.</p>
            <span className="paper-note__scribble">remember this ↗</span>
          </article>
          <span className="floating-tag">private space</span>
        </div>
      </section>

      <section className="manifesto container" id="features">
        <p className="eyebrow">Less noise. More meaning.</p>
        <h2>Not another productivity machine.<br /><em>A place to hear yourself think.</em></h2>
        <div className="benefit-grid">
          {benefits.map(({ icon: Icon, number, title, text }) => (
            <article className="benefit-card" key={number}>
              <div className="benefit-card__top"><span>{number}</span><Icon size={22} /></div>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-cta">
        <div className="container closing-cta__inner">
          <span className="closing-cta__spark">✦</span>
          <p className="eyebrow">Your next thought is waiting</p>
          <h2>Make space for it.</h2>
          <Link className="button button--light button--large" to="/register"><span>Create your space</span><ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="site-footer container"><Brand compact /><p>Thoughtfully made for thoughts worth keeping.</p><span>© 2026 Mora</span></footer>
    </main>
  )
}

export default HomePage
