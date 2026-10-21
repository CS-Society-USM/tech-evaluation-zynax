import { LayoutGrid, LogOut, Plus, Rows3, Search, Trash2 } from 'lucide-react'
import { Brand } from '../components/shared/Brand.jsx'
import { Button } from '../components/shared/Button.jsx'
import { PageLoader } from '../components/shared/PageLoader.jsx'
import { Toast } from '../components/shared/Toast.jsx'
import { DeleteNoteDialog } from '../features/notes/DeleteNoteDialog.jsx'
import { EmptyNotes } from '../features/notes/EmptyNotes.jsx'
import { EmptyTrashDialog } from '../features/notes/EmptyTrashDialog.jsx'
import { NoteEditorModal } from '../features/notes/NoteEditorModal.jsx'
import { NoteSection } from '../features/notes/NoteSection.jsx'
import { NotesSidebar } from '../features/notes/NotesSidebar.jsx'
import { useAppLayoutActions } from '../hooks/useAppLayoutActions.js'
import { useNotesController } from '../hooks/useNotesController.js'
import { NOTE_COLLECTIONS, NOTE_PERIODS } from '../utils/note.js'

const VIEWS = [
  { id: 'grid', label: 'Grid view', icon: LayoutGrid },
  { id: 'list', label: 'List view', icon: Rows3 },
]

const COLLECTION_HINTS = {
  starred: 'Notes you starred, including archived ones.',
  archive: 'Archived notes stay out of the way until you need them.',
  trash: 'Notes in Trash can be restored or deleted forever.',
}

/**
 * Private workspace where users search, filter, create, edit, star, archive, trash, and delete their own notes.
 *
 * @returns {JSX.Element} Authenticated notes workspace.
 * @example
 * <Route path="dashboard" element={<DashboardPage />} />
 */
export function DashboardPage() {
  const { user, handleLogout } = useAppLayoutActions()
  const controller = useNotesController()

  if (controller.isLoading) return <PageLoader />

  const isNotes = controller.collection === 'notes'
  const title = isNotes
    ? (controller.period === 'all' ? 'My Notes' : NOTE_PERIODS.find((item) => item.id === controller.period)?.label)
    : NOTE_COLLECTIONS.find((item) => item.id === controller.collection)?.label
  const actions = {
    open: controller.openEdit,
    toggleStar: controller.toggleStar,
    toggleArchive: controller.toggleArchive,
    moveToTrash: controller.moveToTrash,
    restore: controller.restoreNote,
    deleteForever: controller.requestDelete,
  }

  return (
    <div className="workspace">
      <NotesSidebar
        collection={controller.collection}
        period={controller.period}
        collectionCounts={controller.collectionCounts}
        periodCounts={controller.periodCounts}
        sections={controller.sections}
        recentNotes={controller.recentNotes}
        onCollectionChange={controller.openCollection}
        onPeriodChange={controller.openPeriod}
        onOpenNote={controller.openEdit}
      />

      <main className="workspace__main">
        <header className="workspace__mobile-bar">
          <Brand compact />
          <button className="icon-button" type="button" onClick={handleLogout} aria-label="Log out"><LogOut size={18} /></button>
        </header>

        <header className="workspace__header">
          <h1>{title}</h1>
          <div className="workspace__tools">
            <div className="view-toggle" role="group" aria-label="Layout">
              {VIEWS.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" aria-pressed={controller.view === id} aria-label={label} onClick={() => controller.setView(id)}><Icon size={16} /></button>
              ))}
            </div>
            {controller.collection === 'trash'
              ? controller.collectionCounts.trash > 0 && <Button size="small" variant="danger" onClick={controller.requestEmptyTrash} icon={<Trash2 size={16} />}>Empty Trash</Button>
              : <Button className="workspace__new" size="small" onClick={controller.openCreate} icon={<Plus size={16} />}>New note</Button>}
          </div>
        </header>

        {isNotes
          ? <p className="workspace__hello">Hola {user.name.split(' ')[0]} <span aria-hidden="true">👋</span></p>
          : <p className="workspace__hello workspace__hello--muted">{COLLECTION_HINTS[controller.collection]}</p>}

        <label className="workspace__search">
          <span className="sr-only">Search notes</span>
          <input type="search" value={controller.query} onChange={controller.handleQueryChange} placeholder={`Search ${isNotes ? 'your notes' : title.toLowerCase()}…`} />
          <Search size={18} aria-hidden="true" />
        </label>

        <div className="period-tabs" role="group" aria-label="Filter notes">
          {NOTE_PERIODS.map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={isNotes && controller.period === id} onClick={() => controller.openPeriod(id)}>{label} <small>{controller.periodCounts[id]}</small></button>
          ))}
          {NOTE_COLLECTIONS.slice(1).map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={controller.collection === id} onClick={() => controller.openCollection(id)}>{label} <small>{controller.collectionCounts[id]}</small></button>
          ))}
        </div>

        {controller.error && <p className="form-error" role="alert">{controller.error}</p>}

        {controller.sections.length === 0
          ? <EmptyNotes hasQuery={Boolean(controller.query) || controller.period !== 'all'} collection={controller.collection} onCreate={controller.openCreate} />
          : (
            <div className={`workspace__sections workspace__sections--${controller.view}`}>
              {controller.sections.map((section, index) => (
                <NoteSection
                  key={section.id}
                  section={section}
                  showCreateCard={isNotes && index === 0 && controller.view === 'grid'}
                  canCreate={isNotes}
                  onCreate={controller.openCreate}
                  actions={actions}
                />
              ))}
            </div>
          )}
      </main>

      {controller.editorNote !== undefined && <NoteEditorModal key={controller.editorNote?.id ?? 'new'} note={controller.editorNote} onSave={controller.saveNote} onClose={controller.closeEditor} />}
      {controller.deleteTarget && <DeleteNoteDialog note={controller.deleteTarget} onConfirm={controller.confirmDelete} onCancel={controller.cancelDelete} />}
      {controller.isEmptyingTrash && <EmptyTrashDialog count={controller.collectionCounts.trash} onConfirm={controller.confirmEmptyTrash} onCancel={controller.cancelEmptyTrash} />}
      <Toast message={controller.toast} />
    </div>
  )
}

export default DashboardPage
