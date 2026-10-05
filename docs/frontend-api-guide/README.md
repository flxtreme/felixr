# Frontend API guides

Each route module has its own frontend integration guide. The route implementation is the source of truth; note contract gaps in each guide before relying on undocumented response details.

## Shared conventions

- Default base URL is `{BASE_URL}/api`; `API_PREFIX` can override `/api`.
- Public routes, `/auth/*`, `POST /track`, and `GET /track/views` need no credentials. `GET /track` and `DELETE /track/bulk` require authentication, as do `/admin/*` routes; send `Authorization: Bearer <JWT>` or configured `x-api-key`. Login JWT expiry is three hours. Expired token: `403`; missing/invalid credentials: `401`.
- Common list parameters are `offset` (default `0`), `limit` (default `10`), `page`, `search`, and often `isActive`. List services paginate with `offset`/`limit`; `page` is accepted but is not converted to an offset.
- Paginated response: `{ "data": [], "meta": { "total": 0, "offset": 0, "limit": 10, "page": 1 } }`.
- Admin delete requests require `{ "isPermanent": boolean }`; `false` soft-deletes and `true` permanently deletes. Admin list `isActive=true` filters to non-deleted and `false` to deleted records (module-specific exceptions are called out).
- Send query values in the URL and JSON bodies with `Content-Type: application/json`. On admin mutations, refresh affected list/detail data. Public list/detail APIs hide deleted records.

## Module guides

| Module | Guide |
| --- | --- |
| Auth | [auth.md](modules/auth.md) |
| Tracking | [track.md](modules/track.md) |
| Users | [user.md](modules/user.md) |
| Roles | [role.md](modules/role.md) |
| Permissions | [permission.md](modules/permission.md) |
| Posts | [post.md](modules/post.md) |
| Tags | [tag.md](modules/tag.md) |
| Projects | [project.md](modules/project.md) |
| Experience | [experience.md](modules/experience.md) |
| Products | [product.md](modules/product.md) |
| Gigs / services | [gig.md](modules/gig.md) |
| Stack | [stack.md](modules/stack.md) |
| Certifications | [certification.md](modules/certification.md) |
| Training | [training.md](modules/training.md) |
| Uploads | [upload.md](modules/upload.md) |
