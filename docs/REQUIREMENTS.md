# Project Requirements

## Product goal

Build a responsive full-stack notes application where visitors can discover the product and registered users can privately manage their notes.

## Functional requirements

### Level 1 — Public landing page

- Guests can access a promotional home page.
- The page explains the product's primary benefits.
- Private application routes are not available to guests.

### Level 2 — Authentication

- Guests can register with a name, email address, and password.
- Existing users can sign in and sign out.
- Authenticated users can access a protected dashboard.
- Passwords must be hashed and never stored as plain text.

### Level 3 — Note creation

- Authenticated users can create notes from the dashboard.
- Every note requires a title and content.
- Validation errors must be clear and accessible.

### Level 4 — Note ownership

- Users can only retrieve and view notes that belong to their account.
- Ownership must be enforced by the API, not only hidden in the interface.

### Level 5 — Note management

- Users can edit their own notes.
- Users can delete their own notes after an explicit confirmation.
- Users cannot modify or delete another user's notes.

## Non-functional requirements

- Responsive layouts must support mobile, tablet, and desktop screens.
- Interactive controls must be keyboard accessible and have visible focus states.
- Forms must expose labels, validation messages, and sensible loading states.
- API input must be validated and errors must not expose sensitive details.
- Secrets and environment-specific values must not be committed to Git.
- The production build and lint checks must pass before merge.

## Data requirements

### User

- Unique identifier
- Name
- Unique email address
- Password hash
- Created and updated timestamps

### Note

- Unique identifier
- Required title
- Required content
- Owner identifier referencing a user
- Created and updated timestamps

Deleting a user should delete that user's notes through a database relationship or an explicit cleanup transaction.

## Environment variables planned for the API

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file connection string |
| `JWT_SECRET` | Token signing secret |
| `CLIENT_ORIGIN` | Allowed frontend origin for CORS |
| `PORT` | API server port |

## Implementation status

All five assessment levels are implemented. Automated API tests verify that a second authenticated account cannot list, update, or delete another user's note.
