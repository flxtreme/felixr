# Certification API

## Public

Base: `{BASE_URL}/api/public/certification` (no auth). `GET /` accepts `offset`, `limit`, `page`, `search`; search matches title, issuer, description. `GET /:id` fetches a visible certification. Fields: `id`, `title`, `issuer`, `issuedAt`, `description`, optional `credentialId`, optional `credentialUrl`, `createdAt`, `updatedAt`. Missing detail returns `404`.

## Admin

Base: `{BASE_URL}/api/admin/certification`; requires admin auth. Routes: `GET /` (paginated, shared filters), `GET /:id`, `POST /` (`201`), `PUT /:id` (partial, `200`), `DELETE /:id` (`200`). Search matches title, issuer, description.

Create requires `title`, `issuer`, `issuedAt`, `description`; `credentialId` and `credentialUrl` are optional. Update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin record adds `isDeleted`, nullable delete/audit fields.
