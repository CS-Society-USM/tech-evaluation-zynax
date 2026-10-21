# Architecture

## Planned stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Client | React + Vite | Responsive interface, routing, forms, and API consumption |
| API | Node.js + Express | Authentication, validation, authorization, and note operations |
| Database | PostgreSQL + Prisma | Durable user and note storage, schema migrations, and relations |
| Authentication | JWT + HTTP-only cookie | Secure server-managed login sessions |

## Repository structure

```text
.
├── docs/                  Project requirements and technical decisions
├── public/                Static public assets
├── server/
│   ├── src/
│   │   ├── config/        Environment and infrastructure configuration
│   │   ├── controllers/   HTTP request handlers
│   │   ├── middleware/    Authentication, errors, and shared middleware
│   │   ├── routes/        API route definitions
│   │   ├── services/      Business and persistence operations
│   │   └── validators/    Request validation schemas
│   └── tests/             API tests
└── src/
    ├── assets/            Imported images and icons
    ├── components/        Shared presentational components
    ├── features/          Domain modules such as authentication and notes
    ├── hooks/             Shared React hooks
    ├── layouts/           Page-level layout shells
    ├── pages/             Route entry components
    ├── services/          API client and browser integrations
    ├── styles/            Global styles and design tokens
    └── utils/             Framework-independent helpers
```

## API boundaries

The planned API will expose versioned routes under `/api/v1`. Authentication middleware will derive the current user from a signed token. Every note query and mutation will include the authenticated user's identifier so ownership remains enforced at the server and database query level.

## Dependency direction

- Pages compose layouts and feature components.
- Features may depend on shared components, hooks, services, and utilities.
- Shared components do not import page or feature modules.
- Controllers delegate business logic to services.
- Routes apply validators and middleware before invoking controllers.
