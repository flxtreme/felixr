---
name: integrate-endpoint
description: Integrate an API endpoint from a user-provided guide, using the current repository's established patterns. Applies across languages, frameworks, and AI agent environments.
---

# Integrate endpoint

Integrate the requested API behavior into the appropriate part of the current codebase. Treat the user's guide as the API contract and the repository as the source of implementation conventions. After the integration works, clean up obsolete mock data for that same module. Keep the instructions and workflow independent of any particular AI agent, framework, or HTTP library.

## Confirm the API guide

Before implementation, verify the guide includes:

- The base path and endpoint path(s), including path parameters.
- The HTTP method for each endpoint.
- The request format: path and query parameters, body fields, and an example or schema. If an endpoint has no body, that should be clear.
- The response format: JSON shape or schema, including pagination envelopes and relevant error/status behavior.

If no guide was provided, ask the user for it. If required details are missing or ambiguous, ask one concise follow-up listing only the missing details. Do not invent endpoint methods, fields, or response shapes. Repository inspection that does not depend on those details can continue while waiting; do not implement against an incomplete contract.

## Integration workflow

1. Read the repository's applicable agent and project instructions. Identify the language, framework, architecture, and conventions already in use. Inspect the requested screen or feature and nearby integrations for the same domain or a comparable endpoint.
2. Follow the established patterns for request clients, endpoint services, types, state/data hooks, caching, mutations, and reusable UI. Reuse existing authentication and error handling. Do not introduce a new library or architecture when the project already has a suitable convention.
3. Match endpoint paths, methods, query parameters, request bodies, response types, and link/action behavior to the guide. Encode dynamic path segments and serialize query values using the project's established approach.
4. Implement only the user-facing flows in scope. For fetched lists or details, handle loading, empty, and request-error states in the style used by the project. For mutations, follow its existing cache refresh or invalidation conventions.
5. After wiring the requested module to the real endpoint, audit its mock data: hard-coded sample records, placeholder arrays, local fake responses, and fallback values. Remove only data proven to be superseded by the integration and no longer used by the module. Preserve tests, fixtures, seeds, stories, demos, documentation examples, and intentional offline/error fallbacks. Do not clean mock data in unrelated modules. If an item's purpose or safety is uncertain, leave it in place and report its file, symbol, and reason; ask before removing that uncertain item.
6. Review the changes for contract mismatches, incorrect paths, missing call-site updates, stale references to removed mock values, and regressions. Follow repository instructions for documentation and checks; do not run checks that the project or user disallows.

When framework behavior is version-sensitive, consult the repository's required or currently installed framework documentation before changing code. Explain any minimal adaptation needed if the API contract conflicts with a repository convention.

## Communication

Keep questions focused on missing contract details. Once the integration is complete, briefly state what was connected and which checks were performed.
