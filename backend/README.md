# FESTRONIX backend

TypeScript/Fastify modular monolith, PostgreSQL through `pg`, Firebase identity and server-side scoped authorization. Backend foundation only; no frontend connection or production deployment.

- [Setup and verification](../docs/BACKEND_SETUP.md)
- [Architecture and known limits](../docs/BACKEND_ARCHITECTURE.md)
- [Schema](../docs/DATABASE_SCHEMA.md)
- [Permissions/security](../docs/RBAC_SECURITY_MODEL.md)
- [QR and attendance](../docs/QR_TICKETING_AND_ATTENDANCE.md)
- [OpenAPI request reference](openapi.json)

Use `npm run db:local` for the dedicated local development database, `npm test` for native PostgreSQL integration tests, and `npm run build` for compilation. Provider-backed server execution requires genuine Firebase configuration; the test verifier is not an executable-server mode.
