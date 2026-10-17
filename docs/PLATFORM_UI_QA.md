# Operational prototype QA — 17 October 2026

## What was built

One shared local-data workspace provides Events, Participant, Coordinator/helper and Admin/faculty views in Campus, Pulse, Panel and Flux. New features are lazy loaded; the QR encoder loads only when a confirmed ticket is displayed. Existing WebGL B/C scenes and original Campus glass-X geometry/motion are retained.

This is a **UI and interaction prototype**. It has no real authentication/session, server-side access control, payment, uploaded evidence, outbound messages or valid admission credentials. Role/account selectors are explicitly public previews. Never enter real participant information in them.

## Browser checks performed

- Events, Admin overview, Coordinator and Participant rendered in all four themes at **390×844, 768×1024, 1440×900 and 1920×1080**: 64 unique combinations. Document width stayed within the viewport in the final matrix.
- All four landing pages checked at 390×844 and 1440×900. No measured horizontal overflow; unrelated literature/cinema/anime/cultural copy was absent from the rendered pages.
- Found and fixed mobile workspace grid minimum-width overflow. Phone workspace navigation now uses a compact two-column layout. Adjusted Pulse logo-X contrast and shortened the directory heading.
- Guest Register opens the shared login prompt with the selected event. Escape closes it and focus returns to the originating Register button. Actual provider actions remain unconfigured.
- Faculty appointment → coordinator creates draft → submits → faculty approves → publishes. The published event appeared in the shared event directory. An existing coordinator's Create action was disabled at 2/2 events, and only that coordinator's two events appeared in their selector.
- Attempt to revoke either of the two required faculty owners was rejected.
- Free registration confirmed and rendered an actual encoded demo QR image. Paid registration stayed pending without a QR; assigned coordinator rejection → participant resubmission → assigned coordinator approval unlocked its demo QR. This sequence crossed Flux/Panel views using the same records.
- Helper assignment added only check-in access. Helper preview displayed one assigned event, with no event editor, payment-review or helper-delegation tabs.
- Confirmed QR accepted after the event was started. Wrong-event QR rejected. Repeated scan rejected as duplicate, without another check-in. Camera access was not requested during QA.
- Coordinator completed an event and published provisional results; the confirmed participant submitted a local appeal. Faculty finalization time/appeal guards exist but the 48-hour real-time waiting period was not bypassed for QA.
- Next edition prepared without copying events, participant entries or staff assignments. Private preview showed the next year and edited hero heading while the active edition stayed unchanged. Activation was rejected while an event was Live.
- After live completion and closing registration, activation archived the former edition, preserved its entries/history, expired its edition staff and kept institutional owners. Participant accounts continued without staff privileges; Past editions retained the participant's old entry without an admission QR. Institutional faculty closeout remained reachable for the archive, with scanning and new registration closed.
- Browser error/warning inspection returned no messages on the checked normal states. Sample data was restored after the operating walkthroughs.

## Build and source checks

TypeScript and Vite production build passed. No new automated test suite was added or run in this UI pass. Existing backend test counts in older documents were not rerun here. The existing deferred Flux scene chunk remains approximately 951 KB / 259 KB gzip and still produces Vite's size advisory; these workspaces do not load it.

Local browser output is under `output/platform-ui/` (ignored): layout matrix and selected screenshots. `campus-event-cards-desktop.png` shows event facts and direct Register actions. Early captures were used to diagnose layout issues and are not a claim of final pixel review. Live publication is checked separately after the Git push.

## Remaining limitations

- Real Firebase client sign-in, backend API binding and authoritative event scope/quota enforcement are pending. The existing backend is preserved, not connected by this pass.
- Proof input stores a **fictional filename/reference only**, never a file. Real payment destinations, evidence upload, refunds and reconciliation need the approved backend/private storage workflow.
- Camera scanning uses an optional browser QR-detection API with manual token fallback. Physical phone cameras, permission prompts, Safari support, print scanning and poor-light conditions remain unverified.
- Team tickets are simplified to one local entry QR. Real individual attendance/certificates must use the backend's per-member credentials/evidence. No certificate PDFs or awards are issued here.
- Institutional identity verification, MFA, notification delivery, final certificate release, rich asset/logo management, retention automation and technical maintenance are not made operational by a visual preview.
- Actual OS reduced-motion preference, assistive technology and physical-device performance were not newly certified. Dashboard transitions have a reduced-motion CSS override; existing landing-page fallbacks remain.

See [PLATFORM_UI_SCOPE.md](PLATFORM_UI_SCOPE.md) for responsibilities, product rules and primary research sources.
