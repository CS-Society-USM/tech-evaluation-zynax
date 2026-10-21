import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react'
import { formatNoteDate } from '../../utils/date.js'
import { getNoteTone } from '../../utils/note.js'

/**
 * Displays one note summary with edit and delete actions.
 *
 * @param {{note: object, onEdit: Function, onDelete: Function}} props Note data and actions.
 * @returns {JSX.Element} Responsive note card.
 * @example
 * <NoteCard note={note} onEdit={selectNote} onDelete={requestDelete} />
 */
export function NoteCard({ note, onEdit, onDelete }) {
  const tone = getNoteTone(note.id)

  return (
    <article className={`note-card note-card--${tone}`}>
      <header className="note-card__header">
        <time dateTime={note.updatedAt}>{formatNoteDate(note.updatedAt)}</time>
        <span aria-hidden="true"><MoreHorizontal size={19} /></span>
      </header>
      <button className="note-card__content" type="button" onClick={() => onEdit(note)} aria-label={`Edit ${note.title}`}>
        <h2>{note.title}</h2><p>{note.content}</p>
      </button>
      <footer className="note-card__footer">
        <span>{note.content.trim().split(/\s+/).length} words</span>
        <div>
          <button type="button" onClick={() => onEdit(note)} aria-label={`Edit ${note.title}`}><Edit3 size={16} /></button>
          <button type="button" onClick={() => onDelete(note)} aria-label={`Delete ${note.title}`}><Trash2 size={16} /></button>
        </div>
      </footer>
    </article>
  )
}
