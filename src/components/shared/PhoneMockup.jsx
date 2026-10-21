import { Bell, Heart, Plus, Search, Send, Sparkles } from 'lucide-react'

const darkTiles = [
  { tone: 'peach', title: 'Plan for the day', items: ['Buy food', 'Gym', 'Invest'] },
  { tone: 'sand', title: 'Reading list', meta: 'updated 2h ago' },
  { tone: 'cream', title: 'My lectures', meta: '5 notes', wide: true },
  { tone: 'sage', title: 'List of ideas' },
  { tone: 'sky', title: 'Weekend trip' },
]

/**
 * Decorative phone frame previewing the Mora app on marketing and auth screens.
 *
 * @param {{variant?: 'light'|'dark', className?: string}} props Visual variant and extra class names.
 * @returns {JSX.Element} Purely decorative phone preview, hidden from assistive technology.
 * @example
 * <PhoneMockup variant="dark" />
 */
export function PhoneMockup({ variant = 'light', className = '' }) {
  return (
    <div className={`phone phone--${variant} ${className}`} aria-hidden="true">
      <div className="phone__status"><span>9:41</span><span className="phone__island" /><span>●●●</span></div>
      {variant === 'dark' ? <DarkScreen /> : <LightScreen />}
    </div>
  )
}

function LightScreen() {
  return (
    <div className="phone__screen">
      <div className="phone__top"><span className="phone__avatar">🙂</span><span className="phone__icons"><i><Search size={13} /></i><i><Bell size={13} /></i></span></div>
      <p className="phone__hello">Hi there!</p>
      <p className="phone__title">My Notes</p>
      <p className="phone__date"><b>Thursday</b> 22 Oct, 2026</p>
      <div className="phone__ask"><Sparkles size={12} /><span>Search anything in your notes…</span><i><Send size={10} /></i></div>
      <div className="phone__tiles">
        <div className="phone__tile phone__tile--peach"><span>New notes</span></div>
        <div className="phone__stack">
          <div className="phone__tile phone__tile--lilac"><span>New task</span></div>
          <div className="phone__pill">Start writing…</div>
        </div>
      </div>
      <div className="phone__dock"><span /><span /><span /><i><Plus size={14} /></i></div>
    </div>
  )
}

function DarkScreen() {
  return (
    <div className="phone__screen">
      <p className="phone__title phone__title--big">My<br />Notes</p>
      <div className="phone__chips"><span className="is-active">All <b>23</b></span><span>Important</span><span>To-do</span></div>
      <div className="phone__grid">
        {darkTiles.map((tile) => (
          <div key={tile.title} className={`phone__card phone__tile--${tile.tone}${tile.wide ? ' phone__card--wide' : ''}`}>
            <span className="phone__card-title">{tile.title}</span>
            {tile.meta && <small>{tile.meta}</small>}
            {tile.items && <ul>{tile.items.map((item, index) => <li key={item} className={index === 0 ? 'is-done' : ''}>{item}</li>)}</ul>}
            <i className="phone__heart"><Heart size={10} /></i>
          </div>
        ))}
      </div>
      <span className="phone__fab"><Plus size={18} /></span>
    </div>
  )
}
