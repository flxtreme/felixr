# Admin roles API

Base path: `{BASE_URL}/api/admin/role`. Requires admin authentication.

| Method | Path | Purpose / response |
| --- | --- | --- |
| GET | `/` | Paginated roles; search matches ID, name, or description |
| GET | `/:id` | Role or `404` |
| POST | `/` | Create role, `201` |
| PUT | `/:id` | Partial update, `200` |
| DELETE | `/:id` | Soft/permanent delete, `200` |

List accepts shared `offset`, `limit`, `page`, `search`, `isActive`. Response envelope: `{ data, meta: { total, offset, limit, page } }`.

Create requires `{ "name": string, "description": string | null }`; update accepts either field. Delete requires `{ "isPermanent": boolean }`, default false. Role response fields: `id`, `name`, nullable `description`, `createdAt`, `updatedAt`, nullable `deletedAt`, nullable `createdBy`/`deletedBy`, `isDeleted`.
