# Database schema

Implemented in `backend/migrations/`; updated 2026-10-16. PostgreSQL is accessed only by the server or trusted migration/operations tooling. Do not expose the runtime account to a browser.

## Entity map

| Relation | Authoritative facts / relationships |
| --- | --- |
| `users` | Internal UUID, display/contact and minimal self-declared eligibility profile, disablement |
| `identities` | Unique Firebase provider/UID → user; no linking by email |
| `editions` | Annual identity, display label, dates, timezone, state, admission flag and presentation theme |
| `roles` | Fixed role vocabulary and GLOBAL/EDITION/EVENT/SELF scope |
| `role_assignments` | User, role, edition/event, grantor, reason, validity and revocation |
| `event_staff_assignments` (view) | Event-scoped assignments from the same authoritative assignment table |
| `events` | Edition, slug, lifecycle, admission state, active published revision |
| `event_revisions` | Versioned event facts, eligibility, prices, capacity, team/check-in policies, approval attribution |
| `event_sessions` | Revision-owned named sessions, venue and time window |
| `teams` | Event/edition, name, captain and pending captain-transfer proposal |
| `team_members` | Consented membership and departure history |
| `team_invitations` | Exact invited user, inviter, acceptance and expiry |
| `registrations` | Event/edition, accepted revision, applicant, optional team, admission state, hold/offer deadlines |
| `registration_members` | Individual participant membership in that registration; withdrawal marker |
| `proof_objects` | Private storage key, uploader, registration, MIME, byte count and content hash; no binary payload |
| `payment_submissions` | Proof/reference, status, submitter/reviewer and decision history |
| `tickets` | Event/edition/member relationship, public lookup code, secret hash, state/expiry/revocation |
| `attendance` | Individual member check-in, ticket if used, actor/assignment, method, time and void history |
| `announcements` | Scoped audience, content, author and faculty publication |
| `announcement_recipients` | Explicit recipient membership for targeted notices |
| `audit_logs` | Append-only action, actor, target, scope, timestamp and allowlisted metadata |
| `certificate_eligibility_basis` (view) | Confirmation, individual attendance, completion and policy evidence; no release entitlement |
| `schema_migrations` | Ordered applied migration names and SHA-256 checksums |

Relationships: edition → events → revisions/sessions; event → registrations → registration members → tickets/attendance. A team is event-specific. Payment submissions belong to a registration. Roles reference the same event/edition identifiers. Theme changes do not produce any second copy of these business facts.

## Integrity and normalization

- UUID primary keys identify domain records; dates use `timestamptz`. Money uses integer paise. Dates should be rendered in the edition timezone; no client-local assumption.
- Composite foreign keys carry edition/event/member context to reject mismatched references. The active revision must belong to its event. Attendance/tickets cannot point to another event's registration member.
- Relational entities have separate tables. Small scalar eligibility lists use PostgreSQL arrays. JSONB is reserved for safe audit metadata, not a serialized platform data model.
- Registration `revision_id` preserves the terms accepted. Changes to the active publication never rewrite that pointer. No destructive annual reset or cascade erasure workflow exists.
- Profiles remain current user facts; no complete historical eligibility snapshot is implemented. This is a limitation for future eligibility disputes and must be addressed before claiming such an audit trail.

## Constraints and indexes

| Invariant | Enforcement |
| --- | --- |
| One active/admitting edition | Two partial unique indexes; admission flag requires ACTIVE |
| Distinct institutional custodians while ACTIVE | Deferred triggers require primary and backup; a person cannot hold both active owner roles |
| Valid role scope | Foreign keys, scope-shaped checks, expiry requirement for edition/event roles |
| No repeated unrevoked grant | Unique NULLS NOT DISTINCT assignment index |
| One pending event revision | Partial unique index; version unique per event; reviewer differs from author |
| Valid sessions | Time checks and trigger bound sessions to the parent revision |
| No duplicate participant placement | Unique active team membership and active registration membership per event/user |
| Paid confirmation | Deferred guard requires an approved payment at commit |
| No reused approved transfer reference | Partial unique edition/reference index |
| One usable ticket per member | Partial unique index for ACTIVE/CHECKED_IN; unique token hash |
| Ticket is eligible at insertion | Guard requires confirmed, nonwithdrawn membership |
| One current attendance per member | Partial unique index where `voided_at IS NULL` |
| Audit immutability | Runtime privileges plus mutation-rejecting trigger |

Status/scope/time indexes support staff listings, authorization and reports. Query plans and load at the college's expected scale have not been benchmarked. Schema constraints alone do not implement capacity arithmetic or permissions: the server's locked transactions remain required.

## Lifecycle vocabulary

- Registration: `PENDING_PAYMENT`, `PAYMENT_VERIFICATION_PENDING`, `PAYMENT_REJECTED`, `CONFIRMED`, `WAITLISTED`, `OFFERED`, `ACTION_REQUIRED`, `CANCELLED`, `REJECTED`.
- Payment: `PENDING`, `APPROVED`, `REJECTED`, `SUPERSEDED`.
- Ticket: `ACTIVE`, `CHECKED_IN`, `REVOKED`, `EXPIRED`; expiry is also evaluated at scan time without needing a scheduled state update.
- Attendance correction: mark a row void; retain its original actor/time. A future check-in can create a new current row. Never equate a team row with all-member attendance.

Some vocabulary/metadata is reserved for later workflows (for example payment SUPERSEDED and registration correction deadlines). Presence in a table does not mean a complete UI/API workflow exists.

## Migration operation

1. `001_foundation.sql`: core entities, scope keys, custody/audit rules, reporting view.
2. `002_operational_guards.sql`: captain-transfer metadata, approved waitlist duration, payment-confirmation and ticket-eligibility guards.
3. `003_assignment_and_team_guards.sql`: assignment uniqueness, invitation lookup index and session-window guard.

The runner uses a migration advisory lock and one transaction per new file. Unchanged reruns are safe; changing an applied file's checksum fails. Add a new migration for later changes. There are no automatic down/reset commands. Back up before live migrations and plan a tested forward repair or restore procedure; that operational rehearsal remains outstanding.

Use a separate migration account. The runtime gets table SELECT/INSERT/UPDATE and sequence access, with role catalog/migration writes and audit mutation removed. It receives no DELETE/TRUNCATE/DDL grants from the supplied helper. Startup rejects effective owner/admin accounts and dangerous audit/catalog privileges. This is service-level authorization, not PostgreSQL row-level security or direct client database access.

Preserving history does not authorize indefinite personal-data storage. Faculty must confirm retention, restricted audit preservation and deletion/anonymization procedures before a live edition; no automatic retention job has been activated.
