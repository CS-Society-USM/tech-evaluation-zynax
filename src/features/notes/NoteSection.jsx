import { Plus } from 'lucide-react'
import { NoteCard } from './NoteCard.jsx'

/**
 * Titled group of note cards, optionally led by a dashed "New note" card.
 *
 * @param {{section: {id: string, label: string, notes: Array<object>}, showCreateCard?: boolean, canCreate?: boolean, onCreate: Function, actions: object}} props Section data and actions.
 * @returns {JSX.Element} Note section.
 * @example
 * <NoteSection section={section} onCreate={openCreate} actions={noteActions} />
 */
export function NoteSection({ section, showCreateCard = false, canCreate = true, onCreate, actions }) {
  const headingId = `section-${section.id}`

  return (
    <section className="note-section" id={section.id} aria-labelledby={headingId}>
      <header className="note-section__header">
        <span className={`section-icon section-icon--${section.id}`} aria-hidden="true" />
        <h2 id={headingId}>{section.label}</h2>
        <span className="note-section__count">{section.notes.length}</span>
        {canCreate && <button className="note-section__add" type="button" onClick={onCreate} aria-label={`New note in ${section.label}`}><Plus size={18} /></button>}
      </header>
      <div className="notes-grid">
        {showCreateCard && <button className="new-note-card" type="button" onClick={onCreate}><Plus size={18} /> New note</button>}
        {section.notes.map((note) => <NoteCard key={note.id} note={note} actions={actions} />)}
      </div>
    </section>
  )
}
