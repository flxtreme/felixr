# Admin permissions API

Base path: `{BASE_URL}/api/admin/permission`. Requires admin authentication.

| Method | Path | Purpose / response |
| --- | --- | --- |
| GET | `/` | Paginated permissions; search matches ID, name, or description |
| GET | `/:id` | Permission or `404` |
| POST | `/` | Create permission, `201` |
| PUT | `/:id` | Partial update, `200` |
| DELETE | `/:id` | Soft/permanent delete, `200` |

List accepts `offset`, `limit`, `page`, `search`; `isActive` is not accepted. Response envelope: `{ data, meta: { total, offset, limit, page } }`.

Create requires `{ "name": string, "description": string | null }`; update accepts either field. Delete requires `{ "isPermanent": boolean }`, default false. Response fields: `id`, `name`, nullable `description`, `createdAt`, `updatedAt`, nullable `deletedAt`, nullable `createdBy`/`deletedBy`, `isDeleted`.
