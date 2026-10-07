# FESTRONIX Product Specification

**Status:** U1–U11 resolved at product level; faculty policy, staffing and launch confirmations remain outstanding. U1–U4 are unchanged. Other recommendations remain subject to review.  
**Version:** 0.2  
**Date:** 2026-10-06  
**Product:** Reusable annual technology-festival platform for Vardhaman College of Engineering  
**Visual-reference gate:** PASSED; final artwork and visual design remain separate decisions.

## Product intent and decision status

Build one platform that faculty can operate across annual FESTRONIX editions. Participants should discover suitable events, understand commitments, register reliably, attend with clear information, and obtain trustworthy outcomes. Student organizers should prepare and run assigned events under accountable faculty oversight. Future organizers should inherit reusable configuration and operating guidance, not last year's participant lists or student privileges.

“Without a developer for normal administration” means the supported tasks in this specification can be performed through bounded administrative capabilities. New feature development, security maintenance, fault repair and substantial new theme design still require technical stewardship. The college must name an ongoing product owner and technical support contact.

Decision labels used throughout:

- **Fixed requirement:** Explicitly established by the user: one annual FESTRONIX platform; Pulse, Panel and Flux affect presentation only; faculty administration; assigned coordinator scope; preservation of edition history; no business-data duplication for themes. U1 is resolved: free and paid event-specific registrations, manual payment-proof verification, and no general fest pass in MVP. U2 is resolved: Vardhaman and recognized external-college/university students may participate under approved event eligibility. U3 is resolved: two institutional faculty owners must provide active-platform continuity. Configurable edition/year presentation and ordinary annual administration without developers are required.
- **Recommendation:** The proposed behavior in this document. It is ready for product review, not silently treated as institutional approval.
- **Unresolved:** A college policy or operating decision that needs an owner and an answer. Section 13 records defaults and consequences so planning can continue coherently.

This document specifies capabilities, responsibilities and user-visible rules. It does not select frameworks, storage, authentication providers, database permissions, schemas, APIs or deployment infrastructure. References inform public presentation only; no reference site's dashboard or business architecture is adopted.

### Provisional authentication preference

This is a planning preference, not a finalized technical architecture or implementation decision. FESTRONIX is expected to use **Firebase Authentication**, subject to later architecture review. The preferred participant sign-in order is Google Sign-In as the primary option, with passwordless email-link authentication as a secondary option. A successful email-link sign-in verifies ownership of that email address.

Authentication identifies a person and establishes their sign-in session. Authorization determines what FESTRONIX work they may perform. Signing in through Google or email must never automatically grant Platform Owner, Faculty Admin, Fest Operations Lead, Event Coordinator, Check-in Operator or any event-scoped authority. Authorized administrators assign FESTRONIX roles and event/edition scope separately, subject to the role boundaries in section 1.

Admin and faculty accounts may later require stronger protection such as MFA. The exact policy, triggers and implementation remain unresolved. This preference does not configure Firebase, select a complete security architecture, or change the resolved U1–U11 product decisions.

### Outcomes that define a useful product

1. A participant can find eligibility, fee/free status, date, venue, team requirements and registration availability before starting registration.
2. A coordinator can complete an event from draft to closure within their assignment, with clear approval feedback and no access to unrelated participants.
3. Faculty can publish approved events, handle a cancellation or venue change, correct results and open a new edition without code changes.
4. Changing a theme leaves event facts, registrations, participant status, links and eligibility unchanged.
5. At edition handover, old student assignments expire, new people receive explicit assignments, and historic registrations/results remain attributable to their original edition.
6. An event-day operator can resolve a failed scan or missing phone through a controlled manual process. A decorative scene is never necessary to find or use a core action.

Operational measures should include registration completion/failure reasons, unresolved review age, unresolved support cases, attendance corrections and edition setup tasks that needed a developer. Use aggregate counts; exact targets will be set after expected festival scale is confirmed.

## 1. Roles and responsibility boundaries

Keep six role families, with clearer names and scope. The Platform Owner family has two mandatory institutional faculty custodial appointments while the platform is active: Primary Faculty Owner and Backup Faculty Owner. A role describes a responsibility; an assignment identifies the edition, event or event-day duty to which it applies. One person may hold several explicit assignments. Being a coordinator in one event must not imply coordinator access elsewhere. A staff member's participant activity remains separate from their organizing responsibilities.

| Recommended role | Purpose and responsibilities | May manage | Must not manage |
| --- | --- | --- | --- |
| **Primary Faculty Owner / Super Admin** | College-controlled primary institutional custody and continuity | Faculty administrator, approver, Core Team and coordinator appointments/removals; edition creation/activation/archive; theme publication and rollback; institutional identity and approved policy settings; high-risk recovery and recorded handover | Routine self-approval of their own event/result changes; silent alteration of attendance or results; deletion of history to resolve mistakes; reducing an active platform below two faculty custodians; student assignments without an edition/expiry; use of participant data unrelated to fest duties |
| **Backup Faculty Owner / Super Admin** | Second institutional custodian and recovery path if the primary owner is unavailable | The same institutional actions as the Primary Faculty Owner, including a recorded primary-owner replacement/handover when necessary | Routine self-approval of their own event/result changes; silent alteration of attendance or results; deletion of history; reducing an active platform below two faculty custodians; using student Core Team as the sole recovery path |
| **Faculty Admin / Approver** | Accountable edition leadership, event quality, participant protection and incident decisions | Assigned editions; event assignments; review decisions; publishing approved events/content; schedules/venues; registration exceptions; targeted announcements; cancellation; result/certificate approval; closure and ordinary support escalation | Institutional owner appointments/removals or recovery handover; unassigned editions; theme publication or active-edition switch; approval of their own material submission; unrecorded policy exceptions or destructive history cleanup |
| **Fest Operations Lead (Fest Core Team)** | Coordinate work across the assigned edition and prepare its public content | Edition-wide event status and aggregate counts; content/sponsor/venue drafts; proposed schedule; review follow-up; volunteer assignment proposals; approved operational checklists | Event/result approval; global or faculty access; unrestricted event participant lists; bulk participant contact exports; material publication, theme switching or edition activation; changing coordinator ownership to gain access |
| **Event Coordinator** | Prepare, run and close specifically assigned events | Event drafts/revisions; preview and submission; approved operational controls; propose eligibility and admission/team settings; necessary participant roster/contact fields and payment-proof verification for their assigned events; attendance reconciliation; result drafts; event announcements through the prescribed approval path | Other events or editions and their payment proofs; self-approval/publication of material eligibility, capacity, admission or team-policy changes; self-assignment or granting roles; arbitrary participant removal; silent capacity/eligibility changes; final result/certificate release; overall fest branding/themes |
| **Check-in Operator (Volunteer / Scanner)** | Perform a limited gate or event attendance duty during a defined shift | Assigned check-in list/search or future scanning; minimum identity and admission status; inspect a valid college ID only when explicitly authorized for the assigned event; mark attendance; report mismatch or duplicate; request correction | Editing registrations/team membership, rules/results/certificates or schedules; retaining/copying ID documents; full participant profiles/contact exports; removing registrations; granting admission overrides or assigning other operators |
| **Participant** | Manage their own festival participation | Their profile; individual registrations; accepted team memberships; captain duties where applicable; own confirmations/attendance/results/certificates; withdrawal and correction/support requests | Another person's account or consent; other teams' private details; editing approved event terms; marking own attendance or results; staff capabilities |

**Why these choices:** Keep Core Team distinct from faculty because coordination work is broad but approval authority is different. Rename Volunteer around the task so “volunteer” does not imply general administrator access. Team Captain is a responsibility within a participant team, not a new privileged role. Public visitors need no role or account to browse. Do not add judge, sponsor, finance or department-admin roles in MVP: coordinators collect judges' decisions and faculty approve publication; add specialized roles only when a confirmed workflow demands them.

### Assignment and sensitive-action rules

- U3 requires at least two institutional faculty custodians whenever the platform is active: one Primary Faculty Owner / Super Admin and one Backup Faculty Owner / Super Admin. Each uses their own assigned identity; no shared administrator identity or hardcoded email is permitted. For the current edition, Asif Sir is expected to hold the Primary Faculty Owner role once his email is provided and an authorized administrator assignment is made; the email is not product logic.
- Faculty assignments specify the edition and whether the person can approve. Core/Coordinator assignments specify edition, assigned events where applicable, start/end dates and the faculty sponsor. Operator duties also specify gate/event and shift. The person sees their current scope and expiry.
- Faculty Owners add/remove faculty admins, edition Faculty Approvers, Core Team users and coordinators through the admin interface without code changes. Faculty Approvers may review event submissions and material changes for their assigned editions. Core/Coordinators can nominate people; nominations grant no access. Only Faculty Owners appoint other owners. The platform blocks a change that would leave fewer than two faculty custodians while active; role changes show scope/consequences and record actor, reason and outcome.
- If the primary owner is unavailable, the Backup Faculty Owner continues institutional control, manages faculty roles and appoints/replaces a Primary Faculty Owner through a recorded handover. Student Core Team users are never the only owner or recovery path.
- **Owner-confirmed requirement:** Event coordinator access is granted only after assignment by an authorized faculty/admin. It is scoped to assigned events, including payment-proof review; nomination, registration or student-team membership grants no coordinator access. Authorized faculty/admin may review, override or audit payment verification within their administrative responsibility, with attributable reasons for overrides.
- **Owner-confirmed eligibility requirement:** Assigned coordinators may propose eligibility for their events, but material eligibility rules are approved by faculty as part of the event approval/revision process. Faculty/admin may authorize event staff to verify a valid college ID at check-in or attendance for an assigned event. Verification is a limited inspection; student-ID uploads, copies and image retention are not default requirements.
- An approver must be different from the author of a material revision or result submission. A conflicted approver refers it to another assigned faculty approver; there is no owner bypass for self-approval. If only one faculty person is available, approval waits for another appointment.
- Revocation/expiry ends operational access immediately, including a previously opened working view. It preserves attributed historical actions. Former students may still use their own participant records.
- Show the scope and consequences before role changes, bulk messages, participant exports, cancellations, certificate withdrawal, theme publication and edition activation. Record who acted, when, why, scope and outcome. This is an accountability requirement, not a database permission design.
- Limit rosters and exports to the minimum needed for the task. Core Team sees totals by default. An authorized faculty administrator may permit an event roster export with purpose and scope recorded; operators cannot export. Handover copies must not become uncontrolled participant archives.
- Student organizers may participate in other events. A coordinator must not adjudicate or reconcile results for an event in which they compete; faculty reassign that duty. No hidden test entries in real participation counts.

## 2. Public FESTRONIX experience

The following are product destinations/capabilities, not a screen inventory or visual layout. Combine small content into sections where a separate page would add navigation without value.

| Public destination | Strong reason to exist | Essential content and behavior |
| --- | --- | --- |
| **Current edition home** | Explain what the fest is and direct visitors to action | College/fest identity, edition, dates, location, registration availability, primary event discovery action, selected approved events, urgent changes, concise about/sponsor information. No mandatory intro, sound or sign-in |
| **Event directory** | Help participants find suitable activities | Search by name/topic; category/day and solo/team filters when useful; consistent date, format, eligibility summary and open/full/closed/cancelled labels. Hide unused filters. No recommendation engine |
| **Event detail** | Give an informed basis for registering | Purpose, format, eligibility, team size, capacity basis, fees/free status, registration deadline, schedule/venue, rules, judging/prizes where relevant, required equipment, accessibility/help contact, status and important updates. Clear unavailable-state explanations |
| **Schedule** | Support planning and finding the next event | Day/time/venue grouping from approved event facts; conflicts/delays/cancellations visible; links to event details. It must not be a second independently maintained schedule |
| **Visit and help** | Reduce avoidable event-day confusion | Campus location/map or approved directions, entry requirements, venue access notes, help desk and event support contacts, FAQ, code of conduct and reporting route. Housing/transport booking is excluded unless the college actually provides it |
| **Announcements** | Make operational changes discoverable | Time, affected event/edition, authoring authority and superseding notice. Important event notices also appear on event detail and affected participant records; routine marketing should not bury them |
| **Results and recognition** | Publish approved outcomes credibly | Edition/event context, approved winners or outcomes, correction/version notice and contact for queries. Publish only permitted participant information; personal certificates remain private by default |
| **Edition archive** | Preserve history and prevent stale registration | Clearly labeled past edition summaries, public events, approved results and selected licensed media; no active registration action. Old edition links remain distinguishable from the current edition |
| **Policy and institutional information** | Explain participation and data use | College-approved privacy/participation/cancellation policies, accessibility/contact route and sponsor acknowledgements. Product drafting does not substitute for college policy review |

Sponsor acknowledgements and a small approved gallery can be sections; neither needs an independent product module at MVP. Merchandise commerce, livestream infrastructure, a social feed, a chatbot and a campus metaverse are not necessary to complete the festival journey.

### Public quality requirements

Pulse, Panel and Flux preserve the same facts, available actions and meaningful reading order. Flux has a readable static fallback; Panel protects copy from texture; Pulse retains a distinctive fest identity. Public reading works without an account. Forms, errors, touch targets, keyboard navigation and ordinary phone layouts remain usable in every theme. Core participant/staff work uses a stable functional presentation; switching the public theme must not disrupt a check-in duty or registration already in progress.

Dates use the festival's declared local time, with timezone shown where ambiguity matters. Cancelled/postponed events retain explanatory pages. Essential details cannot exist only in a poster, image, animation, downloadable rulebook or external social post.

## 3. Participant journey and registration rules

### Discovery through registration

1. Browse public events and compare commitments without signing in. Register only after the event is published, registration is open, and essential facts/policies are present.
2. Establish their participant identity through a later-designed access experience. FESTRONIX accepts students from Vardhaman and other recognized colleges/universities. Collect only needed details: name, reliable contact, institution and event-required eligibility information. Student-ID uploads are not required by default. Access recovery and mistaken/duplicate identity handling must exist before launch; the method/provider is deferred.
3. Review event facts, approved eligibility criteria, capacity unit, rules, withdrawal policy and any fee before submitting. Show clashes with their confirmed events at minimum; block an incompatible overlap only when that event's faculty-approved policy explicitly requires it.
4. Submit an individual entry or complete a team entry. Free registration may confirm immediately under capacity/eligibility rules. Paid registration follows the event's configured payment instructions and proof review below; show pending status clearly until approved. Confirmed entries receive edition/event, members where applicable, reference, current schedule and next steps. A notification failure does not undo confirmation; their participation area remains authoritative.
5. If capacity or deadline changed during submission, clearly explain why confirmation failed. Do not show confirmation until a place is secured. Repeated submission must not create duplicate confirmed entries. Draft entries do not reserve capacity in the recommended MVP. The approved event policy must state how pending paid entries, waitlist offers and their expiry affect available capacity.

### Team model — small but complete MVP behavior

- Each event declares either individual entry or team entry and a minimum/maximum size. Capacity is explicitly **participants** for individual events or **teams** for team events. Venue occupancy also accounts for maximum team members and staff; a team limit does not replace a room occupancy check.
- A captain creates a named team for one event and invites members. Each member accepts participation using their own identity; a captain cannot consent on someone else's behalf or silently add strangers. Do not publish an open directory of people's contact details.
- A participant can have only one active entry in that event, whether individual or in a team. The same person may join separate teams in different events. One captain per team; captain transfer needs the new captain's acceptance.
- Team draft shows missing acceptances and size requirements. The captain submits once all required members accept and the team meets the rules. Free entries may confirm immediately; paid entries need payment-proof approval. Capacity is checked under the approved event policy. A waitlist is optional per event and does not itself secure a place; any offer and expiry rule must be visible before joining it.
- Participants and teams may make allowed changes until the event's configured team-edit/change deadline. After that deadline, a substitution or other material team change requires authorized coordinator/faculty handling under the event's published late-substitution policy. During Live, the competitive roster cannot be changed.
- A member can request removal or withdraw their own participation; no person is trapped by a captain. If that makes a confirmed team invalid, mark it **Action required**, alert all members and the coordinator, and keep its one team slot until the faculty-set correction cutoff. If unresolved at cutoff, faculty cancels that entry and records why. No invalid team is silently admitted.
- Cancelling the entire team is a captain request reviewed by the coordinator, with notification to every member. Where the team has paid or is in a dispute, faculty owns the decision. No one can replace a confirmed roster simply by editing a team name.

### Registration and attendance are different facts

| Participant status | Meaning and permitted next step |
| --- | --- |
| Draft / awaiting team acceptance | Incomplete; no reserved place; may edit or abandon |
| `PAYMENT_VERIFICATION_PENDING` | Paid entry has submitted proof/reference and awaits authorized review; not confirmed admission; participant can see review status |
| Payment proof rejected / action required | Show the rejection reason and permitted re-upload/resubmission; new proof returns to `PAYMENT_VERIFICATION_PENDING`; payment amount/recovery and deadlines follow approved operating rules |
| Confirmed | Eligible entry with secured capacity under the published terms; show confirmation |
| Waitlisted | Event has enabled a waitlist and capacity is unavailable; no place is secured until an explicit offer is accepted under the published expiry rule |
| Action required | Previously confirmed entry has an unresolved roster/eligibility issue; show issue, owner and cutoff; do not count it as a free place until cancelled |
| Withdrawn | Participant/captain withdrawal completed under policy; preserve record and release capacity where allowed |
| Cancelled by organizer | Faculty-authorized event/entry cancellation with reason; preserve notice and any resolution obligations |

Do not invent a general “pending approval” queue for every free registration. Eligibility is self-declared against approved event rules and may be verified at check-in/attendance through a valid college-ID inspection by authorized event staff/coordinators. Attendance is recorded separately as not recorded, present or a documented correction. Registration, campus entry, eligibility verification and participation are different facts.

### Eligibility — U2 resolved as Modified Option B

FESTRONIX may accept students from Vardhaman and other recognized colleges/universities. An event may define its approved eligibility rules using institution type, restricted permitted colleges, academic year, department/branch and age or safety restrictions where genuinely required.

Under-18 college students may participate where institutional and event policy permits. Events with genuine safety or legal requirements may use stricter eligibility rules. General-public/non-student participation is disabled by default; faculty/admin approval is required to enable it for a specific event.

Event coordinators may propose settings only for their assigned events. Material eligibility rules, including a restriction or exception affecting who may enter, must be submitted for faculty approval with the event or revision. Show the approved rules and any check-in verification expectation before registration. Authorized event staff/coordinators may inspect a valid college ID at check-in or attendance when verification is needed. They do not collect ID uploads by default or retain/copy ID images as part of routine verification.

### Before, during and after attendance

- View current registrations, accepted teams, deadlines and a personal schedule. Show changed facts prominently and retain important notices. Recover a confirmation without asking a coordinator to share a whole roster.
- Withdraw an individual entry before the published cutoff; after the cutoff, request organizer help. Capacity can reopen only while registration is open and the approved admission rules allow it. Full events show full status; no hidden queue promises.
- Receive targeted confirmation and critical change notices. U8 adopts email plus an in-product notice record for MVP; communication provider remains open. Show failed delivery to organizers, allow resend and use approved contact escalation for urgent cases. Do not claim that a sent email proves receipt.
- Check in with an operator using a confirmation reference or identity lookup in MVP. A missing phone or unreachable connection must not automatically deny an otherwise valid participant; section 4 defines reconciliation.
- See provisional/final result status, submit an appeal within the event's approved window or a later factual-error query through the named channel, and download issued certificates when available. Workshops may complete with participation confirmation and no ranked result.
- Correcting a certificate name requires an attributable correction request and approval, not free editing of an already-issued document. Losing a link must not allow another participant to retrieve it.

### Results and certificates

U5 is resolved as Modified Option C with a 48-hour default. Assigned coordinators prepare an outcome list and evidence under approved event rules. Faculty approves provisional release and the event's published appeal window, resolves appeals/disqualification and authorizes final release. Default appeal window is 48 hours from notified provisional publication; event-specific variations require approval before registration. Expiry does not finalize disputed outcomes. A conflicted reviewer needs an independent faculty replacement. Hold only affected awards/certificates, preserve corrections and permit factual-error queries after finalization. Workshops need no ranked result. MVP supports manual winners/placements or participation outcomes, not a scoring engine. Faculty must confirm prize funding, fulfilment owner and delivery date before advertisement; record delivery/outstanding obligations manually.

U6 is resolved as Modified Option A. Each event may offer no certificates, winner certificates, eligible-attendee certificates or both; default is no promise until faculty approves entitlement and fulfilment responsibility. Use a simple issuance register and individually assigned private PDFs in MVP. Assigned coordinators prepare names, recipient/evidence lists and corrections; faculty approves eligibility, template/signatory, recipients and release. A team award records the team and each eligible member; a captain's check-in does not establish another member's attendance. Use individual attendance or faculty-approved equivalent evidence. Suggested delivery target is 14 calendar days after relevant attendance/outcome finalization, only published once faculty confirms capacity. Preserve issued/replaced/withdrawn history and a retrieval/reissue route. Automatic generation, public verification and bulk mailing remain Phase 2. Registration/payment alone does not earn a certificate.

### Free and paid registration — U1 resolved as Modified Option B

Some events are free and some are paid; there is **no general fest pass in MVP**. Free registrations may become `CONFIRMED` immediately, subject to the event's capacity and eligibility rules.

For paid events, the participant registers, pays using the payment method/instructions configured for that event, and uploads proof such as a screenshot plus a transaction/UTR/reference number. The registration becomes `PAYMENT_VERIFICATION_PENDING`. Payment submission or proof upload alone is not confirmed admission.

Only coordinators assigned to that specific event may review its proofs. Authorized faculty/admin users may review, override or audit verification. Record reviewer, time, decision and reason; faculty overrides remain attributable. Payment verification is distinct from event/result approval, so the rule requiring faculty approval of material event revisions does not prevent an assigned coordinator from verifying participant payments.

On approval, the registration becomes `CONFIRMED`. Invalid/rejected proof shows a clear reason and allows re-upload/resubmission, returning to `PAYMENT_VERIFICATION_PENDING`. Retain review history; participants see their own proof/status, and proofs are not public or visible to unrelated coordinators or check-in operators.

No payment gateway integration is required for MVP. Event fee, method and instructions must be configurable through bounded settings/CMS and reviewed before publication. Review must establish receipt against the designated payment records; a screenshot/reference is evidence for review, not an automatic assertion that funds arrived.

U1 settles this product model, not every financial operating detail. Paid pending-capacity/hold treatment, verification deadlines, duplicate proof/reference handling, authorized payment recipient, reconciliation, receipts, cancellation/refund responsibilities and participant disputes need explicit rules before paid registration launches. U4 now requires event-specific capacity and admission policies; proof retention remains subject to U7. No providers, architecture or user flows are chosen here.

### Admission and team policy — U4 resolved as Modified Option C

Each event has a faculty-approved, participant-visible admission and team policy. It may define participant/team capacity, registration deadline, optional waitlist, whether walk-ins are allowed, team-size minimum/maximum, team-edit/change deadline, late-substitution policy and schedule-clash behavior. Advance registration is the normal path. Waitlists are optional, and walk-ins are disabled by default.

Walk-ins may be enabled only for an approved event while registration/admission remains open and capacity permits. Confirmed registrations must never silently exceed capacity. The system warns a participant about schedule clashes at minimum. It may block an incompatible overlap only where the event explicitly configures the rule and faculty approves it. The published policy must explain any waitlist-offer expiry and how a pending payment-verification entry affects available capacity.

Only assigned coordinators may propose/configure these policies for their events. Material capacity, admission and team-policy changes require faculty approval before publication. Authorized faculty/admin may override a setting when necessary; later technical design must provide an attributable audit trail. This does not settle the remaining operating details for withdrawals, waitlist offer timing, payments or staff exception documentation.

### Resolved operating defaults — U7–U11

**U7 — Privacy and retention, Modified Option B:** Public results default to team names or participant references. Publish individual names/institution only under faculty-approved policy and required participant permission; media permission is separate. Contact details, rosters, proofs and certificates stay private, with no public participant directory. Preserve edition facts/aggregate counts independently from private records. Faculty appoints a data steward, approves exports/publication, handles access/correction/removal requests and retention holds. Coordinators access only necessary assigned-event records, reconcile temporary exports and route requests; they do not set retention or authorize mass deletion.

Proposed retention defaults require faculty confirmation or replacement before live collection: ordinary registration/contact/attendance records 12 months after edition closeout; temporary roster exports within 30 days of reconciliation; uploaded proof images within 90 days after financial reconciliation and related dispute closure; minimal certificate issuance/outcome evidence three years after issue. These are not legal retention determinations. Faculty must separately specify finance/account/audit records and backup disposal. Document purpose/review date for exceptions; retain only restricted necessary evidence for unresolved cases. Explain private-access expiry and maintain a retrieval/reissue route; deletion must not silently invalidate certificates or outstanding obligations.

**U8 — Communications/support, Modified Option A:** Email plus persistent participant notices, event/edition announcements and a named help route are MVP. Show failed delivery to staff, allow resend/follow-up and keep participant records authoritative. A simple query owner/status and handover list suffice; no SMS, messaging groups or full ticketing platform. Faculty controls official channels, coverage, support owner/backup and emergency/changed-commitment notices. Assigned coordinators handle event queries and approved factual reminders; they escalate disputes, safety, refunds and exceptions. Core Team may triage within assigned scope with minimum data. Propose replies within two working days only after staffing confirmation; publish phone/duty-faculty coverage during fest hours and next coverage outside those hours. No 24/7 or guaranteed receipt claim.

**U9 — Formats/scale, Modified Option A:** MVP supports individual/team competitions, hackathons and attendance-based workshops/talks, one registration per event with one or more published sessions. Manual judging and operational rounds may occur outside the platform; coordinators submit outcome proposals for faculty approval. No scoring engine, bracket generator, round-specific eligibility or independently bookable batches. Genuinely separate batches can be separate faculty-approved listings with explicit capacity/names; faculty checks shared equipment/venue conflicts. Faculty approves formats and operating scale, while coordinators manage only assigned events. Actual event/participant/team/session/venue counts, peak arrivals and staff/certificate workload require confirmation before implementation sizing; no arbitrary platform cap or throughput promise is made. Specialized booking/judging is later scope.

**U10 — Editions/archives, Modified Option A:** Only one edition accepts registrations in MVP. Next-edition preparation remains private; selective template copying, fresh assignments and reapproval precede owner activation. Old admissions must be closed and new readiness checked. Old faculty-led closeout, results, disputes, prizes and certificate access may continue while the new edition is active, through specifically authorized roles; student access never carries forward automatically. Participants/payments remain attached to the original edition. Archive URLs and approved facts persist, normally read-only; a named faculty steward makes reasoned historical corrections. A maintained accessible archive may replace retired theme effects without changing facts. Archiving follows U7 retention and does not promise permanent private records. Public upcoming teasers and concurrent edition bookings are outside MVP.

**U11 — Maintenance, Modified Option A with B resourcing fallback:** U3's faculty custodians retain institutional ownership. Appoint a faculty product/operations lead, accountable technical maintainer/backup and college budget approver. Prefer college IT if it accepts; otherwise use a contracted maintainer under the same governance. Student help is supervised and never the only recovery path. Ordinary yearly administration belongs in approved controls/handover guidance; defects, updates, accessibility/security review, recovery exercises and renewals still need technical ownership. Require pre-edition readiness, event-day escalation, annual budget/renewal review and institutional custody of accounts/assets/documentation. Maintenance access does not automatically grant result approval or unrestricted exports. Names, support coverage, budget and acceptance/agreement are launch prerequisites, not assumed commitments or vendor selections.

U5–U11 behaviors are resolved under the owner's authorization. Faculty confirmations listed in `OWNER_DECISIONS.md` remain prerequisites for the affected promises, live collection or launch. This does not approve institutional policy or change U1–U4.

## 4. Event coordinator workflow

| Step | Coordinator work | Review / guardrail / outcome |
| --- | --- | --- |
| Assignment | Accept an event/edition responsibility and see scope/expiry, faculty approver and backup coordinator | Faculty creates the assignment. A coordinator can create events only within a faculty-assigned organizing scope; the resulting draft remains assigned to that scope. No self-assigned global ownership |
| Create and edit | Supply title/category, purpose/format, proposed eligibility, entry type/team bounds, capacity unit/limit, registration dates, waitlist/walk-in policy, team-change/substitution policy, schedule-clash behavior, event sessions/venues, rules, judging/prizes, equipment, contacts and certificate basis | Eligibility can define institution type, restricted colleges, academic year, department/branch and genuine age/safety restrictions. Structured completeness checks; no arbitrary forms/scripts. Material admission/team settings require faculty approval; optional fields remain optional for event types that do not need them |
| Preview | Review participant-facing content using the chosen theme and phone/desktop preview | Private preview cannot register real participants or send notices. Draft/revision status is conspicuous |
| Submit | Send a stable version to the assigned faculty reviewer with any budget/resource/prize concerns | Submission identifies the version. A later material edit requires withdrawal/revision and a new submission; approval cannot accidentally apply to unseen changes |
| Resolve review | Respond to specific comments, amend and resubmit; withdraw a proposal if needed | Changes Requested stays editable; rejection includes a reason. Reviewer sees what changed and prior decisions |
| Approved and published | Check the approved version and ask faculty to publish; scheduled release is Phase 2 | Approval alone does not publish. Publication readiness includes rules, venue/schedule, contact, admission and policy completeness |
| Registrations | Track confirmed, pending and waitlisted entries, team completeness, capacity and eligibility issues; handle scoped correction requests | No deleting unwanted registrants to free space or silently exceeding confirmed capacity. Faculty authorizes disqualification/cancellation, eligibility exceptions, material team changes after deadline and non-student participation with reasons and notification |
| Payment verification | Review pending proofs/reference numbers only for assigned events; approve or reject with a reason; review resubmitted proof | Approval confirms the registration under the approved capacity/eligibility policy. Faculty/admin may review, override or audit; unrelated coordinators and operators cannot inspect proofs |
| Prepare event day | Confirm venue/resources, roster, operator shifts, escalation contact and check-in window; issue approved instructions | Faculty/Core coordinate cross-event conflicts. Operators receive only assigned duty information |
| Run | Start/finish operations, monitor check-in, record attendance exceptions and alert duty faculty to delays/safety issues | No competitive rule/roster rewriting once Live. Duty faculty controls emergency changes and cancellation |
| Results | Prepare outcomes with judging evidence and attendance eligibility; submit to faculty | Draft outcomes are private. Faculty approval and a correction/dispute policy precede final publication |
| Complete | Resolve corrections, reconcile attendance, submit certificate list where promised and a short closure note | Faculty confirms completion. Unresolved complaints, promised certificates or cancellation obligations remain visible and block closure unless an accountable follow-up is recorded |

### Event-day exceptions

- The same person checking in twice should show already recorded attendance, not count twice. Wrong event/edition, cancelled entry and unresolved team entry get distinct explanations.
- Operators request undo/correction; a coordinator records a reason when correcting attendance and faculty reviews disputed cases. Never overwrite history invisibly.
- For poor connectivity, MVP uses a faculty-approved limited roster and manual record with operator/time/event context, later reconciled by the coordinator. Protect and dispose of temporary copies under college policy. Automated offline scanning and synchronization are Phase 2, not an implied MVP promise.
- Walk-ins are allowed only if the event has an approved walk-in policy, registration/admission remains open and capacity permits. Before Live, a coordinator can assist a participant through the ordinary registration rules. An operator cannot create an entry or override capacity. During Live, only attendance for existing eligible entries is allowed in MVP. Where eligibility verification is required, authorized event staff/coordinators inspect a valid college ID; routine ID upload, copying or retention is not part of this check.
- If a coordinator is unavailable, faculty reassigns the event to an accepted backup. Their departure does not leave approvals, announcements or roster access dependent on a personal account.

## 5. Faculty and platform administration

Faculty need an edition operating view organized around decisions and exceptions: waiting reviews, missing event facts, conflicts, approaching deadlines, registration issues, unanswered participant cases, urgent notices and incomplete closures. Counts should link to the relevant work; decorative analytics are unnecessary.

| Administration area | Faculty capability without code | Owner boundary |
| --- | --- | --- |
| Events and approvals | Assign owners/reviewers; create or revise proposals; compare submitted changes; request changes/reject/approve; approve material eligibility rules or event-specific non-student participation; publish approved versions; pause admissions; cancel with a resolution plan | A different faculty reviewer approves material work authored by faculty themselves |
| Coordinators and operators | Invite/assign, set scope and expiry, accept nominations, revoke, replace absent coordinators, confirm shifts | Faculty Owners manage faculty-owner, faculty-admin, approver, Core Team and coordinator appointments; student leads cannot elevate their own authority |
| Fest content | Draft/review/publish bounded content and previews; fix supported content issues; restore an earlier editorial version | Institutional identity/policy changes require the designated college owner |
| Themes | Preview all three themes with actual edition content; flag omissions or unreadability; request a publication | Platform Owner publishes/rolls back public themes |
| Sponsors | Maintain approved logos, names, links, tiers/order, edition term and acknowledgement copy; retire expired sponsorship | No assumption that last year's financial commitment or logo rights carry forward |
| Venues and resources | Maintain names/directions, occupancy guidance, access notes, availability and assigned sessions | Capacity/resource conflicts need resolution or an explicit faculty exception; do not silently overbook |
| Schedules | Review date/time/venue conflicts, session durations and equipment constraints; approve revisions; communicate changes | Schedule is another view of approved event sessions, not independent content |
| Announcements | Publish targeted edition/event notices, identify urgent items, expire stale notices, view delivery failures and issue corrections | Coordinators may send approved reminder templates to their event's participants using current approved facts. New messaging or changed commitments require faculty review; duty faculty may publish an emergency notice immediately with attribution |
| Registrations and support | Resolve duplicate identities, invalid entries, eligibility exceptions, waitlist/capacity issues, withdrawals, substitution requests, lost access and disputes; authorize scoped exports and necessary admission-policy overrides | Minimal necessary personal data; every override has a reason, affected participants are informed, and later technical design records an audit trail |
| Payment administration | Configure/review event payment instructions; review, override or audit coordinator verification; monitor unresolved proof and reconciliation issues | Proofs remain private; record approval/rejection/override and reason. Financial responsibility and refund policy must be explicitly assigned before paid launch |
| Results and certificates | Review outcome/recipient lists, resolve appeals, release, correct, replace or withdraw with history | No self-approved competitive outcomes; participant-publication policy applies |
| Future editions | Prepare a new edition from selected reusable configuration, review carry-over and nominate new teams | Platform Owner activates/archive-transitions editions and publishes themes |
| Continuity | Maintain an operating checklist, escalation contacts, outstanding work and staff handover notes | Named college product owner and technical maintenance contact remain necessary |

MVP supports basic search/filter, bulk review of selected records and explicit batch confirmation only where safe. Bulk actions must show affected edition/events/people and partial failures. Do not make one-click mass deletion, mass disqualification or arbitrary role grants normal administration.

## 6. Event lifecycle

Use a clear event lifecycle while keeping **registration availability** and **pending revisions** separate. Publication is about what visitors can see; registration is about accepting entries; Live is about event operations. “Full” is not an event lifecycle state.

| Event state | Meaning / allowed next states | Responsible actor / exit condition |
| --- | --- | --- |
| **Draft** | Private proposal; → In Review; may be abandoned | Assigned coordinator or faculty author; required facts complete before submission |
| **In Review** | Specific submitted version awaits decision; → Approved, Changes Requested, Rejected; author may withdraw → Draft | Assigned independent faculty reviewer decides with reasons |
| **Changes Requested** | Editable proposal with actionable feedback; → In Review or withdrawn Draft | Author resubmits a revised version |
| **Rejected** | Proposal not accepted; remains private and attributable | Faculty may reopen → Draft with a reason; rejection is not cancellation of an already published event |
| **Approved** | A version is accepted but not yet public; → Published or revised Draft/In Review | Faculty publishes only the approved version after readiness check; never auto-publish merely on approval |
| **Published** | Public upcoming event; registration may be scheduled/open/full/closed/paused; → Live or Cancelled | Coordinator starts operations when ready, under approved timing; duty faculty handles exceptions |
| **Live** | Event-day participation underway; → Ended or Cancelled | Assigned coordinator ends operations; rule/admission constraints apply throughout |
| **Ended** | Attendance has stopped; results, disputes, certificates and closeout may still be pending; → Completed | Faculty accepts coordinator closeout only after required outcomes/obligations are resolved or an explicit follow-up owner/date is recorded |
| **Completed** | Operational closeout accepted; → Archived | Faculty/Owner archives with edition policy; later corrections use a recorded amendment, not silent reopening |
| **Cancelled** | Event cannot proceed; published events retain a notice and participant resolution work | Faculty cancels, records reason and communication; → Archived only after obligations are resolved or tracked with owner/date. A mistaken cancellation requires faculty-reviewed reinstatement and a new notice |
| **Archived** | Historical edition/event, closed to new entries and routine editing | Only faculty/Owner-approved historical corrections with reason; no ordinary reactivation or reuse as next year's event |

Postponement is an announced disruption while Published, not an ambiguous permanent state. Pause registration, show “Postponed — new date pending”, retain prior date/history, and set a faculty owner and decision deadline. Approved rescheduling restores a known date and appropriate admission state; otherwise cancel. Do not leave an event indefinitely postponed with silent obligations.

Registration availability has these user-visible conditions: **Not open yet**, **Open**, **Full**, **Paused**, **Closed**, or **Unavailable because cancelled/archived**. Opening requires a Published event and approved opening/deadline values. Full is derived from effective occupied capacity, including unresolved confirmed team slots. Paused is a recorded staff action; reopening cannot bypass cancellation, expiry or approved capacity. Deadlines close admissions without auto-starting, ending or completing the event. Staff are alerted when scheduled start/end passes without an operational update.

Pending material revision: the last published approved version remains visible while a proposed replacement is reviewed. Show the author and reviewer both versions. Approval applies only to the submitted revision; publishing it is a distinct deliberate action. If the old facts are unsafe or misleading, pause registration and post an immediate faculty notice instead of leaving a harmful version apparently current.

## 7. Editing after approval

“Immediate” means an authorized actor can publish a narrow safe correction with a recorded reason. It does not mean unrestricted editing. Changes to event terms after people register require both reapproval and participant impact handling. The same edit classification applies to shared venue/schedule changes that affect approved events.

| Field/change | Approved or Published, before Live | While Live / after participation begins |
| --- | --- | --- |
| Spelling, punctuation, broken formatting, alternative text | Assigned coordinator may publish immediately only if meaning and commitments are unchanged; log correction | Same narrow correction allowed; preserve original terms |
| Description | Cosmetic corrections immediate; changes to scope, promised experience, equipment or commitments require reapproval | Correct factual explanation with faculty review; do not retrospectively change promised obligations |
| Venue / delivery location | Faculty reapproval, availability/occupancy/access check and targeted notice; pause admission if unresolved | Routine relocation prohibited. Duty faculty may make a safety/availability relocation with reason, new directions and urgent notice; record promptly for review |
| Date, start/end time, session schedule | Reapproval; conflict review; targeted notice; offer withdrawal where participant commitment changes | Do not rewrite elapsed schedule. Duty faculty may record delay, interruption, early ending or emergency reschedule; preserve original and actual facts |
| Team minimum/maximum, team-edit/change deadline, late-substitution policy or individual/team format | Reapproval before entries exist; once confirmed entries exist, routine change is blocked. Faculty exception must preserve accepted eligibility or offer an explicit alternative/withdrawal | Prohibited for the active competition; no retrospective roster or format changes |
| Eligibility, including permitted institutions, academic year, department/branch, age/safety restrictions or non-student participation | Faculty approval before publication; no retroactive disqualification through a new rule. Faculty approval is required to enable a specific event for non-students. An exception needs impact review and affected participant resolution | Prohibited as a new admission/competitive rule. Enforcement of already published rules, including an authorized ID check, remains possible with documented decision |
| Registration capacity, waitlist or walk-in availability | Increase, enabling or disabling a waitlist/walk-in needs reapproval and a resource check. Decrease requires reapproval and cannot fall below occupied confirmed/action-required entries | No new competitive admission capacity changes. Emergency safety limits may pause/cancel activity with faculty-led resolution; do not silently remove registrations or silently admit above capacity |
| Registration deadline/opening time or schedule-clash behavior | Reapproval and notice where relevant. Closing earlier after entries is exceptional; an emergency pause can be immediate. Blocking an overlap requires explicit approved event policy | Cannot reopen to add competitors in MVP. Existing eligible participants may still check in under the approved late-arrival policy |
| Prize pool / prize distribution | Reapproval and commitment check; after registration, reduction is blocked as routine editing and requires faculty-led participant remedy/notice | Promised prizes cannot be reduced by editing. Record a fulfilment dispute or exceptional resolution separately |
| Rules, judging criteria, tie-breaks, certificate basis | Reapproval; show effective version. Material changes after registration require fairness review and explicit participant notice/reconfirmation if obligations change | Prohibited retroactive competitive changes. Clarifications must retain meaning, be faculty approved and communicated consistently; unresolved fairness issues may suspend the event |
| Emergency contact / approved directions correction | Faculty or designated coordinator may correct verified contact information immediately and record it | Allowed immediately; avoid exposing personal contacts without authorization |
| Registration pause | Coordinator or faculty may pause immediately with reason; public explanation where relevant; alert faculty | Pause new admission immediately; operator cannot override it |
| Results / attendance / certificate recipient facts | Use their dedicated review/correction workflow, never an event-description edit | Faculty approval for result/certificate correction; attendance correction follows section 4; retain superseded record |

For every material published change, record the previous/new facts, affected entries, approving faculty, publication time and required notices/remedies. Registered people must be able to find the updated facts in their own record. Reconfirmation is required for newly imposed commitments, not a typo. If a participant declines a material change, provide the approved withdrawal/refund route; fee-bearing remedy policy is unresolved and gates paid launch.

Emergency authority is narrow: duty faculty may pause, relocate, delay, suspend or cancel to address actual safety or venue failure without waiting for the ordinary review queue. Record reason, affected audience, actual time and follow-up review owner. This authority cannot approve winners, rewrite judging rules or grant personal access. Immediate protective action must not be delayed solely because another approver is unavailable.

## 8. Annual edition lifecycle and handover

Recommended edition states: **Preparation → Ready → Active → Closed → Archived**, with a cancelled-edition path preserving notices and outstanding work. Ready means publication checks passed, not that registration is already open. Exactly one edition is the default current public edition. Another may be prepared privately while prior participants still access their records.

### FESTRONIX 2027 → FESTRONIX 2028

1. Faculty requests or prepares the next edition; Platform Owner confirms its identity, year/label and dates. A new edition must not overwrite or rename the old one into the new year. A year may have one named edition by default; unusual multiple-edition needs require product review.
2. Offer a selective carry-forward preview showing what will be copied, reset or omitted. Copy useful configuration into editable **drafts**, never approved/published status.

| Carry forward as a reviewed starting point | Reset for the next edition | Never carry forward as active data/access |
| --- | --- | --- |
| Approved content templates; event categories; reusable rule templates; venue directory with capacity/access recheck; contact-role placeholders; bounded theme settings and licensed reusable assets; operating checklist | Edition label/lockup/dates; event session dates and registration windows; capacity, waitlist/walk-in, team-change and schedule-clash settings; prizes/approved eligibility commitments; payment recipient/instructions; emergency/help contacts; schedule; approvals; sponsor terms; announcements; theme publication decision | Registrations, attendance, participant/team lists, student-ID documents/images, payment proofs/verification/refunds, results, certificate entitlements, disputes, coordinator/operator assignments and student access |

3. Optionally copy selected old events as new private proposals, with provenance and a checklist of fields requiring confirmation. No event is ready merely because last year used it. Do not publish old sponsors, personnel, dates or prize promises automatically.
4. Faculty appoints the new Core Team, coordinators, reviewers and operators with fresh scopes and expiry. Existing faculty may be assigned deliberately; no implicit global access to the new edition. Previous student assignments end at their recorded expiry or handover revocation, whichever occurs first.
5. Previous-edition unresolved work is handed to faculty. If a former coordinator is needed for a specific issue, faculty grants a short, named scope with an expiry and reason; it does not reactivate their whole old role or grant new-edition access.
6. Preview the next edition privately in all themes, including incomplete/long event content and mobile. Previews do not send notices, accept registrations or mix test people with real participant records. Check required policies, confirmed dates, contacts, venue clashes, event publication readiness, student assignments and theme availability.
7. Mark Ready after faculty review. Platform Owner sees the current and proposed edition, public destination change, registration consequences and any unfinished old-edition obligations before activating. Confirm explicitly; record actor/time. Faculty may publish an approved upcoming-edition announcement on the current site without exposing a draft edition.
8. Activation changes the default public edition and its approved theme/content together. Old links remain edition-specific. Prior participants retain access to their old confirmations, outcomes and certificates. Existing in-progress submissions remain bound to their original edition and are rechecked against its admission status; they must never migrate into the new edition.
9. U10 adopts no simultaneous open registration across annual editions in MVP. Close the previous edition's admissions before activating the next. Old result/support/certificate work may continue in Closed under faculty responsibility. Resolve or assign its outstanding obligations before archival.
10. Archive the old edition as a historical public record with private participant access governed by retention policy. Archiving ends routine edits and student operations; it does not delete history or make personal records public. Corrections remain attributed amendments.

If activation was a mistake, the Owner can restore the prior default edition after reviewing current admissions and notices. Any valid entries already created in the new edition stay there and require explicit handling; activation rollback is never a deletion or movement of participants. Cancelling an entire edition pauses admissions, marks affected events appropriately and creates a communication/obligation checklist before archival.

Participant identity may persist across years, but registering for 2027 never enrolls someone in 2028. Historic public content, private participant records and temporary exported rosters have different retention needs. College policy must specify retention, correction/removal requests and who owns cleanup; do not interpret preservation of festival history as indefinite publication of personal information.

## 9. Theme Manager product behavior

Theme selection is an edition's public presentation choice, not three sites or three sets of events. Platform Owner publishes; faculty/Core may preview and propose. Participants are not asked to choose a different theme to complete a task. Administrative operations remain stable across theme changes.

| Action | Product behavior |
| --- | --- |
| Select a draft theme | Choose Pulse, Panel or Flux for a named edition. Show current published choice, draft choice, supported content and any missing required assets. Editing a draft does not affect visitors |
| Preview | Use the same approved edition facts in each theme. Show desktop/phone, long titles, empty categories, closed/cancelled events and reduced-motion/static presentation. Private event drafts stay confined to an authorized preview context |
| Review readiness | Check readable identity/date/location/action, all event metadata, navigation, accessible fallback, approved/licensed assets and required content coverage. If a theme cannot render required information, it cannot be published |
| Publish | Owner reviews edition, exact presentation version and differences, then confirms. Publish the theme and its approved presentation settings as a coherent version; no partial asset/settings state. Display who published and when |
| Switch during an edition | Allowed by Owner with impact confirmation; recommend no discretionary switch during registration peaks or event-day operations. Emergency rollback remains available. Existing registrations, forms, URLs, attendance and results remain intact |
| Roll back | Preview and restore a previously published presentation version for that edition, with reason. Rollback changes appearance/settings only, never reverts later event facts, registration status or announcements |
| Recover from unavailable assets/effects | Present readable content and a static fallback. Visitors must not receive a blank stage or blocked registration because an effect failed |

A presentation version contains only the bounded appearance choices and assets that belong to that theme. It must not bundle business facts into a rollback. Archive pages preserve their edition identity and historical facts; retaining the historical rendering forever is not promised. If a retired theme becomes unusable, Owner may apply a maintained compatible presentation to the archive with history recorded, without rewriting festival outcomes.

All three theme choices are part of the intended MVP public product. Advanced interactions can arrive later; a coherent accessible static Flux is preferable to making content depend on complex 3D. The final implementation and performance approach remain undecided.

## 10. Bounded CMS scope

Faculty should eventually control the following content through established templates and validations. “Eventually” includes Phase 2 items explicitly labeled below; it is not unrestricted layout editing.

| Content family | Editable without developers | Limits / publication rule |
| --- | --- | --- |
| Edition identity | Display label such as `2026`, `2027` or `2K27`; separately configured edition/year logo lockup; fest dates, tagline, venue summary, introduction and approved contacts | Core FESTRONIX brand/logo remains year independent; edition/year presentation changes without editing the core logo or underlying edition history; date changes follow participant-impact review |
| Homepage sections | Intro, featured approved events, sponsor acknowledgements, FAQ, practical information, bounded approved media | Fixed section families; allow approved optional sections to be shown/hidden and ordered within defined limits. Essential facts/actions/notices cannot be removed |
| Events | Structured fields listed in section 4, including event eligibility settings; approved imagery/rule attachments, category and ordering | Eligibility covers institution type, restricted colleges, academic year, department/branch and genuine age/safety requirements. Faculty approves material rules and event-specific non-student participation; no duplicate schedule or status prose maintained separately |
| Admission, team and payment settings | Event free/paid status, fee, approved payment method/instructions, capacity, deadline/pause state, optional waitlist, approved walk-ins, team-change/substitution and schedule-clash behavior | Material policy changes require faculty approval; publication must not silently alter registered participants' commitments. No unrestricted financial settings or automatic proof approval |
| Venues and sessions | Venue labels, directions, access notes, availability, session allocation | Review conflicts, occupancy and effects on already published events; notify when locations change |
| Sponsors | Logo/name/link, tier/order, acknowledgement copy, applicable edition and expiry | Rights/commitment confirmation; no scripts, trackers or sponsor-controlled page access |
| Announcements | Title/body, audience, urgency, effective/expiry dates and superseding notice | Target previews and audience counts before sending; preserve important correction history |
| FAQs and participation policies | FAQ entries and links to college-approved terms, conduct, eligibility/cancellation guidance | Policy changes are reviewed; no coordinator rewriting of institutional commitments |
| Media | Approved images, poster fallback, captions, alternative text, credits and allowed crops | Recommended file limits/formats, rights/consent check and accessible text alternatives. No arbitrary video upload library at MVP |
| Results/certificates | Event appeal window, certificate entitlement/evidence basis, approved outcomes, release status, assigned PDF uploads and replacement notices | Faculty approves material rules, signatory and releases; dedicated workflow, not free-form content; certificates remain private under U6 |
| Theme settings | Approved theme assets and a small set of supported presentation options | No custom CSS/HTML/scripts, arbitrary fonts, unlimited effects or free canvas; Owner publishes theme versions |
| Archive summaries | Historic summary, approved photo selection, corrections and links | Routine history is read-only; reasoned faculty amendment for errors |

CMS fundamentals in MVP: draft, preview, clear review/publication state, validation, published-version awareness and attributable change history. Restore editorial content as a new revision; a content undo cannot undo registrations, notices already sent or participant commitments. Known placeholders, expired contacts and missing required facts should block relevant publication, not silently disappear. Support descriptive errors that faculty can resolve themselves.

**Owner-confirmed reusable-admin requirement:** Ordinary annual operation must not require a developer. Faculty/admin must eventually change edition display details (`2026`, `2027`, `2K27`), logo/edition lockup, dates, tagline, theme, sponsors, contacts, hero content, featured events, FAQs, registration state and announcements through bounded settings/CMS. Theme preview/publication follows section 9's proposed authority rules; exact personnel remain pending under U3. A separately configurable edition/year lockup accompanies the year-independent core brand; changing its display must not rename or overwrite a historical edition.

Deliberately exclude arbitrary page builders, custom registration-form designers, injected embeds/scripts, raw data editors, hidden business-rule editors, unlimited navigation depth and per-theme copies of content. New page types or business workflows require a later product change. Safe form flexibility is a curated list of necessary event questions with clear collection purpose; unrestricted sensitive uploads are outside MVP. Payment-proof uploads are the explicit bounded exception adopted in U1, with private access and retention policy to be defined.

## 11. MVP, Phase 2 and optional scope

### MVP — enough to operate one edition and hand over to the next

- One platform, edition history, private next-edition preparation, selective configuration copy, deliberate activation/archive and expiring student assignments.
- Faculty-owner continuity with one Primary and one Backup Faculty Owner at minimum while active; edition-scoped Faculty Approvers; Core Team operational support; event-scoped coordinators; independent approval, replacement/revocation and attributable sensitive actions. Account access/recovery must work, but its solution is not selected here.
- Public home, directory, event details, schedule, practical help/policies, announcements, approved outcomes and edition archive. A bounded sponsor section; no separate sponsor portal.
- Pulse/Panel/Flux publication, preview, rollback and usable static/low-motion paths. One content and business-data set across all themes.
- Assigned event authoring, review/revision/publishing, admission controls, operational lifecycle, cancellation and post-approval edit rules.
- Free and paid individual/accepted-team registration, explicit capacity/deadline handling, optional per-event waitlists, approved walk-ins, team-edit/substitution policy, schedule-clash warnings or approved blocking, withdrawal and assisted correction, confirmations and personal participation records. Event-configured payment instructions, screenshot/proof plus transaction/UTR/reference submission, `PAYMENT_VERIFICATION_PENDING`, assigned-event coordinator review, faculty/admin review/override/audit, confirmation on approval and rejection/resubmission are MVP. No general fest pass or required payment gateway integration. Eligible participants are students from Vardhaman and recognized colleges/universities under approved event-specific rules; no default ID upload. Selective applications are excluded.
- Explicit manual-payment operating rules and responsibility for verification, reconciliation, duplicate/invalid proof, deadlines and cancellation/refund handling before paid launch; pending-payment capacity treatment, waitlist offer timing/expiry and retention decisions require published event rules and remaining policy decisions.
- Manual attendance with narrowly scoped operator duties, duplicate detection, correction history and a controlled manual fallback for connectivity failure.
- Coordinator outcome submission, faculty-approved provisional/final results, event-specific appeals with a 48-hour default, affected-award holds, participation-only closure and private certificate issuance/correction register with approved individual PDFs only where promised.
- Faculty scheduling/venue coordination, content/sponsor maintenance, targeted critical notices, delivery-failure handling, minimal scoped roster exports and an ordinary support/escalation record. No full help-desk platform.
- Edition readiness and closeout checklists, activity history, simple operating counts and an administrator handover guide. College-approved data handling and cancellation policies before live registration.

### Phase 2 — only after core operation proves reliable

- Optional payment gateway integration and additional financial automation after manual paid registration is dependable. Basic reconciliation and cancellation/refund responsibility already belong to the paid MVP; their operating rules still need agreement.
- QR-assisted check-in and QR-specific device controls; keep manual lookup. Ordinary staff access expiry/revocation is already MVP. Offline synchronization requires its own conflict and privacy review.
- Automatic certificate generation from approved templates/recipient lists, public certificate verification if approved, and controlled bulk release.
- Selective application/review event types, structured multi-round judging and independently bookable repeated batches only if actual events require them.
- More capable media/archive management, scheduled content publication, reusable notification templates and richer operational reporting based on observed needs.
- Additional mobile/calendar conveniences, such as personal calendar export, when core schedules and change notices are dependable.

### Optional / future — no implied commitment

Merchandise sales, accommodation/transport booking, sponsor self-service, participant chat, social profiles, points/badges, AI recommendations, native mobile apps, elaborate interactive campus worlds, livestream hosting, external competition-platform integration and multilingual publishing. Each needs evidence of demand, an operating owner and a maintenance case. Do not add a feature solely because a reference website includes it.

### MVP readiness scenarios for later planning review

These are product acceptance scenarios, not implementation tests or screen designs:

1. A coordinator tries to access an unassigned event and is unable to manage it; faculty can reassign it without losing history.
2. A team confirms as the last available place is taken: only one valid entry succeeds and the unsuccessful team receives a clear explanation.
3. A venue changes after confirmation: faculty approval, current schedule, notice and participant record all agree; old facts remain traceable.
4. A volunteer records attendance twice or at the wrong event: the product distinguishes duplicate/mismatch and supports a reasoned correction.
5. A result is challenged after publication: affected certificate release can be held; the corrected result supersedes rather than erases the original.
6. A theme is published and rolled back during an unfinished registration: participant facts and selected event/edition remain unchanged.
7. The next edition is activated while old certificates are still accessible: history is retained, old students have no inherited staff access, and new registration belongs only to the new edition.
8. An event or edition is cancelled: admission stops, participants see a clear notice and accountable outstanding obligations remain visible.

## 12. Risks and challenged assumptions

| Risk / weak assumption | Product response | Residual decision or consequence |
| --- | --- | --- |
| “Build once” means no maintenance ever | Bound faculty tasks, maintain templates and an operating guide, name college and technical owners | Annual maintenance/support ownership is a launch prerequisite |
| One faculty owner becomes unavailable | U3 requires Primary and Backup Faculty Owners, no hardcoded owner email, recorded handover and owner-managed staff appointments | Keep at least two active faculty custodians and confirm their availability each edition |
| Core Team becomes a second super-admin | Give coordination and draft ownership, aggregate information and nomination ability | Faculty retains approvals, exceptions and participant exports |
| All changes need approval, creating event-day delay | Immediate cosmetic correction and admission pause; narrow duty-faculty emergency powers | Name a duty faculty contact and backup before events go Live |
| Approval is a one-time checkbox | Version-specific approval and deliberate publication of revisions | Terms accepted by participants remain traceable |
| Event time passing means completion | Separate Ended from Completed and track results, disputes and certificate obligations | Faculty must actually perform closeout |
| Teams are just captain-entered names | Require member acceptance, locked confirmed rosters and scoped correction | Adds necessary coordination work; large/complex team workflows are deferred |
| Certificates are automatically earned by registering | Explicit event policy and attendance/outcome evidence, approved recipients and corrections | College must decide eligibility, signatory and fulfilment owner |
| QR is proof of eligibility and solves check-in | Keep admission and attendance separate; start with controlled lookup and manual fallback | QR adds convenience later, not independent authority |
| Themes cause three implementations of the business | Preserve common capabilities/facts and one publishing workflow; check parity | Each theme still incurs visual maintenance; limit configuration knobs |
| Theme rollback restores the whole fest | Roll back only presentation version; retain newer facts/notices | Content correction and edition activation have separate workflows |
| Capacity, waitlists, walk-ins or team changes are altered informally | Require approved per-event policy, capacity/resource checks, participant notice and future audit trail; never silently exceed confirmed capacity | Expected venue capacities, waitlist offer/expiry and crowd policy need operational ownership |
| Uploaded payment proof is mistaken for confirmed payment/admission | U1 explicitly adopts manual verification: pending status, assigned-event reviewers, faculty oversight, clear rejection/resubmission and attributable decisions | Define pending-capacity treatment, verification deadlines, duplicate proof/reference checks, reconciliation and refund responsibility before paid launch |
| Public results expose private participant data | Publish only approved fields and handle correction/removal requests | College approval of publication/retention policy required |
| Sponsors and volunteers automatically carry over | Confirm sponsors/rights and create fresh assignments each edition | Renewal and handover checklist is essential |
| Exported sheets become the real system | Scoped justified exports; reconcile offline records and dispose of temporary copies under policy | Faculty training and accountability remain necessary |
| Eligibility checks become unnecessary document collection | U2 uses self-declared eligibility and limited valid-college-ID inspection at check-in/attendance only when needed | Faculty must approve material eligibility and any non-student event; U7 still determines retention/public-name policy |
| A polished hero proves good UX | Prioritize event facts, deadlines, actions and phone usability; make effects optional | Visual implementation must be reviewed separately |
| More dashboards improve operations | Show work queues, unresolved cases and essential counts first | Advanced analytics needs a demonstrated decision it will support |

Missing workflows now included: coordinator absence/reassignment; access expiry; duplicate/invalid registrations; team-member consent and withdrawal; late/failed attendance recording; postponed/cancelled events; conflicting schedules/venue limits; failed critical notifications; result appeals; certificate correction/withdrawal; mistaken edition activation; historical amendments; and outstanding obligations at closeout.

## 13. Recommended decisions and unresolved policy register

### Recommended baseline for review

**R1 (updated after U3):** Keep operational role families with one Primary Faculty Owner and one Backup Faculty Owner at minimum while active, edition-scoped Faculty Approvers, Core Team operational support and event-scoped coordinators. Bind student authority to explicit expiring assignments. **R2:** Separate faculty approval from student execution and prohibit self-approval. **R3:** Treat registration status, event operations and pending revisions separately. **R4:** Preserve the last approved published event while reviewing amendments, with emergency notices/pauses where the current facts are unsafe. **R5 (updated after U1/U2/U4):** Free and paid individual/team events with manual payment-proof verification, faculty-approved event-level capacity/admission/team policy and no silent confirmed-capacity overflow are owner-adopted. Eligible participants are Vardhaman and recognized external-college/university students under approved event rules; manual attendance and controlled certificate delivery remain recommendations. **R6:** Make annual rollover selective, private and reversible only at the public-selection level, never by deleting or migrating participant history. **R7:** Give Platform Owners theme publish/rollback with faculty preview; maintain a stable operational interface. **R8:** Provide a bounded CMS and defer arbitrary builders and low-value features. **R9:** Complete workflow/policy review before screen inventory.

U1 is owner-approved as **Modified Option B — 2026-10-06**, as recorded in `OWNER_DECISIONS.md`: mixed free/paid events, no general MVP pass, manual proof/reference verification by assigned-event coordinators with faculty/admin review/override/audit, rejected-proof resubmission and no required gateway integration. U2 is owner-approved as **Modified Option B — 2026-10-06**: Vardhaman and recognized external-college/university students may participate under event-specific faculty-approved eligibility rules; ID upload is not default, ID inspection may occur at check-in/attendance, under-18 participation follows institutional/event policy, and non-student participation requires event-specific faculty/admin approval. U3 is owner-approved as **Modified Option A — 2026-10-06**: an active platform requires Primary and Backup Faculty Owners, no hardcoded owner email, one or more edition Faculty Approvers, owner-managed staff appointments and a recorded continuity handover. Asif Sir is the expected current primary once an authorized role assignment is made after his email is provided. U4 is owner-approved as **Modified Option C — 2026-10-06**: each event defines its approved capacity, deadline, optional waitlist, walk-in, team-change and schedule-clash policy; confirmed entries never silently exceed capacity; material policy changes require faculty approval. Authorized assignment before coordinator access and configurable annual CMS/edition presentation are also owner-confirmed requirements. U5–U11 and other recommendations remain pending; U1–U4 do not approve every operating detail or other policy.

| ID | Unresolved decision | Recommended planning default | Owner / decision needed before |
| --- | --- | --- | --- |
| U1 — RESOLVED | Free versus paid events; whether a general fest pass exists | Modified Option B: free/paid events; manual proof/reference verification; assigned-event review and faculty oversight; no general pass or required gateway | Owner selected 2026-10-06. Financial operating details require explicit follow-up before paid launch; U5–U11 remain pending |
| U2 — RESOLVED | Internal/external colleges, student eligibility, guests/minors and identity checks | Modified Option B: Vardhaman/recognized external-college/university students; event-specific faculty-approved eligibility; no default ID upload; limited ID inspection when needed; under-18 permitted where policy permits; non-students require event-specific faculty/admin approval | Owner selected 2026-10-06. U5–U11 remain pending; U7 determines any further retention/publication policy |
| U3 — RESOLVED | Who may be Platform Owner, who approves, and staffing backup | Modified Option A: minimum Primary and Backup Faculty Owners while active; edition Faculty Approvers; owner-managed staff appointments and recorded continuity handover; no hardcoded owner email | Owner selected 2026-10-06. Asif Sir expected as current primary once assigned; U5–U11 remain pending |
| U4 — RESOLVED | Capacity, walk-ins, waitlists, team changes and schedule-clash policy | Modified Option C: per-event faculty-approved capacity/deadline, optional waitlist, approved walk-ins, team-change/substitution and clash behavior; no silent confirmed-capacity overflow | Owner selected 2026-10-06. Define waitlist offer/expiry, payment hold and exception documentation in approved operating rules; U5–U11 remain pending |
| U5 — RESOLVED | Results, appeals, disqualification and prizes | Modified C: faculty-approved per-event window; 48-hour default; faculty final release and affected-award hold | Confirm rules/reviewers, funding and delivery commitments |
| U6 — RESOLVED | Certificate entitlement and delivery | Modified A: event-specific entitlement; no unapproved promise; private individual PDFs/register in MVP | Confirm eligibility/evidence, signatory, owner and delivery target |
| U7 — RESOLVED | Privacy/publication and retention behavior | Modified B: private by default; reference/team-name results; configurable faculty-approved periods and holds | Confirm publication permissions, all periods, finance/certificate/account/audit/backup policy and steward before collection |
| U8 — RESOLVED | Communication and support | Modified A: email/persistent notices, staffed help and duty-faculty escalation; simple tracking | Confirm contacts, coverage and response commitments |
| U9 — RESOLVED | Formats and operating scale | Modified A: solo/team competitions, hackathons, workshops/talks; one event booking and scheduled sessions; manual outcomes | Confirm real scale/resources and manual workload before sizing |
| U10 — RESOLVED | Edition overlap/archive | Modified A: one registering edition, private preparation, continued old closeout and maintained archive | Confirm activation readiness, fresh staff/access and archive steward |
| U11 — RESOLVED | Maintenance ownership | Modified A/B: institutional product owner and technical maintainer/backup; IT or contract; annual review | Confirm personnel, support acceptance, budget/renewals and recovery ownership before launch |

U1–U11 are now resolved at product level. The preceding U1–U4 decisions are unchanged; their references to pending U5–U11 retain the original decision context and are superseded by this status and the resolved rows above. Other baseline recommendations still need review. Faculty confirmations and paid/admission operating details remain explicit prerequisites; a resolved product default is not college policy approval or a staffing/budget commitment.

## 14. Next planning task and handoff

The owner decision review is complete at product level. Recommend a separately authorized `docs/USER_FLOWS.md` planning task based on U1–U11, carrying forward faculty-confirmation gates and remaining operating details without inventing college commitments. It has not been started. Future flows should cover participant solo/team, eligibility verification and payment-proof journeys, coordinator review/revisions, faculty exceptions, event-day reconciliation, outcomes/certificates, theme publication/rollback and annual handover, including failure/cancellation paths.

After those workflows are accepted, derive `docs/SCREEN_INVENTORY.md` from them. This intentionally updates the earlier planning order: product definition and workflow agreement now precede screen inventory. Technical architecture and visual prototypes remain later separate tasks.

Sources of project intent: `AI_HANDOFF.md`, `THEME_REFERENCES.md`, `REFERENCE_CANDIDATES.md` and the current user brief. Repository skills applied: `festronix-context`, `premium-web-design`, and `auth-rbac-security` solely for product responsibility/sensitive-action boundaries. No provider, schema or implementation decision is made here.
