# FESTRONIX Owner Decision Checklist

**Status:** U1–U11 resolved at product level. U1–U4 remain unchanged. U5–U11 use the defaults selected under the owner's authorization on 2026-10-06; institutional policy, staffing and launch commitments still require faculty confirmation.  
**Date:** 2026-10-06  
**Source:** `PRODUCT_SPEC.md`, unresolved register U1–U11.

All eleven product choices are recorded. The earlier U1–U4 references to pending U5–U11 describe their original decision context; the current status and U5–U11 resolutions below supersede those pending labels without changing U1–U4. Faculty confirmations listed below are operating prerequisites, not silent policy approval. `USER_FLOWS.md` still requires separate owner authorization.

## U1 — Fees and fest passes

**Question:**  
Should the first edition offer free event registration, paid events, or a general fest pass?

**Why it matters:** Fees and passes change when a place is confirmed and who handles entry, cancellations and refunds.

**Options:**  
A. Free registration for each event; no platform-managed fest pass. Campus entry follows a separately published college policy.  
B. Free and paid events, each registered separately; no general pass.  
C. A general fest pass, with separate event bookings and explicit rules about included events and campus entry.

**Recommended:**  
The earlier recommendation was A. The owner's explicit decision below supersedes it.

**Final decision — RESOLVED, 2026-10-06:** Modified Option B. Some events are free and some are paid. There is no general fest pass in MVP.

- Free events: a participant registers; registration may become `CONFIRMED` immediately, subject to event capacity and eligibility rules.
- Paid events: a participant registers, pays using the method/instructions configured for that event, and uploads payment proof such as a screenshot plus a transaction/UTR/reference number. Registration becomes `PAYMENT_VERIFICATION_PENDING`.
- Only coordinators assigned to that specific event may review its proofs. Authorized faculty/admin users may review, override or audit verification. Coordinator access begins only after authorized faculty/admin assignment and remains limited to assigned events.
- Approved proof changes the registration to `CONFIRMED`. Rejected/invalid proof must have a clear reason and a re-upload/resubmission path returning to verification pending.
- No payment gateway integration is required for MVP. An uploaded screenshot or reference number alone does not confirm admission.

**Impact:** Manual payment verification, event payment settings, private proof handling, reviewer decisions, resubmission and faculty oversight are MVP capabilities. Capacity treatment while verification is pending, verification deadlines, duplicate proof handling, payment reconciliation and cancellation/refund responsibilities still need explicit operating rules; U4 now governs event-level admission/capacity policy, while U5–U11 remain pending. No provider or technical architecture is selected.

**Related reusable-admin requirements recorded by the owner:** Faculty/admin must eventually manage edition display labels such as `2026`, `2027` or `2K27`, edition/logo lockups, fest dates, tagline, theme, sponsors, contacts, hero content, featured events, FAQs, registration state and announcements through settings/CMS. The core FESTRONIX brand/logo stays year independent; the edition/year presentation is configured separately. Ordinary annual changes must not require a developer. These requirements do not settle U5–U11, including U10 overlap or U11 maintenance ownership.

## U2 — Audience and eligibility checks

**Question:**  
Who may participate, and how should their eligibility be checked?

**Why it matters:** The audience determines registration details, campus entry expectations and support for exceptions.

**Options:**  
A. Vardhaman students only; staff check college identity when needed.  
B. Students aged 18+ from Vardhaman and other colleges; eligibility varies by event, with student ID checked at attendance when required. No ID uploads by default.  
C. Broader participation, including under-18 students or non-student guests; publish separate eligibility, entry and applicable guardian-consent rules approved by the college.

**Recommended:**  
The earlier recommendation was B. The owner's explicit decision below supersedes its proposed 18+ baseline.

**Final decision — RESOLVED, 2026-10-06:** Modified Option B. FESTRONIX accepts students from Vardhaman and other recognized colleges/universities. Each event may define institution type, restricted permitted colleges, academic year, department/branch and genuine age/safety restrictions.

- Student-ID uploads are not required by default. When verification is needed, an authorized event coordinator or authorized event staff member may inspect a valid college ID at check-in or attendance.
- Under-18 college students may participate where institutional and event policy permits. An event may impose stricter age, safety or legal requirements when genuinely required.
- General-public/non-student participation is disabled by default. Faculty/admin approval is required to enable it for a particular event.
- An assigned coordinator may propose eligibility settings for their event. Material eligibility rules require faculty approval as part of the event approval or revision process.

**Impact:** Event settings and participant-facing details must show approved eligibility criteria, any restricted institutions and verification-at-attendance expectation. Verification is a limited inspection, not default document collection or a reason to retain ID images. Events that enable non-student participation or stricter rules need faculty/admin approval and clear public wording. U5–U11 remain unresolved.

## U3 — Institutional owners and approvers

**Question:**  
Who will retain platform ownership, approve events and cover absent faculty?

**Why it matters:** Student turnover or one unavailable faculty member must not strand approvals or annual handover.

**Options:**  
A. Two named institutional custodians, an edition faculty lead and a backup approver; independent approval of material submissions. Custodians may also hold faculty duties with explicit assignments.  
B. One institutional custodian, with a separately named recovery contact and two edition faculty approvers.  
C. Two institutional custodians and department faculty reviewers, with a central faculty lead resolving cross-department issues.

**Recommended:**  
A. It provides continuity and backup without introducing department-specific administration before it is needed. Authors cannot approve their own material submissions. Name the people and the event-day duty backup before operating the fest.

**Final decision — RESOLVED, 2026-10-06:** Modified Option A. An active FESTRONIX platform must always have at least two institutional faculty custodians: one **Primary Faculty Owner / Super Admin** and one **Backup Faculty Owner / Super Admin**. For the current edition, Asif Sir is expected to be Primary Faculty Owner; his email will be provided later and must never be hardcoded into application logic. His authority comes from an administrator role assignment in FESTRONIX.

- One or more authorized faculty users may be assigned as **Faculty Approvers** for an edition. They review event submissions and material event changes under the established approval rules.
- Student Core Team users support fest operations but can never be the sole institutional owner or platform recovery path. Event Coordinators receive only assigned-event scope.
- Authorized faculty owners can add/remove future faculty admins, approvers, Core Team users and coordinators through the admin interface without code changes. Role changes must preserve the two-custodian minimum, record the actor/reason and avoid self-approved elevation.
- If the primary owner becomes unavailable, the backup owner continues institutional control, assigns/replaces faculty roles and appoints a new primary owner through a recorded handover. A staff transition cannot depend on one personal inbox or a hardcoded email.

**Impact:** The active platform needs two available faculty-owner assignments before it can operate. The admin interface needs accountable role assignment, revocation and handover actions, while approval roles remain edition-scoped and coordinators remain event-scoped. U5–U11 remain unresolved.

## U4 — Capacity, walk-ins and team changes

**Question:**  
How flexible should admission and team changes be after registration?

**Why it matters:** Flexibility affects fairness, room occupancy and how much exception work organizers must handle.

**Options:**  
A. Advance registration only; confirmed team changes need staff assistance before the deadline, with later substitutions only by faculty exception. Schedule clashes warn participants.  
B. The same controls, plus event-specific walk-ins before the event goes Live when approved capacity permits. Schedule clashes warn participants.  
C. B plus waitlists and published event-specific rules that may block incompatible overlapping bookings.

**Recommended:**  
The earlier recommendation was B. The owner's explicit decision below supersedes it.

**Final decision — RESOLVED, 2026-10-06:** Modified Option C. Admission and team policies are configured per event rather than imposed globally.

- Every event may define its participant/team capacity, registration deadline, optional waitlist, whether approved walk-ins are allowed, team-size minimum/maximum, team-edit/change deadline, late-substitution policy and schedule-clash behavior.
- Advance registration is the normal path. Waitlists are optional. Walk-ins default to disabled and can be enabled only for an approved event when capacity permits.
- Participants and teams may make changes allowed by the event until its configured deadline. After that deadline, substitutions or material team changes require authorized coordinator/faculty handling under that event's published policy.
- Confirmed registrations must never silently exceed capacity. Users receive at least a schedule-clash warning; an event may block an incompatible overlap only when that behavior is explicitly configured and faculty-approved.
- Assigned coordinators may propose/configure these policies only for their own events. Material capacity, admission and team-policy changes require faculty approval before publication. Authorized faculty/admin users may override settings when necessary; the later technical design must provide an audit trail.

**Impact:** Event configuration, approval, registration status and staff handling must support explicit capacity checks, optional waitlists, approved walk-ins, controlled team changes and approved clash behavior. The product still needs decisions on withdrawal detail, waitlist offer/expiry rules, verification time limits and exception documentation; U5–U11 remain unresolved.

## U5 — Results, appeals and prizes

**Question:**  
When should results become final, and who resolves appeals, disqualification and prize commitments?

**Why it matters:** Participants need a fair correction opportunity and a named authority for awards.

**Options:**  
A. Faculty-approved provisional results, a published 48-hour appeal window, then final results; disputed awards/certificates stay on hold.  
B. Faculty-approved results become final immediately; later factual errors still have a correction route.  
C. Event-specific appeal windows approved before registration, with a named faculty panel for contested judging or disqualification.

**Recommended:**  
A. A consistent short window is easy to explain and operate. The 48 hours starts at notified publication. Faculty resolves appeals and disqualification against published rules; an independent reviewer handles conflicts. Name a prize fulfilment owner and publish the delivery date before promising prizes.

**Impact:** A adds provisional/final labels and appeal holds. B releases awards sooner but leaves less time for challenge. C supports complex competitions with more review staffing. Prize amounts, funding and delivery dates still require explicit event approval.

**Final decision — RESOLVED at product level, 2026-10-06:** Modified Option C with A's 48-hour default. Each competitive event has a faculty-approved appeal window and named faculty decision authority published before registration. Default: 48 hours from notified provisional-result publication; a different window requires approval and visible wording, not a coordinator's ad hoc change.

Assigned coordinators prepare results/evidence and route queries; faculty approves provisional release, resolves appeals/disqualification with an independent reviewer where conflicted, and authorizes final release. Expiry alone does not finalize disputed results. Hold only affected awards/certificates; unaffected results can proceed. Preserve correction history and a factual-error route after finalization. Workshops need no ranked result. Prize amounts, funding, fulfilment owner and delivery date require faculty confirmation before being advertised; prize delivery is tracked manually in MVP.

**Faculty confirmation:** Event judging/appeal rules, reviewer and backup, funding, prize delivery commitments. No universal judging engine or prize-payment automation in MVP.

## U6 — Certificate promises and delivery



**Question:**  
Who receives certificates, and what delivery commitment can the college support?

**Why it matters:** Certificate promises create attendance, name-checking and fulfilment work after the fest.

**Options:**  
A. Winners and eligible attendees of explicitly designated events; faculty-approved individual PDFs, with a published delivery target within 14 days of outcome finalization.  
B. Attendance-based participation certificates for every event plus winner certificates; automatic generation is required at launch.  
C. Winner certificates only in the first release; participation certificates are deferred.

**Recommended:**  
A. Promise certificates only where a named faculty owner can verify attendance/outcomes and deliver them. Confirm recipient names before issuance and approve the template/signatory. The 14-day target is proposed and requires the college's agreement; manual PDF delivery must be checked against expected volume.

**Impact:** A needs an issuance register and correction/replacement handling. B increases volume and moves certificate automation into MVP. C reduces closeout work. The college certificate authority must confirm eligibility, signatory, format, deadline and staffing.

**Final decision — RESOLVED at product level, 2026-10-06:** Modified Option A. Certificate policy is per event: none, winners, eligible attendees, or both. Default is **no certificate promise until faculty approves the policy and delivery responsibility**. No entitlement from registration alone; participation requires individual attendance or approved equivalent evidence, and winner certificates require finalized outcomes.

Coordinators prepare recipient/name/evidence lists and proposed corrections only for assigned events; faculty confirms eligibility, template/signatory, recipients and release. MVP uses individually assigned PDFs and an issuance register with issued/replaced/withdrawn history. PDFs remain private to recipients and authorized staff. Suggested target is 14 calendar days after relevant outcome/attendance finalization, published only once faculty confirms staffing. Generation, public verification and mass mailing remain Phase 2; registration fees do not automatically buy a certificate.

**Faculty confirmation:** Which events promise certificates, attendance threshold/evidence, signatory/template authority, fulfilment owner and achievable deadline/volume.

## U7 — Public names and data retention

**Question:**  
What participant information may be public, and how long should private records be retained?

**Why it matters:** Preserving fest history does not require public contact details or permanent operational rosters.

**Options:**  
A. Publish only approved winner/team names and institution under the college's publication policy; keep certificates private. Propose 12 months for ordinary registration/contact records and delete temporary rosters within 30 days of reconciliation.  
B. Use team names or participant reference codes in public results; otherwise use A's proposed retention periods.  
C. Publish an approved participant/results gallery and retain ordinary private records for three years, with an explicit college-approved purpose and removal process.

**Recommended:**  
A. It gives winners recognition with limited disclosure. Collect only necessary information, explain publication and provide correction/removal requests. The college must approve the proposed periods and any consent requirements. Certificate/outcome evidence may need a separate retention period; it must be specified before records are collected, with participant access limits explained.

**Impact:** A balances recognition and limited retention. B minimizes public identity exposure. C increases consent, media and ongoing stewardship work. Every choice needs a named data steward, justified exports, retention exceptions for unresolved cases and an approved certificate-record policy.

**Final decision — RESOLVED at product level, 2026-10-06:** Modified Option B with opt-in recognition and faculty-controlled retention. Default public results use team names or participant references; individual names/institution are published only under an approved publication policy with the required participant permission. Contact details, rosters, payment proofs and certificates are private. Media use needs separate approved permission; no public participant directory. Preserve non-personal edition facts and aggregate counts separately from private operational records.

Proposed conservative retention defaults for faculty confirmation: ordinary registration/contact/attendance records 12 months after edition closeout; temporary exported rosters within 30 days of reconciliation; uploaded payment-proof images within 90 days after financial reconciliation and related dispute closure; minimal certificate issuance/outcome evidence three years after issue. These are product proposals, not legal retention determinations. Faculty must approve or replace these periods and specify finance/account/audit records and backup disposal before live collection; longer retention needs a documented purpose and review date. Unresolved disputes retain only necessary restricted evidence under a faculty hold, not the entire roster indefinitely.

Faculty appoints a data steward, approves publication/exports, handles access/correction/removal requests and records retention exceptions. Assigned coordinators see only needed event records, reconcile temporary copies and route requests; they cannot decide global retention or bulk deletion. Explain when private access ends and provide a certificate retrieval/reissue route before removing supporting records. Deletion must not silently invalidate already-issued certificates or outstanding obligations.

**Faculty confirmation:** Publication/permission wording, minors policy, all retention periods, financial/certificate/account/audit requirements, hold and backup-disposal policy, data steward. Live personal-data collection remains subject to these approvals.

## U8 — Notifications and participant support

**Question:**  
Which channels should carry confirmations and urgent changes, and who will answer participants?

**Why it matters:** A changed venue or failed confirmation needs a dependable support route.

**Options:**  
A. Email plus notices in the participant area; a named help desk monitors routine queries, with a phone contact and duty faculty escalation during fest hours.  
B. A plus SMS for critical changes and confirmation problems.  
C. A plus an official managed messaging channel, with clear responsibility for monitoring and protecting participant contact details.

**Recommended:**  
A. It provides a persistent notice record and a practical event-day fallback with fewer channels to maintain. Recommend routine replies within two working days and active phone coverage during published fest hours; confirm staffing and hours before promising these targets.

**Impact:** A needs delivery-failure follow-up and a staffed help route. B adds message costs and consent/contact requirements. C adds moderation and channel administration. Organizers must name support owners, urgent escalation contacts and the final response commitment.

**Final decision — RESOLVED at product level, 2026-10-06:** Modified Option A. MVP uses email plus persistent participant-area notices, targeted event/edition announcements, a staffed help contact and a published event-day phone/duty-faculty escalation route. The participation area is authoritative if email fails; show failures to staff and support resend/follow-up. Avoid exposing recipient lists. No SMS, messaging groups or full ticketing platform in MVP.

Faculty sets approved channels, support owner/backup and coverage hours, and approves changed commitments or emergency notices. Assigned coordinators handle their event's routine queries and approved factual reminder templates; they escalate disputes, safety, payments/refunds and policy exceptions. Core Team may help triage within its assignment, with minimum participant data. Propose routine replies within two working days only when coverage is confirmed; outside published hours show the next coverage period. Maintain a simple query owner/status record and unresolved handover list. Delivery is not proof of receipt.

**Faculty confirmation:** Monitored official email/phone, duty roster/backup, coverage hours and achievable response commitment. No 24/7 or automated emergency-response promise.

## U9 — Event formats and operating scale

**Question:**  
Which event formats and festival size must the first release handle?

**Why it matters:** Multi-round judging, repeated sessions and large attendance change organizer workload and MVP scope.

**Options:**  
A. Solo/team competitions and workshops; scheduled sessions with participant allocation where needed, manual judging and outcome entry.  
B. A plus multi-round competitions with structured scoring and judging responsibilities inside FESTRONIX.  
C. A plus repeated independently bookable workshop batches, shared equipment limits and session-specific attendance/certificates.

**Recommended:**  
A. It covers common tech-fest activities without building a judging engine. It can show an event spanning several sessions; independently bookable batches and detailed round management require B/C-level scope review. Confirm expected events, participants, team sizes, fest days, venues and peak arrivals before accepting manual operating assumptions.

**Impact:** A keeps one event entry with a defined schedule. B adds rounds, scores and judging reviews. C adds booking and capacity per batch. Scale figures determine whether manual attendance, PDF delivery and faculty review capacity are credible.

**Final decision — RESOLVED at product level, 2026-10-06:** Modified Option A. MVP supports individual/team competitions, hackathons and attendance-based workshops/talks with one registration per event and one or more published sessions. Judging and rounds may occur operationally outside FESTRONIX; coordinators enter final outcome proposals for faculty review. No scoring engine, bracket generator, round-specific eligibility or independently bookable workshop batches in MVP. Separate faculty-approved event listings may represent genuinely separate batches, with their own capacity and clear names; shared-resource conflicts need faculty review.

Faculty approves formats, session/venue capacity, equipment and the operating plan. Coordinators manage schedule/attendance/outcome facts only for assigned events within approved rules. Do not impose arbitrary platform participant caps: actual event/participant/team/session/venue counts and peak arrivals must be confirmed before implementation sizing and before relying on manual attendance/PDF fulfilment. Formats requiring specialized booking/judging remain Phase 2 pending demonstrated need.

**Faculty confirmation:** First-edition scale, expected formats, venues/equipment, review/help-desk capacity and manual attendance/certificate workload. This settles product scope, not technical capacity or infrastructure.

## U10 — Edition overlap and archive presentation

**Question:**  
Can two annual editions accept registrations at once, and how should old editions be displayed?

**Why it matters:** Overlap can confuse bookings; preserving every historic visual effect indefinitely creates maintenance work.

**Options:**  
A. One edition accepts registrations; the next stays private until activation. Old facts/links remain, using a maintained archive presentation if an old theme is retired.  
B. The next edition has a public preview while only the current edition accepts registrations; use A's archive policy.  
C. Multiple editions may accept registrations simultaneously, with explicit edition selection; preserve each original theme while supported and permit a documented compatible fallback when retired.

**Recommended:**  
A. A clear annual handover suits a college fest and limits accidental booking into the wrong year. Closing old admissions does not stop faculty completing old results or certificates. A named faculty archive steward handles corrections; changing archive appearance never changes historical facts.

**Impact:** A needs private preview and deliberate activation. B adds a public upcoming-edition state. C adds overlapping admission and navigation responsibilities. In all options, old student access expires and historic participant records stay attached to their original edition.

**Final decision — RESOLVED at product level, 2026-10-06:** Modified Option A. Only one edition accepts registrations in MVP. Faculty owners prepare the next edition privately, copy reusable templates selectively, reapprove event facts and assign fresh student roles; activation requires old admissions closed and new-edition readiness checked. A public upcoming teaser is optional future scope, not parallel booking.

Old edition URLs, event facts and approved outcomes remain clearly labeled. Old results, disputes, prize fulfilment and certificates can continue through specifically authorized faculty/staff closeout access after the next edition activates; no inherited student authority. Do not copy participant/payment data into the next edition. Archive is normally read-only; a named faculty archive steward makes reasoned corrections with history. Supported old themes may remain, but a maintained accessible archive presentation may replace retired visual effects without changing facts. Archiving does not override U7 retention.

**Faculty confirmation:** Activation readiness, expiring/reassigned access, outstanding obligations, archive steward and licensed historical media. No requirement to preserve every historical WebGL effect indefinitely.

## U11 — Maintenance ownership and budget

**Question:**  
Who will maintain FESTRONIX after launch, and what recurring support can the college commit to?

**Why it matters:** Faculty can administer editions, but faults, updates and staff turnover still need accountable technical support.

**Options:**  
A. A named faculty product owner and college IT/technical maintainer, with an annual operating budget, pre-edition review and event-day support arrangement.  
B. A faculty product owner with a contracted maintainer and an agreed support/renewal budget.  
C. A faculty product owner with a supervised student maintenance team, documented annual handover and a named college technical escalation contact.

**Recommended:**  
A, if college IT accepts the responsibility; otherwise B is the stronger continuity option. Name the owner, maintainer, backup and budget approver. Student contributors can help, but annual turnover must not be the only fault-recovery plan.

**Impact:** A needs an institutional commitment of time and funds. B needs a support agreement and renewal ownership. C depends on training and supervised handover. No amount or provider is selected here; the owner must confirm resources and coverage before committing to launch.

**Final decision — RESOLVED at product level, 2026-10-06:** Modified Option A with B as a resourcing fallback. Institutional faculty ownership stays with U3's Primary/Backup custodians. Name a faculty product/operations lead, accountable technical maintainer and backup, plus college budget approver. Prefer college IT if it accepts responsibility; otherwise appoint a contracted maintainer under the same faculty governance. Student contributors may help under supervision but cannot be the sole maintenance/recovery path.

Ordinary edition/content/assignment/theme operation belongs in approved admin controls and an annual handover guide. Maintenance still covers defects, dependencies, accessibility/security review, recovery exercises and renewals; faculty administration does not eliminate that work. Require pre-edition readiness review, documented event-day escalation, annual resource/renewal review and recoverable institutional custody of accounts/assets/documentation. Technical maintainers do not automatically gain result approval or unrestricted participant-export authority.

**Faculty confirmation:** Named people and backups, IT acceptance or support agreement, recurring budget/renewal owner, support coverage and recovery responsibility. These are launch prerequisites; no supplier, amount or technical stack is selected.

## Remaining confirmation status

U5–U11 are resolved as product behaviors under the owner's instruction. Faculty confirmation remains required for commitments listed in each item; no college policy, staffing agreement or budget is presumed approved. U1–U4 remain unchanged. Manual-payment operating details and event-specific admission limits from those decisions still need an approved operating plan. User flows and screen inventory have not been started and require a separate instruction.
