const CARD_TONES = ['peach', 'sage', 'lilac', 'sky', 'sand']

/**
 * Selects a stable visual tone for a note from its identifier.
 *
 * @param {string} noteId Note identifier.
 * @returns {string} Tone token used by note card CSS.
 * @example
 * const tone = getNoteTone(note.id)
 */
export function getNoteTone(noteId) {
  const total = [...noteId].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return CARD_TONES[total % CARD_TONES.length]
}

/**
 * Filters notes using a case-insensitive title and content query.
 *
 * @param {Array<object>} notes Notes to search.
 * @param {string} query Search query.
 * @returns {Array<object>} Matching notes.
 * @example
 * const visible = filterNotes(notes, search)
 */
export function filterNotes(notes, query) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return notes
  return notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(normalizedQuery))
}
