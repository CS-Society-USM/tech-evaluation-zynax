import { ArrowRight, Check, LockKeyhole, PencilLine, Search, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/shared/Brand.jsx'
import { PhoneMockup } from '../components/shared/PhoneMockup.jsx'

const features = [
  { icon: PencilLine, tone: 'peach', title: 'Write without friction', text: 'A calm, paper-like editor that keeps the thought louder than the tool.' },
  { icon: LockKeyhole, tone: 'ink', title: 'Private by design', text: 'Every note belongs to you. Server-side ownership checks keep other accounts out.' },
  { icon: Search, tone: 'lilac', title: 'Find it in seconds', text: 'Search titles and content instantly, then filter by today or this week.' },
  { icon: Sparkles, tone: 'sand', title: 'Colour that sticks', text: 'Each note gets its own tone, so your ideas are easy to spot at a glance.' },
]

const steps = [
  { number: '01', title: 'Create your space', text: 'Sign up in seconds. No setup, no clutter.' },
  { number: '02', title: 'Capture anything', text: 'Plans, lectures, lists, and the 2 a.m. ideas.' },
  { number: '03', title: 'Come back to it', text: 'Edit, search, and tidy whenever you like.' },
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
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <Link to="/login">Log in</Link>
          <Link className="nav-cta" to="/register">Get started <ArrowRight size={16} /></Link>
        </nav>
      </header>

      <section className="hero container">
        <div className="hero__copy">
          <p className="eyebrow"><Sparkles size={14} /> Your private notebook</p>
          <h1>Let’s make your notes <span className="hero__highlight">feel personal.</span></h1>
          <p className="hero__lead">Mora is a colourful, private place for plans, lectures, lists, and every idea worth keeping — beautifully organised and only ever yours.</p>
          <div className="hero__actions">
            <Link className="button button--accent button--large" to="/register"><span>Get started — it’s free</span><ArrowRight size={18} /></Link>
            <Link className="button button--ghost button--large" to="/login"><span>I have an account</span></Link>
          </div>
          <ul className="hero__proof">
            <li><Check size={15} /> No credit card</li>
            <li><Check size={15} /> Private by default</li>
            <li><Check size={15} /> Works on any device</li>
          </ul>
        </div>
        <div className="hero-art">
          <div className="hero-art__glow" />
          <PhoneMockup variant="dark" className="hero-art__phone hero-art__phone--back" />
          <PhoneMockup variant="light" className="hero-art__phone hero-art__phone--front" />
          <span className="hero-sticker hero-sticker--one">✦ just for you</span>
          <span className="hero-sticker hero-sticker--two"><LockKeyhole size={14} /> private space</span>
        </div>
      </section>

      <section className="features container" id="features">
        <div className="section-heading">
          <p className="eyebrow">Why people love Mora</p>
          <h2>Less noise. More <span>meaning.</span></h2>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, tone, title, text }) => (
            <article className={`feature-card feature-card--${tone}`} key={title}>
              <span className="feature-card__icon"><Icon size={22} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how container" id="how">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Three steps to a <span>clearer head.</span></h2>
        </div>
        <ol className="steps">
          {steps.map(({ number, title, text }) => (
            <li className="step" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <section className="closing-cta container">
        <div className="closing-cta__inner">
          <p className="closing-cta__tag">Your next thought is waiting</p>
          <h2>Start writing today.</h2>
          <p>Join Mora and give your ideas a home they deserve.</p>
          <Link className="button button--light button--large" to="/register"><span>Create my space</span><ArrowRight size={18} /></Link>
        </div>
      </section>

      <footer className="site-footer container"><Brand compact /><p>Thoughtfully made for thoughts worth keeping.</p><span>© 2026 Mora</span></footer>
    </main>
  )
}

export default HomePage
