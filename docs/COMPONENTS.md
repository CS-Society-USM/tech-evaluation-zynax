# Components, Hooks, and Function Usage

Source files include JSDoc for every public component, hook, utility, middleware, service, and controller. This guide provides the practical import and composition patterns.

## Shared components

### `Brand`

Use the linked Mora wordmark (black tile with an orange dot) in global navigation.

```jsx
import { Brand } from '../components/shared/Brand.jsx'

<Brand compact />
```

### `Button`

Use for every action. Available variants are `primary` (black pill), `accent` (orange call to action), `light`, `ghost`, and `danger`; sizes are `small`, `medium`, and `large`.

```jsx
<Button variant="primary" size="large" isLoading={isSaving} onClick={saveNote}>
  Save note
</Button>
```

### `InputField` and `TextAreaField`

Use these controlled fields to keep labels, hints, error semantics, and visual states consistent. Pass `variant="bare"` for borderless paper-style inputs and `hideLabel` to keep the label for screen readers only.

```jsx
<InputField label="Title" name="title" value={title} onChange={onChange} error={errors.title} />
<TextAreaField label="Content" name="content" value={content} onChange={onChange} rows={10} />
<InputField label="Title" name="title" hideLabel variant="bare" />
```

### `Modal`

Use as the accessible frame for focused tasks. Pass task controls as children. `tone="cream"` gives the paper-style note editor background and `eyebrow` changes the small label above the title.

```jsx
<Modal title="Edit note" description="Update your saved thought." onClose={closeEditor}>
  <NoteForm />
</Modal>
```

### `AuthPanel`

Use as the shared two-column wrapper for guest authentication screens.

```jsx
<AuthPanel title="Welcome back" description="Your notes are waiting." footer={<Link to="/register">Register</Link>}>
  <AuthForm mode="login" onSubmit={login} />
</AuthPanel>
```

### `PhoneMockup`

Decorative phone preview used on the landing and authentication pages. It is hidden from assistive technology.

```jsx
<PhoneMockup variant="light" />
<PhoneMockup variant="dark" className="hero-art__phone" />
```

### `PageLoader` and `Toast`

Use `PageLoader` while resolving blocking route state. Use `Toast` for non-blocking success announcements.

```jsx
if (isLoading) return <PageLoader />
return <Toast message="Note saved." />
```

## Feature components

| Component | Purpose | Typical use |
| --- | --- | --- |
| `AuthForm` | Shared controlled login/registration form | `<AuthForm mode="register" onSubmit={register} />` |
| `ProtectedRoute` | Redirects guests away from private routes | Parent route element around dashboard routes |
| `GuestRoute` | Redirects authenticated users away from auth routes | Parent route element around login/register |
| `NotesSidebar` | Desktop workspace sidebar: Starred/Archive/Trash collections, date filters with counts, section links, recent notes, account and logout | `<NotesSidebar period={period} onPeriodChange={setPeriod} ... />` |
| `NoteSection` | Titled group of notes (Today, Earlier this week, Older notes) with an add button and optional dashed "New note" card | Map over `controller.sections` |
| `NoteCard` | White card with a coloured accent stripe, optional cover image, paragraph/bullet preview, relative time, star/archive markers, and action menu | `<NoteCard note={note} actions={actions} />` |
| `NoteMenu` | Kebab menu whose items follow the note state: Edit, Star, Archive, Move to Trash — or Restore and Delete forever in Trash | Rendered by `NoteCard` |
| `EmptyTrashDialog` | Confirmation before permanently deleting everything in Trash | Render when `isEmptyingTrash` is true |
| `NoteEditorModal` | Create or update form | Render when `editorNote !== undefined` |
| `DeleteNoteDialog` | Explicit destructive-action confirmation | Render when a deletion target exists |
| `EmptyNotes` | Empty and no-search-results state | Render when the filtered notes array is empty |

## Hooks

| Hook | Responsibility | Return highlights |
| --- | --- | --- |
| `useAuth` | Read the authenticated user and auth actions | `user`, `login`, `register`, `logout` |
| `useAuthController` | Initialize and mutate the global session | Used only by `AuthProvider` |
| `useAuthForm` | Form values, server errors, and submission | `values`, `handleChange`, `handleSubmit` |
| `useNotesController` | Load/filter/group notes and coordinate all CRUD UI | `visibleNotes`, `sections`, `collection`, `collectionCounts`, `periodCounts`, `recentNotes`, `view`, star/archive/trash/restore actions, editor/delete state |
| `useMenu` | Popover open state that closes on outside click or Escape | `isOpen`, `toggle`, `close`, `menuRef` |
| `useNoteForm` | Note values, queued image additions/removals, client validation, and saving | `values`, `errors`, `existingImages`, `newImages`, `addImages`, `handleSubmit` |
| `useAppLayoutActions` | Account display, logout, and mobile create action | `user`, `handleLogout`, `requestNewNote` |

## Client API functions

Import functions from `src/services/api.js`. Each function uses credentialed JSON requests and throws `ApiError` when the server rejects a request.

```js
import { createNote, getNotes, updateNote, deleteNote } from '../services/api.js'

const { notes } = await getNotes()
const { note } = await createNote({ title, content })
await updateNote(note.id, { title: 'Revised', content })
await deleteNote(note.id)
```

Authentication functions follow the same pattern: `registerAccount`, `loginAccount`, `getCurrentAccount`, and `logoutAccount`.

## Server functions

The server follows `route → middleware → controller → service → Prisma`.

- Controllers receive validated Express requests and format responses.
- Services own authentication, hashing, and ownership-aware database queries.
- `authenticate` reads and verifies the HTTP-only cookie.
- `validate(schema)` turns a Zod schema into reusable request middleware.
- `asyncHandler(handler)` forwards asynchronous errors to `errorHandler`.
- `createApp()` returns a configured Express app for both tests and the HTTP server.

Refer to the JSDoc above each exported function for its parameters, return value, and inline usage example.
