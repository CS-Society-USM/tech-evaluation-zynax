import { Feather, Plus } from 'lucide-react'
import { Button } from '../../components/shared/Button.jsx'

/**
 * Displays a welcoming empty state for a new or filtered workspace.
 *
 * @param {{hasQuery: boolean, onCreate: Function}} props Empty-state context and create action.
 * @returns {JSX.Element} Empty notes state.
 * @example
 * <EmptyNotes hasQuery={false} onCreate={openEditor} />
 */
export function EmptyNotes({ hasQuery, onCreate }) {
  return (
    <section className="empty-notes">
      <span className="empty-notes__icon"><Feather size={28} /></span>
      <h2>{hasQuery ? 'No notes found' : 'A quiet page is waiting.'}</h2>
      <p>{hasQuery ? 'Try a different word or clear your search.' : 'Capture the first thought in your new private space.'}</p>
      {!hasQuery && <Button onClick={onCreate} icon={<Plus size={17} />}>Create your first note</Button>}
    </section>
  )
}
