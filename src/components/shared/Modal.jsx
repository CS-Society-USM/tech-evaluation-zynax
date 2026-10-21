import { X } from 'lucide-react'

/**
 * Accessible modal frame with title, close button, and content slot.
 *
 * @param {{title: string, description?: string, onClose: Function, children: import('react').ReactNode, size?: string}} props Modal content and controls.
 * @returns {JSX.Element} Modal overlay and dialog.
 * @example
 * <Modal title="Edit note" onClose={close}><NoteForm /></Modal>
 */
export function Modal({ title, description, onClose, children, size = 'medium' }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby={description ? 'modal-description' : undefined}>
        <header className="modal__header">
          <div><p className="eyebrow">Mora notebook</p><h2 id="modal-title">{title}</h2>{description && <p id="modal-description">{description}</p>}</div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button>
        </header>
        {children}
      </section>
    </div>
  )
}
