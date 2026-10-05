# Admin users API

Base path: `{BASE_URL}/api/admin/user`. Requires a bearer JWT or configured API key.

| Method | Path | Result |
| --- | --- | --- |
| GET | `/` | Paginated users; `search` filters email/username/name |
| GET | `/:id` | User or `404` |
| POST | `/` | Create user, `201` |
| PUT | `/:id` | Partial update, `200` |
| DELETE | `/:id` | Soft/permanent delete, `200` |

List accepts shared `offset`, `limit`, `page`, `search`, `isActive` params. List envelope is `{ data, meta: { total, offset, limit, page } }`.

Create required: `email`, `username`, `password`. Optional: `name`, `phone`, `avatar`, `roles: string[]`. Update accepts any subset. Delete body is `{ "isPermanent": false }` (`true` permanently removes). User responses include id, email, username, nullable name/phone/avatar/picture, email/phone verification flags and timestamps, active/deleted flags and audit timestamps/IDs, `roles: string[]`, and `permissions: string[]`. Password is not returned.

Example create:

```json
{ "email": "person@example.com", "username": "person", "password": "<password>", "name": "Person", "roles": [] }
```

Do not expose API keys in browser code. Public account registration uses `/auth/register` instead.
