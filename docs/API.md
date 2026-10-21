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

Returns every note the current user owns, ordered by most recent update. Each note includes `isStarred`, `archivedAt`, `trashedAt`, and `images` (`[{ id, url }]`). The client derives the Notes, Starred, Archive, and Trash views from these fields.

### `POST /api/v1/notes`

Creates a note from a required `title` and `content`.

### `PUT /api/v1/notes/:noteId`

Updates `title` and `content` only when the note belongs to the current user.

### `PATCH /api/v1/notes/:noteId`

Stars, archives, trashes, or restores a note. Send at least one of `isStarred`, `archived`, or `trashed` (booleans). Archiving and trashing store a timestamp; `false` restores the note. State changes keep the note's `updatedAt`. Returns `404` for notes owned by other accounts and `400` for an empty body.

```json
{ "isStarred": true }
{ "trashed": false }
```

### `DELETE /api/v1/notes/:noteId`

Permanently deletes a note and its images only when it belongs to the current user and returns status `204`. The interface only offers this from Trash.

### `DELETE /api/v1/notes/trash`

Permanently deletes every trashed note the current user owns and returns `{ "deleted": <count> }`.

## Note images

Images are private: they are stored on disk under `UPLOAD_DIR` with random file names and are only served to the note's owner.

### `POST /api/v1/notes/:noteId/images`

Uploads one image as `multipart/form-data` in the `image` field. PNG, JPEG, GIF, and WebP up to 5 MB are accepted, up to 8 images per note. The file signature is checked, so a renamed non-image is rejected with `400`. Returns `201` with `{ "image": { "id", "url" } }`.

### `GET /api/v1/notes/:noteId/images/:imageId`

Streams the image to its owner. Other accounts receive `404`; guests receive `401`.

### `DELETE /api/v1/notes/:noteId/images/:imageId`

Removes the image record and file and returns `204`.
