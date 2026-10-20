export const colors = ["paper", "sage", "peach", "lavender", "sky"] as const;
export type NoteColor = (typeof colors)[number];
export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  color: NoteColor;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};
export type NoteInput = Pick<Note, "title" | "content" | "color" | "pinned">;
export const emptyNote: NoteInput = {
  title: "",
  content: "",
  color: "paper",
  pinned: false,
};
export const TITLE_LIMIT = 120;
export const CONTENT_LIMIT = 20000;

export function validateNote(note: NoteInput): string | null {
  if (!note.title.trim()) return "Give your note a title.";
  if (note.title.trim().length > TITLE_LIMIT)
    return `Keep your title within ${TITLE_LIMIT} characters.`;
  if (!note.content.trim()) return "Add a little something to your note.";
  if (note.content.length > CONTENT_LIMIT)
    return `Keep your note within ${CONTENT_LIMIT.toLocaleString()} characters.`;
  if (!colors.includes(note.color)) return "Choose one of the note colors.";
  return null;
}

export function selectNotes(
  notes: Note[],
  query: string,
  filter: string,
  sort: string,
): Note[] {
  const search = query.trim().toLocaleLowerCase();
  return notes
    .filter(
      (note) =>
        (!search ||
          `${note.title}\n${note.content}`
            .toLocaleLowerCase()
            .includes(search)) &&
        (filter === "all" ||
          (filter === "pinned" ? note.pinned : note.color === filter)),
    )
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "oldest")
        return Date.parse(a.created_at) - Date.parse(b.created_at);
      return Date.parse(b.updated_at) - Date.parse(a.updated_at);
    });
}

export function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}

export function readableError(error: unknown): string {
  if (error instanceof Error && /fetch|network|offline/i.test(error.message)) {
    return "We couldn’t connect. Check your connection and try again. Your edits are still here.";
  }
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
