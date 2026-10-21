# Development Roadmap

## Phase 0 — Initial setup

- [x] Create a React application with Vite.
- [x] Add lint and production build commands.
- [x] Establish frontend and backend folder boundaries.
- [x] Document requirements, architecture, and implementation phases.

## Phase 1 — Promotional experience

- [ ] Define the visual system and reusable UI primitives.
- [ ] Build the responsive public landing page.
- [ ] Add navigation, feature highlights, and calls to action.
- [ ] Verify keyboard navigation and responsive behavior.

## Phase 2 — Authentication

- [ ] Initialize the Express API and PostgreSQL schema.
- [ ] Implement registration, login, logout, and session verification.
- [ ] Add client-side authentication state and protected routes.
- [ ] Add validation, rate limiting, and authentication tests.

## Phase 3 — Create notes

- [ ] Build the authenticated dashboard.
- [ ] Implement note creation with title and content validation.
- [ ] Add empty, loading, success, and error states.

## Phase 4 — Enforce ownership

- [ ] Scope all note reads to the authenticated user.
- [ ] Test cross-account access attempts.

## Phase 5 — Edit and delete notes

- [ ] Implement note editing with ownership checks.
- [ ] Implement confirmed note deletion with ownership checks.
- [ ] Add API and interface regression tests.

## Completion checklist

- [ ] All five functional levels are complete.
- [ ] Database migrations are reproducible.
- [ ] Lint, tests, and production build pass.
- [ ] Environment setup and API usage are documented.
- [ ] The interface is validated on mobile and desktop sizes.
