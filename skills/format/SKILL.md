---
name: format
description: Standardize how a requested data type is formatted in a specified file or across a codebase, following local conventions and the user's requested output style.
---

# Format data consistently

Update the code so the requested data type is displayed or serialized in the user's requested format. This skill is agent-neutral and applies to any language, framework, or data type.

## Parse the request

Identify:

- The data type or value to format (for example, a number, date, currency, text, identifier, address, or measurement).
- The desired format. It may be a pattern such as `MMM YYYY`, a literal example such as `Sep 2025` or `$10.00`, or a description in natural language.
- The scope: a named file, files, or `all` for the codebase.

If neither a file/scope nor `all` is specified, ask the user which file to update or whether to apply it across the codebase. If the target format cannot reasonably be inferred from the pattern, example, or description, ask one concise question before making changes.

Examples:

- `/format number "$10.00" @src/path/file.tsx`
- `/format date "MMM YYYY" @src/path/file.ts`
- `/format date "Sep 2025" @src/path/file.tsx` (treat as an example of the desired display)
- `/format date "MM DD YYYY" all`

## Apply the format

1. Read applicable project instructions and inspect the target code, nearby call sites, and existing formatting helpers or libraries. For `all`, search the codebase for formatting of the requested type and identify shared behavior and exceptions before editing.
2. Match the requested output exactly, interpreting tokens according to the project's language and formatter. If a literal example is supplied, preserve its visible shape (such as punctuation, spacing, zero padding, separators, and capitalization) while formatting the actual value dynamically.
3. Reuse or extend an existing shared formatter when appropriate. For a codebase-wide request, use one consistent shared implementation where that fits the architecture, then update relevant usages. Avoid unrelated formatting changes.
4. Keep the underlying value and its semantics intact. Format at the presentation or serialization boundary appropriate to the request; do not change stored values, API contracts, calculations, or sorting unless the user explicitly asks.
5. Handle relevant edge cases according to local conventions, such as missing or invalid values, timezone behavior for dates, locale and precision for numbers, and units for measurements. Do not silently invent locale, timezone, currency, precision, or other business rules when they materially affect the requested result; ask if repository context does not resolve them.
6. Review all affected call sites and ensure the requested scope is covered without changing unrelated output. Follow the repository's instructions for checks, and do not run tests or other checks unless the user asks.

## Report

Briefly state which formatter or usages changed and the scope covered. If the user's scope is `all`, mention any relevant exceptions left unchanged and why.
