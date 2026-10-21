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
