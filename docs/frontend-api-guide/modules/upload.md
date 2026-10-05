# Upload API

## Admin

Base: `{BASE_URL}/api/admin/upload`; requires admin auth. See the [shared guide](../README.md#shared-conventions) for credentials and common list parameters.

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Paginated upload records; search matches name or storage path |
| GET | `/:id` | Upload record by ID |
| GET | `/:id/signed-url` | Create a temporary URL to view or download the file |
| POST | `/` | Upload a file to Supabase Storage and create its record, `201` |
| PUT | `/:id` | Update upload name, alt text, and/or metadata, `200` |
| DELETE | `/:id` | Permanently delete the stored object and its upload record, `200` |

List accepts `offset` (default `0`), `limit` (default `10`), `page`, and `search`. The search checks `name` and `path`; `page` is accepted but does not set the offset.

Create accepts `multipart/form-data` with these fields:

| Field | Required | Description |
| --- | --- | --- |
| `file` | Yes | The file to upload. Maximum size is 20 MiB. |
| `alt` | No | Alternative text for the uploaded asset. |
| `metadata` | No | A JSON-encoded string stored as upload metadata. |

The backend selects the configured `SUPABASE_MEDIA_BUCKET` for image, audio, and video extensions (including `jpg`, `png`, `webp`, `mp3`, `wav`, `mp4`, `mov`, and `webm`). Files with other or no extensions go to `SUPABASE_FILES_BUCKET`. The content bucket is not used by this endpoint. The storage path is generated as `uploads/<id>/<file-name.ext>`; clients do not provide a bucket or path. The `id` is the upload record ID. Updating the record's `name` later does not rename the stored object.

Example browser request:

```js
const form = new FormData();
form.append('file', file);
form.append('alt', 'Profile photo');
form.append('metadata', JSON.stringify({ width: 512, height: 512 }));

const response = await fetch(`${BASE_URL}/api/admin/upload`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});
```

Do not set the multipart `Content-Type` header manually; the browser adds the boundary. The response includes `id`, the selected `bucket`, generated `path`, original filename as `name`, nullable `alt` and `metadata`, `createdAt`, `updatedAt`, and `publicPath`. The URL is derived from Supabase Storage; the bucket must have public access enabled for it to serve the object publicly.

If the selected bucket is not configured, the request fails with `500`. Invalid `metadata` JSON or a missing `file` returns `400`; a missing ID returns `404`.

Update accepts a JSON body with at least one of `name`, `alt`, or `metadata`. Only those fields can be changed; the stored file, bucket, and path are not modified. `alt` and `metadata` can be set to `null`.

```json
{
  "name": "profile-avatar.png",
  "alt": "Updated profile photo",
  "metadata": { "width": 512, "height": 512 }
}
```

The response is the updated upload record, including its `publicPath`. A missing ID returns `404`.

For files in a private bucket, request `GET /:id/signed-url` with admin credentials. It returns `{ "url": "<temporary-url>", "expiresIn": 3600 }`; open the URL in a browser to view the file. Pass `?download=true` to make the signed URL trigger a download instead. The signed URL expires after one hour, so request a new one when needed. A missing upload returns `404`.

Delete is permanent and has no request body. The backend removes the object from its recorded Supabase bucket, then deletes the upload record. Success returns `{ "id": "<upload-id>", "deleted": true }`; a missing upload returns `404`. If Supabase storage deletion fails, the database record is kept. A JSON `Content-Type` header on an empty delete request is ignored.

During creation, if saving the database record fails after the file reaches Supabase, the backend removes that newly uploaded object as rollback cleanup.
