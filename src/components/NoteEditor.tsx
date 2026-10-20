import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Pin, Save, X } from "lucide-react";
import {
  colors,
  CONTENT_LIMIT,
  emptyNote,
  TITLE_LIMIT,
  validateNote,
  wordCount,
  type Note,
  type NoteInput,
} from "../lib/notes";

export function NoteEditor({
  note,
  onClose,
  onSave,
}: {
  note: Note | null;
  onClose: () => void;
  onSave: (input: NoteInput, note?: Note) => Promise<void>;
}) {
  const [draft, setDraft] = useState<NoteInput>(
    note
      ? {
          title: note.title,
          content: note.content,
          color: note.color,
          pinned: note.pinned,
        }
      : { ...emptyNote },
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmClose, setConfirmClose] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const initial = useRef(JSON.stringify(draft));
  const dirty = JSON.stringify(draft) !== initial.current;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function close() {
    if (busy) return;
    if (dirty) setConfirmClose(true);
    else onClose();
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const invalid = validateNote(draft);
    if (invalid) {
      setError(invalid);
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onSave(draft, note ?? undefined);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save. Please try again.",
      );
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className={`editor-dialog ${draft.color}`}
      aria-labelledby="editor-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <form onSubmit={submit}>
        <div className="editor-top">
          <span className="eyebrow" id="editor-title">
            {note ? "A LITTLE ROOM TO REVISE" : "A FRESH PAGE"}
          </span>
          <button
            type="button"
            className="icon-button"
            aria-label="Close editor"
            onClick={close}
            disabled={busy}
          >
            <X size={21} />
          </button>
        </div>
        {confirmClose && (
          <div className="notice discard-notice" role="alert">
            <p>You have unsaved changes. Leave this note?</p>
            <div>
              <button
                type="button"
                className="button button-small"
                onClick={() => setConfirmClose(false)}
              >
                Keep writing
              </button>
              <button
                type="button"
                className="button button-small button-ghost"
                onClick={onClose}
              >
                Discard changes
              </button>
            </div>
          </div>
        )}
        <label className="sr-only" htmlFor="note-title">
          Note title
        </label>
        <input
          id="note-title"
          className="editor-title"
          placeholder="Give this thought a title…"
          value={draft.title}
          maxLength={TITLE_LIMIT}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          autoFocus
          required
          disabled={busy}
        />
        <label className="sr-only" htmlFor="note-content">
          Note content
        </label>
        <textarea
          id="note-content"
          className="editor-content"
          placeholder="Start anywhere. This space is yours."
          value={draft.content}
          maxLength={CONTENT_LIMIT}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          required
          disabled={busy}
        />
        {error && (
          <div className="notice error" role="alert">
            {error}
          </div>
        )}
        <div className="editor-meta">
          <span>{wordCount(draft.content)} words</span>
          <span>
            {draft.content.length.toLocaleString()} /{" "}
            {CONTENT_LIMIT.toLocaleString()}
          </span>
          <span>
            {dirty
              ? "Unsaved changes"
              : note
                ? "Saved note"
                : "Just a beginning"}
          </span>
        </div>
        <div className="editor-toolbar">
          <fieldset className="color-options">
            <legend className="sr-only">Note color</legend>
            {colors.map((color) => (
              <label
                key={color}
                className={`color-choice ${color}`}
                title={color}
              >
                <input
                  type="radio"
                  name="note-color"
                  value={color}
                  checked={draft.color === color}
                  onChange={() => setDraft({ ...draft, color })}
                  aria-label={color}
                  disabled={busy}
                />
                <span>{draft.color === color && <Check size={15} />}</span>
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            className={`icon-button pin-toggle ${draft.pinned ? "active" : ""}`}
            onClick={() => setDraft({ ...draft, pinned: !draft.pinned })}
            aria-label="Pin note"
            aria-pressed={draft.pinned}
            disabled={busy}
          >
            <Pin size={18} />
          </button>
          <button
            className="button button-small save-button"
            disabled={busy}
            type="submit"
          >
            {busy ? <span className="spinner" /> : <Save size={16} />}
            {busy ? "Saving…" : "Save note"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
