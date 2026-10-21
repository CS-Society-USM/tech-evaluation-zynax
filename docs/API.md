# API Reference

All endpoints use the `/api/v1` prefix and return JSON except successful delete and logout responses. Authentication is maintained by the `notes_session` HTTP-only cookie; browser clients must include credentials.

## Response format

```json
{
  "success": true,
  "data": {}
}
```

Errors use `{ "success": false, "error": "Message" }`. Validation errors also include a `details` array containing `field` and `message` entries.

## Health

### `GET /api/v1/health`

Returns API availability without authentication.

## Authentication

### `POST /api/v1/auth/register`

Creates an account and session. Provide `name`, `email`, and a password of at least eight characters.

### `POST /api/v1/auth/login`

Creates a session from `email` and `password`.

### `GET /api/v1/auth/me`

Returns the authenticated user's safe profile. Requires the session cookie.

### `POST /api/v1/auth/logout`

Clears the session cookie and returns status `204`.

## Notes

Every note endpoint requires authentication and applies the current user identifier to its database query.

### `GET /api/v1/notes`

Returns the current user's notes ordered by most recent update.

### `POST /api/v1/notes`

Creates a note from a required `title` and `content`.

### `PUT /api/v1/notes/:noteId`

Updates `title` and `content` only when the note belongs to the current user.

### `DELETE /api/v1/notes/:noteId`

Deletes a note only when it belongs to the current user and returns status `204`.
