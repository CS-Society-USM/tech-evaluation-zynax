import { Archive, NotebookPen, Plus, SearchX, Star, Trash2 } from 'lucide-react'
import { Button } from '../../components/shared/Button.jsx'

const COLLECTION_EMPTY = {
  starred: { icon: Star, title: 'No starred notes yet', text: 'Star a note from its ⋯ menu to keep it close.' },
  archive: { icon: Archive, title: 'Archive is empty', text: 'Archive notes you want to keep but not see every day.' },
  trash: { icon: Trash2, title: 'Trash is empty', text: 'Notes you move to Trash show up here.' },
}

/**
 * Displays a welcoming empty state for a new workspace, an empty collection, or a search without results.
 *
 * @param {{hasQuery: boolean, collection?: string, onCreate: Function}} props Empty-state context and create action.
 * @returns {JSX.Element} Empty notes state.
 * @example
 * <EmptyNotes hasQuery={false} collection="notes" onCreate={openEditor} />
 */
export function EmptyNotes({ hasQuery, collection = 'notes', onCreate }) {
  const preset = hasQuery
    ? { icon: SearchX, title: 'No notes found', text: 'Try a different word or another filter.' }
    : COLLECTION_EMPTY[collection] ?? { icon: NotebookPen, title: 'A blank page is waiting.', text: 'Capture the first thought in your new private space.' }
  const Icon = preset.icon

  return (
    <section className="empty-notes">
      <span className="empty-notes__icon"><Icon size={30} /></span>
      <h2>{preset.title}</h2>
      <p>{preset.text}</p>
      {!hasQuery && collection === 'notes' && <Button variant="accent" onClick={onCreate} icon={<Plus size={17} />}>Create your first note</Button>}
    </section>
  )
}
