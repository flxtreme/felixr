# Product API

## Public

Base: `{BASE_URL}/api/public/product` (no auth). `GET /` accepts `offset`, `limit`, `page`, `search`; search matches title, description, category. `GET /:id` gets one visible product. Both return product fields `id`, `title`, `description`, `price`, `category`, `image`, `link`, `actionType` (`redirect | download`), `actionLabel`, `createdAt`, `updatedAt`. Missing detail returns `404`.

## Admin

Base: `{BASE_URL}/api/admin/product`; requires admin auth. Routes: `GET /` (paginated, shared filters), `GET /:id`, `POST /` (`201`), `PUT /:id` (partial, `200`), `DELETE /:id` (`200`). Search matches title, description, category.

Create body requires `title`, `description`, `price` (number >= 0), `category`, `image`, `link`, `actionType` (`redirect | download`), `actionLabel`. Update accepts a subset. Delete body: `{ "isPermanent": boolean }`. Admin records also include soft-delete and audit fields.

```json
{ "title": "SaaS Landing Page", "description": "Conversion-focused template.", "price": 19, "category": "Landing Page Template", "image": "https://example.com/image.png", "link": "https://example.com/buy", "actionType": "redirect", "actionLabel": "Buy" }
```
