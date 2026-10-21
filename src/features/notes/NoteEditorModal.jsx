import { ImagePlus, Save, X } from 'lucide-react'
import { Button } from '../../components/shared/Button.jsx'
import { InputField } from '../../components/shared/InputField.jsx'
import { Modal } from '../../components/shared/Modal.jsx'
import { TextAreaField } from '../../components/shared/TextAreaField.jsx'
import { MAX_IMAGES_PER_NOTE, useNoteForm } from '../../hooks/useNoteForm.js'

/**
 * Modal editor used to create or edit a note, including attaching and removing images.
 *
 * @param {{note: object|null, onSave: Function, onClose: Function}} props Editor data and actions.
 * @returns {JSX.Element} Note editor dialog.
 * @example
 * <NoteEditorModal note={selectedNote} onSave={saveNote} onClose={closeEditor} />
 */
export function NoteEditorModal({ note, onSave, onClose }) {
  const form = useNoteForm({ note, onSave })
  const words = form.values.content.trim().split(/\s+/).filter(Boolean).length
  const images = [
    ...form.existingImages.map((image) => ({ key: image.id, url: image.url, remove: () => form.removeExistingImage(image.id) })),
    ...form.newImages.map((image) => ({ key: image.url, url: image.url, remove: () => form.removeNewImage(image.url) })),
  ]

  return (
    <Modal title={note ? 'Edit note' : 'New note'} eyebrow="My notebook" onClose={onClose} size="large">
      <form className="note-form" onSubmit={form.handleSubmit} noValidate>
        <InputField label="Title" hideLabel variant="bare" name="title" value={form.values.title} onChange={form.handleChange} error={form.errors.title} maxLength={120} placeholder="Untitled thought" autoFocus />
        <TextAreaField label="Note" hideLabel variant="bare" name="content" value={form.values.content} onChange={form.handleChange} error={form.errors.content} maxLength={10000} rows={8} placeholder="Start writing… Lines starting with “-” become bullet points." />

        {images.length > 0 && (
          <ul className="note-form__images" aria-label="Attached images">
            {images.map((image, index) => (
              <li key={image.key}>
                <img src={image.url} alt={`Attachment ${index + 1}`} />
                <button type="button" onClick={image.remove} aria-label={`Remove attachment ${index + 1}`}><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}
        {form.imageError && <p className="field__message field__message--error" role="alert">{form.imageError}</p>}
        {form.error && <p className="form-error" role="alert">{form.error}</p>}

        <footer className="note-form__footer">
          <div className="note-form__meta">
            <label className={form.canAddImages ? 'note-form__attach' : 'note-form__attach is-disabled'}>
              <ImagePlus size={17} /> Add image
              <input className="sr-only" type="file" accept="image/png,image/jpeg,image/gif,image/webp" multiple disabled={!form.canAddImages} onChange={(event) => { form.addImages(event.target.files); event.target.value = '' }} />
            </label>
            <span className="note-form__count">{words} {words === 1 ? 'word' : 'words'} · {images.length}/{MAX_IMAGES_PER_NOTE} images</span>
          </div>
          <div className="modal__actions">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={form.isSubmitting} icon={<Save size={17} />}>{note ? 'Save changes' : 'Save note'}</Button>
          </div>
        </footer>
      </form>
    </Modal>
  )
}
