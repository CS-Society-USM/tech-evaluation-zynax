# Mora — Private Notes App

A full-stack notes application created for the USM Computer Science Society technical test.

Mora is a responsive full-stack notes application. Guests can explore the promotional website, create an account, and securely manage a private collection of notes.

**Live demo:** https://mora.15-235-211-72.sslip.io

## Completed features

- Public promotional landing page for guests
- Registration, login, logout, and persistent cookie sessions
- Protected notes dashboard with search
- Create, read, update, and delete note flows
- Starred, Archive, and Trash collections with restore and "delete forever"
- Private image attachments on notes (PNG, JPEG, GIF, WebP up to 5 MB)
- Workspace dashboard with sidebar, date sections, grid and list views
- Server-side ownership enforcement for every note operation
- Responsive desktop, tablet, and mobile layouts
- Accessible labels, focus states, validation, loading, and confirmation states
- Integration tests covering authentication and cross-account access attempts

## Technology direction

- React and Vite for the client application
- Node.js and Express for the REST API
- SQLite with Prisma ORM for zero-configuration persistent storage
- JSON Web Tokens stored in secure HTTP-only cookies for authentication

## Getting started

### Prerequisites

- Node.js 20.19 or newer
- npm 10 or newer
- Git

### Installation

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Copy `.env.example` to `.env` before the database commands and replace `JWT_SECRET` for any shared or production environment. Open `http://localhost:5173` after both development servers start.

## Available commands

```bash
npm run dev      # Start the frontend development server
npm run build    # Create a production build
npm run lint     # Run static code checks
npm test         # Run API ownership and utility tests
npm run preview  # Preview the production build locally
npm run db:push  # Apply the Prisma schema to SQLite
```

## Documentation

- [Project requirements](docs/REQUIREMENTS.md)
- [Architecture and folder structure](docs/ARCHITECTURE.md)
- [Development roadmap](docs/ROADMAP.md)
- [API reference](docs/API.md)
- [Components, hooks, and usage](docs/COMPONENTS.md)
