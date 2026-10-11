# Backend Rules

- Inspect existing endpoints before creating or modifying routes.
- Follow the established route-controller-service-repository structure, if present.
- Reuse existing middleware, validators, response helpers, and error classes.
- Match existing request and response schemas.
- Follow existing naming, HTTP method, and status code conventions.
- Reuse existing database models, query utilities, and transaction patterns.
- Use parameterized queries and validate untrusted input.
- Update tests and API documentation following existing conventions.
- Do not invent new architectural layers if the project does not use them.