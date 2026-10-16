# Backend setup and verification

Updated 2026-10-16. Backend root: `D:\FESTRONIX\backend`. No frontend or production service has been connected.

## Local tools

Node 22+ and npm are required; this machine used Node 26.5.1/npm 11.17.0. The lockfile pins the dependency tree. From PowerShell:

```powershell
Set-Location -LiteralPath 'D:\FESTRONIX\backend'
npm ci
```

On package managers requiring lifecycle-script approval, inspect `package.json`'s `allowScripts` entries. They cover the embedded PostgreSQL binary, esbuild, Firebase util and protobufjs. Approve only the reviewed dependencies if your npm version prompts; do not globally allow all package scripts.

## Dedicated local PostgreSQL

```powershell
npm run db:local
```

Keep that terminal running. It starts native PostgreSQL on `127.0.0.1:55432`, creates `festronix_dev` and a restricted `festronix_app` role, applies migrations and grants the runtime privileges. Data persists inside `backend/.local/dev-postgres`. Ctrl+C stops the supervisor/database. Do not start a second supervisor for an already running cluster or erase its files to resolve a port conflict. This is a development convenience with intentionally public local-only example credentials, never a production deployment.

In a second terminal, create `.env` from `.env.example` only if one does not already exist; preserve any existing configuration:

```powershell
Set-Location -LiteralPath 'D:\FESTRONIX\backend'
if (-not (Test-Path -LiteralPath '.env')) { Copy-Item -LiteralPath '.env.example' -Destination '.env' }
npm run db:migrate
```

Migrations are checksum-checked and safe to repeat unchanged. A separate migration account is used; never put that account into `DATABASE_URL`. For an externally managed PostgreSQL database, provision both accounts first, set the URLs/TLS variables and choose the existing runtime role in `RUNTIME_DATABASE_ROLE`. The helper revokes public schema CREATE; use a dedicated application database, not a shared schema with unrelated applications.

### Fictional seed (optional)

```powershell
npm run db:seed
```

This accepts only an empty localhost database named `festronix_dev` in non-production mode. It never resets existing data. The prior implementation run already populated this workspace's development database; do not seed it again. Fixtures include two owners, faculty admin, two coordinators with different event scopes, scanner/core roles, solo/team participants, free/paid pending/paid approved registrations, valid and revoked tickets and another private edition. Seeds are fictional test identities, not Firebase production accounts.

Ignored `.local/seed-fixture.json` contains development-only QR payloads/IDs. Do not distribute it or use those tokens for real admissions. API tests inject fixture identity inside the test process; the executable server will not accept `test-*` bearer strings.

## Firebase and running the executable

Set `FIREBASE_PROJECT_ID` to the intended real development/staging project. Provide Application Default Credentials using the institution's approved method. A service-account path may be supplied with `GOOGLE_APPLICATION_CREDENTIALS`; never put the JSON contents into the repository or send them in chat. The backend verifies Firebase **ID tokens**, not Google access tokens. Google Sign-In/email-link provider and client-domain setup is separate from this backend.

For deliberate local emulator work only, `FIREBASE_AUTH_EMULATOR_HOST` may point to a running Auth emulator. No emulator is installed/configured by this task, and production startup rejects that setting. There is no insecure runtime mock-auth switch.

```powershell
npm run dev
```

Default API address: `http://127.0.0.1:4300`. Check `/health`, `/ready` and `/api/v1/openapi.json`. Readiness confirms database reachability, not Firebase credential validity or proof-storage health. Protected calls require `Authorization: Bearer <Firebase ID token>`; do not put tokens into URLs or shell history. The frontend remains unconnected and no CORS policy is enabled by default.

For compiled execution:

```powershell
npm run build
npm start
```

Real provider-backed execution was not demonstrated because genuine project credentials were not provided. The test suite also starts a temporary loopback HTTP listener for health/readiness/unauthenticated-denial checks; this uses the test app's identity abstraction and is not a live Firebase claim.

## Initial institutional owners

On a separate, clean real staging database, both designated faculty custodians first authenticate through `GET /api/v1/me`. They remain participants until assigned. Then a trusted operator runs:

```powershell
npm run owners:bootstrap -- PRIMARY_FIREBASE_UID BACKUP_FIREBASE_UID
```

Use actual distinct UIDs, not the literal placeholders. This requires the migration credential and an uninitialized role store. Do not use the fictional seeded database for institutional bootstrap. Afterwards use authorized `/api/v1/ownership/handover` and scoped role-assignment endpoints. Faculty should normally use those future admin interfaces without developer intervention; the UI has not been built.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | `development` locally; `production` enables stricter startup checks |
| `HOST`, `PORT` | Listener; defaults `127.0.0.1`, `4300` |
| `DATABASE_URL` | Restricted runtime PostgreSQL account |
| `MIGRATION_DATABASE_URL` | Trusted migration/bootstrap account; unnecessary in deployed runtime environment |
| `RUNTIME_DATABASE_ROLE` | Existing role to receive grants when migrations run |
| `DATABASE_SSL` | `true` enforces verified TLS; required for production |
| `PGSSLROOTCERT` | Optional trusted CA path for database TLS |
| `AUTH_MODE` | Only `firebase` accepted by the executable |
| `FIREBASE_PROJECT_ID` | Intended Firebase project |
| `GOOGLE_APPLICATION_CREDENTIALS` | Optional private service-account file path; otherwise ADC |
| `FIREBASE_AUTH_EMULATOR_HOST` | Explicit local development only; forbidden in production |
| `PROOF_STORAGE` | Only `local` currently implemented; unsupported values fail closed |
| `PROOF_DIRECTORY` | Private evidence directory, default `.local/proofs` |
| `ALLOW_PRIVATE_LOCAL_PROOFS` | Production opt-in requires `true` and absolute `PROOF_DIRECTORY`; this flag is not a security review |

For production, use verified TLS connection settings without URL parameters that weaken certificate validation. The local proof adapter may be considered only with a reviewed private durable volume, appropriate OS ACLs and access/encryption/retention/backup procedures. Windows requires explicit ACL configuration; a POSIX file mode is not sufficient evidence. Otherwise implement/review `ProofStore` for the selected private object storage. No public static file route should expose that directory.

## Verification commands

```powershell
npm run typecheck
npm run build
npm test
npm run openapi
npm audit --omit=dev
```

`npm test` creates a fresh database on an available loopback port under the persistent `.local/test-postgres` cluster, applies all three migrations and grants a separate runtime role. It tests API routes against native PostgreSQL, including competing requests, rather than replacing the database with mocks. Run one suite per cluster at a time. Normal completion stops its server. Prior test databases remain for diagnosis; there is no automatic destructive cleanup.

The suite covers the 15 requested QR/security cases plus payment resubmission, team consent/withdrawal/captain transfer, independent approval, capacity contention, custody handover, private proofs/notices, immutable audit, CSV safety, edition isolation, runtime privileges and first-login behavior. A live loopback smoke check complements Fastify injection. No lint script is configured.

### Verification record

Final run: **58 passed, 0 failed, 0 skipped**, including the loopback HTTP smoke check. Typecheck and final build passed; OpenAPI export succeeded. Migrations were applied to development and fresh test databases, with unchanged rerun coverage. Production dependency audit reported **0 known vulnerabilities** on this run. This does not certify the complete system or future dependency state. `AI_HANDOFF.md` records the continuation status and remaining configuration.

## Before a real edition

Provide the Firebase project/identity configuration, genuine PostgreSQL endpoints and accounts, private storage decision, two institutional custodians and their verified UIDs, maintenance/recovery contacts, and faculty-approved operational/privacy policies. Test revoked identity handling against Firebase, production TLS, storage controls and a backup restore. Measure rate limits and lock behavior on expected student-network traffic.

No public deployment, payment gateway, email/SMS provider, certificate renderer or frontend integration was performed. See [RBAC_SECURITY_MODEL.md](RBAC_SECURITY_MODEL.md) and [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) for guarded workflows and deferred features before deciding the next task.
