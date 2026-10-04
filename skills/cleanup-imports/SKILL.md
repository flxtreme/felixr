---
name: cleanup-imports
description: Find and remove unused code imports in a repository, preserving side-effect imports and reporting each deletion by file and original line number.
---

# Clean up unused imports

Inspect the requested code scope, remove imports only when they are confirmed unused, and report every removed import with its file and original line number. This workflow is independent of any AI agent, programming language, framework, or editor.

## Workflow

1. Read applicable repository instructions and determine the requested scope. If none is specified, inspect the codebase while excluding generated output, dependencies, and other non-source directories according to repository conventions.
2. Use the repository's language-aware linter, compiler, or parser when available to identify unused import bindings. Otherwise inspect each import and its references in the relevant file, accounting for the language's syntax, type positions, JSX/template usage, macros, and framework conventions.
3. Remove only bindings proven unused. For mixed imports, remove only the unused specifiers and keep bindings that are referenced. Remove an import declaration only when no bindings remain.
4. Preserve side-effect imports and imports whose evaluation or registration is required, even when they introduce no local binding. Do not remove exports, variables, files, or other dead code as part of this task.
5. Record each import's original starting line before editing. After edits, review the diff and confirm the reported path, line, and removed binding match the change. Use original line numbers so the report remains useful after lines shift.
6. Follow repository instructions for validation. Do not run tests or unrelated checks unless the user asks.

## Report

List every removed import with its file path, original line number (or line range for a multiline declaration), and the import or binding removed. If no unused imports were found, say so. Mention any suspected imports left untouched and why they could not be safely confirmed unused.
