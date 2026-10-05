# Stack API

## Public

Base: `{BASE_URL}/api/public/stack` (no auth). `GET /` accepts `offset`, `limit`, `page`, `search`; search matches `label`, `key`, and `category`. `GET /:id` gets a visible stack item. Public fields: `id`, `label`, `key`, `color`, `category`, `createdAt`, `updatedAt`. Missing detail returns `404`.

## Admin

Base: `{BASE_URL}/api/admin/stack`; requires admin auth. Routes: `GET /` (paginated, shared filters), `GET /:id`, `POST /` (`201`), `PUT /:id` (partial, `200`), `DELETE /:id` (`200`). Search matches `label`, `key`, `category`.

Create requires `{ "label": string, "key": string, "color": string, "category": string }`; update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin response also includes deletion/audit fields.
