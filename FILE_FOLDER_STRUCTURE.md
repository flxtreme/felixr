# File & Folder Structure

This project has been restructured following a Vertical Slicing architecture to improve modularity and maintainability. In this approach, code is grouped by feature rather than by technical concern.

## Directory Layout

```text
src/
├── app/                  # Next.js App Router (Routing only)
│   ├── (public)/         # Public routes (Home, Blog, Projects, About)
│   ├── admin/            # Admin routes
│   ├── login/            # Login route
│   └── api/              # API routes (e.g. Proxy)
│
├── views/                # Page-level UI components grouped by domain
│   ├── home/             # Home view components
│   ├── blog/             # Blog listing and single post views
│   ├── projects/         # Projects views
│   ├── auth/             # Login view components
│   └── admin/            # Admin pages and dashboards views
│
├── features/             # Feature modules containing domain-specific logic and UI
│   ├── auth/             # Authentication (hooks, services.ts, types.ts)
│   ├── posts/            # Posts domain (hooks, services.ts, types.ts, PostsLayout.tsx)
│   ├── tags/             # Tags domain (hooks, services.ts, types.ts, TagsLayout.tsx)
│   └── admin/            # Admin-specific contexts and components (AdminLayout.tsx)
│
├── components/           # Shared, generic UI components (Buttons, Breadcrumbs, PostRender)
│
├── layouts/              # Shared layouts (Header, Footer, Dashboard Layout)
│
├── contexts/             # Global Contexts (Theme)
│
├── types/                # Global common types
│
└── utils/                # Global utility functions (cln, fetcher, session)
```

## Vertical Slicing Concept

- **Routing vs Views:** The `app` directory only handles routing definitions and fetching server-side params. Actual page rendering is delegated to components in `views/`.
- **Features over Technical Layers:** Instead of having giant global `hooks/`, `services/`, and `types/` folders, logic is grouped by feature inside `features/` (e.g., `features/auth/hooks`, `features/posts/services.ts`).
- **Shared UI:** Components used across multiple features remain in `components/` and `layouts/`.

## Naming Convention

- **Components**: ComponentName (PascalCase)
- **Other Files**: camelCase

This slicing ensures that as the blogging app grows, each feature domain remains self-contained and easier to scale.
