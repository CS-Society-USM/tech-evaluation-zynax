import { describe, expect, it } from 'vitest'
import { filterNotes, getNoteTone } from './note.js'

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
})
