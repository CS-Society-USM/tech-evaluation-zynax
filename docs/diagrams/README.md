# Diagrams

PlantUML sources (`.puml`) and rendered images (`.png`) describing how Mora works. Regenerate the images with:

```bash
java -jar plantuml.jar -tpng docs/diagrams/*.puml
```

## Use cases

What guests and authenticated users can do.

![Use cases](use-case.png)

## System architecture

React client, Express API layers, and the SQLite database accessed through Prisma.

![Architecture](architecture.png)

## Database schema

Each user owns many notes; deleting a user cascades to their notes.

![Database schema](erd.png)

## Authentication flow

Session restore via `/auth/me`, register/login with a signed JWT in an HTTP-only cookie, and logout.

![Authentication flow](auth-flow.png)

## Note CRUD and ownership

Every note query is scoped by the `ownerId` taken from the verified JWT, so other accounts receive `404`.

![Notes flow](notes-flow.png)
