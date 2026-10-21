import { Archive, ArchiveRestore, MoreHorizontal, PencilLine, RotateCcw, Star, StarOff, Trash2 } from 'lucide-react'
import { useMenu } from '../../hooks/useMenu.js'

/**
 * Builds the menu items available for a note in its current state.
 *
 * @param {object} note Note shown by the menu.
 * @param {object} actions Note actions from the dashboard controller.
 * @returns {Array<{label: string, icon: Function, run: Function, danger?: boolean}>} Menu items.
 */
function getMenuItems(note, actions) {
  if (note.trashedAt) {
    return [
      { label: 'Restore', icon: RotateCcw, run: actions.restore },
      { label: 'Delete forever', icon: Trash2, run: actions.deleteForever, danger: true },
    ]
  }

  return [
    { label: 'Edit', icon: PencilLine, run: actions.open },
    { label: note.isStarred ? 'Unstar' : 'Star', icon: note.isStarred ? StarOff : Star, run: actions.toggleStar },
    { label: note.archivedAt ? 'Unarchive' : 'Archive', icon: note.archivedAt ? ArchiveRestore : Archive, run: actions.toggleArchive },
    { label: 'Move to Trash', icon: Trash2, run: actions.moveToTrash, danger: true },
  ]
}

/**
 * Kebab menu offering the actions available for one note.
 *
 * @param {{note: object, actions: object}} props Note and dashboard actions.
 * @returns {JSX.Element} Menu trigger and popover.
 * @example
 * <NoteMenu note={note} actions={noteActions} />
 */
export function NoteMenu({ note, actions }) {
  const { isOpen, toggle, close, menuRef } = useMenu()

  return (
    <div className="note-menu" ref={menuRef}>
      <button className="note-menu__trigger" type="button" onClick={toggle} aria-haspopup="menu" aria-expanded={isOpen} aria-label={`More actions for ${note.title}`}>
        <MoreHorizontal size={16} />
      </button>
      {isOpen && (
        <div className="note-menu__popover" role="menu">
          {getMenuItems(note, actions).map(({ label, icon: Icon, run, danger }) => (
            <button key={label} type="button" role="menuitem" className={danger ? 'is-danger' : undefined} onClick={() => { close(); run(note) }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
