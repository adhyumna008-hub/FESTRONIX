# RBAC and security model

Implemented foundation; updated 2026-10-16. The server is the authorization boundary. Browser route visibility, Firebase custom claims and QR presentation confer no FESTRONIX staff authority.

## Identity is separate from authority

The executable server supports Firebase identity only. It uses `verifyIdToken(token, true)` with the configured project and Application Default Credentials, including revoked-token checking. Email ownership must be verified. Internal users map by Firebase UID, never by a matching email or Google login. Authentication errors are generic. A new identity receives participant self-service capabilities, not a privileged role assignment.

Existing users are rejected when locally disabled. Google/email-link login and email-link completion are client/provider setup work, not endpoints built here. MFA and recent-auth step-up for sensitive faculty actions remain deployment/security work; they are not currently enforced. Real provider credentials and live verification remain untested.

## Implemented permissions

All scope-dependent actions also enforce entity state, timing and eligibility checks. Global owners operate across editions. Everyone else is constrained to currently valid assignments. Participant access is implicit self-service; there is no need to insert a PARTICIPANT assignment.

| Actor | Allowed | Explicit exclusions |
| --- | --- | --- |
| Primary / Backup Faculty Owner | Institutional handover; create/activate/close/archive editions; assign faculty roles; faculty operations across editions | Cannot self-approve an authored revision or review own payment; cannot bypass confirmation/revocation by using a scanner override |
| Faculty Admin | Assigned-edition event setup/publication, student staff assignment, payment review/override, reports/exports, notices, audit and event closeout | No owner handover, faculty-role creation or cross-edition authority |
| Faculty Approver | Assigned-edition preview and independent event revision decisions | No automatic publish, payment, roster, scanner, role-administration or CSV access |
| Core Team | Assigned-edition aggregate reports and edition announcement drafts | No participant roster, proof access, staff grants, approval or publication |
| Event Coordinator | Assigned-event revisions/submission, admission pause/close, registrations, payment review, waitlist, tickets, attendance, event notices and operational LIVE/ENDED transitions | No other event's data; no material self-approval/publication; no staff assignment; no faculty window override, exports or final closeout |
| Volunteer Scanner | Assigned-event scan and exact-code lookup, per-member manual attendance with verified identity/reason | No bulk roster endpoint, payments/proofs, policy edits, ticket issuance, staff grants or attendance correction |
| Participant | Own profile, admission, consent-based teams, own payments/proofs, own tickets and eligible targeted announcements | No staff endpoints, other members' private payment proofs or privileged roles through profile updates |

Faculty admins/owners can reopen admission only if the approved event window and state permit it. All new post-deadline or LIVE walk-in admission is deferred. Coordinators may revoke tickets and void operational attendance; completed-event corrections require faculty. Paid-team cancellation requires faculty; other staff cancellations remain attributable and flag financial follow-up when paid.

## Scoped grants and continuity

Assignments include grantor, reason, start, mandatory expiry for non-owner staff, revocation, edition and (where required) event. Wrong-scope IDs are rejected server-side. Coordinators/scanners require an event; approvers/admins/core require an edition. Only owners appoint faculty admins/approvers; faculty admins can appoint core/coordinators/scanners in their edition. Self-assignment is prohibited.

Role checks are centralized in `permissions.ts`; no token role string substitutes for them. Shared/exclusive transaction locking orders protected requests against revocations/edition transitions. Expired/revoked assignments are rejected on the next request. Closing an edition revokes student assignments immediately; archive removes all edition assignments. Fresh assignments, including explicit post-close operational assignments where needed, must be deliberate faculty actions.

At least one primary and one distinct backup owner are required while an edition is ACTIVE. A deferred database check permits atomic handover without a temporary ownerless commit. Initial bootstrap accepts two previously authenticated Firebase UIDs through trusted local administration only; no public bootstrap endpoint or hardcoded faculty email exists. Later handover is an audited owner action. The appointing faculty must verify that nominees are appropriate institutional personnel; login alone cannot prove that fact.

If the primary is unavailable, the backup can perform handover. If both are inaccessible, use the college's controlled Firebase account-recovery and database emergency-access procedures with independent authorization and retained incident evidence. No hidden recovery password or internet-accessible bypass has been added. The college must appoint and rehearse that recovery process before launch.

## Request, storage and database defenses

- Strict Zod inputs reject extra role/approval fields, invalid UUIDs and policy combinations. SQL values are parameterized; dynamic column lists derive only from fixed schemas.
- Staff scope is checked before resolving a QR token or returning event participant/proof data. Authorized wrong-event scan responses omit PII.
- Private proof reads require original uploader or authorized assigned-event editor; reads are audited. Team captain transfer preserves original payer ownership. Scanner/Core/Approver roles do not acquire proof access.
- Proof uploads are limited to 2 MiB PNG/JPEG, signature-checked, with random storage keys and a per-registration count cap. Files are returned as attachments with `nosniff`, never public URLs. This is not malware scanning or full image decoding; see launch limits below.
- API body limit is 3 MB, default limit 120 requests/minute per IP. Proxy trust is not enabled automatically. These defaults need measured college-network tuning; there is no distributed limiter.
- Runtime account is distinct from migration ownership. Startup rejects elevated roles, public-schema CREATE/ownership and audit/catalog mutation privileges. Runtime has no supplied delete/truncate/DDL grant. There is no RLS; do not expose the database to clients.
- Audit writes share successful domain transactions. Domain audit is append-only to runtime users, with a trigger rejecting mutation. Database administrators remain a trusted high-privilege boundary; external immutable backup/logging is not implemented.
- Logs avoid auth headers, QR values, request bodies, proof keys/URLs and SQL values. Denied requests require separate operational monitoring; ordinary transactional rollback does not preserve a failed-action audit.
- Public endpoints return approved event facts, not public rosters. Faculty CSV is audited, capped and omits contact fields; formula-leading cells are neutralized.

## Before live student data

These are outstanding controls, not certifications:

1. Configure genuine Firebase identity, client allowed domains, faculty MFA/step-up policy, verified PostgreSQL TLS and non-default credentials. Test real sign-in, revoked accounts and recovery.
2. Review private durable evidence storage, OS access controls, encryption/backup, image sanitization or scanning and orphan cleanup after process crashes. File-write rollback cleanup is best-effort; a crash can leave an orphan. Local development files are not a production retention service.
3. Faculty must approve privacy notice, retention periods/holds, evidence handling and deletion/anonymization jobs. No retention duration or legal compliance claim is invented here.
4. Confirm administrator identity checks, audit access, operational support, override policy and maintenance ownership. Global custody events currently require trusted audit storage review; the edition audit API filters to edition-scoped entries.
5. Rehearse backups/restores, configure HTTPS/proxy/rate-limit rules, monitor auth failures and capacity/storage, and measure expected event-day load. Body and upload limits do not replace infrastructure quotas.
6. Review missing participant-impact revisions, substitutions, payment reconciliation/refunds, results/appeals and certificate release before promising them in the UI.

The test suite covers server-side scope and integrity behavior with native PostgreSQL and an injected identity verifier. It does not constitute penetration testing, legal review, physical identity assurance or production-provider verification.
