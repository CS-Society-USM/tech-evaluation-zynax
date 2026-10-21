import { Trash2 } from 'lucide-react'
import { Button } from '../../components/shared/Button.jsx'
import { Modal } from '../../components/shared/Modal.jsx'

/**
 * Confirmation dialog for permanently deleting every note in Trash.
 *
 * @param {{count: number, onConfirm: Function, onCancel: Function}} props Number of trashed notes and actions.
 * @returns {JSX.Element} Empty-trash confirmation dialog.
 * @example
 * <EmptyTrashDialog count={3} onConfirm={emptyTrash} onCancel={close} />
 */
export function EmptyTrashDialog({ count, onConfirm, onCancel }) {
  return (
    <Modal title="Empty the Trash?" description={`${count} ${count === 1 ? 'note' : 'notes'} and their images will be deleted forever.`} onClose={onCancel}>
      <div className="modal__actions modal__actions--standalone">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="button" variant="danger" onClick={onConfirm} icon={<Trash2 size={17} />}>Empty Trash</Button>
      </div>
    </Modal>
  )
}
