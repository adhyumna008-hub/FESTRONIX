# FESTRONIX events and attendance demo — 18 October 2026

## Current status

Implementation is available locally at **http://127.0.0.1:4180/?theme=Campus&view=events**. Campus is the primary UI; Pulse, Panel and Flux use the same directory, data, demo sessions and workspaces. This pass is not pushed or deployed. The live Vercel site still represents the previously published version.

**Automated checks passed; browser QA is partially completed.** Browser access now works after the owner's settings/restart changes. Current Campus desktop registration, payment approval, individual attendance and Excel downloads were exercised through the built-in browser. Phone event introductions were inspected in all four themes. Full coverage remains pending as listed below; previous QA captures do not certify this version.

## Public demo accounts

| Username | Password | Initial access |
|---|---|---|
| admin | admin123 | Primary institutional owner: all events, staff, approvals, edition/CMS and reports |
| user1 | user1 | Sample Participant: registrations and personal passes |
| user2 | user2 | User Two: an independent participant; can be linked as a teammate |
| user3 | user3 | Development coordinator: Quantum Game Development Challenge and Signal / Noise |
| user4 | user4 | Engineering coordinator: RoboRumble and Circuit Sprint |
| user5 | user5 | Helper: Quantum only; roster and check-in, no payment review or report export |
| user6 | user6 | Helper: RoboRumble only; roster and check-in, no payment review or report export |

Sessions last 12 hours and are stored per tab. Sign out to change accounts. All passwords above are intentionally public demo values and are never accepted by the real backend. Faculty assignment, current role, active status and edition scope are rechecked for demo actions. Newly added staff records demonstrate administration but do not create login credentials; use the existing six test accounts to exercise role assignments. The two institutional custodians and remaining sample coordinator/approver records are retained in the dataset.

Changes persist in this browser's local storage. Same-origin tabs synchronize updates; separate browsers, private windows, phones and the deployed site's origin have separate datasets. Simultaneous writes are not transactional. Use fictional information only.

## What changed

- Events: original technical SVG posters, track tabs, search, day/sort/free filters, clear fee/venue/team/capacity/prize facts, Details and Register actions. Empty results can reset all filters.
- Navigation: Home, Events, Schedule, Visit & FAQ and authenticated workspace access. All four presentations use the same sign-in entry. Selected event context survives login.
- Registration: capacity/eligibility/deadline checks, free confirmation, paid proof-metadata review/resubmission, optional waitlist and individual member passes. A linked second participant sees their own pass in their account. A captain can distribute the individual QR images to their team.
- Operations: assigned-event helper scanning, explicit event selection, individual attendance, duplicate/wrong-event feedback, manual attendance reasons, scoped coordinator reports and admin reports.
- Existing approval, two-event quota, event locking, CMS, faculty oversight, results/appeals and history-preserving yearly rollover remain available. No real payments, documents, certificates, emails or provider sign-in are created.
- Camera scanning uses native QR detection where available and a lazy decoder fallback otherwise. It is user-initiated and releases the stream when stopped, hidden or removed. Manual token entry remains available. Physical camera and permission behavior still require browser/device testing.

## Excel definitions

Download produces a real `.xlsx`, not a CSV renamed as Excel:

1. **Event summary:** one row per selected event, including coordinator, active entries/people, confirmed entries/people, attendance and payment/waitlist/withdrawal counts.
2. **All attendees:** one consolidated row per member per event, including status, attendance, check-in time in IST, scanning staff and manual reason where used.

An entry can be an individual or a team. People counts sum members, not registration rows. Active totals exclude withdrawn entries; withdrawn detail is retained. Attendance denominator is confirmed members only. Pending, rejected and waitlisted registrations are not absences. A confirmed member is "Not yet checked in" before completion and "Absent" after completion/archive if no check-in exists. Across events, totals represent participations: one person attending two events counts twice.

The workbook is a dated snapshot; download again after later scans. It excludes QR credentials, payment proof and transaction references. Member names beginning with `=` remain plain Excel strings. Downloads are scoped and audited locally; access is checked again after the asynchronous workbook generation.

Older browser datasets are upgraded without deleting registrations. Old whole-team check-in is retained as historical information, but is not treated as proof that every individual attended.

## Evidence and inspiration

| Source | What was actually accessible | Concept used |
|---|---|---|
| [Infinium events](https://felicity.iiit.ac.in/infinium/events) | Rendered browser view and readable event content: dark comic treatment, expressive title, flagship/additional events, participation, prizes, duration, venue, schedule, rules and registration | Clear event information hierarchy and an obvious next action |
| [AEON events](https://www.mu-aeon.com/events) | Rendered browser view: dark starfield, search/filter controls, three-column event cards, club/prize/team/fee information | Easy filtering and visible event decision-making facts; original FESTRONIX artwork and styling retained |
| [Techfest InnovateX](https://techfest.org/competitions/innovatex), [EV Infra](https://techfest.org/competitions/ev-infra), [Zero Code](https://techfest.org/competitions/zero-code) | Official competition information covering eligibility, teams, timelines, rules, registration, FAQs and contact | Put useful decision-making facts before registration, with schedule/help navigation |

No source artwork, site branding or exact layout was copied. The event illustrations are original local SVGs. Both requested reference sites have now been inspected in the browser.

## Checks completed

- `npm run build`: TypeScript and Vite production build passed.
- `npm test`: **14 passed, 0 failed**. Covers all seven credentials, expiry/revocation, workspace and helper boundaries, two-event quota, creation/review/publication, free/paid registration, rejection/resubmission, capacity/waitlist/deadline/withdrawal, personal QR uniqueness and pixel decoding, linked teammate access, wrong-event/duplicate checks, report scope and true XLSX read-back, attendance totals, formula-like strings, appeals/faculty finalization, rollover and two-owner continuity.
- `npm audit --omit=dev`: 0 known vulnerabilities at this check. ExcelJS uses a compatible UUID override to remove the reported advisory.
- Generated workbook fixture: `output/event-platform/all-events-test.xlsx` (ignored test output).
- Existing deferred Flux and new deferred ExcelJS bundles still produce size warnings. ExcelJS loads when exporting; the fallback QR decoder loads when starting the camera. No real-device performance claim.
- The existing backend's earlier test results are historical; its suite was not rerun or modified in this pass.

## Browser checks completed after access was restored

- Campus at 1440×900: inspected Events header/hero; searched Quantum and verified one result; guest Register opened login and retained the selected event after `user1` sign-in.
- Registered fictional QA Circuit Crew with Sample Participant and linked User Two. Paid proof remained pending and no QR was exposed before approval. `user3` saw only Quantum and Signal / Noise, with the two-event creation limit disabled at 2/2. Approved the fictional proof and opened Quantum check-in.
- `user2` saw only their personal QR, not their teammate's pass. `user5` saw only Quantum, check-in and attendee-list controls, with no payment or export controls. Pasting the personal QR token recorded exactly one attendee; repeating it produced the duplicate warning and left attendance at one. This tests token verification, not physical camera scanning.
- Coordinator report showed 2 entries, 4 confirmed people, 1 attended and 3 not checked in, including the pre-existing two-person sample registration. The actual event Excel download completed. Admin's combined six-event Excel download also completed and displayed the expected totals. Automated XLSX read-back remains the file-content evidence; these browser downloads were not separately parsed.
- Campus 390×844: inspected event filters/artwork and scrollable long-title detail dialog; Escape closed it. Inspected the coordinator report layout with horizontally scrollable navigation/table. All four themes' phone Events headers and introductions were visually inspected. Flux desktop filters/cards were inspected at 1440×900. No console warnings/errors were reported in the inspected tab.
- Browser-wide viewport controls timed out. Tab-scoped CDP emulation worked; matching the Windows display scale (1.25) was necessary for usable phone/1440 captures. At 768×1024 and 1920×1080, DOM measurements showed no page overflow, but screenshots contained repeated surface tiles: those full visual checks are **not passed**. Do not mistake the capture artifact for an application layout defect.
- Evidence is under `output/event-platform/`: `desktop-scanner-duplicate.jpg`, `campus-390-events.png`, `campus-390-detail.png`, `campus-390-hero.png`, `campus-1440-hero.png`, the other three `*-390-events.png` captures and `flux-1440-lineup.png`. The 768/1920 captures and preliminary mobile report capture are diagnostic only, not acceptance evidence.
- The local browser dataset retains the fictional QA registration and Quantum in Live state for inspection. No production data or backend was changed. This pass is still local, uncommitted and undeployed.

## Remaining browser review — do not mark complete prematurely

Inspect 390×844, 768×1024, 1440×900 and 1920×1080 CSS viewports in all four themes, prioritizing Campus. Check wrapping, horizontal overflow, card heights, long event titles, sticky header clearance, forms/dialog focus, touch targets, keyboard/Escape, reduced motion and console errors. Exercise these flows on the rendered pages:

1. Guest → Events filters/details → Register → demo login → selected event registration.
2. User1 → register Quantum with fictional teammates and proof; optionally link User Two. User2 → confirm only their personal ticket is visible after approval.
3. User3 → review/reject/resubmit/approve the proof, then start Quantum. User5 → scan each personal token once and confirm separate attendance. Repeat one token and try a RoboRumble token; neither should add attendance.
4. User3 → export Quantum; admin → export Quantum individually and all events. Compare live UI totals with both workbook sheets after each scan. User5 must have no report access.
5. User6 must see RoboRumble only. An account cannot access an unrelated event or protected workspace by changing the URL. Revoking helper access must take effect before another scan.
6. Admin → assign user2 as a coordinator, create/submit up to two events under that account, approve as admin and reject a third event. Existing coordinators already own two events. Reassign owned events before changing their role.
7. Admin → prepare next year, preview settings, close registrations/finish live events and activate. Confirm historical reports remain and previous student staff access expires.
8. Confirm browser refresh, same-origin tabs, sign-out and expired-session feedback. Verify camera permission rejection, stop/restart, backgrounding and physical QR focus on actual devices when access is available.

The completed subset above does not certify every step in this checklist. Remaining work includes reliable tablet/large-desktop captures, all remaining theme/workspace combinations, wrong-event and revoked-scope UI checks, free/rejected-proof flows, admin assignment/rollover UI, persistence and physical-camera/device checks. Real multi-device attendance, authoritative authorization, account recovery, secure uploads, production locking and institutional policies remain backend/integration work, not claims of this local demo.
