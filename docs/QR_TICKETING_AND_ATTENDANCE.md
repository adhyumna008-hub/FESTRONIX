# QR ticketing and attendance

Implemented foundation, updated 2026-10-16. Online validation is mandatory.

## Payment → registration → ticket

Free eligible admission confirms immediately if capacity permits. Paid admission reserves a time-limited slot as `PENDING_PAYMENT`. Proof/reference submission enters `PAYMENT_VERIFICATION_PENDING`; authorized event staff approve or reject. Approval rechecks capacity and member eligibility before committing `CONFIRMED`. Rejected proof can be replaced and resubmitted while admissions permit it. Waiting, rejected, cancelled or action-required registrations cannot receive tickets.

`POST /api/v1/events/:eventId/members/:memberId/ticket` issues one member's ticket. The member or authorized event editor may call it. Captains are not entitled to other members' tickets merely by being captain. Payload accepts `regenerate` and a reason. Issuance returns metadata, `qr_payload` and `qr_svg`.

The payload is `fx1_` plus 32 cryptographically random bytes encoded as base64url. It contains no name, college, contact information, payment information or event claims. Only SHA-256 of the full opaque bearer is stored. A fast hash is appropriate for a uniformly random 256-bit secret; this is not password hashing.

The secret is returned only at issuance. Listing tickets returns metadata, never reconstructs the secret. A lost response requires explicit regeneration, which invalidates the previous token. Clients must treat the SVG as a credential, avoid analytics/logging and display recovery clearly. The random `TKT-…` code is a staff lookup reference, not a bearer credential.

## Online scan

`POST /api/v1/events/:eventId/scans` takes `{ token, identity_checked?, override?, reason?, device_label? }`.

1. Authenticate the staff user; authorize a currently valid assignment for the selected event/edition.
2. Only then hash/resolve the token. Do not trust its contents or the client-selected event.
3. Reject wrong scope, revoked or expired unused tickets. Check current registration/member eligibility.
4. If attendance already exists, return its original timestamp.
5. Check event/edition state and check-in window. Where required, staff must affirm physical identity inspection.
6. Insert attendance atomically, attribute it to scanner and assignment, update ticket state and append audit.

| Result | Meaning / client handling |
| --- | --- |
| `VALID_CHECKED_IN` | New individual attendance; display the safe name/code/time returned |
| `ALREADY_CHECKED_IN` | Informational success with original time; no new attendance |
| `WRONG_EVENT` | Token is for another event; no participant data returned |
| `INVALID_TICKET` | Unknown random/malformed payload; no participant data |
| `REVOKED_TICKET` | Reissue, cancellation or staff revocation invalidated it |
| `EXPIRED_TICKET` | Unused bearer passed its expiry |
| `REGISTRATION_NOT_CONFIRMED` | Admission/member no longer eligible |
| `CHECKIN_NOT_OPEN` / `CHECKIN_CLOSED` | Window or event state blocks admission |
| `IDENTITY_CHECK_REQUIRED` | Verify permitted physical ID before retrying |

Unauthorized requests receive HTTP 403 with `error.code=NOT_AUTHORIZED`; invalid/missing identity receives 401. These are not successful scan-result bodies. Authorized operational outcomes normally use HTTP 200. Validation errors are 400; lock contention can produce 503 and must be retried without claiming attendance.

## Atomicity and duplicates

An event row lock serializes check-in decisions. A partial unique index permits only one nonvoid attendance record per registration member. Insert uses `ON CONFLICT … DO NOTHING`, then reads the existing check-in if needed. Ticket state and audit commit in the same transaction. Eight simultaneous scans by two authorized identities are covered by an integration test.

An already-present eligible member returns `ALREADY_CHECKED_IN` even after the window/token expiry. Revoked tokens still fail, and withdrawn/nonconfirmed members still fail. A revoked ticket does not erase historic attendance.

Each member has a separate attendance record. Scanning a captain records only the captain. Authorized exact-code lookup can return the associated team roster so staff may explicitly check in each present member.

## Manual fallback and correction

- `POST /events/:eventId/lookup`: exact random registration/ticket code; no open participant directory. Assigned scanners receive only operational roster details. Lookups are audited.
- `POST /events/:eventId/manual-checkins`: chosen `member_id`, mandatory reason and positive `identity_checked`; same admission eligibility, event scope, window and duplicate rules.
- Faculty/admin window override requires `override=true` and a meaningful reason. It cannot override wrong scope, revocation, expired QR, cancelled admission or closed event. For a valid participant with an expired QR, faculty can use verified manual admission while event state permits it.
- `POST /events/:eventId/attendance/:attendanceId/void`: editors can correct an operational record; completed/archived event corrections additionally require faculty. The row is retained with reason/actor/time, and its usable QR is revoked. Any subsequent issuance is explicit and must still meet normal issuance conditions.

Manual check-in does not mean uploading an identity document. The identity affirmation records a staff decision, not automated proof of who was physically present.

## Audit and privacy

Issuance, regeneration, revocation, authorized scan outcomes, new attendance, override, lookup and correction are recorded. The audit contains result codes and safe identifiers, not QR secrets, proof URLs, bearer headers or proof images. Failed authorization does not enter the transactional domain audit; operational security monitoring of denied traffic is a later deployment concern.

Static QR can be copied/shared. Online revocation and duplicate prevention limit reuse but cannot distinguish the rightful holder from the first person presenting a copied token. Use event-approved ID checks for higher-risk admission. No claim of screenshot-proof or offline-safe tickets is made.

## Future dynamic/offline options (not implemented)

Dynamic tickets should be an optional event policy with versioned short-lived presentations, linked to the same revocable server-side ticket and member record. Validate audience/event, lifetime and replay state server-side; retain static/manual accessibility fallback under faculty policy.

Offline scanning requires a separate reviewed protocol: expiring device and scoped staff authorization, encrypted minimal roster/cache, device-bound signed scan records and unique operation IDs, revocation freshness rules, bounded offline authority, replay protection and deterministic server reconciliation. Two disconnected devices can accept the same credential; conflicts need an attributable review queue and must not silently create two attendances. A cache or signed QR alone does not solve that problem. Current clients must show unavailable/pending connectivity rather than claim an offline check-in succeeded.
