# Tracking API

Base path: `{BASE_URL}/api/track`. `POST /` and `GET /views` are public. `GET /` requires authentication because track records include visitor details and IP addresses; send `Authorization: Bearer <JWT>` or a configured `x-api-key`.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | List track records with pagination and filters (authenticated) |
| DELETE | `/bulk` | Permanently delete selected track records (authenticated) |
| POST | `/` | Submit analytics event chunks |
| GET | `/views?path=<path>` | Get distinct views for the final path segment |

## Bulk delete track records

`DELETE /bulk` requires authentication and a JSON body containing at least one track ID:

```json
{ "ids": ["<track-uuid-1>", "<track-uuid-2>"] }
```

This permanently deletes matching records; there is no soft-delete option or recovery flag. IDs that do not exist are ignored. Success returns `200` with `{ "deletedCount": number }`, the count of records removed.

## List track records

`GET /` accepts these optional query parameters:

| Parameter | Type | Behavior |
| --- | --- | --- |
| `offset` | number | Defaults to `0`; records to skip. |
| `limit` | number | Defaults to `10`; range `1` to `100`. |
| `search` | string | Case-insensitive partial match on `visitorId` or `currentUrl`, substring match on `ip`, or exact path segment match. |
| `action` | string | Exact event action: `view`, `insert`, `soft_delete`, `delete`, or `update`. |
| `visitorId` | string | Exact visitor ID. |
| `path` | string | Exact path segment present in the stored path array. |
| `currentUrl` | string | Case-insensitive substring of the URL. |
| `ip` | string | Exact IP address. |
| `timestampFrom` | date-time | Inclusive lower bound on event timestamp (ISO 8601). |
| `timestampTo` | date-time | Inclusive upper bound on event timestamp (ISO 8601). |

Filters combine with AND; the fields within `search` combine with OR. Results sort by event `timestamp` descending, then `createdAt` descending.

Response:

```json
{
  "data": [
    {
      "id": "<uuid>",
      "visitorId": "<visitor-id>",
      "action": "view",
      "path": ["projects", "sample-project"],
      "currentUrl": "https://example.com/projects/sample-project",
      "parameters": {},
      "from": {},
      "visitor": {},
      "location": {},
      "changes": null,
      "ip": "<ip-address-or-null>",
      "timestamp": "<ISO-8601 event timestamp>",
      "createdAt": "<ISO-8601 created timestamp>",
      "updatedAt": "<ISO-8601 updated timestamp>"
    }
  ],
  "meta": { "total": 1, "offset": 0, "limit": 10, "page": 1 }
}
```

`parameters`, `from`, `visitor`, `location`, and `changes` contain stored JSON values and may be `null`. The list exposes IP and visitor data, so use it only from a trusted authenticated admin interface.

## Submit analytics

Body: `{ "payload": string[] }`. Each entry must be base64-encoded UTF-8 text. The decoded chunks are sorted by integer prefix and joined after removing each prefix and `~~~`; the result is parsed as JSON. The expected parsed object includes `visitorId`, `path`, `currentUrl`, `parameters`, `from`, `visitor`, `location`, and `timestamp`. Optional `action` accepts `view`, `insert`, `soft_delete`, `delete`, or `update`; it defaults to `view` when omitted. Optional `changes` must have `data` and `update` objects for the previous and new values:

```json
{
  "visitorId": "<visitor-id>",
  "action": "update",
  "path": ["admin", "items", "<item-id>"],
  "currentUrl": "https://example.com/admin/items/<item-id>",
  "timestamp": "<ISO-8601 timestamp>",
  "changes": {
    "data": { "status": "draft", "title": "Old title" },
    "update": { "status": "published", "title": "New title" }
  }
}
```

For view or other events without a before/after snapshot, omit `changes` or send `null`. The JSON example above is the decoded event object; encode/chunk it according to the existing payload format before sending it in `payload`.

Response is always shaped `{ "success": boolean }` with status `200`; malformed chunks or database write failure return `false`.

```json
{ "payload": ["<base64 chunk with index~~~JSON fragment>"] }
```

## Get views

Required query parameter `path` is a string. The service counts distinct visitors for the last non-empty slash-delimited path segment. A root/empty path returns `{ "views": 0 }`; otherwise `{ "views": number }`.
