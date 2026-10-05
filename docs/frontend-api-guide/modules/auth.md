# Auth API

Base path: `{BASE_URL}/api/auth`. Both routes are public. Login returns a JWT expiring in three hours; send it as `Authorization: Bearer <token>` to admin routes.

| Method | Path | Success |
| --- | --- | --- |
| POST | `/login` | `200` login response |
| POST | `/register` | Handler returns `201` with login response (route schema documents `200`) |

## Login

Request: `{ "username": string, "password": string }`.

Invalid credentials return `401 { "message": "Invalid username or password" }`.

## Register

Request fields: `email`, `username`, `password` required; `name`, `phone`, `avatar`, `roles` optional. Registration ignores supplied roles and assigns none.

## Success response

```json
{
  "data": {
    "user": {
      "id": "<id>", "username": "<username>", "email": "<email>",
      "name": null, "phone": null, "avatar": null, "picture": null,
      "roles": [], "permissions": []
    },
    "token": "<jwt>", "expiry": "3h"
  }
}
```

Use the token for admin API calls. Clear the session and prompt for login on `403` token expiry or `401` invalid access. Registration schema reuses the admin user create schema; no separate public profile shape is declared.
