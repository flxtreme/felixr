# Experience API

## Public

Base: `{BASE_URL}/api/public/experience` (no auth).

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Paginated list; search matches role and company; sorts by start month/year descending, then creation descending |
| GET | `/:id` | Experience record; `404 { "message": "Experience not found" }` |

List params: `offset`, `limit`, `page`, `search`. Public item fields: `id`, `role`, `company`, `start`, `end`, `responsibilities: string[]`, `createdAt`, `updatedAt`.

## Admin

Base: `{BASE_URL}/api/admin/experience`; requires admin auth.

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/` | Paginated admin list; same search and date sort; shared `isActive` filter |
| GET | `/:id` | Record or `404` |
| POST | `/` | Create, `201` |
| PUT | `/:id` | Partial update, `200` |
| DELETE | `/:id` | Soft/permanent delete, `200` |

Create requires `role`, `company`, `start`, `end`, `responsibilities: string[]` (defaults to `[]`). Update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin response also includes `isDeleted`, nullable delete/audit timestamps and IDs.

```json
{ "role": "Software Engineer", "company": "Example Co.", "start": "Nov 2022", "end": "Present", "responsibilities": ["Built internal applications."] }
```
