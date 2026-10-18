# FESTRONIX functional verification — 18 October 2026

## Result

The implemented **browser-local prototype** passed 32 automated tests and its TypeScript/Vite production build after repairs. Core workflows were exercised in the built-in browser. This is not certification of a connected institutional platform: real authentication, shared persistence and certificate delivery remain unconnected.

Data-changing browser checks used **http://127.0.0.1:4181/**, a separate local origin with fictional records. The existing local and production datasets were not reset. Read-only theme/layout checks used port 4180. The 4181 fixture now has 2027 active and preserved 2026 test history; that is intentional QA state, not the published default. Production continues to default to 2026.

## Repairs

- Account/sign-in navigation now opens the appropriate workspace instead of returning to public Events. Selected-event login uses the exact event ID, including duplicate-title cases.
- Full paid-event waitlists no longer require transaction/proof fields. Full events without waitlists cannot be entered through the detail button. Promotion checks the registration deadline.
- Blocking schedule policies include linked teammates and are checked again at payment approval/promotion.
- Invalid manual-attendance reasons keep the confirmation dialog open with feedback. Other confirmations can likewise remain open when the action fails.
- Revoking/restoring/changing staff authority invalidates the old demo session using an access revision. Restoring access requires a fresh sign-in. Invalid sessions are cleared from the open tab.
- Protected-page account switching no longer renders two sign-in forms. Missing/denied clipboard support produces useful feedback. Approved paid entries direct cancellation requests to faculty instead of offering a withdrawal that must fail.
- Landing cards and detail buttons now use the same deadline/state checks as the directory.
- Campus renders the configured tagline, sponsors and all FAQs. Theme changes retain future-edition preview context.
- Same-month date ranges are compact, and phone hero facts use larger type and can wrap.

## Functional coverage

| Area | Actual checks | Result |
|---|---|---|
| Demo sign-in | All seven supplied accounts; wrong password; intended workspace; event context; expiry/revocation guards | Passed |
| Event discovery | Search/no matches/reset; alphabetical sort; combined track/day/free filters; details and Escape/focus restoration | Passed in browser |
| Paid admission | Pending proof → reject → resubmit → approve; no personal QR before approval | Passed in browser and automated tests |
| Waitlists/capacity | Second participant joined full paid event without evidence; no QR/admission; capacity and deadline guards | Passed |
| Free/team admission | Free registration with a linked second account; teammate saw exactly one personal pass | Passed |
| Personal QR | Separate tokens; pixel decoding; wrong-event, invalid/nonconfirmed and duplicate guards | Browser token checks and automated decoding passed |
| Helper operations | Assigned-event-only options; no payment/export controls; Admin route denied | Passed in browser |
| Live access revocation | Second faculty tab revoked an open helper session; restoration left that session signed out | Passed in browser |
| Individual attendance | One QR check-in plus one reasoned manual check-in; invalid reason changed nothing; final count 2/2 | Passed in browser |
| Coordinator creation | Faculty appointed User Two; created/submitted two events; third creation disabled | Passed in browser; command quota also tested |
| Faculty approvals | Changes requested → student revision → resubmission → approval → publication | Passed in browser |
| Event locking/deletion | Registered/live rules protected; unused draft deletion allowed; history-bearing deletion denied | Locking inspected; deletion tested on automated fixtures |
| Results/appeals | Completion; provisional results; participant appeal; faculty resolution; early finalization rejected | Passed in browser; elapsed-window finalization automated |
| Excel | Coordinator event; admin single/all events; archived edition; attendance totals and scoped access | Browser downloads started successfully; generated workbooks read back in automated tests |
| CMS | Future-year heading, tagline, sponsor and six FAQs saved and rendered; private preview retained current year | Passed in browser |
| Annual operation | Preset 2027 selected/activated; old registrations/reports retained; staff expired; participant history retained | Passed in browser |
| Next-year reuse | Coordinator explicitly restored for 2027, created a new event; faculty published it; guest sign-in resumed that exact event and registration confirmed | Passed in browser |
| Continuity | Two-custodian guard, role/scope and history boundaries | Passed in automated tests |

In the 2026 browser fixture, reports showed **10 registered people, 6 confirmed, 2 attended and 4 not checked in**, matching the five entries including existing samples and a waitlist. Signal / Noise showed one two-person registration and 2/2 attended. Those counts remained available after archiving. Counts are event participations, not globally unique people.

## Presentation checks

- Campus, Pulse, Panel and Flux Home/Events were measured at **390×844, 768×1024, 1440×900 and 1920×1080**: **32 layout checks**, no measured page overflow or broken completed image loads. Details are in `output/full-qa/responsive-layouts.json`.
- Inspected phone screenshots of all four landing themes and Campus event/filter/dialog behavior. Desktop workflows were inspected in the native 1280px browser. Larger emulated screenshots can repeat or clip the browser surface; DOM measurements passed, but full visual acceptance at those larger sizes remains limited by capture reliability.
- Campus Explore and event dialog closed with Escape and restored focus to their triggers. Reduced-motion desktop glass-X animation was disabled. Flux B/C STATIC fallbacks kept the wordmark/content available without a canvas.
- Main acceptance captures: `output/full-qa/campus-home-390.png`, `pulse-home-390.png`, `panel-home-390.png`, `flux-home-390.png`, `admin-reports-desktop.jpg`. Intermediate rapid-resize captures are diagnostic only.
- No console errors were reported in the inspected tabs. Existing deferred Excel/WebGL bundle size warnings remain; no physical-device performance claim is made.

## Still unconnected or unverified

- Physical camera permissions, focus and scanning a printed/displayed QR require actual device testing. Manual-token scanning and generated QR decoding were verified. B/C WebGL rendering on real GPUs and no-WebGL hardware still require device checks; STATIC fallbacks were exercised.
- Google/Firebase/email authentication, authoritative server permissions, shared data across phones/browsers, secure uploads, real payment/refund processing, email/notifications and actual certificates are not connected. Public demo credentials do not provide real institutional access.
- Same-origin tabs synchronize demo records; different devices do not. Simultaneous local-storage writes are not transaction-safe. These limitations require the future backend integration, not additional cosmetic controls.
- The existing unconnected backend suite was not rerun or changed. Its historical results are not evidence for these frontend workflows.

## Release

The fixes are prepared for the existing GitHub → Vercel production integration. The verified commit and deployment are recorded in `AI_HANDOFF.md` and `VERCEL_DEPLOYMENT.md` after publication.
