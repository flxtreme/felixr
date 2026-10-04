---
name: mock-cleanup
description: Audit mock data across a codebase, verify whether each item is superseded by a real integration, and remove only items the user explicitly approves.
---

# Mock cleanup

Audit mock data throughout the requested codebase. Use the repository's conventions and inspect actual integration paths before deciding whether each mock can be removed. This workflow is agent- and framework-neutral.

## Audit first; do not delete yet

1. Read applicable repository instructions and inspect the project structure.
2. Search for mock data and mock providers, including hard-coded sample arrays, placeholder constants, fixtures, seeds, local fake responses, fallback data, and test/demo/storybook data. Report the source file and specific variable, export, fixture, or item name for each finding.
3. Trace references and inspect the corresponding real data integration: request/service calls, hooks or state layer, component usage, and relevant route or screen. Use the actual code paths as evidence; a similarly named endpoint alone does not prove that a mock is unused.
4. Classify each finding:
   - **Deletable (✅):** it is clearly obsolete or unused, and the relevant feature is already wired to real data. Confirm it has no meaningful runtime, test, demo, documentation, or fallback use.
   - **Keep (❌):** it is used by tests, fixtures, seeds, stories, demos, docs, offline or error fallback behavior, or a feature that is not yet integrated with real data.
   - If references or purpose are uncertain, mark **Keep (❌)** until there is enough evidence. Never remove an ambiguous item.

Do not edit or delete mock data during this audit phase. Present all ✅ candidates with their file, symbol/item, and brief integration/reference evidence, then ask whether the user wants those specific candidates deleted. Make the confirmation scope explicit (for example, “delete all listed candidates” or named items).

## If the user declines or does not confirm

Make no deletion. Reply with a Markdown table covering every discovered mock-data item:

| File | Variable or item | Status | Reason |
| --- | --- | --- | --- |
| `src/example.ts` | `sampleItems` | ✅ Deletable | Live API integration is used; no remaining references. |
| `src/example.test.ts` | `mockResponse` | ❌ Keep | Required by the test suite. |

Use ✅ only for items verified deletable and ❌ for items to keep or whose safety is uncertain. Do not report only the candidates; include all findings.

## After explicit confirmation

1. Delete only the confirmed ✅ item(s). If the user confirms all listed candidates, that authorizes all and only those candidates.
2. Update imports or references made obsolete by the approved deletions. Do not broaden cleanup to unrelated mocks or files.
3. Review the changed files and search again for references to the removed names. Follow repository instructions for checks; do not run checks that the user or project disallows.
4. Briefly report what was removed and any verified items kept. If a candidate's status changes during implementation, stop and ask before deleting it.

## Scope and reporting

Scan the whole repository unless the user specifies a narrower scope. Exclude generated dependencies/build output from mock findings unless the user explicitly includes them. Cite evidence by file and symbol or call site. Keep the audit readable; group multiple same-purpose values only when each item's file and name remain clear.
