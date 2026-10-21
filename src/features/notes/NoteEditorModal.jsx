import { Save } from 'lucide-react'
import { Button } from '../../components/shared/Button.jsx'
import { InputField } from '../../components/shared/InputField.jsx'
import { Modal } from '../../components/shared/Modal.jsx'
import { TextAreaField } from '../../components/shared/TextAreaField.jsx'
import { useNoteForm } from '../../hooks/useNoteForm.js'

/**
 * Modal form used to create a new note or edit an existing note.
 *
 * @param {{note: object|null, onSave: Function, onClose: Function}} props Editor data and actions.
 * @returns {JSX.Element} Note editor dialog.
 * @example
 * <NoteEditorModal note={selectedNote} onSave={saveNote} onClose={closeEditor} />
 */
export function NoteEditorModal({ note, onSave, onClose }) {
  const form = useNoteForm({ note, onSave })

  return (
    <Modal title={note ? 'Refine your note' : 'Capture a thought'} description="Keep it simple. You can always come back and shape it later." onClose={onClose} size="large">
      <form className="note-form" onSubmit={form.handleSubmit} noValidate>
        <InputField label="Title" name="title" value={form.values.title} onChange={form.handleChange} error={form.errors.title} maxLength={120} placeholder="Give this thought a name" autoFocus />
        <TextAreaField label="Note" name="content" value={form.values.content} onChange={form.handleChange} error={form.errors.content} maxLength={10000} rows={10} placeholder="Start writing here…" />
        {form.error && <p className="form-error" role="alert">{form.error}</p>}
        <footer className="modal__actions">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={form.isSubmitting} icon={<Save size={17} />}>{note ? 'Save changes' : 'Create note'}</Button>
        </footer>
      </form>
    </Modal>
  )
}
