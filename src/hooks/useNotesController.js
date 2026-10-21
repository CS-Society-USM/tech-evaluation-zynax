import { useCallback, useEffect, useMemo, useState } from 'react'
import { createNote, deleteNote, deleteNoteImage, emptyTrash, getNotes, setNoteState, updateNote, uploadNoteImage } from '../services/api.js'
import { filterNotes, filterNotesByCollection, filterNotesByPeriod, groupNotesBySection, NOTE_COLLECTIONS } from '../utils/note.js'

/**
 * Coordinates dashboard note data, collections, filtering, editor state, and every note action.
 *
 * @returns {object} Notes dashboard state and actions.
 * @example
 * const notes = useNotesController()
 */
export function useNotesController() {
  const [notes, setNotes] = useState([])
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState('notes')
  const [period, setPeriod] = useState('all')
  const [view, setView] = useState('grid')
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editorNote, setEditorNote] = useState(undefined)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isEmptyingTrash, setEmptyingTrash] = useState(false)
  const [toast, setToast] = useState('')

  const reloadNotes = useCallback(async () => {
    const data = await getNotes()
    setNotes(data.notes)
  }, [])

  useEffect(() => {
    let isCurrent = true

    getNotes()
      .then((data) => {
        if (isCurrent) setNotes(data.notes)
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message)
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    const openEditor = () => setEditorNote(null)
    window.addEventListener('mora:new-note', openEditor)
    return () => window.removeEventListener('mora:new-note', openEditor)
  }, [])

  /** Replaces one note in local state and moves it to the top, matching server ordering. */
  function upsertNote(note) {
    setNotes((current) => [note, ...current.filter((item) => item.id !== note.id)])
  }

  /**
   * Creates or updates a note, then applies queued image removals and uploads.
   *
   * @param {{title: string, content: string, newImages?: File[], removedImageIds?: string[]}} input Editor output.
   */
  async function saveNote({ title, content, newImages = [], removedImageIds = [] }) {
    const isEditing = Boolean(editorNote)
    const { note } = isEditing ? await updateNote(editorNote.id, { title, content }) : await createNote({ title, content })

    await Promise.all(removedImageIds.map((imageId) => deleteNoteImage(note.id, imageId)))
    for (const file of newImages) await uploadNoteImage(note.id, file)

    if (newImages.length > 0 || removedImageIds.length > 0) await reloadNotes()
    else upsertNote(note)

    setEditorNote(undefined)
    setToast(isEditing ? 'Note updated.' : 'Note created.')
  }

  /** Applies a state change (star, archive, trash, restore) and shows a confirmation. */
  async function changeState(note, state, message) {
    try {
      const data = await setNoteState(note.id, state)
      setNotes((current) => current.map((item) => item.id === note.id ? data.note : item))
      setToast(message)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  /** Permanently deletes the selected note and removes it from local state. */
  async function confirmDelete() {
    await deleteNote(deleteTarget.id)
    setNotes((current) => current.filter((note) => note.id !== deleteTarget.id))
    setDeleteTarget(null)
    setToast('Note deleted forever.')
  }

  /** Permanently deletes every trashed note. */
  async function confirmEmptyTrash() {
    const { deleted } = await emptyTrash()
    setNotes((current) => current.filter((note) => !note.trashedAt))
    setEmptyingTrash(false)
    setToast(`${deleted} ${deleted === 1 ? 'note' : 'notes'} deleted forever.`)
  }

  /** Updates the active note search query from an input event. */
  function handleQueryChange(event) {
    setQuery(event.target.value)
  }

  /** Switches collection and resets the date filter. */
  function openCollection(id) {
    setCollection(id)
    setPeriod('all')
  }

  /** Shows active notes filtered by a date period. */
  function openPeriod(id) {
    setCollection('notes')
    setPeriod(id)
  }

  const collectionNotes = useMemo(() => filterNotesByCollection(notes, collection), [notes, collection])
  const visibleNotes = useMemo(() => filterNotes(filterNotesByPeriod(collectionNotes, period), query), [collectionNotes, period, query])
  const sections = useMemo(() => groupNotesBySection(visibleNotes), [visibleNotes])
  const activeNotes = useMemo(() => filterNotesByCollection(notes, 'notes'), [notes])
  const collectionCounts = useMemo(() => Object.fromEntries(NOTE_COLLECTIONS.map(({ id }) => [id, filterNotesByCollection(notes, id).length])), [notes])
  const periodCounts = useMemo(() => ({
    all: activeNotes.length,
    today: filterNotesByPeriod(activeNotes, 'today').length,
    week: filterNotesByPeriod(activeNotes, 'week').length,
  }), [activeNotes])
  const recentNotes = useMemo(() => activeNotes.slice(0, 6), [activeNotes])

  return {
    notes,
    visibleNotes,
    query,
    collection,
    period,
    view,
    sections,
    collectionCounts,
    periodCounts,
    recentNotes,
    isLoading,
    error,
    editorNote,
    deleteTarget,
    isEmptyingTrash,
    toast,
    handleQueryChange,
    openCollection,
    openPeriod,
    setView,
    openCreate: () => setEditorNote(null),
    openEdit: setEditorNote,
    closeEditor: () => setEditorNote(undefined),
    toggleStar: (note) => changeState(note, { isStarred: !note.isStarred }, note.isStarred ? 'Removed from Starred.' : 'Added to Starred.'),
    toggleArchive: (note) => changeState(note, { archived: !note.archivedAt }, note.archivedAt ? 'Moved back to notes.' : 'Note archived.'),
    moveToTrash: (note) => changeState(note, { trashed: true }, 'Moved to Trash.'),
    restoreNote: (note) => changeState(note, { trashed: false }, 'Note restored.'),
    requestDelete: setDeleteTarget,
    cancelDelete: () => setDeleteTarget(null),
    requestEmptyTrash: () => setEmptyingTrash(true),
    cancelEmptyTrash: () => setEmptyingTrash(false),
    saveNote,
    confirmDelete,
    confirmEmptyTrash,
  }
}
