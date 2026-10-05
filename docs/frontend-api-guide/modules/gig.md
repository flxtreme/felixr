# Gig / services API

## Public

Base: `{BASE_URL}/api/public/gig` (no auth). `GET /` accepts `offset`, `limit`, `page`, `search`; search matches title and description. `GET /:id` gets one visible gig. Fields: `id`, `title`, `description`, `details: string[]`, `link`, `linkLabel`, `external`, `createdAt`, `updatedAt`. Missing detail returns `404`.

## Admin

Base: `{BASE_URL}/api/admin/gig`; requires admin auth. Routes: `GET /` (paginated, shared filters), `GET /:id`, `POST /` (`201`), `PUT /:id` (partial, `200`), `DELETE /:id` (`200`). Search matches title and description.

Create requires `title`, `description`, `link`, `linkLabel`; `details` defaults to `[]`, `external` defaults to `false`. Update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin records include deletion and audit fields.

```json
{ "title": "Design to live website", "description": "Turn designs into responsive websites.", "details": ["React", "WordPress"], "link": "https://example.com/contact", "linkLabel": "Request a website", "external": true }
```
