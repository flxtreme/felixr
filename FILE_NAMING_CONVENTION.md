# File Naming Convention

To maintain consistency and readability across the codebase, this project strictly adheres to the following file naming conventions.

## 1. Components (PascalCase)

Any file that exports a React Component (e.g., UI elements, Layouts, Views, Pages) must use **PascalCase** and end with the `.tsx` extension. 

**Examples:**
- `src/components/Button.tsx`
- `src/views/admin/posts/PostsListView.tsx`
- `src/features/tags/TagsLayout.tsx`
- `src/layouts/DashboardLayout.tsx`

## 2. Other Files (camelCase)

All non-component files, such as services, types, hooks, utilities, and configuration files, must use **camelCase** and typically end with the `.ts` extension. 

**Examples:**
- **Services:** `src/features/auth/services.ts`
- **Types:** `src/features/posts/types.ts`
- **Hooks:** `src/features/tags/hooks/useTags.ts`
- **Utils:** `src/utils/fetcher.ts`

## Summary Table

| File Type | Case Style | Example |
| :--- | :--- | :--- |
| React Components | PascalCase | `CustomPageView.tsx`, `AdminLayout.tsx` |
| Hooks | camelCase (prefixed with `use`) | `usePostActions.ts`, `useAuthActions.ts` |
| Services | camelCase | `services.ts`, `tagService.ts` |
| Types / Interfaces | camelCase | `types.ts`, `authTypes.ts` |
| Utilities / Helpers | camelCase | `cln.ts`, `session.ts` |

By adhering to these conventions, the project remains highly organized and predictable as new features and domains are added.
