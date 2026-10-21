import { useEffect, useMemo, useState } from 'react'
import { createNote, deleteNote, getNotes, updateNote } from '../services/api.js'
import { filterNotes } from '../utils/note.js'

/**
 * Coordinates dashboard note data, filtering, editor state, and CRUD actions.
 *
 * @returns {object} Notes dashboard state and actions.
 * @example
 * const notes = useNotesController()
 */
export function useNotesController() {
  const [notes, setNotes] = useState([])
  const [query, setQuery] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editorNote, setEditorNote] = useState(undefined)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState('')

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

  /** Creates or updates a note and synchronizes local state. */
  async function saveNote(input) {
    const data = editorNote
      ? await updateNote(editorNote.id, input)
      : await createNote(input)

    setNotes((current) => editorNote
      ? current.map((note) => note.id === data.note.id ? data.note : note)
      : [data.note, ...current])
    setEditorNote(undefined)
    setToast(editorNote ? 'Note updated.' : 'Note created.')
  }

  /** Deletes the selected note and removes it from local state. */
  async function confirmDelete() {
    await deleteNote(deleteTarget.id)
    setNotes((current) => current.filter((note) => note.id !== deleteTarget.id))
    setDeleteTarget(null)
    setToast('Note deleted.')
  }

  /** Updates the active note search query from an input event. */
  function handleQueryChange(event) {
    setQuery(event.target.value)
  }

  const visibleNotes = useMemo(() => filterNotes(notes, query), [notes, query])

  return {
    notes,
    visibleNotes,
    query,
    isLoading,
    error,
    editorNote,
    deleteTarget,
    toast,
    handleQueryChange,
    openCreate: () => setEditorNote(null),
    openEdit: setEditorNote,
    closeEditor: () => setEditorNote(undefined),
    requestDelete: setDeleteTarget,
    cancelDelete: () => setDeleteTarget(null),
    saveNote,
    confirmDelete,
  }
}
