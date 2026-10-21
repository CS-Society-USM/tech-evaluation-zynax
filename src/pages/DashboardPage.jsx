import { Plus, Search, Sparkles } from 'lucide-react'
import { Button } from '../components/shared/Button.jsx'
import { PageLoader } from '../components/shared/PageLoader.jsx'
import { Toast } from '../components/shared/Toast.jsx'
import { DeleteNoteDialog } from '../features/notes/DeleteNoteDialog.jsx'
import { EmptyNotes } from '../features/notes/EmptyNotes.jsx'
import { NoteCard } from '../features/notes/NoteCard.jsx'
import { NoteEditorModal } from '../features/notes/NoteEditorModal.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useNotesController } from '../hooks/useNotesController.js'

/**
 * Private dashboard where users search, create, edit, and delete their own notes.
 *
 * @returns {JSX.Element} Authenticated notes workspace.
 * @example
 * <Route path="dashboard" element={<DashboardPage />} />
 */
export function DashboardPage() {
  const { user } = useAuth()
  const controller = useNotesController()

  if (controller.isLoading) return <PageLoader />

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <div><p className="eyebrow"><Sparkles size={14} /> Personal notebook</p><h1>Good to see you, <em>{user.name.split(' ')[0]}.</em></h1><p>{controller.notes.length === 0 ? 'Your space is ready for its first thought.' : `${controller.notes.length} ${controller.notes.length === 1 ? 'note' : 'notes'} in your private collection.`}</p></div>
        <Button className="desktop-create" size="large" onClick={controller.openCreate} icon={<Plus size={18} />}>New note</Button>
      </header>

      <div className="dashboard-toolbar">
        <label className="search-box"><Search size={18} /><span className="sr-only">Search notes</span><input type="search" value={controller.query} onChange={controller.handleQueryChange} placeholder="Search your notes…" /></label>
        <span className="dashboard-toolbar__count">Showing {controller.visibleNotes.length} of {controller.notes.length}</span>
      </div>

      {controller.error && <p className="form-error" role="alert">{controller.error}</p>}
      {controller.visibleNotes.length === 0
        ? <EmptyNotes hasQuery={Boolean(controller.query)} onCreate={controller.openCreate} />
        : <section className="notes-grid" aria-label="Your notes">{controller.visibleNotes.map((note) => <NoteCard key={note.id} note={note} onEdit={controller.openEdit} onDelete={controller.requestDelete} />)}</section>}

      {controller.editorNote !== undefined && <NoteEditorModal note={controller.editorNote} onSave={controller.saveNote} onClose={controller.closeEditor} />}
      {controller.deleteTarget && <DeleteNoteDialog note={controller.deleteTarget} onConfirm={controller.confirmDelete} onCancel={controller.cancelDelete} />}
      <Toast message={controller.toast} />
    </main>
  )
}

export default DashboardPage
