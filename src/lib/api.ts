import { client } from "./supabase";
import { validateNote, type Note, type NoteInput } from "./notes";

const columns = "id,user_id,title,content,color,pinned,created_at,updated_at";

export async function listNotes(): Promise<Note[]> {
  const notes: Note[] = [];
  for (let from = 0; ; from += 500) {
    const { data, error } = await client()
      .from("notes")
      .select(columns)
      .order("updated_at", { ascending: false })
      .order("id")
      .range(from, from + 499);
    if (error) throw new Error(error.message);
    notes.push(...(data as Note[]));
    if (data.length < 500) break;
  }
  return [...new Map(notes.map((note) => [note.id, note])).values()];
}

export async function saveNote(
  input: NoteInput,
  userId: string,
  existing?: Note,
): Promise<Note> {
  const validation = validateNote(input);
  if (validation) throw new Error(validation);
  const value = {
    title: input.title.trim(),
    content: input.content,
    color: input.color,
    pinned: input.pinned,
  };
  // RLS remains authoritative; the version predicate also prevents silently overwriting another tab's edits.
  const query = existing
    ? client()
        .from("notes")
        .update(value)
        .eq("id", existing.id)
        .eq("updated_at", existing.updated_at)
    : client()
        .from("notes")
        .insert({ ...value, user_id: userId });
  const { data, error } = await query.select(columns).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data)
    throw new Error(
      "This note changed in another tab or is no longer available. Copy your edits, close the editor, and refresh your notes.",
    );
  return data as Note;
}

export async function deleteNote(note: Note): Promise<void> {
  const { data, error } = await client()
    .from("notes")
    .delete()
    .eq("id", note.id)
    .eq("updated_at", note.updated_at)
    .select("id");
  if (error) throw new Error(error.message);
  if (!data?.length)
    throw new Error(
      "This note changed or is no longer available. Refresh your notes before deleting it.",
    );
}
