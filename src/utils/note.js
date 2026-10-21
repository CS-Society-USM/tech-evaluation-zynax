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
  const hash = [...noteId].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 7)
  return CARD_TONES[hash % CARD_TONES.length]
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

const DAY_IN_MS = 24 * 60 * 60 * 1000

/** Period filters shown as chips on the dashboard. */
export const NOTE_PERIODS = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
]

/**
 * Keeps notes updated within the selected period.
 *
 * @param {Array<{updatedAt: string}>} notes Notes to filter.
 * @param {'all'|'today'|'week'} period Period identifier from NOTE_PERIODS.
 * @param {Date} [now] Reference time, injectable for tests.
 * @returns {Array<object>} Notes inside the period.
 * @example
 * const recent = filterNotesByPeriod(notes, 'week')
 */
export function filterNotesByPeriod(notes, period, now = new Date()) {
  if (period === 'today') return notes.filter((note) => new Date(note.updatedAt).toDateString() === now.toDateString())
  if (period === 'week') return notes.filter((note) => now - new Date(note.updatedAt) < 7 * DAY_IN_MS)
  return notes
}

/** Dashboard sections, in display order. */
export const NOTE_SECTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Earlier this week' },
  { id: 'older', label: 'Older notes' },
]

/**
 * Groups notes into dashboard sections by last update and drops empty sections.
 *
 * @param {Array<{updatedAt: string}>} notes Notes sorted newest first.
 * @param {Date} [now] Reference time, injectable for tests.
 * @returns {Array<{id: string, label: string, notes: Array<object>}>} Non-empty sections.
 * @example
 * groupNotesBySection(visibleNotes).map((section) => section.label)
 */
export function groupNotesBySection(notes, now = new Date()) {
  const today = new Set(filterNotesByPeriod(notes, 'today', now))
  const week = new Set(filterNotesByPeriod(notes, 'week', now))
  const sectionOf = (note) => (today.has(note) ? 'today' : week.has(note) ? 'week' : 'older')

  return NOTE_SECTIONS
    .map((section) => ({ ...section, notes: notes.filter((note) => sectionOf(note) === section.id) }))
    .filter((section) => section.notes.length > 0)
}

/**
 * Splits plain note content into paragraph and bullet-list blocks for previews.
 * Lines starting with "-", "*", or "•" become list items.
 *
 * @param {string} content Raw note content.
 * @returns {Array<{type: 'paragraph', text: string}|{type: 'list', items: string[]}>} Preview blocks.
 * @example
 * parseNoteBlocks('Intro\n- one\n- two')
 */
export function parseNoteBlocks(content) {
  const blocks = []

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim()
    const bullet = line.match(/^[-*•]\s+(.*)$/)
    const last = blocks.at(-1)

    if (!line) continue
    if (bullet && last?.type === 'list') last.items.push(bullet[1])
    else if (bullet) blocks.push({ type: 'list', items: [bullet[1]] })
    else blocks.push({ type: 'paragraph', text: line })
  }

  return blocks
}

/** Top-level note collections shown in the sidebar. */
export const NOTE_COLLECTIONS = [
  { id: 'notes', label: 'My Notes' },
  { id: 'starred', label: 'Starred' },
  { id: 'archive', label: 'Archive' },
  { id: 'trash', label: 'Trash' },
]

/**
 * Keeps the notes that belong to a sidebar collection.
 * Trashed notes only appear in Trash; archived notes only in Archive (and Starred when starred).
 *
 * @param {Array<{isStarred?: boolean, archivedAt?: string|null, trashedAt?: string|null}>} notes Notes to filter.
 * @param {'notes'|'starred'|'archive'|'trash'} collection Collection identifier.
 * @returns {Array<object>} Notes in the collection.
 * @example
 * filterNotesByCollection(notes, 'starred')
 */
export function filterNotesByCollection(notes, collection) {
  if (collection === 'trash') return notes.filter((note) => note.trashedAt)
  const live = notes.filter((note) => !note.trashedAt)
  if (collection === 'starred') return live.filter((note) => note.isStarred)
  if (collection === 'archive') return live.filter((note) => note.archivedAt)
  return live.filter((note) => !note.archivedAt)
}
