# Tag API

## Public

Base: `{BASE_URL}/api/public/tag` (no auth).

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Paginated tags; search matches name or ID |
| GET | `/:slug` | Tag with paginated posts |

List accepts shared list params and returns `{ data: { name, slug, count }[], meta }`. Detail accepts public post list query params (`offset`, `limit`, `page`, `search`, `tags`, `postType`) and returns `{ name, slug, count, posts: { data, meta } }`. Missing tag returns `404` with `null`. Detail has no declared response schema.

## Admin

Base: `{BASE_URL}/api/admin/tag`; requires admin auth.

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Paginated tags; search matches name/ID/slug |
| GET | `/:id` | Tag by ID |
| GET | `/search?query=<text>` | Search tags; `query` required, min length 1 |
| POST | `/` | Create, `201` |
| PUT | `/:id` | Partial update, `200` |
| DELETE | `/:id` | Soft/permanent delete, `200` |

List accepts shared params; search is combined with the `isActive` filter. Create requires `{ "slug": string, "name": string, "excludeFromPages": boolean }`; update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin records include `id`, `slug`, `name`, `excludeFromPages`, deletion/audit fields, and optional `count`.

For tag detail, `slug` is a path parameter. The `/search` endpoint uses query parameter `query`, not `search`.
