const noteForm = document.querySelector("#noteForm");
const notesList = document.querySelector("#notesList");
const notesMessage = document.querySelector("#notesMessage");
const noteIdInput = document.querySelector("#noteId");
const saveNoteButton = document.querySelector("#saveNoteButton");
const cancelEditButton = document.querySelector("#cancelEditButton");

let currentUser;
let notes = [];

function showMessage(message) {
  notesMessage.textContent = message;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

async function loadNotes() {
  showMessage("Memuat nota...");

  const { data, error } = await supabaseClient
    .from("notes")
    .select("id, title, content, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    showMessage(`Ralat memuat nota: ${error.message}`);
    return;
  }

  notes = data;

  if (notes.length === 0) {
    notesList.innerHTML = "<p>Belum ada nota. Cipta nota pertama anda.</p>";
    showMessage("");
    return;
  }

  notesList.innerHTML = notes.map((note) => `
    <article class="note-card">
      <h2>${escapeHtml(note.title)}</h2>
      <p>${escapeHtml(note.content)}</p>
      <button type="button" data-action="edit" data-id="${note.id}">Edit</button>
      <button type="button" data-action="delete" data-id="${note.id}">Padam</button>
    </article>
  `).join("");

  showMessage(`${notes.length} nota`);
}

function resetNoteForm() {
  noteForm.reset();
  noteIdInput.value = "";
  saveNoteButton.textContent = "Simpan nota";
  cancelEditButton.hidden = true;
}

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = document.querySelector("#noteTitle").value.trim();
  const content = document.querySelector("#noteContent").value.trim();
  const noteId = noteIdInput.value;

  const result = noteId
    ? await supabaseClient.from("notes")
        .update({ title, content })
        .eq("id", noteId)
        .eq("user_id", currentUser.id)
    : await supabaseClient.from("notes")
        .insert({ title, content, user_id: currentUser.id });

  if (result.error) {
    showMessage(`Ralat menyimpan nota: ${result.error.message}`);
    return;
  }

  resetNoteForm();
  await loadNotes();
});

notesList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const note = notes.find((item) => item.id === button.dataset.id);
  if (!note) return;

  if (button.dataset.action === "edit") {
    noteIdInput.value = note.id;
    document.querySelector("#noteTitle").value = note.title;
    document.querySelector("#noteContent").value = note.content;
    saveNoteButton.textContent = "Kemaskini nota";
    cancelEditButton.hidden = false;
    document.querySelector("#noteTitle").focus();
  }

  if (button.dataset.action === "delete" && confirm(`Padam nota "${note.title}"?`)) {
    const { error } = await supabaseClient
      .from("notes")
      .delete()
      .eq("id", note.id)
      .eq("user_id", currentUser.id);

    if (error) {
      showMessage(`Ralat memadam nota: ${error.message}`);
      return;
    }

    resetNoteForm();
    await loadNotes();
  }
});

cancelEditButton.addEventListener("click", resetNoteForm);

document.querySelector("#logoutButton").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "auth.html";
});

async function startDashboard() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session) {
    window.location.href = "auth.html";
    return;
  }

  currentUser = data.session.user;
  document.querySelector("#userEmail").textContent =
    `Log masuk sebagai ${currentUser.email}`;

  await loadNotes();
}

startDashboard();