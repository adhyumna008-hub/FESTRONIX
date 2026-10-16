# FESTRONIX backend foundation

Status: implemented foundation, not approved for live deployment. Updated 2026-10-16.

The owner explicitly authorized backend implementation in the attached request and subsequent continuation messages. This supersedes earlier planning-only restrictions for this backend scope. U1–U11 remain the product baseline. Pulse, Panel and Flux still share one platform; this task does not connect or redesign the visual prototype.

## Choices and boundaries

| Concern | Implemented choice | Reason |
| --- | --- | --- |
| API | TypeScript, Fastify 5 | Small modular monolith with request validation, hooks and HTTP integration testing |
| PostgreSQL access | `pg` (node-postgres), parameterized SQL, explicit transactions | Makes row locks, composite keys, partial indexes and deferred constraints visible; no ORM introduced |
| Identity | Firebase Admin ID-token verifier | Provider authenticates; FESTRONIX assignments separately authorize every protected operation |
| Validation | Zod 4, strict bodies, generated JSON Schema | Reject unknown properties and invalid scopes; shared validation produces OpenAPI request schemas |
| QR | Node crypto and `qrcode` | Random opaque bearer, SHA-256 storage, actual SVG generation |
| Proof storage | `ProofStore` interface and private local adapter | Binary evidence stays outside PostgreSQL; an object-storage adapter can replace it |
| Development database | `embedded-postgres`, native PostgreSQL 18 | Reproducible local tests without Docker; development only, not hosting infrastructure |

Exact dependency versions are locked in `backend/package-lock.json`. Node 22+ is required; this workstation used Node 26.5.1. No production framework or infrastructure is added outside `backend/`.

## Module map

| File under `backend/src/` | Responsibility |
| --- | --- |
| `server.ts` | Environment validation, restricted runtime-role check, Firebase wiring, listener and shutdown |
| `app.ts` | Versioned routes, validation, safe error responses, reports, announcements, staff administration |
| `auth.ts` | Verified identity to internal user mapping; no email-based privilege linking |
| `permissions.ts` | Central role vocabulary, scope/expiry/revocation enforcement |
| `db.ts` | Pool, transaction boundaries, audit insertion and startup permission guard |
| `schemas.ts` | API inputs and event policy validation |
| `events.ts` | Revisions, independent approval, publication and edition transitions |
| `registrations.ts` | Eligibility, capacity, payment holds, waitlists, cancellation and clash checks |
| `teams.ts` | Invitations, member consent, captain transfer, withdrawal and reconciliation |
| `payments.ts`, `storage.ts` | Private proof upload/read, decision history and manual payment review |
| `tickets.ts` | Issuance, revocation, scoped online verification and individual attendance |

## Request and transaction model

Protected requests authenticate a Firebase bearer before resolving an internal user. Authentication rejects unverified email identities and checks Firebase revocation. A new UID creates an unprivileged participant, even if its email matches a privileged account. Local user disablement also denies access.

Authorization runs inside the operation transaction using current assignments. An event-scoped role never expands to another event or edition. Protected writes and their audit entries commit together. A shared transaction advisory lock coordinates with exclusive role/edition changes, so revocation and already-authorized operations have a defined ordering. A revocation cannot retroactively undo an operation that committed before it.

Capacity and attendance operations lock the event row. Member eligibility/clash checks lock user rows in a consistent order. Partial unique indexes provide an additional duplicate barrier. This favors correctness over maximum throughput; same-event operations serialize. Lock/statement timeouts return `503 RETRY_REQUEST`. This is not a measured throughput guarantee.

## Implemented workflows

- Editions: PREPARATION → READY → ACTIVE → CLOSED → ARCHIVED. Only one ACTIVE/admitting edition. Closing revokes student staff; archiving requires event closeout and revokes remaining edition assignments. Historical rows remain. READY is an attributable faculty readiness assertion, not an automated completeness audit.
- Events: create → revision draft → submission → independent review → faculty publication → LIVE → ENDED → COMPLETED → ARCHIVED, with changes-requested/rejected/cancelled alternatives. Published terms remain unchanged while a replacement is reviewed. Sessions belong to a revision and must fit its time window.
- Registrations: eligibility and duplicate checks, free confirmation, paid pending state, optional waitlist offer/acceptance. Capacity means individuals for SOLO and teams for TEAM. Unexpired payment holds and waitlist offers reserve a slot; confirmed/ACTION_REQUIRED entries also count.
- Payments: original applicant uploads a PNG/JPEG proof and reference, assigned staff review, approval atomically confirms, rejection permits resubmission. Late approval rechecks capacity. Approved references cannot be reused within an edition. Faculty may override a rejected decision under guarded conditions; this is not a refund or approved-payment reversal system.
- Teams: consent-based invitations to exact internal user IDs; captain registers accepted members. Captain transfer requires recipient acceptance and does not transfer access to the payer's evidence. Withdrawal preserves history and suspends a confirmed team's admission until faculty reconciles its remaining eligible members.
- Tickets/attendance: per-member QR issuance/reissue; scoped online scan, duplicate feedback, manual lookup/check-in and audited corrections. No captain-wide automatic attendance.
- Notices/reporting: edition/event/team/participant announcement audiences, faculty publication, private recipient access; counts, team/member attendance, certificate basis and audited faculty CSV export (10,000-member cap). No delivery provider.

## API contract

Routes use `/api/v1`. `GET /health` is liveness; `GET /ready` checks database reachability only. `GET /api/v1/openapi.json` and generated `backend/openapi.json` document routes and request bodies. Query pagination defaults to 50 and is capped at 100 where present. OpenAPI does not yet supply fully typed success-response schemas or a generated client.

Errors use `{ error: { code, message, fields? }, request_id }`; database details are not returned. Scanner outcomes are documented in [QR_TICKETING_AND_ATTENDANCE.md](QR_TICKETING_AND_ATTENDANCE.md). QR payloads must be sent in POST bodies, never URLs. All responses use `Cache-Control: no-store`. Request logging omits bodies and bearer headers; internal failures log a request identifier without SQL or secrets.

## Explicit foundation limits

These are incomplete workflows, not changes to the approved product:

1. Publishing revised terms once any registration exists fails with `PARTICIPANT_IMPACT_REVIEW_REQUIRED`. Participant notice, reconfirmation and financial-impact handling must precede enabling that operation. Even cosmetic revision replacement currently follows this conservative block.
2. Adding/replacing members after team registration is blocked. Remaining-member reconciliation and captain transfer exist; full substitution, late captain transfer and team re-registration after cancellation are deferred.
3. Walk-in and late-substitution settings are stored for approval, but no staff walk-in admission or substitution endpoint is enabled. New admission stops at the deadline and during LIVE.
4. Payment proof resubmission requires an open admission window. After the deadline, staff must reconcile a case; there is no automated extension/refund workflow. Ten proof uploads per registration is a protective foundation limit.
5. Results, appeals, certificate release/rendering, outbound email/SMS, institutional CMS, selective edition-copy tools and retention deletion jobs are not implemented. The certificate view is evidence only; it always reports faculty release as false.
6. Sessions must be re-authored in a replacement revision; no automatic clone or independent batch booking. No scoring/bracket engine.
7. Institution recognition and profile truth are not verified against an external directory. Staff ID inspection can be required without uploading ID documents.
8. No production load, penetration, backup-restore or real Firebase identity test has been completed. Review [BACKEND_SETUP.md](BACKEND_SETUP.md) before live configuration.

## Verification

The existing three migrations were applied to the dedicated development database. The integration suite creates a fresh real PostgreSQL database, applies all migrations and uses a restricted runtime account through HTTP route handlers. Test identity injection is available to the test app factory only; the executable server has no test-auth mode. See [BACKEND_SETUP.md](BACKEND_SETUP.md) for final counts and reproducible commands.

The `gaxios@6` → `uuid@11.1.1` override addresses the audited transitive dependency; re-evaluate it when Firebase dependencies change. The lockfile and local audit result are evidence, not a permanent vulnerability guarantee.

Official reference: [Firebase ID-token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens). Provider verification is deliberately separate from the FESTRONIX permission model.
