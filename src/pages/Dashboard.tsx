import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Leaf,
  LogOut,
  Menu,
  Pin,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { NoteEditor } from "../components/NoteEditor";
import { deleteNote, listNotes, saveNote } from "../lib/api";
import { client } from "../lib/supabase";
import {
  colors,
  readableError,
  selectNotes,
  type Note,
  type NoteInput,
} from "../lib/notes";

export function Dashboard({ user }: { user: User }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [editor, setEditor] = useState<Note | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [busyNote, setBusyNote] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const generation = useRef(0);
  const visible = useMemo(
    () => selectNotes(notes, query, filter, sort),
    [notes, query, filter, sort],
  );
  const load = useCallback(async () => {
    const current = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const data = await listNotes();
      if (generation.current === current) setNotes(data);
    } catch (err) {
      if (generation.current === current) setError(readableError(err));
    } finally {
      if (generation.current === current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
    return () => {
      generation.current++;
    };
  }, [load]);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    if (deleteTarget) {
      const previous = document.activeElement as HTMLElement | null;
      deleteDialog.current?.showModal();
      return () => {
        previous?.focus();
      };
    }
  }, [deleteTarget]);
  async function save(input: NoteInput, existing?: Note) {
    const saved = await saveNote(input, user.id, existing);
    generation.current++;
    setLoading(false);
    setNotes((old) =>
      existing
        ? old.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...old],
    );
    setToast(
      existing ? "A little update, saved." : "A new thought, safely saved.",
    );
  }
  async function pin(note: Note) {
    setBusyNote(note.id);
    setError("");
    try {
      await save({ ...note, pinned: !note.pinned }, note);
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusyNote(null);
    }
  }
  async function remove() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteNote(deleteTarget);
      generation.current++;
      setLoading(false);
      setNotes((old) => old.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
      setToast("Note deleted.");
    } catch (err) {
      setDeleteError(readableError(err));
    } finally {
      setDeleting(false);
    }
  }
  async function signOut() {
    setSigningOut(true);
    try {
      const { error } = await client().auth.signOut();
      if (error) throw error;
    } catch (err) {
      setError(readableError(err));
      setSigningOut(false);
    }
  }
  function chooseFilter(value: string) {
    setFilter(value);
    setMenuOpen(false);
  }
  return (
    <div className="workspace">
      {menuOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-button mobile-menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <button
          className="button new-note-sidebar"
          onClick={() => {
            setEditor(null);
            setMenuOpen(false);
          }}
        >
          <Plus size={18} /> New note
        </button>
        <nav aria-label="Notebook filters">
          <span className="sidebar-label">YOUR NOTEBOOK</span>
          <button
            className={`sidebar-item ${filter === "all" ? "selected" : ""}`}
            onClick={() => chooseFilter("all")}
            aria-pressed={filter === "all"}
          >
            <FileText size={18} /> All notes <span>{notes.length}</span>
          </button>
          <button
            className={`sidebar-item ${filter === "pinned" ? "selected" : ""}`}
            onClick={() => chooseFilter("pinned")}
            aria-pressed={filter === "pinned"}
          >
            <Pin size={18} /> Pinned{" "}
            <span>{notes.filter((n) => n.pinned).length}</span>
          </button>
          <span className="sidebar-label colors-label">A LITTLE COLOR</span>
          {colors.map((color) => (
            <button
              key={color}
              className={`sidebar-item ${filter === color ? "selected" : ""}`}
              onClick={() => chooseFilter(color)}
              aria-pressed={filter === color}
            >
              <span className={`color-dot ${color}`} />
              <span className="color-name">{color}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-quote">
            <Leaf size={20} />
            <p>
              One thought at a time.
              <br />
              That’s enough.
            </p>
          </div>
          <div className="account">
            <span className="avatar">
              {user.email?.charAt(0).toUpperCase() || "Y"}
            </span>
            <div>
              <strong>Your space</strong>
              <span title={user.email}>{user.email}</span>
            </div>
            <button
              className="icon-button"
              onClick={signOut}
              disabled={signingOut}
              aria-label="Log out"
            >
              {signingOut ? <span className="spinner" /> : <LogOut size={17} />}
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-top">
          <div className="workspace-breadcrumb">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation"
              aria-expanded={menuOpen}
            >
              <Menu size={21} />
            </button>
            <span>My notebook</span>
            <span className="breadcrumb-slash">/</span>
            <span className="color-name">
              {filter === "all" ? "All notes" : filter}
            </span>
          </div>
          <span className="private-label">
            <span className="status-dot" /> A space of your own
          </span>
        </header>
        <main id="main" className="dashboard-main">
          <div className="dashboard-heading">
            <div>
              <span className="eyebrow">A CLEARER HEAD STARTS HERE</span>
              <h1>
                {filter === "pinned"
                  ? "Close to mind."
                  : filter === "all"
                    ? "Your little corner."
                    : `${filter.charAt(0).toUpperCase() + filter.slice(1)} thoughts.`}
              </h1>
              <p>
                {filter === "pinned"
                  ? "The thoughts you want to keep within reach."
                  : "Gather your thoughts. Make room for the next good thing."}
              </p>
            </div>
            <button
              className="button desktop-new"
              onClick={() => setEditor(null)}
            >
              <Plus size={18} /> New note
            </button>
          </div>
          <div className="dashboard-tools">
            <div className="search-box">
              <Search size={18} />
              <label htmlFor="search-notes" className="sr-only">
                Search notes
              </label>
              <input
                id="search-notes"
                type="search"
                placeholder="Find a thought…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="sort-control">
              <label htmlFor="sort-notes">Sort by</label>
              <select
                id="sort-notes"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recent">Recently edited</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
            <button
              className="icon-button refresh-button"
              onClick={() => void load()}
              disabled={loading || busyNote !== null}
              aria-label="Refresh notes"
            >
              <RefreshCw size={17} className={loading ? "spin" : ""} />
            </button>
          </div>
          {offline && (
            <div className="notice" role="status">
              You’re offline. You can keep an open draft here; reconnect before
              saving.
            </div>
          )}
          {error && (
            <div className="notice error" role="alert">
              <span>{error}</span>
              <button className="text-button" onClick={() => void load()}>
                Try again
              </button>
            </div>
          )}
          <div className="notes-section-heading">
            <span>
              {query
                ? "SEARCH RESULTS"
                : filter === "all"
                  ? "ALL YOUR THOUGHTS"
                  : "A LITTLE COLLECTION"}
            </span>
            <span>
              {visible.length} {visible.length === 1 ? "note" : "notes"}
            </span>
          </div>
          {loading ? (
            <div
              className="notes-grid"
              role="status"
              aria-label="Loading notes"
            >
              {[1, 2, 3].map((n) => (
                <div className="note-skeleton" key={n}>
                  <i />
                  <i />
                  <i />
                </div>
              ))}
            </div>
          ) : visible.length ? (
            <div className="notes-grid">
              {visible.map((note) => (
                <article key={note.id} className={`note-card ${note.color}`}>
                  <div className="note-card-top">
                    <span className="note-date">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(note.updated_at))}
                    </span>
                    <button
                      className={`icon-button note-pin ${note.pinned ? "is-pinned" : ""}`}
                      aria-label={
                        note.pinned
                          ? `Unpin ${note.title}`
                          : `Pin ${note.title}`
                      }
                      aria-pressed={note.pinned}
                      disabled={busyNote !== null || loading}
                      onClick={() => void pin(note)}
                    >
                      <Pin size={16} />
                    </button>
                  </div>
                  <button
                    className="note-open"
                    onClick={() => setEditor(note)}
                    aria-label={`Edit ${note.title}`}
                  >
                    <h2>{note.title}</h2>
                    <p>{note.content}</p>
                  </button>
                  <div className="note-card-bottom">
                    <span>
                      {note.pinned ? "Pinned for later" : "A thought, kept."}
                    </span>
                    <div>
                      <button
                        className="icon-button"
                        aria-label={`Delete ${note.title}`}
                        onClick={() => {
                          setDeleteError("");
                          setDeleteTarget(note);
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={`Open ${note.title}`}
                        onClick={() => setEditor(note)}
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {!query && filter === "all" && (
                <button
                  className="add-note-card"
                  onClick={() => setEditor(null)}
                >
                  <span>
                    <Plus size={23} />
                  </span>
                  <strong>Room for one more thought.</strong>
                  <span>Start a fresh note</span>
                </button>
              )}
            </div>
          ) : (
            !error && (
              <div className="empty-state">
                <div className="empty-illustration" aria-hidden="true">
                  <FileText size={48} strokeWidth={1.1} />
                  <span>✳</span>
                </div>
                <h2>
                  {query
                    ? "That thought is playing hide-and-seek."
                    : filter === "all"
                      ? "A fresh page, just for you."
                      : "A little space, waiting."}
                </h2>
                <p>
                  {query
                    ? "Try a different word or clear your search."
                    : filter === "all"
                      ? "Big idea or small reminder — your first note belongs here."
                      : "Notes in this collection will appear here."}
                </p>
                {query || filter !== "all" ? (
                  <button
                    className="button button-outline"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                  >
                    Show all notes
                  </button>
                ) : (
                  <button className="button" onClick={() => setEditor(null)}>
                    <Plus size={18} /> Write your first note
                  </button>
                )}
              </div>
            )
          )}
          <footer className="dashboard-footer">
            <span>Small thoughts. A little more clarity.</span>
            <span title={`Build ${__COMMIT_SHA__}`}>stillnote.</span>
          </footer>
        </main>
      </div>
      <button
        className="mobile-new"
        aria-label="New note"
        onClick={() => setEditor(null)}
      >
        <Plus size={25} />
      </button>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
          <button
            className="icon-button"
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {editor !== undefined && (
        <NoteEditor
          note={editor}
          onClose={() => setEditor(undefined)}
          onSave={save}
        />
      )}
      {deleteTarget && (
        <dialog
          ref={deleteDialog}
          className="delete-dialog"
          aria-labelledby="delete-title"
          onCancel={(event) => {
            event.preventDefault();
            if (!deleting) setDeleteTarget(null);
          }}
        >
          <div className="delete-icon">
            <Trash2 size={24} />
          </div>
          <h2 id="delete-title">Let this thought go?</h2>
          <p>
            “{deleteTarget.title}” will be permanently deleted. This can’t be
            undone.
          </p>
          {deleteError && (
            <div className="notice error" role="alert">
              {deleteError}
            </div>
          )}
          <div className="delete-actions">
            <button
              className="button button-outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              autoFocus
            >
              Keep note
            </button>
            <button
              className="button button-danger"
              onClick={() => void remove()}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete note"}
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}
