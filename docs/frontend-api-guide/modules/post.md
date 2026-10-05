# Post API

Post type enum: `POST | PAGE`. Status enum: `DRAFT | PUBLISHED | TRASHED` (admin only).

## Public

Base: `{BASE_URL}/api/public/post` (no auth).

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Paginated published list; search title/slug/excerpt |
| GET | `/:slug` | Published post by slug |
| GET | `/page/:slug` | Published page by slug |
| GET | `/:slug/content` | Content by slug |
| GET | `/:slug/metadata` | Metadata by slug |

List accepts `offset`, `limit`, `page`, `search`, `tags: string[]`, `postType`. It returns `{ data, meta: { total, offset, limit, page } }`. Public summaries contain `slug`, `title`, nullable `excerpt`/`publishedAt`, `createdAt`, `updatedAt`, `featureImages: string[]`, `postType`, optional `tags` and `views`. Missing records return `404`. Content and metadata route response schemas are not declared; inspect actual JSON before depending on exact shapes.

## Admin

Base: `{BASE_URL}/api/admin/post`; requires admin auth.

Routes: `GET /` (paginated), `GET /:id`, `GET /:id/content`, `GET /:id/metadata`, `POST /` (`201`), `PUT /:id` (partial, `200`), `DELETE /:id` (`200`). List accepts shared query params plus `tags`, `postType`, `status`; search matches title and excerpt. Delete body: `{ "isPermanent": boolean }`.

Create fields: required `slug`, `content`, `status`, `featureImages: string[]`, `metadata: JSON | null`, `postType`, `title`; `publishedAt: date-time | null` defaults null, `featureImages` defaults `[]`, `excerpt: string | null` defaults null, `tags: string[]` optional. Updates accept a subset.

```json
{
  "slug": "hello-world", "content": "<content>", "status": "DRAFT",
  "publishedAt": null, "featureImages": [], "metadata": {},
  "postType": "POST", "excerpt": null, "title": "Hello world", "tags": []
}
```

Admin summary responses do not promise that `content` or `metadata` are included; use the dedicated routes. The auxiliary route response schemas should be checked against runtime output.
