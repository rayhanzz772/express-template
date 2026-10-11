# Project Development Rules

## Core Principles
- Always inspect existing code before implementing changes.
- Follow the existing architecture, directory structure, naming conventions, and coding patterns.
- Prefer minimal, targeted changes over unnecessary refactoring.
- Reuse existing implementations instead of creating duplicates.
- Do not introduce new dependencies, abstractions, or architectural patterns without a clear reason.
- Keep responses concise. Prioritize actionable information.

## Mandatory Codebase Inspection
Before implementing any feature:
1. Inspect the relevant directories and files.
2. Find the closest existing implementation with similar behavior.
3. Identify reusable components, utilities, hooks, services, middleware, and helpers.
4. Trace how data flows through the existing implementation.
5. Follow the established pattern unless there is a concrete reason not to.

Do not guess project conventions. Verify them in the codebase.

## Component Reuse
- Search existing UI components before creating new ones.
- Reuse existing buttons, forms, tables, dialogs, dropdowns, layouts, hooks, and utilities.
- Follow existing component props, variants, styling, and composition patterns.
- Do not duplicate functionality already provided by the project.
- Create a new shared component only when existing components cannot reasonably support the requirement.

## API and Endpoint Consistency
- Inspect existing routes, controllers, services, repositories, validators, and middleware before adding endpoints.
- Find a similar endpoint and use it as the reference implementation.
- Follow existing URL conventions, HTTP methods, API versioning, request validation, response formats, and status codes.
- Reuse authentication, authorization, error handling, pagination, and response helpers.
- Follow the existing database access and transaction patterns.
- Use parameterized SQL queries when applicable.
- Update API documentation and tests using existing conventions.
- Never create an alternative endpoint architecture when an established one exists.

## Frontend and API Integration
- Reuse the existing API client, service functions, hooks, and data-fetching utilities.
- Follow existing authentication, caching, query key, loading, error, and invalidation patterns.
- Keep API logic in the established layer rather than introducing a new one.
- Follow the project's design system and responsive UI conventions.

## Change Management
- Modify only files necessary for the requested task.
- Preserve existing behavior unless the task explicitly requires a change.
- Do not silently change public APIs or shared component contracts.
- Avoid unrelated refactoring and unnecessary abstractions.
- If existing patterns conflict, prefer the dominant pattern and explain significant deviations.

## Verification
After implementation:
- Review the changes for consistency with existing code.
- Check imports, types, validation, security, error handling, and affected consumers.
- Run relevant tests, linting, or type checks when available.
- Report the files changed, checks performed, and any remaining issues.