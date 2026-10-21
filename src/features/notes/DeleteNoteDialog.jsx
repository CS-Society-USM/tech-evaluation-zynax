import { Trash2 } from 'lucide-react'
import { Button } from '../../components/shared/Button.jsx'
import { Modal } from '../../components/shared/Modal.jsx'

/**
 * Confirmation dialog that prevents accidental permanent note deletion.
 *
 * @param {{note: object, onConfirm: Function, onCancel: Function}} props Deletion target and actions.
 * @returns {JSX.Element} Delete confirmation dialog.
 * @example
 * <DeleteNoteDialog note={note} onConfirm={remove} onCancel={close} />
 */
export function DeleteNoteDialog({ note, onConfirm, onCancel }) {
  return (
    <Modal title="Let this note go?" description={`“${note.title}” will be permanently deleted.`} onClose={onCancel}>
      <div className="modal__actions modal__actions--standalone">
        <Button type="button" variant="ghost" onClick={onCancel}>Keep note</Button>
        <Button type="button" variant="danger" onClick={onConfirm} icon={<Trash2 size={17} />}>Delete forever</Button>
      </div>
    </Modal>
  )
}
