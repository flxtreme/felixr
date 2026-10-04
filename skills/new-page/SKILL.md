---
name: new-page
description: Create a page in an existing codebase after inspecting its routing, page architecture, folder structure, naming, and UI conventions.
---

# New page

Create the requested page by following the current repository's established architecture. Keep this workflow independent of any particular AI agent, language, or framework.

## Inspect before implementing

1. Read applicable repository and agent instructions, including folder and naming guides.
2. Trace how an existing page with a similar purpose is built: route registration, page/view split, layouts, data loading, reusable components, styles, and any navigation links.
3. Identify the correct route and file locations from the repository's actual structure. Check for conflicting or equivalent routes before adding one.
4. Consult installed or project-required framework documentation when local instructions call for it or when the relevant routing or rendering behavior is version-sensitive.

## Build the page

1. Use the request and relevant existing content to determine the page's purpose and expected behavior. If route, core content, or behavior is too ambiguous to implement correctly, ask one concise clarification; otherwise proceed with reasonable assumptions.
2. Follow existing file naming, folder placement, route conventions, and page/view composition. Reuse existing layouts, components, utilities, data services, and styles where appropriate. Keep a component reusable when the codebase already has that pattern or the behavior has clear reuse value.
3. Match the site's visual language and responsive behavior. For data-driven pages, use the existing data-access pattern and provide loading, empty, and error states consistent with nearby pages.
4. Add navigation or route metadata only when requested or needed by the established route pattern. Avoid unrelated refactors and dependencies.
5. Review the final route, imports, links, responsive layout, and relevant call sites. Follow repository rules for checks; do not run checks the user or project disallows.

## Communication

Briefly report the route and the page structure added, plus any assumptions or checks that matter.
