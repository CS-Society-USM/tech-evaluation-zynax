/**
 * Formats an ISO timestamp as a concise, human-readable update label.
 *
 * @param {string} value ISO timestamp.
 * @returns {string} Localized date label.
 * @example
 * formatNoteDate('2026-10-21T08:00:00.000Z')
 */
export function formatNoteDate(value) {
  const date = new Date(value)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  return isToday
    ? `Today, ${new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date)}`
    : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric' }).format(date)
}

/**
 * Splits a date into the weekday and day-month-year labels used by the dashboard greeting.
 *
 * @param {Date} [date] Date to format, defaults to now.
 * @returns {{weekday: string, day: string}} Formatted labels.
 * @example
 * formatGreetingDate(new Date('2026-10-22')) // { weekday: 'Thursday', day: '22 Oct, 2026' }
 */
export function formatGreetingDate(date = new Date()) {
  const weekday = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(date)
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date)
  return { weekday, day: `${date.getDate()} ${month}, ${date.getFullYear()}` }
}

const RELATIVE_UNITS = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
]

/**
 * Formats a timestamp relative to now, such as "2 minutes ago" or "Yesterday".
 *
 * @param {string} value ISO timestamp.
 * @param {Date} [now] Reference time, injectable for tests.
 * @returns {string} Human-readable relative time.
 * @example
 * formatRelativeTime(note.updatedAt) // "5 hours ago"
 */
export function formatRelativeTime(value, now = new Date()) {
  const seconds = Math.round((new Date(value) - now) / 1000)
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) {
      const label = formatter.format(Math.trunc(seconds / size), unit)
      return label.charAt(0).toUpperCase() + label.slice(1)
    }
  }

  return 'Just now'
}
