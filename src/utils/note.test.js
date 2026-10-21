import { describe, expect, it } from 'vitest'
import { filterNotes, filterNotesByCollection, filterNotesByPeriod, getNoteTone, groupNotesBySection, parseNoteBlocks } from './note.js'

const notes = [
  { id: 'note-a', title: 'Morning plan', content: 'Coffee and a short walk.' },
  { id: 'note-b', title: 'Reading list', content: 'The Creative Act' },
]

describe('note utilities', () => {
  it('filters by title and content without case sensitivity', () => {
    expect(filterNotes(notes, 'MORNING')).toEqual([notes[0]])
    expect(filterNotes(notes, 'creative')).toEqual([notes[1]])
    expect(filterNotes(notes, '')).toEqual(notes)
  })

  it('returns a stable visual tone for a note', () => {
    expect(getNoteTone('note-a')).toBe(getNoteTone('note-a'))
    expect(['peach', 'sage', 'lilac', 'sky', 'sand']).toContain(getNoteTone('note-a'))
  })

  it('filters notes by today and the last seven days', () => {
    const now = new Date('2026-10-21T12:00:00')
    const dated = [
      { id: 'today', updatedAt: '2026-10-21T08:00:00' },
      { id: 'recent', updatedAt: '2026-10-17T08:00:00' },
      { id: 'old', updatedAt: '2026-09-01T08:00:00' },
    ]

    expect(filterNotesByPeriod(dated, 'today', now).map((note) => note.id)).toEqual(['today'])
    expect(filterNotesByPeriod(dated, 'week', now).map((note) => note.id)).toEqual(['today', 'recent'])
    expect(filterNotesByPeriod(dated, 'all', now)).toEqual(dated)
  })

  it('groups notes into today, this week, and older sections', () => {
    const now = new Date('2026-10-21T12:00:00')
    const dated = [
      { id: 'today', updatedAt: '2026-10-21T08:00:00' },
      { id: 'recent', updatedAt: '2026-10-17T08:00:00' },
      { id: 'old', updatedAt: '2026-09-01T08:00:00' },
    ]

    expect(groupNotesBySection(dated, now).map((section) => [section.id, section.notes.map((note) => note.id)]))
      .toEqual([['today', ['today']], ['week', ['recent']], ['older', ['old']]])
    expect(groupNotesBySection([dated[2]], now).map((section) => section.id)).toEqual(['older'])
  })

  it('parses paragraphs and bullet lists for note previews', () => {
    expect(parseNoteBlocks(['Intro line', '- one', '* two', '', 'Outro'].join('\n'))).toEqual([
      { type: 'paragraph', text: 'Intro line' },
      { type: 'list', items: ['one', 'two'] },
      { type: 'paragraph', text: 'Outro' },
    ])
  })

  it('splits notes into active, starred, archive, and trash collections', () => {
    const notes = [
      { id: 'active' },
      { id: 'starred', isStarred: true },
      { id: 'archived', archivedAt: '2026-10-01' },
      { id: 'starred-archived', isStarred: true, archivedAt: '2026-10-01' },
      { id: 'trashed', isStarred: true, trashedAt: '2026-10-02' },
    ]
    const ids = (collection) => filterNotesByCollection(notes, collection).map((note) => note.id)

    expect(ids('notes')).toEqual(['active', 'starred'])
    expect(ids('starred')).toEqual(['starred', 'starred-archived'])
    expect(ids('archive')).toEqual(['archived', 'starred-archived'])
    expect(ids('trash')).toEqual(['trashed'])
  })
})
