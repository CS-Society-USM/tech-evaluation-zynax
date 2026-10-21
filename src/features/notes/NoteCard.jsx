import { Archive, Images, Star } from 'lucide-react'
import { formatRelativeTime } from '../../utils/date.js'
import { getNoteTone, parseNoteBlocks } from '../../utils/note.js'
import { NoteMenu } from './NoteMenu.jsx'

/**
 * Displays one note as a white card with a coloured accent, optional image, content preview, and action menu.
 * Trashed notes open nothing on click; they can only be restored or deleted from the menu.
 *
 * @param {{note: object, actions: object}} props Note data and dashboard actions.
 * @returns {JSX.Element} Note card.
 * @example
 * <NoteCard note={note} actions={noteActions} />
 */
export function NoteCard({ note, actions }) {
  const tone = getNoteTone(note.id)
  const [cover] = note.images ?? []
  const isTrashed = Boolean(note.trashedAt)

  return (
    <article className={`note-card note-card--${tone}${isTrashed ? ' note-card--trashed' : ''}`}>
      <button className="note-card__content" type="button" onClick={() => !isTrashed && actions.open(note)} aria-label={isTrashed ? `${note.title} (in Trash)` : `Open ${note.title}`} aria-disabled={isTrashed}>
        {cover && <img className="note-card__cover" src={cover.url} alt="" loading="lazy" />}
        <h3>{note.title}</h3>
        <div className="note-card__preview">
          {parseNoteBlocks(note.content).slice(0, 4).map((block, index) => block.type === 'list'
            ? <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>
            : <p key={index}>{block.text}</p>)}
        </div>
      </button>
      <footer className="note-card__footer">
        <span className="note-card__meta">
          <time dateTime={note.updatedAt}>{formatRelativeTime(note.updatedAt)}</time>
          {note.isStarred && <Star className="note-card__star" size={14} aria-label="Starred" />}
          {note.archivedAt && !isTrashed && <Archive size={14} aria-label="Archived" />}
          {note.images?.length > 1 && <span className="note-card__images"><Images size={14} aria-hidden="true" /> {note.images.length}</span>}
        </span>
        <NoteMenu note={note} actions={actions} />
      </footer>
    </article>
  )
}
