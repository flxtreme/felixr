# Training API

## Public

Base: `{BASE_URL}/api/public/training` (no auth). `GET /` accepts `offset`, `limit`, `page`, `search`; search matches title, provider, description. `GET /:id` fetches a visible training entry. Fields: `id`, `title`, `provider`, `completedAt`, `description`, `createdAt`, `updatedAt`. Missing detail returns `404`.

## Admin

Base: `{BASE_URL}/api/admin/training`; requires admin auth. Routes: `GET /` (paginated, shared filters), `GET /:id`, `POST /` (`201`), `PUT /:id` (partial, `200`), `DELETE /:id` (`200`). Search matches title, provider, description.

Create requires `title`, `provider`, `completedAt`, `description`; update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin records add `isDeleted` and nullable deletion/audit fields.
