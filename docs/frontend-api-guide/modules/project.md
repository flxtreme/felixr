# Project API

## Public

Base: `{BASE_URL}/api/public/project` (no auth).

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Paginated visible projects |
| GET | `/:slug` | Project by related page slug |

List accepts `offset`, `limit`, `page`, `search`; `search` is accepted but currently ignored by the service. Response is `{ data, meta: { total, offset, limit, page } }`. Public project fields: `id`, `title`, nullable `description`, `links: { label, href }[]`, `createdAt`, `updatedAt`, optional related `page`, optional `views`. Detail misses return `404`.

## Admin

Base: `{BASE_URL}/api/admin/project`; requires admin auth. Routes: `GET /` (paginated; search matches project title and description), `GET /:id`, `POST /` (`201`), `PUT /:id` (partial, `200`), `DELETE /:id` (`200`). List accepts shared filters.

Create body requires `title`, `pageId`, `links: { label: string, href: string }[]`; nullable `description` defaults to null and `links` defaults to `[]`. Update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin result adds soft-delete/audit fields and may include `page`.

```json
{ "title": "Portfolio", "description": null, "pageId": "<page-id>", "links": [{ "label": "Source", "href": "https://example.com" }] }
```

Public list search limitation and relationship lookup should be reflected in UI filters/links; slug is a path parameter, not a query parameter.
