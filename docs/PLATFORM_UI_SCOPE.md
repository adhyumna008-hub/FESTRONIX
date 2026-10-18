# FESTRONIX operational UI prototype

## Scope — updated 18 October 2026

The owner requested reusable festival administration, event discovery, coordinator and event-helper operations in Campus, Pulse, Panel and Flux. This is one shared **local, fictional-data prototype**, with four visual layers. It does not connect the existing backend, create real accounts, take payments, send messages or issue valid admission credentials. Temporary demo sign-in now replaces public role switching; its client-side guards are demonstrations, not a production security boundary. See [current account and QA guide](EVENTS_DEMO_QA.md).

## Permission and responsibility matrix

| Actor | May manage | Must not manage |
|---|---|---|
| Institutional faculty owner / Admin | Edition settings and public content, theme, faculty/student access, approvals, publication, archives, next-edition preparation and activation, oversight of all events | Remove the last two active faculty owners; destroy registration/attendance history during annual rollover |
| Faculty approver | Review submissions, payment/results oversight, material policy approval | Become an institutional owner through student assignment |
| Event coordinator | Create up to **two events per edition**, edit/submit their events, roster/payment review, event-scoped helper assignments, attendance, provisional results | Other coordinators' events; self-approve/publish; change faculty roles; bypass the two-event quota by archiving an event |
| Event helper / sub-coordinator | Check QR or manually check in confirmed participants and read the minimum roster **only for assigned events** | Create events; review payment evidence; change rules/results; delegate access; inspect other events |
| Participant | Discover events, register in the local preview, track confirmation, view their own demo tickets, submit an appeal | Other participants' private records or staff operations |

## Product rules retained

- Free entries confirm only when eligibility, admission window and capacity permit. Paid entries wait for assigned-coordinator/faculty review of payment reference/proof metadata. No payment gateway. Rejection permits resubmission. Demo uploads store **only a filename**, never file bytes.
- Individual QR credentials appear only for confirmed registrations. Each member gets a different opaque token with a `FESTRONIX-DEMO` prefix and no personal information; they are not live tickets. Wrong event, invalid, pending, withdrawn and duplicate scans receive distinct feedback. Manual check-in requires a reason. Attendance records identify the member, scanning staff and timestamp.
- The assigned event coordinator can export that event to Excel. Faculty/admin can export individual events or all current events; institutional owners can export archived editions. Workbooks include one summary and one consolidated attendee sheet, with registration and individual attendance counted separately. Helpers cannot export. QR tokens and payment evidence are excluded.
- Coordinator scope is assigned by faculty; student helpers are assigned to individual events by their coordinator. Active-edition access expires at rollover. UI guards illustrate scope, but authoritative server checks remain mandatory before launch.
- Drafts without registrations may be deleted after confirmation. Completed/published events are archived/unlisted, preserving private operational history. Annual activation archives the former edition and revokes its student access. It copies public configuration only, not events, participants, proofs, attendance or student assignments.
- Event changes after approval return to review. Rules cannot be changed during a live event. After registrations exist, participant-impacting changes remain deferred to the existing backend's controlled change workflow; prototype edits are blocked rather than silently invalidating registrations.
- Provisional results use a configurable appeal period (48 hours by default); faculty finalizes after that window. Certificates require approved policy and attendance/outcome evidence. No real certificates are generated here.
- One public registering edition at a time. The next edition is privately prepared before activation. Theme changes never copy event/business data.

## Research informing the controls

- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): least privilege, deny by default and authorization on every protected request. The UI is explicitly not the security boundary.
- [OWASP Business Logic Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html): validate ownership and quantity limits against authoritative state; the two-event rule must also be enforced transactionally by the backend later.
- [Eventbrite event check-in](https://www.eventbrite.com/help/en-gb/articles/741083/how-to-check-in-attendees-at-the-event-with-eventbrite-organizer/) and [staff roles](https://www.eventbrite.co.uk/help/en-gb/articles/509534/how-to-manage-roles-and-permissions/): explicit event selection, scoped check-in duties and clear scan feedback.
- [Cvent event administration](https://support.cvent.com/s/communityarticle/Home-Page-Overview): separate copying reusable event configuration from archiving completed work.

## Faculty confirmation / production follow-up

Real faculty identities, approver assignments, payment destinations, safety/eligibility policies, refund handling, retention periods, certificate signatories, support hours and maintenance ownership remain institutional decisions. Firebase client setup, backend connection, authoritative two-event enforcement, camera/device testing and production security verification are separate follow-up work. No real participant data should be entered in this public local-storage preview.
