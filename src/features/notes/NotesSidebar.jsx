import { Archive, CalendarDays, Clock3, FileText, LogOut, NotebookTabs, Star, Trash2 } from 'lucide-react'
import { Brand } from '../../components/shared/Brand.jsx'
import { useAppLayoutActions } from '../../hooks/useAppLayoutActions.js'
import { NOTE_PERIODS } from '../../utils/note.js'

const COLLECTION_LINKS = [
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'archive', label: 'Archive', icon: Archive },
  { id: 'trash', label: 'Trash', icon: Trash2 },
]
const PERIOD_ICONS = { all: NotebookTabs, today: Clock3, week: CalendarDays }

/**
 * Workspace sidebar with collections, date filters, section shortcuts, recent notes, and account controls.
 *
 * @param {{collection: string, period: string, collectionCounts: Record<string, number>, periodCounts: Record<string, number>, sections: Array<{id: string, label: string, notes: Array}>, recentNotes: Array<object>, onCollectionChange: Function, onPeriodChange: Function, onOpenNote: Function}} props Sidebar data and actions.
 * @returns {JSX.Element} Desktop workspace sidebar.
 * @example
 * <NotesSidebar collection="notes" period="all" ... />
 */
export function NotesSidebar({ collection, period, collectionCounts, periodCounts, sections, recentNotes, onCollectionChange, onPeriodChange, onOpenNote }) {
  const { user, handleLogout } = useAppLayoutActions()

  return (
    <aside className="sidebar" aria-label="Workspace sidebar">
      <div className="sidebar__top"><Brand compact /></div>

      <nav className="sidebar__group" aria-label="Collections">
        {COLLECTION_LINKS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`sidebar__link sidebar__link--${id}`} aria-pressed={collection === id} onClick={() => onCollectionChange(id)}>
            <Icon size={17} /> <span>{label}</span> <small>{collectionCounts[id]}</small>
          </button>
        ))}
      </nav>

      <nav className="sidebar__group" aria-label="Notes by date">
        <p className="sidebar__label">Notes</p>
        {NOTE_PERIODS.map(({ id, label }) => {
          const Icon = PERIOD_ICONS[id]
          return (
            <button key={id} type="button" className="sidebar__link" aria-pressed={collection === 'notes' && period === id} onClick={() => onPeriodChange(id)}>
              <Icon size={17} /> <span>{label === 'All' ? 'All notes' : label}</span> <small>{periodCounts[id]}</small>
            </button>
          )
        })}
      </nav>

      {sections.length > 0 && (
        <div className="sidebar__group">
          <p className="sidebar__label">Sections</p>
          {sections.map((section) => (
            <a key={section.id} className="sidebar__link" href={`#${section.id}`}>
              <span className={`section-icon section-icon--${section.id}`} aria-hidden="true" /> <span>{section.label}</span> <small>{section.notes.length}</small>
            </a>
          ))}
        </div>
      )}

      {recentNotes.length > 0 && (
        <div className="sidebar__group sidebar__group--recent">
          <p className="sidebar__label">Recent notes</p>
          {recentNotes.map((note) => (
            <button key={note.id} type="button" className="sidebar__recent" onClick={() => onOpenNote(note)}>
              <FileText size={15} /> <span>{note.title}</span>
              {note.isStarred && <Star className="sidebar__star" size={13} aria-label="Starred" />}
            </button>
          ))}
        </div>
      )}

      <div className="sidebar__account">
        <span className="avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
        <span className="sidebar__who"><strong>{user.name}</strong><small>{user.email}</small></span>
        <button className="sidebar__logout" type="button" onClick={handleLogout} aria-label="Log out"><LogOut size={17} /></button>
      </div>
    </aside>
  )
}
