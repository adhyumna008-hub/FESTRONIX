# FESTRONIX AI Handoff

**Current Phase:** Technology-fest content and shared interactive operational prototypes across Campus, Pulse, Panel and Flux; existing backend remains unconnected
**Status:** Four-theme operational UI prototype implemented and browser-checked with fictional local data. Existing TypeScript/Fastify/PostgreSQL/Firebase backend is preserved but unconnected; its earlier 58-test result is historical, not rerun in this frontend task. Real identity, secure staff scope/quota enforcement, evidence upload, admission and institutional launch policies remain pending. U1–U11 remain unchanged, with the new two-event coordinator/helper clarification recorded in PRODUCT_SPEC. USER_FLOWS and screen inventory have not been started.
**Last updated:** 2026-10-17

## Purpose

Keep a single shared source of truth for FESTRONIX across Go, Claude, Antigravity, Astra, and any other tools. Record decisions here and link to the detailed documents as they are created.

## Technology-fest operational prototype — 2026-10-17

- Owner requested technology-fest copy, a full Events tab with Register buttons and Admin, Coordinator and Participant experiences in all four UIs. Removed active nontechnical club/cultural copy and changed flat illustrations to technical tracks. Original Campus glass X and existing Flux B/C experiments remain.
- One shared browser-local provider drives all themes and website settings; no per-theme business records. Added local interactive event creation/submission/approval/publication, faculty appointments, two-event coordinator quota, event-specific helpers, manual-proof status/resubmission, confirmed-only demo QR, check-in/duplicate feedback, provisional results/appeals and private participant history.
- Admin can edit year/edition label, dates, published theme, hero/introduction/contact content, sponsors, FAQs, announcements and registration state. Annual preparation copies configuration only; activation preserves history, expires old edition staff and keeps institutional custodians. Institutional faculty retain archive closeout. Unused drafts can be deleted; other events are archived/unlisted. Faculty-owner handover maintains two custodians.
- All role/account switches are explicitly fictional previews. No real sign-in, authority, upload, payment, message, certificate or valid admission is created. Demo proof stores only invented filename/reference metadata. Team QR is simplified; real per-member tickets remain in the existing backend. The new two-event rule still needs authoritative backend integration/enforcement.
- Browser exercised 64 workspace/theme/viewport combinations at 390×844, 768×1024, 1440×900 and 1920×1080; fixed phone grid overflow. Walked through approval, free/paid registration and rejection/resubmission, helper scope, wrong-event/duplicate scans, results/appeals and annual rollover with preserved history. Build passed. Physical-camera and live-provider verification remain pending. See [PLATFORM_UI_SCOPE.md](PLATFORM_UI_SCOPE.md) and [PLATFORM_UI_QA.md](PLATFORM_UI_QA.md).
- Published implementation commit 547d0f12265fccead8b33008922b70f6bb020d36 through the existing GitHub main → Vercel integration. Deployment dpl_4K2sG54h77Vg6bPDjpgme3gVt2QS reached READY in about 21 seconds; public desktop directory/login/Admin settings and all four phone themes were checked. A documentation-only follow-up records the release; frontend output is unchanged. Older pinned releases below remain historical. No backend configuration, SQL/auth redesign, USER_FLOWS, screen inventory or next phase was started.

## Campus screenshot-feedback refinement — 2026-10-17

- Owner requested fixes based on supplied screenshots: plain club cards, singular Developers label, duplicated event dismissal/header discovery, weak wordmark emphasis, typography/spacing and mobile adaptation.
- Campus now uses original illustrated SVG club posters and the corrected shared **Student Developers Club** label. Added provisional Outfit display headings with shared Manrope body text, a larger wordmark, shorter supporting hero and tighter section rhythm. Original glass-X geometry/shading/9-second float and existing event-art concepts remain.
- Removed the center header discovery link and event-dialog Back to exploring duplicate. One Close plus one primary Log in to register action remain in the event detail. Login remains unconfigured and keeps the selected event.
- Browser checked the four required sizes, narrow phone and landscape; no measured horizontal overflow. Inspected cards/dialogs, focus wrap/Escape/trigger recovery, motion control and console. See [CAMPUS_FEEDBACK_QA.md](CAMPUS_FEEDBACK_QA.md). No backend or next product phase.
- Published commit `31c222fa5a8dcdae2fdb30209265fc0b24bccf8b` to GitHub `main`. Git integration automatically built deployment `dpl_5tthx1b3e2MhUtL7k9ho1ZZQBMFC`, which reached **READY** in approximately 19.8 seconds. Primary URL remains **https://festronix2k27.vercel.app/**. Public browser check confirmed posters, corrected club name, absent duplicate header link, simplified event dialog and phone fit; console was empty. Release-result documentation is recorded locally after publication.

## Vercel publication completed — 2026-10-16

- Owner renewed deployment authorization with “yes” after Vercel plugin connection. Created project `festronix2k27` (`prj_WiMAMhuc87fnn8YTdxiNazH2rQs9`) and deployed GitHub `adhyumna008-hub/FESTRONIX`, `main`, commit `a7d9ea2c8640062c24d4a35aeeafeeaab70efd04` to production.
- Deployment `dpl_3TY934pA2LTqyAgSJ1y3b46WoGCa` reached **READY**. Verified primary alias and public URL **https://festronix2k27.vercel.app/**. Secondary `festronix-2k27.vercel.app` is also a verified project domain. No paid upgrades, backend services, credential additions or protection changes.
- Browser checked live Campus at 1440×900 and 390×844, original X motion, institution images, login preview and four-theme switching; no horizontal overflow or browser errors/warnings observed. Login/registration remain unconnected visual prompts. No real-account or payment availability is claimed.
- Project/domain/deployment operations succeeded in the plugin's default context. Explicit team-scoped reads and build-event logs returned scope permission errors; no authenticated CLI fallback exists. Remote READY and actual public browser rendering were independently verified. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md); screenshots under `output/vercel-deployment/`.
- This publishes the existing visual comparison only. Backend remains unconnected and institutional launch/security prerequisites remain pending. No next product phase started. Post-release documentation edits remain local; deployed source is pinned above.

## Vercel deployment preparation — 2026-10-16

- Owner explicitly authorized deploying the GitHub repository to Vercel, preferably at `festronix2k27.vercel.app`. Existing remote is `adhyumna008-hub/FESTRONIX`, branch `main`.
- Added root `vercel.json` to install/build only `prototypes/festronix-visual` and publish its `dist` output. Import with Vercel Root Directory `./`. No frontend secrets or backend configuration are required for this visual-only deployment.
- Vercel dashboard and GitHub OAuth currently require user sign-in. No Vercel project, deployment, or hostname reservation is confirmed. User sign-in requested; do not claim that the site is live. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md).
- Later owner instruction stopped the deployment attempt in favor of manual deployment and requested a plugin alternative. Configuration and original X restoration were already pushed as `a7d9ea2` before that instruction. Vercel plugin found and suggested, but not installed/connected; no deployment should resume without renewed owner authorization.
- Subsequent plugin connection confirmed. Applied `vercel:deployments-cicd` guidance and successfully listed the connected account's teams and FESTRONIX-named projects; both lists were empty. No project or deployment was created. Browser sign-in is no longer the blocker for available authenticated plugin tools; the owner's earlier stop remains in effect until publishing is requested again. Hostname availability remains unverified.

## Original Campus X fidelity correction — 2026-10-16

- Owner correctly identified that the preceding X recreation differed from the first version. Compared `output/glass-home/home-desktop.png` against the recreated hero and recovered the actual original CSS from saved Git blob `0b0ad318687920f7edc056c6516ad96c2b88d118`, plus original artwork markup from `87ebb46202652b9b3629a1045e1abaaa7d8ac023`.
- Restored the original 330×400 artwork with 110×395 arms, glass gradients/shadows, crossing order, orbit perspective, floating edition ticket, caption and responsive rules. Original motion is a 9-second ease-in-out float from −13° toward −7° with 14px downward travel (12px on tablet), plus the ticket's 10-second float. Removed the recreated 8-second float and its extra light sweep. Phones retain the original still composition.
- `CampusX` retains observer/visibility cleanup and pause handling for dialogs, Motion off, offscreen and hidden-tab states. Existing reduced-motion rules apply. Five flat club cards, Flux A Club Symbols, four-theme selection and shared login remain in place; no gallery or backend changes.
- Build/typecheck passed. Visually inspected Campus at 390×844, 768×1024, 1440×900 and 1920×1080; no horizontal overflow. Observed running float, dialog pause and manual Motion off pause. Phone X/ticket animations are disabled. Browser console check was empty. Evidence: `output/glass-x-restore/`; see the correction addendum in [LOGIN_AND_MOTION_QA.md](LOGIN_AND_MOTION_QA.md). Physical-device and actual OS preference emulation were not repeated.

## Shared sign-in, animated X and publication — 2026-10-16 (preceding pass)

- Owner requested the earlier animated X treatment back, login buttons in every theme, login prompts for unauthenticated registration, smoother scrolling/controls and publication of the current workspace to their existing FESTRONIX GitHub repository.
- Campus rendered `CampusX` with recreated CSS optical arms, bounded orbit lines and three small flat category symbols. This recreation differed from the first version and is superseded by the original-artwork recovery above. Flat club cards remain.
- `LoginPanel` supplies the same accessible Google/email sign-in entry to Campus, Pulse, Panel and Flux. Every theme has an explicit header Log in button. Legacy event cards have direct Register buttons; all event dialogs provide Log in to register. The selected event is shown in the login prompt. Focus is contained, Escape closes, the original trigger regains focus and background scrolling is locked while the dialog is open.
- Real frontend Firebase sign-in remains **UNCONFIGURED**. No client credentials/project settings exist in this prototype, so provider actions clearly explain the pending setup. No mock login/session, account, registration, email or payment is created. Backend Firebase/RBAC enforcement remains as previously implemented and independent; these visual prompts do not replace server authorization.
- Native smooth anchor scrolling, staggered Campus content entrances, refined legacy reveals, button/card/label feedback, dialog/FAQ entrances and quieter hover motion are implemented. Keyboard focus exposes waiting content; filters/day changes stay immediate. Phone headers retain login/menu/theme access. Theme/Flux variant selection now updates the URL and survives refresh.
- Final build/typecheck passed. Browser checked login dialogs in all four themes at 390×844, 768×1024, 1440×900 and 1920×1080 with no horizontal overflow. Verified registration/event context in every theme, field feedback without sending, focus wrap, Escape/trigger recovery and Campus pause/resume/scroll behavior. QA tab returned no console errors/warnings. See [LOGIN_AND_MOTION_QA.md](LOGIN_AND_MOTION_QA.md).
- GitHub target verified as the existing `https://github.com/adhyumna008-hub/FESTRONIX` remote, branch `main`; write dry run succeeded. Owner authorized replacing its file contents with the current workspace snapshot using a normal commit/push, retaining history. Local databases/proofs, credentials, dependencies, build output and browser output remain excluded. Root README now explains both preview and backend setup. Remote commit identity is verified after the push in the task's completion record.


## Campus variant and flat club symbols — 2026-10-16 (current frontend change)

- The owner explicitly selected **Campus as a fourth option beside Pulse, Panel and Flux**. The cream/orange home is available at `/?theme=Campus` and remains the root view. Both prototype comparison controls offer all four choices. Campus is a local visual experiment; backend theme settings and product rules were not changed.
- Replaced the hero's glass X and the five model-poster club images with original flat SVG category symbols: gaming, code, literature, cinema and anime/culture. These are illustrative marks, not official club logos.
- Removed the active `WorldExpedition` / 3D Club Gallery connection and its Campus links. Flux A is now **Club Symbols**, with readable content and flat SVGs. Old Flux A URLs reach this replacement. B / Liquid Flux and C / Network / Portal retain their existing experiments. Old gallery source/model files remain inactive historical material and are absent from generated JS.
- Browser inspected Campus and Flux A at 390×844, 768×1024, 1440×900 and 1920×1080: no horizontal overflow and zero Canvas elements. Verified all four choices, menu/Escape and keyboard motion toggle. Corrected inherited arrow positioning/number contrast on club cards. Final TypeScript/build passed; QA tab logged no errors/warnings. Existing deferred Flux B/C chunk warning remains.
- Evidence: [CAMPUS_VARIANT_QA.md](CAMPUS_VARIANT_QA.md), `output/campus-variant/`. Preview: http://127.0.0.1:4180/?theme=Campus. No backend connection or next phase started.

## Backend foundation continuation — 2026-10-16 (preceding backend phase)

- Continued the existing backend rather than replacing it. The owner's pasted request explicitly authorized implementation, migrations, Firebase identity preparation, scoped RBAC, QR/attendance and serious backend tests. Earlier prohibitions apply to their historical planning/prototype phases, not this authorized backend scope. No frontend/admin UI or production deployment was started.
- Implementation root: `backend/`. Fastify 5 + TypeScript; `pg` with parameterized SQL and explicit transactions; Firebase Admin ID-token verification with revocation checking. Identity and authority remain separate; no hardcoded owner email or executable test-auth mode. Startup rejects an overprivileged runtime database account.
- Implemented three checksum-tracked migrations and fictional development seed. Native local PostgreSQL setup lives in ignored `backend/.local`; runtime uses a restricted account distinct from migrations. No destructive annual reset; next-edition roles do not inherit old student access. Do not reseed the existing populated development database.
- Implemented independent event approval/publication, solo/team registration and capacity locking, waitlist offers, consent-based teams/captain transfers, private payment proofs/rejection/resubmission, faculty review/override, per-member opaque hashed QR credentials with actual SVGs, reissue/revoke, authorized online scan/manual check-in, duplicate feedback and attributed attendance correction. Announcements, audit, reports, faculty CSV and certificate-evidence foundation are included.
- Final verification: **58 integration tests passed, 0 failed, 0 skipped** against native PostgreSQL through a restricted runtime role. Covers all 15 requested security/QR scenarios, concurrent scans/final-seat competition, scope tampering, custodian handover, proof privacy, live edit restrictions and first-login safety. A temporary real loopback HTTP listener passed health/readiness/unauthenticated-denial checks. Final TypeScript build passed; typecheck passed; OpenAPI exported; production dependency audit reported 0 known vulnerabilities. No lint task is configured. Migrations were applied to development and fresh test databases, and unchanged reruns were tested.
- Documentation: [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md), [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md), [QR_TICKETING_AND_ATTENDANCE.md](QR_TICKETING_AND_ATTENDANCE.md), [RBAC_SECURITY_MODEL.md](RBAC_SECURITY_MODEL.md), [BACKEND_SETUP.md](BACKEND_SETUP.md); `backend/README.md`, `.env.example` and `openapi.json` provide the implementation entry points.
- Foundation limits: material publication after any registration is blocked pending participant-impact handling; post-registration substitutions, late captain changes, staff walk-ins and selective edition cloning are deferred. Paid proof resubmission requires an open admission window; no refunds/reversal system. Results/appeals/certificate release, outbound communications, full CMS and retention automation remain future work. Approved product requirements have not been silently removed.
- Live prerequisites: genuine Firebase project/ADC and provider verification, PostgreSQL/TLS/runtime credentials, reviewed durable private evidence storage and sanitization, faculty custodians, privacy/retention policies, MFA/recovery decisions, backup-restore rehearsal and load/security review. Current proof handling checks signatures and serves private attachments; it does not claim malware scanning. No production-readiness or real-provider claim.

## Liquid-glass home continuation — 2026-10-08 (preceding frontend pass)

- The owner requested a new modern, useful, animated home page with liquid-glass styling, a distinctive menu and login option. Continued the existing implementation after the owner's resume message. The root URL now renders `GlassHome`; explicit `?theme=Pulse|Panel|Flux` URLs retain the earlier visual experiments in a lazy `LegacyApp` module. No existing club models or scenes were replaced.
- Added a warm paper/charcoal/orange composition, optical-glass X artwork, frosted navigation, animated festival-directory dialog, interest filtering, shared sample event details, five club previews linked to the live gallery, shared day schedule, visit section and FAQs. Primary discovery precedes the longer optional 3D tour. No fabricated attendance statistics, sponsors or testimonials.
- Login is a designed modal with Google/email preview controls and browser email validation, explicitly unconnected to authentication. It sends/stores no email and creates no account. The existing untracked `backend/` directory was left untouched. Real sign-in integration is not claimed.
- Home uses no Canvas and no new dependencies. Earlier theme/GSAP/WebGL modules load only on their theme URLs. Final build passes: initial JS 77.24 KB gzip, home CSS 7.29 KB; deferred legacy JS 67.11 KB and legacy CSS 13.19 KB. Existing deferred GLTF chunk-size warning remains.
- Checked home/menu/login at phone, tablet and desktop CSS viewports (390×844, 768×1024, 1440×900, 1920×1080). Verified filtering, sample event detail, Day 2 schedule, FAQ, modal keyboard wrapping/Escape/focus return, motion-off and offscreen pausing. Fixed home-anchor header clearance, tablet login-button wrapping and keyboard boundary behavior. No normal browser warning/error logs. Gallery link reaches ready with one Canvas. See [GLASS_HOME_DESIGN_QA.md](GLASS_HOME_DESIGN_QA.md).
- Local preview: **http://127.0.0.1:4180/**. Current process is the Vite development server; run `npm run dev` from `prototypes/festronix-visual` to restart. No push or deployment. Owner visual review, actual authentication, confirmed festival content and real-device performance remain pending.

## Five-club gallery continuation — 2026-10-07 (preceding pass)

- Continued the existing authorized world implementation; did not start again. The latest owner request supersedes X-Core and AI/Robotics subjects with **Gaming**, **SDC (Student Developer Club)**, **Literature**, **CINE** and **OTAKU**. Other clubs are deferred until the owner supplies them.
- Flux A uses the actual sourced gamepad, classic laptop, encyclopedia set, vintage video camera, and antique katana with wooden stand. All six source objects are Poly Haven **CC0 1.0**. Original meshes, UVs and PBR material detail are retained. These are authored physical-object models, not claimed photographs, scans or manufacturer CAD. Source records, hashes and preparation evidence are in [assets/3d/SOURCES.md](../assets/3d/SOURCES.md) and [ASSET_MANIFEST.md](ASSET_MANIFEST.md).
- Implemented `WorldExpedition`, `WorldScene`, `WorldCamera`, `WorldRuntime`, `WorldEnvironment`, `WorldModel`, `WorldAssetLoader`, `ClubDisplayTexture`, `WorldExperience` and `world.css`. One lazy Canvas carries the gallery, a continuous scroll-driven camera, restrained ambience, fine-pointer response and actual-mesh raycast selection. Semantic club content, anchors, facts and actions remain HTML. Existing all-theme slow entrances, Panel tile breakup and institution logos remain.
- Nearby exhibits mount only when required (maximum three during club travel); the closing group uses five smaller REDUCED assets. FULL/REDUCED frame scheduling, capped DPR, cached shadows, embedded-image sharing and owned cancellation/disposal bound the enhancement cost. After ten seconds outside the gallery, Canvas is released; returning restores current progress. STATIC, user motion reduction and failure use matching locally rendered stills with all content available.
- The six runtime posters total 43,786 bytes. All five club files total 2,877,454 bytes FULL / 1,588,350 REDUCED, with 66,612 source triangles. REDUCED retains geometry with smaller maps. Earlier scene-transfer, GPU memory and triangle targets are not certified for this expanded gallery. No guarantee of lag-free operation on all phones is made.
- Production build passes. Gzip output: initial JS 139.24 KB, CSS 13.19 KB, lazy WorldScene 9.53 KB, shared deferred GLTF 251.32 KB, retained B/C 8.72 KB. Vite's existing chunk-size warning remains; no dependencies added.
- Browser checked 390×844, 768×1024, 1440×900 and 1920×1080 CSS viewports; all five clubs, live modes, STATIC, reduced-motion preference, mesh/keyboard interactions, missing-first-model fallback/retry, offscreen release/re-entry and theme/variant switching. Final normal console checks were empty. Camera centering/FOV, LCD orientation, static anchor clearance, reveal completion and loading-progress reporting were corrected. See [CLUB_GALLERY_QA.md](CLUB_GALLERY_QA.md) and [REAL_3D_WORLD_IMPLEMENTATION.md](REAL_3D_WORLD_IMPLEMENTATION.md).
- Local production preview is **http://127.0.0.1:4182/?theme=Flux&variant=A&quality=FULL#main**; development server is on 4180. Rebuild/reload after source edits. Older 4180 production-preview notes below describe preceding passes.
- Remaining: owner source/visual approval, confirmed club programs and festival facts, physical midrange-phone checks, sustained isolated performance, GPU timing/residency, forced context-loss and actual OS reduced-motion checks. Earlier hardware/world candidates remain as source history and are not the current gallery. No backend, deployment or push was performed in this continuation.

## Detailed sourced hardware correction — 2026-10-07 (preceding pass)

- The owner rejected the procedural board's stylized appearance and requested product-quality realism with an exploded-parts scroll effect. Work continued from the existing immersive prototype; no redesign or other product phase was started.
- Flux A now renders the detailed **Circuit Board** asset by **Benny Weimer / Poly Haven**, under verified CC0, with its actual geometry, printed surface detail, normal/roughness/metal maps and alpha cutouts. It is a sourced hardware visualization, not asserted to be a physical photograph, scan, manufacturer CAD or accurate internal engineering teardown. The earlier handmade board remains only as source history.
- The source-preserving preparation script retains every one of the 14,430 original triangles, UVs and normals, and groups connected pieces into seven visual assemblies plus a nested fan rotor. Scroll .20–.55 separates cooler, memory, I/O, chips, slots and capacitors; reversing restores exact assembled transforms. FULL spins the actual rotor, with bounded existing pointer response and pulse feedback. Phone/tablet travel is smaller; REDUCED retains the same geometry with smaller textures and a still rotor.
- Added `src/RealHardwareBoard.tsx`, source records and `prepare_asset.py` under `references/flux/asset-candidates/circuit-board/`, served GLB/WebP assets under `public/models/circuit-board/`, and local poster capture tools. Updated `FluxScene.tsx`, `FluxNarrative.tsx`, `motion.css`. Existing one-Canvas/director architecture, wallpaper, semantic content, B/C and the previous all-theme entrances/Panel breakup remain.
- Asset fetch/decode/parsing is scoped and cancelled on teardown. Owned late results are disposed. Runtime readiness waits for the committed model/materials before compilation and Canvas reveal; the matching locally rendered still remains during loading/failure/reduction. A's loading deadline is eight seconds; adaptive sampling begins with a fresh two-second warmup after readiness. Fixed product framing so the identity band no longer cuts through the cooler.
- Production browser checks passed at 390×844, 768×1024, 1440×900, 1920×1080 and the owner's 750×715 annotation size. Checked exact reversal, source rotor motion, REDUCED, keyboard pulse, reduced-motion still, missing-model fallback/retry, quick variant cancellation and all theme/variant regressions. No browser errors/warnings observed. See [REAL_HARDWARE_QA.md](REAL_HARDWARE_QA.md) for evidence and limitations.
- Final build passes: initial JS 134.78 KB gzip, CSS 10.28 KB gzip, deferred Flux 259.13 KB gzip. Board assets are 1,495,650 bytes FULL / 562,496 bytes REDUCED; posters 59,666 / 41,662 bytes. Total enhancement transfer exceeds the earlier 1.5 MB / 700 KB targets; detailed provenance and residency estimates are recorded in [ASSET_MANIFEST.md](ASSET_MANIFEST.md). Physical-device/sustained performance is unverified. No dependency additions, Flux winner, final branding approval or deployment.
- Restarted the production preview at http://127.0.0.1:4180/ after the old process was no longer running. Rebuild/reload after later source edits. Final visual acceptance remains the owner's decision.

## Latest motion correction — 2026-10-06 (preceding pass)

- The owner clarified the requested exit: the individual Panel squares must pop apart, move diagonally left/right or upward, then fade in those directions. They also explicitly requested slow fade-and-pop entrances for below-fold text and boxes in all themes. This supersedes the earlier whole-cover fade and opaque-copy-only entrance choices for this scoped prototype.
- Added five dedicated exit wrappers in `PanelIntro.tsx`; `useLandingMotion.ts` drives Build up-left, Code up-right, Discover down-left, Play down-right and the central tile upward. The existing intro owns separate child layers. Scroll reversal reassembles the cover; invisible stage controls become inert. Responsive travel is smaller on phones; live motion is contained inside the hero with copy/actions above it. Reduced/STATIC preserves the intact cover and unclipped storyboard.
- Pulse, Panel and Flux now share staged below-fold opacity/position/scale entrances for labels, headings, paragraphs, cards, rows and lower content groups. Text takes 1.05 s and boxes 1.15 s with short staggers. Keyboard focus reveals its section immediately; visible filter/day results never wait; baseline HTML/CSS and reduced/STATIC remain fully visible. Pulse archive and Flux narrative sections are included without changing their internal directors.
- Updated `useLandingMotion.ts`, `PanelIntro.tsx`, `Heroes.tsx`, `ThroughTime.tsx`, `FluxNarrative.tsx`, `motion.css`. Verified local ui-ux-pro-max Scroll Reveal guidance with the FESTRONIX motion/accessibility/QA skills; no additional package, model or WebGL architecture change.
- Browser inspected all themes at 390×844, 768×1024, 1440×900 and 1920×1080, plus Panel at the 750×715 annotation size. Verified partial/full breakup, reversal, reduction/storyboard, gradual entrance states, correct card order, keyboard visibility, filters, Day 2 and FAQ expansion. Fixed escaping-tile page overflow. No new page console errors/warnings in final checks. Detailed evidence is at the top of [SCROLL_MOTION_QA.md](SCROLL_MOTION_QA.md).
- Final build passes: initial JS 135.52 KB gzip, CSS 10.27 KB gzip, deferred Flux 245.12 KB gzip; existing size warning remains. Preview at http://127.0.0.1:4180/ continues to serve the production build. All Flux candidates and the realistic Core board remain; no winner or subsequent product phase selected. Real-device performance and comprehensive accessibility certification remain pending.

## Annotated model / parent-exit refinement — 2026-10-06 (preceding pass)

- The owner annotated Panel artwork for an exit/disappearance during scrolling, and Flux Core A for a realistic, theme-related interactive model with matching live wallpaper. These scoped changes preserve the existing immersive direction, shared data and WebGL architecture.
- Panel's parent artwork now slides upward/outward, shrinks, rotates and fades with native scroll; reverse scrolling restores it. Invisible controls become inert; motion reduction restores still art and the existing storyboard. Phone motion uses the existing masked background composition and smaller responsive travel.
- Core A now shows an original physical processor board with PCB routing, metal CPU, etched X, active fan, ports, capacitors, screws and instanced components. Pointer tilt, scroll activation and accessible pulse feedback remain in the existing director/frame loop. A's circuit wallpaper carries traveling signals; its SVG fallback matches the same board. B/C remain available and unchanged in concept. No Flux winner selected.
- Added `ComputeBoard.tsx` and `ComputeBoardPoster.tsx`; updated the scene, narrative, wallpaper, DOM-motion hook and responsive styles. No downloaded model, copied texture, dependency addition or backend work. Asset provenance is recorded in [ASSET_MANIFEST.md](ASSET_MANIFEST.md).
- Browser verified Panel/A at 390×844, 768×1024, 1440×900, 1920×1080 and the additional 916×715 annotation size. Checked reverse exit, replay/scroll interruption, reduction/storyboard, STATIC, live variants, one Canvas and no horizontal overflow. Tablet/phone model fit and chip-mark attachment were corrected. See the final addendum in [SCROLL_MOTION_QA.md](SCROLL_MOTION_QA.md).
- Build passes; final normal checks logged no new browser errors/warnings. One scrolled-phone reload used the deadline fallback and recovered with Try visual enhancement. Core A observed 27 draw calls / 6,142 triangles FULL and 26 / 5,170 REDUCED. Browser scheduling stalls prevent a sustained FPS claim; real-device/GPU certification and final visual approval remain pending.
- Production-build preview remains at http://127.0.0.1:4180/. Rebuild/reload after later source edits. The comparison remains local; no subsequent product phase is authorized.

## Scroll / live-background pass — 2026-10-06 (preceding pass)

- The owner authorized working scroll animation for all themes and a little interactive live 3D background, then explicitly asked to continue. Added theme-specific content entrances and decorative parallax, restrained CSS 3D wallpaper for Pulse/Panel, and a live WebGL grid/pulse backdrop for Flux. Existing five Flux chapters and shared content/data remain.
- Added keyboard/click/tap Send a pulse controls; reduced-motion/STATIC retains still art and disables motion. Full Flux idle motion is now deliberately live at a low render frequency while the opening is visible; hidden/offscreen/information-handoff rendering still stops. REDUCED stays demand-based. This supersedes the previous FULL eight-second idle-stop rule for this authorized decorative feature only.
- Added `useLandingMotion.ts`, `LiveWallpaper.tsx`, `SpatialWallpaper.tsx` and `motion.css`; updated the shell/hero/scene interfaces and resource scheduling. Contexts, timers and listeners are scoped and cleaned up. No animation systems share the same transform properties.
- Fixed scrollbar overflow, deferred-import fallback and a load-deadline/readiness race found during real browser checks. A forced missing-module test preserved event content and recovered the selected Liquid/REDUCED view after the asset was restored.
- See [SCROLL_MOTION_QA.md](SCROLL_MOTION_QA.md): four target viewports, all themes, all Flux quality/variant controls, keyboard pulse, filtering/day changes, reduction and offscreen pausing were checked. Build passes. No new normal-workflow browser errors were observed after the fixes; intentional failure-test logs are recorded separately.
- Preview at http://127.0.0.1:4180/ now serves the production build through a hidden local Vite preview process. It stays usable after the development session ends. Rebuild/reload for later changes; no hosting deployment or backend was added.
- Final art, physical-phone performance and comprehensive accessibility/GPU testing remain pending. No Flux winner selected; no new product phase started.

## Focused UX review — 2026-10-06 (preceding pass)

- Applied the newly installed ui-ux-pro-max skill with all six FESTRONIX visual/context skills under the owner's focused-review authorization. Used verified local focus, heading-balance and React effect guidance; no new design system, architecture plan or external package was introduced.
- Created [PROTOTYPE_UX_REVIEW.md](PROTOTYPE_UX_REVIEW.md) with prioritized critique, changes, measured outcomes and QA limits. Added `src/polish.css` and `src/useSectionNavigation.ts`; updated `main.tsx`, `SharedContent.tsx` and `ThroughTime.tsx`.
- Improved hero scale, readable facts, heading measures, section/card rhythm and control boundaries. At 390×844 both hero actions are visible in all themes. Phone comparison controls open from Header Compare and no longer cover actions; Close/Escape restores focus. Desktop comparison remains a compact launcher and yields visually to keyboard focus without losing its Tab route.
- Filters now show selection/counts and contextual result feedback; mobile uses a 2×2 arrangement. Navigation identifies the current content section. Archive Choose edition focuses year controls, with Left/Right/Home/End support and existing click/tap/Previous/Next preserved.
- Rechecked all themes at 390×844, 768×1024, 1440×900 and 1920×1080, plus 320 px reflow. Checked 18 Flux variant/mode states at phone and desktop widths, Panel replay/reduction, keyboard focus and archive selection. Build passes; no page overflow or browser/shader errors observed.
- Preserved WebGL scene/camera/shader/progress architecture, Panel's timing and original art, Pulse's depth interaction, shared data and all three Flux experiments. No Flux winner selected. Final assets, full accessibility certification and physical-phone performance remain pending.

## Immersive implementation — 2026-10-06 (preceding pass)

- The owner's latest message explicitly authorized rebuilding the public visual prototype against the approved immersive architecture. The previous rebuild/review gate is superseded for this scoped implementation; final branding and production policy remain provisional.
- Rebuilt `prototypes/festronix-visual/` into a shared shell/content layer and separate presentation modules. New modules: `experience.ts`, `Heroes.tsx`, `FluxNarrative.tsx`, `PanelIntro.tsx`, `ThroughTime.tsx`, `SharedContent.tsx`. Significantly replaced `main.tsx`, `FluxScene.tsx`, `styles.css`; updated `index.html` for active-theme font loading. Retained `data.ts`, `Art.tsx`, package/lockfile and existing dependency versions.
- Pulse Through Time, Panel's optional intro, Flux Core, Liquid and Network/Portal are implemented. Prototype controls expose all three themes, all Flux candidates and FULL/REDUCED/STATIC. No winner is selected. All public facts/history remain clearly fictional; no final artwork was generated.
- Flux now has one full-background scene spanning five deterministic scroll chapters, hybrid DOM typography, bounded pointer interaction, category signals and opaque information handoff. Runtime uses demand rendering, visibility checks, scoped listeners, owned resource disposal and a ten-second offscreen release. Returning to the opening recreates its selected scene at current progress.
- Panel uses original SVG/CSS art, automatic first-entry playback, skip/replay, interruption and reduced-motion storyboard. Pulse uses explicit year controls, short desktop depth travel, mobile simplification and static selection. Menu/dialog keyboard focus was checked.
- `npm run build` passes. Browser checked 60 theme/variant/mode states across 390×844, 768×1024, 1440×900 and 1920×1080; also checked 320 px Flux reflow. No page overflow, duplicate simultaneous Canvas, naturally occurring shader failure or browser console error observed. See [IMMERSIVE_PROTOTYPE_QA.md](IMMERSIVE_PROTOTYPE_QA.md) for evidence, fixes, payload/counter observations and honest limits.
- Local Vite preview runs at **http://127.0.0.1:4180/**. Use the bottom-right Prototype controls. Initial theme is Pulse; select Panel or Flux for comparison. The server is local and no deployment was performed.
- Remaining: human visual comparison/Flux selection; final brand/fonts and real archive media; physical-phone/GPU and sustained performance testing; full contrast/text-zoom/spacing audit; actual OS reduced-motion toggle and forced context-loss/import-failure verification. The deferred ~895 KB uncompressed Flux chunk triggers Vite's size warning (~243 KB gzip); initial app remains ~131 KB gzip plus ~8 KB CSS.
- No backend, Firebase, database, authentication, payment verification, admin dashboard or QR phase was started. No new dependency packages or final media assets were added. Do not automatically start another phase.

## Immersive reset specification — 2026-10-06 (preceding phase)

- Created [PROTOTYPE_DIRECTION_RESET.md](PROTOTYPE_DIRECTION_RESET.md), [IMMERSIVE_INTERACTION_ARCHITECTURE.md](IMMERSIVE_INTERACTION_ARCHITECTURE.md) and [ASSET_MANIFEST.md](ASSET_MANIFEST.md). The owner authorized a build-ready creative and technical specification, explicitly not a rebuild. No prototype source, dependencies, integrations or final assets were changed.
- Inspected the actual `prototypes/festronix-visual/` React/Vite sources: `main.tsx`, `FluxScene.tsx`, `Art.tsx`, `data.ts`, `styles.css` and package declarations. The older “no prototype started” entries below describe prior phases; a local visual prototype now exists. This workspace is not currently a Git repository.
- Reset Flux from a half-width scene card to one full-width backdrop across identity, introduction/activation and category discovery, handing off to opaque content before detailed event cards. Core, Liquid and Network/Portal remain equal unbuilt experiments under the new specification; none is selected.
- Specified hybrid DOM/WebGL typography with an intact semantic title, separate editable edition, X registration, bounded decorative depth and no distortion of essential letters. ScrollTrigger owns progress; R3F owns camera/scene updates; GSAP owns separate DOM decorations. One scene/context at a time, native scrolling and explicit cleanup.
- Specified Panel's original optional 3.2-second in-hero comic intro, 2.4 seconds on phone, including skip/replay/persistence, immediate content access and reduced-motion behavior. Specified Pulse's recommended Chrono Archive: explicit year selection plus a short image-tunnel transition, CSS/SVG implementation and ordinary archive fallback.
- Defined FULL/REDUCED/STATIC budgets, downgrade rules, four-size responsive matrix, feature-specific accessibility/failure behavior and a weighted fair-comparison rubric. These are targets and future acceptance checks, not measured performance or completed frontend QA.
- Browser-inspected the four requested reference URLs and initial/scrolled states; directly viewed representative local Pulse, Panel, Flux and Infinium images. Exact evidence and limitations are in the direction reset. Live mobile behavior and reference intro durations were not verified. Reference assets will not ship as artwork.
- Applied all six requested repository skills: festronix-context, premium-web-design, immersive-webgl-r3f, motion-interaction, performance-accessibility and browser-visual-qa. Browser QA guidance defines the future rebuild acceptance matrix; no changed frontend exists to certify in this documentation task.
- **Survives:** shared fictional edition/events/FAQ data, filters/day selection, content hierarchy, procedural placeholder art, semantic content patterns and existing React stack. **Refactored:** App shell/components, theme/preferences, menus/dialogs, lifecycle/fallbacks and quality management. **Replaced:** boxed Flux layout, current generic sculpture implementations, unrelated title/pointer/idle animation drivers and hero-only scene lifetime.
- **Readiness:** three Flux experiments YES (specified, not built); Panel intro YES; Pulse time interaction YES. Before coding: explicit rebuild authorization and pending visual-system review. Final archive rights, live facts and brand/font approval are release dependencies. No backend/product-workflow implementation is authorized.

## Work completed (prior phases; current reset above takes precedence)

- Created `docs/LANDING_PAGE_BLUEPRINT.md` and `docs/DESIGN_SYSTEM_DRAFT.md` under the owner's scoped public-prototype planning authorization. Defined shared section order, theme treatments, provisional component tokens, mobile/fallback behavior and all three competing Flux heroes (CORE, LIQUID FLUX, TECH NETWORK / PORTAL), including readable interactive FESTRONIX/edition typography. No winner, final fonts or permanent logo selected; no website/backend implementation started. Design system remains DRAFT — REQUIRES ASTRA REVIEW.
- Resolved U5–U11 together under the owner's authorization using conservative configurable product defaults in OWNER_DECISIONS and PRODUCT_SPEC. Listed faculty confirmations separately; no college policy, staff availability, budget, technical architecture or next phase was silently approved. U1–U4 decisions are unchanged.
- Completed typography-only exploration in `docs/TYPOGRAPHY_DIRECTIONS.md`: three directions per theme, a shared body/UI recommendation, numeric/mobile/performance considerations and provisional favorites. Font selection remains unapproved; no font files, application code or complete design system were created, and product decisions remain unchanged.
- Created the FESTRONIX workspace and eight repository skills under `.codex/skills/`.
- Copied 39 unique uploaded paths into reference folders, preserving filenames and verifying SHA256 against originals: 2 Pulse, 26 Flux, 10 Infinium landing, 1 excluded dashboard.
- Recorded all attachments and detailed source-family observations in `docs/THEME_REFERENCES.md`, including conceptual borrowing, explicit avoidance, evidence limits and proposed theme treatments.
- Retained the dashboard in `references/infinium-landing/excluded/` solely for archive completeness; excluded its UI and architecture from analysis.
- Identified the clipboard image as an exact duplicate of Screenshot (373). Repeated sequence frames remain archived.
- Reviewed supplied URLs. Infinium public text supports limited landing hierarchy observations; AEON and Pinterest findings rely on attached screenshots where retrieval supplied no usable content.
- Created `docs/PRODUCT_SPEC.md` covering roles and scope, public/participant/coordinator/faculty capabilities, event and edition lifecycles, approved-event revisions, Theme Manager, bounded CMS, phased scope, risks and unresolved policies.
- Applied `festronix-context` and `premium-web-design`; used `auth-rbac-security` only to identify permission-sensitive product responsibilities and actions. No database permissions or authentication implementation were designed.
- Recorded recommended decisions R1–R9 and unresolved decisions U1–U11. Product/workflow review now precedes screen inventory.
- Created `docs/OWNER_DECISIONS.md` with concise questions, realistic options, recommendations and impacts for U1–U11; subsequently recorded the owner's selections for U1/U2 (Modified Option B), U3 (Modified Option A) and U4 (Modified Option C). U5–U11 have no selections.
- Updated PRODUCT_SPEC to include manual payment-proof verification in MVP, assigned-event payment review and faculty/admin oversight, rejected-proof resubmission, configurable annual edition/CMS requirements and faculty-approved event-level admission/team policies.
- Updated PRODUCT_SPEC with event-specific eligibility controls, limited ID inspection at check-in/attendance, under-18 policy handling and faculty/admin approval for non-student participation.
- Recorded Firebase Authentication as a provisional preference only: Google Sign-In primary, passwordless email-link secondary, email-link ownership verification, separate authorization and possible later MFA for faculty/admin. No provider configuration, packages, code or final architecture decision was made.
- Updated PRODUCT_SPEC with a two-faculty-custodian continuity model, edition Faculty Approvers, owner-managed staff assignment and explicit no-hardcoded-email requirement.
- Updated documentation only. No application, backend, schema, authentication, configuration or generated assets were changed.

## Files inspected

- `docs/AI_HANDOFF.md` and `docs/THEME_REFERENCES.md`
- `docs/REFERENCE_CANDIDATES.md` and the new `docs/PRODUCT_SPEC.md`
- `docs/OWNER_DECISIONS.md`
- `.codex/skills/festronix-context/SKILL.md` and `.codex/skills/premium-web-design/SKILL.md`
- `.codex/skills/auth-rbac-security/SKILL.md` — product boundaries only
- Uploaded Screenshot (368) through Screenshot (402), three dated screenshots and one clipboard image; individual mapping is in the theme reference register.
- `references/pulse/`, `references/panel/`, `references/flux/`, `references/infinium-landing/` and its excluded subfolder.

Analysis was completed in this chat from supplied sources; no separate Go task was invoked.

## Earlier theme directions (immersive presentation superseded by current reset)

- **Pulse:** UX London and Hatch anchor clean typography, clear metadata/actions and calm content blocks; Config, OFFF and Forward add restrained play and festival energy. Live mobile captures support the direction; AEON remains secondary metadata evidence.
- **Panel:** Tokyo's professional manga hero, beyond tellerrand's printed masthead and Presstival's framed program establish an independent illustration/editorial direction. Beyond tellerrand and Presstival have live mobile evidence; Vulture adds published historical desktop/mobile mockups. Infinium remains secondary public-landing evidence.
- **Flux:** OPTICORE remains the material anchor. Lusion adds a bounded 3D hero, readable content/card hierarchy and actual mobile stacking. Hatom adds dark atmospheric desktop/mobile scene composition plus readable About modules; Hatom Labs adds a dark content/action surface. Borrow principles for original assets; do not copy scenes or financial content. Labs' clipped mobile module is caution evidence, not a mobile quality anchor.

## Unresolved visual decisions

- New blueprint/system values are provisional. CORE, LIQUID FLUX and TECH NETWORK / PORTAL are preserved equally for comparison; none is the selected Flux hero. Interactive typography is a temporary hero treatment, not permanent logo approval.
- Final fonts, palettes, spacing scales, imagery, object forms and theme-specific component details.
- Motion triggers/timing, loading, reduced-motion alternatives and mobile composition are now specified in IMMERSIVE_INTERACTION_ARCHITECTURE; implementation testing remains pending. Earlier reference screenshots do not verify those proposed behaviors.
- Final FESTRONIX event/logistics/footer compositions; reference evidence is now sufficient, but implementation and human brand approval remain pending.
- Human review of the source analysis and proposed theme synthesis.

## Missing references

The earlier batch added 24 usable captures: 14 Pulse and 10 Panel. The Flux batch adds 16 live JPEG captures (5 Lusion, 6 Hatom, 5 Hatom Labs) under `references/flux/`, including readable content/modules and 390×844 mobile evidence. All three themes are sufficiently supported in aggregate. See `docs/THEME_REFERENCES.md` and `docs/REFERENCE_CANDIDATES.md` for URLs, preferred files, borrowing/avoidance and limits. No Flux site-wide capture block was encountered; Labs' narrow Press module clips and is not positive mobile evidence. Tokyo's embedded media and Config's consent iframe limitations remain optional improvements; Vulture mobile is historical published mockup evidence. Human visual approval of final brand choices remains pending.

## Recommended next task

Review the backend foundation and documented limits, then provide institutional staging configuration and faculty operating/security decisions for a separately authorized real-provider integration and deployment-readiness pass. Read `BACKEND_SETUP.md` first. Do not automatically build participant/admin/scanner UI or deploy the API.

The independent visual comparison remains under `prototypes/festronix-visual`; its prior preview URL was http://127.0.0.1:4180/. No current preview availability is asserted by this backend task. Final Flux choice, branding, media rights and physical-device/accessibility approval remain separate frontend work.

## Product decision status

**Established user requirements:** One reusable annual FESTRONIX platform for Vardhaman; faculty can perform normal administration without developers; coordinators manage assigned work only; Pulse/Panel/Flux change presentation without duplicating business data; preserve annual history. Visual-reference evidence gate is passed.

**U1 final decision — Modified Option B, 2026-10-06:**

- Some events are free and some paid; no general fest pass in MVP. Free registration may confirm immediately under capacity/eligibility rules.
- Paid participants register, pay using the method/instructions configured for their event, and upload proof such as a screenshot plus transaction/UTR/reference number. Their registration is `PAYMENT_VERIFICATION_PENDING` until approved, then `CONFIRMED`.
- Only coordinators assigned to that specific event may review its payment proofs. Authorized faculty/admin may review, override or audit verification. Rejected/invalid proof has a clear reason and re-upload/resubmission path. No payment gateway integration is required for MVP.
- U1 settles the payment model. Pending-capacity treatment, verification deadlines, duplicate proof/reference handling, reconciliation, receipts and cancellation/refund responsibilities still need explicit operating rules before paid launch; U4 now requires event-specific policy and U7 remains pending.

**U2 final decision — Modified Option B, 2026-10-06:**

- FESTRONIX may accept students from Vardhaman and other recognized colleges/universities. Each event may define approved institution type, restricted colleges, academic year, department/branch and genuine age/safety restrictions.
- Student-ID upload is not required by default. Authorized event staff/coordinators may inspect a valid college ID at check-in or attendance where verification is needed; routine copying or retention of ID images is not authorized.
- Under-18 college students may participate where institutional and event policy permits. General-public/non-student participation is disabled by default and requires event-specific faculty/admin approval.
- Coordinators propose eligibility only for their assigned events. Material eligibility rules require faculty approval during event approval or revision.

**U3 final decision — Modified Option A, 2026-10-06:**

- Every active platform has at least two institutional faculty custodians: a Primary Faculty Owner / Super Admin and a Backup Faculty Owner / Super Admin. The platform never depends on one person or hardcoded email for institutional control.
- Asif Sir is expected to be the current Primary Faculty Owner after his email is provided and an authorized FESTRONIX role assignment is made. His email is not application logic.
- One or more edition-scoped Faculty Approvers review event submissions and material changes. Student Core Team supports operations but can never be the sole owner or recovery path. Event Coordinators remain assigned-event scoped.
- Faculty Owners manage future faculty admins, approvers, Core Team users and coordinators through the admin interface. If the primary owner is unavailable, the backup owner continues control and completes a recorded ownership handover.

**U4 final decision — Modified Option C, 2026-10-06:**

- Each event may configure its participant/team capacity, registration deadline, optional waitlist, approved walk-ins, team-size minimum/maximum, team-edit/change deadline, late-substitution policy and schedule-clash behavior.
- Advance registration is the normal path; waitlists are optional; walk-ins are disabled by default. Participants may make allowed changes before the event's configured deadline. Afterward, material team changes need authorized coordinator/faculty handling under the published event policy.
- Confirmed registrations never silently exceed capacity. A schedule clash warns participants at minimum; an event blocks an incompatible overlap only when it is explicitly configured and faculty-approved.
- Assigned coordinators can propose/configure only their events' policies. Material capacity/admission/team policy needs faculty approval before publication. Authorized faculty/admin can override when needed; later technical design must provide an audit trail.

**Owner-confirmed reusable administration:** Coordinators receive access only after authorized faculty/admin assignment and only for assigned events. Ordinary annual operation should not require a developer. Faculty/admin must eventually edit edition display labels (`2026`, `2027`, `2K27`), separate logo/edition lockups, dates, tagline, theme, sponsors, contacts, hero content, featured events, FAQs, registration state and announcements through bounded settings/CMS. The core FESTRONIX brand/logo remains year independent. U3 resolves institutional ownership and staff assignment; U4 resolves event-level admission/team policy; theme publication authority retains its pending product status, and no U5–U11 choice is implied.

**Provisional authentication preference:** FESTRONIX is expected to use Firebase Authentication, subject to later architecture review. Google Sign-In is the preferred primary sign-in option; passwordless email-link authentication is secondary, and a successful link verifies ownership of the email address. Authentication and authorization remain separate: sign-in never grants faculty/admin/coordinator privileges. Authorized administrators assign FESTRONIX roles and event/edition scope separately. Faculty/admin accounts may later require stronger security such as MFA. This is not provider configuration or a finalized technical architecture decision.

**U5–U11 final product decisions — 2026-10-06:**

- **U5, Modified C with 48-hour default:** Faculty approves per-event appeal rules, provisional results and final release; assigned coordinators prepare outcomes/evidence and route queries. Disputed affected awards/certificates stay held; independent review handles conflicts. Prize funding, owner and delivery date need confirmation before advertising.
- **U6, Modified A:** Certificate entitlement is event-specific (none/winners/eligible attendees/both), with no promise until faculty approves it. Coordinators prepare recipients/evidence; faculty controls template/signatory and release. MVP uses private individually assigned PDFs and issuance/correction history; a 14-day target is published only after staffing confirmation.
- **U7, Modified B:** Private records by default; public reference/team-name results, personal recognition only under approved permissions. Faculty data steward controls publication, exports, retention and exceptions. Proposed periods: ordinary records 12 months after closeout, temporary rosters 30 days after reconciliation, proof images 90 days after financial reconciliation/dispute closure, minimal certificate evidence three years after issue. All periods, finance/account/audit/backup rules and permission/minors wording require faculty confirmation or replacement before collection. Restricted holds preserve necessary unresolved evidence; archiving is not indefinite personal-data retention.
- **U8, Modified A:** Email plus persistent participant notices, simple support ownership/status and event-day phone/duty-faculty escalation. Coordinators handle assigned-event queries/approved reminders; faculty controls changed commitments, emergencies and channels/coverage. Confirm contacts/staff and any two-working-day response target. No SMS, group messaging or full ticketing in MVP.
- **U9, Modified A:** Individual/team competitions, hackathons and workshops/talks; one registration per event with scheduled sessions and manual outcomes. No scoring/bracket engine or independently bookable batches; genuinely separate batches may be separate approved events. Actual scale/resources and manual workload require faculty confirmation before implementation sizing.
- **U10, Modified A:** One edition accepts registrations; next is prepared privately and activated by owners after readiness/old-admission closure. Old results, disputes, prizes and certificates can continue with explicit closeout access. Preserve URLs/facts, fresh student assignments and maintained accessible archive; no participant/payment copying. Faculty names archive steward and reviews corrections; U7 governs private-data retention.
- **U11, Modified A/B resourcing:** Institutional faculty ownership plus named technical maintainer/backup, budget approver, annual/pre-edition review and event-day escalation. College IT if accepted, otherwise contracted support under faculty governance. Students never form the sole recovery path. People, support acceptance, budget, renewals and recovery ownership are launch confirmations, not selected suppliers or infrastructure.

Earlier U1–U4 passages and historical completion/log entries retain their original pending references; the current U5–U11 resolutions supersede those status references only. The U1–U4 rules themselves remain unchanged.

**Recommended, not yet approved:**

- Keep six role families, rename Core Team to Fest Operations Lead and Volunteer/Scanner to Check-in Operator; use explicit expiring edition/event/duty assignments. Institutional owners retain continuity and theme/edition publication authority.
- Require independent faculty approval for material event revisions and results. Separate event lifecycle, admission availability and revision review; distinguish Ended from Completed and retain cancellation/correction history.
- Member acceptance, manual attendance and controlled individual certificate delivery where promised remain recommendations. The earlier free-only recommendation is superseded by the owner's U1 manual paid-event decision.
- Use selective annual configuration copying, fresh student assignments and private next-edition preview. Activation never deletes or transfers historical participant records.
- Use a bounded CMS, one shared content set and presentation-only theme rollback. Defer arbitrary page builders, QR automation, automatic certificates and low-value ancillary features.
- Review product decisions and user workflows before screen inventory. Technical architecture and visual prototypes remain separate later tasks.

**Faculty confirmations outstanding:** Event appeal/judging rules and independent reviewer/backup; prize funding/fulfilment dates; certificate eligibility, signatory, owner and achievable deadline; publication permissions/minors wording, retention periods and finance/account/audit/backup handling, data steward; monitored support contacts/coverage; actual scale/resources/manual workload; edition activation/closeout/access and archive steward; named maintainer/backup, budget/renewals and support acceptance. Manual-payment and admission operating details from U1/U4 remain outstanding. These confirmations gate affected live operations; U5–U11 product choices are resolved.

**Owner checklist status:** 11 of 11 product choices resolved. U1–U4 unchanged; U5 Modified C, U6 Modified A, U7 Modified B, U8/U9/U10 Modified A, U11 Modified A with B resourcing fallback. Faculty-sensitive commitments remain subject to confirmation. User flows require a separate instruction.

## Working agreements

- Use realistic mock data so public pages can be designed without waiting for final fest information.
- Do not treat generated concepts or draft design documents as approved without an explicit review decision.
- Keep the core FESTRONIX logo year independent; configure edition/year display and logo lockup separately through settings/CMS.
- Product definition and U1–U11 remain the baseline. The later explicit backend authorization now permits the implemented backend architecture and Firebase identity preparation; it does not grant live-deployment or frontend-integration approval.
- Use Infinium only for landing-page hierarchy, hero presentation, visual pacing, section composition, and public-facing UI presentation. Do not derive backend, database, dashboard, CMS, authentication, or product architecture from it.
- Do not generate actual assets before `docs/ASSET_MANIFEST.md` exists.

## Scope boundaries after backend authorization

- Do not automatically start user flows, screen inventory, frontend integration, final participant/coordinator/admin interfaces or public-site redesign.
- Do not deploy or claim live readiness before real identity/database/storage configuration, faculty policies and operational verification.
- Payment gateway, production email/SMS, full certificate generation, dynamic QR and offline scanning remain deferred.
- The modular backend, PostgreSQL migrations, Firebase verification middleware, manual-payment and QR foundation are now authorized and implemented. This is not approval of every future production infrastructure choice.

## Review Gate

Backend foundation gate: **LOCAL VERIFICATION COMPLETE — 2026-10-16**. 58 tests passed, build passed, three migrations exercised. Real Firebase authentication and production security/operations remain unverified; no launch approval or next-phase authorization is implied.

Visual-reference evidence gate: **PASSED — 2026-10-06**. This assesses evidence sufficiency only; it does not approve final brand choices or authorize the next phase.

Product review status: **SUFFICIENT FOR SCOPED PUBLIC PROTOTYPE PLANNING**, per the owner's latest instruction; institutional policy/live-operation confirmations remain pending. Full workflows precede the later full screen inventory. For the scoped public comparison, LANDING_PAGE_BLUEPRINT and DESIGN_SYSTEM_DRAFT now supply the planning basis; the draft requires review and coding still requires a separate instruction. No full-screen-inventory prerequisite is imposed on this newly authorized limited planning scope.

Owner decision gate: **COMPLETE AT PRODUCT LEVEL — U1–U11 RESOLVED**. Institutional policy and launch confirmations remain outstanding. `USER_FLOWS.md` has not been started and requires separate authorization; no automatic next-phase progression.

## Planned deliverable order

**Scoped public comparison branch, authorized 2026-10-06:** LANDING_PAGE_BLUEPRINT and DESIGN_SYSTEM_DRAFT are now created. Review these drafts before separately authorized public prototype coding; ASSET_MANIFEST precedes actual asset generation. This branch may use labeled mock content while the full-platform sequence below remains deferred. No next task starts automatically.

The later explicit backend implementation request established a separate completed foundation branch described above. The historical sequence below does not require redoing completed documents or block that authorized work.

1. `docs/THEME_REFERENCES.md` — evidence complete; visual-reference gate PASSED
2. `docs/PRODUCT_SPEC.md` and `docs/OWNER_DECISIONS.md` — U1–U11 resolved at product level; faculty confirmations outstanding
3. `docs/USER_FLOWS.md` — after product decision review and separate authorization
4. `docs/SCREEN_INVENTORY.md` — derived from accepted workflows
5. `docs/BRAND_CONCEPTS.md`
6. `mock-data/*.json`
7. `docs/ASSET_MANIFEST.md`
8. `docs/DESIGN_SYSTEM_DRAFT.md` — label `DRAFT — REQUIRES ASTRA REVIEW`
9. `.codex/skills/` — core skills created early at the user's request; future use remains subject to phase limits
10. Static Antigravity prototypes under `prototypes/pulse/`, `prototypes/panel/`, and `prototypes/flux/`
11. Astra architecture review after reset and separate authorization

## Asset direction

Create and review the asset manifest before generating actual assets. Each family should share a coherent art direction. Record format, dimensions, transparency, and intended use for every asset.

## Agent Skills

Repository-scoped skill location: `.codex/skills/`. The earlier `.agents/skills/` placeholder is not the active skill location.

- `festronix-context` — project context and handoff constraints
- `premium-web-design` — public page composition and theme language
- `immersive-webgl-r3f` — Flux and interactive 3D scenes
- `motion-interaction` — purposeful animation and interaction behavior
- `postgres-data-modeling` — methodology for later authorized persistence work
- `auth-rbac-security` — used for product role boundaries and sensitive actions only; technical access-control work remains deferred
- `performance-accessibility` — accessible, responsive, performant student-phone use
- `browser-visual-qa` — rendered frontend verification at the four required viewport sizes

Each folder contains a concise `SKILL.md` with `name` and `description` front matter. No application code, database tables, provider configuration, or final architecture decisions were created. Visual evidence passed through reference review; skill setup itself does not approve product policy, final branding or prototypes.

Core context recorded for future work: FESTRONIX is a reusable annual tech-fest platform for Vardhaman; faculty should eventually operate future editions without developers, and student coordinators receive scoped access. Supplied images/Pinterest references are inspiration for original interpretations, not designs to clone.

## Shared rules across all themes

- FESTRONIX is one website/platform.
- Preserve one content hierarchy, event dataset, CMS, URL structure, and later shared backend.
- Themes change presentation, not business data; never duplicate event information for a theme.
- One admin Theme Manager should switch among Pulse, Panel, and Flux.
- Accessibility and responsive behavior are mandatory; keep the same responsive breakpoints.
- Do not make production technical decisions during visual reference analysis.

## Decision log

| Date | Decision | Status |
| --- | --- | --- |
| 2026-10-16 | Implement authorized backend foundation with Fastify/TypeScript, PostgreSQL `pg`, Firebase identity and scoped server permissions; preserve U1–U11 and frontend work. | Implemented; 58 local tests pass; live configuration/review pending |
| 2026-10-05 | Create one FESTRONIX master workspace as the cross-tool source of truth. | Adopted |
| 2026-10-05 | Keep Pulse, Panel, and Flux as separate visual directions; use Infinium only for public landing-page presentation inspiration. | Adopted as analysis constraint |
| 2026-10-05 | Defer production backend, auth, database schema, payments, QR system, and final repository architecture. | Adopted for current phase |
| 2026-10-05 | Do not generate actual assets until the asset manifest exists. | Adopted |
| 2026-10-05 | Keep the core logo independent of edition/year and defer permanent logo approval. | Adopted |
| 2026-10-05 | Create exactly eight core repository skills in `.codex/skills/` now; retain phase limits on their later use. | Adopted at user request |

| 2026-10-05 | Import and analyze 39 supplied reference paths; exclude dashboard, retain duplicates, and keep visual review pending. | Completed documentation; gate not passed |


| 2026-10-05 | Shortlist five independent Pulse and four Panel references; save partial desktop evidence and candidate analysis; require visual review and supplemental captures. | Evidence added; gate pending |

| 2026-10-05 | Add 24 usable shortlisted-reference captures (14 Pulse, 10 Panel), distinguish live responsive views from published mockups, and record Tokyo/Config capture limits. | Pulse and Panel sufficient; gate PARTIALLY PASSED; Flux content/mobile still needed |

| 2026-10-06 | Complete Flux visual evidence with 16 live captures, distinguish separate content pages and mobile quality limits, and retain original material inspiration. | Pulse, Panel and Flux sufficient; visual-reference evidence gate PASSED; next phase not started |

| 2026-10-06 | Define the annual platform in PRODUCT_SPEC, distinguish fixed requirements from recommendations R1–R9 and unresolved policies U1–U11, and put product/workflow review before screen inventory. | Product specification completed as recommended baseline; stakeholder review pending; no technical architecture, screens or prototypes started |

| 2026-10-06 | Prepare OWNER_DECISIONS questions/options for U1–U11; await the owner's selections one by one before user flows. | All 11 pending; no recommendations adopted; USER_FLOWS remains blocked |

| 2026-10-06 | Resolve U1 as Modified Option B: mixed free/paid events, manual proof/reference verification, assigned-event coordinator review with faculty/admin oversight, resubmission, no general pass or required gateway. Confirm assigned coordinator access and configurable annual CMS/edition presentation. | Owner adopted U1 and reusable-admin requirements; U2–U11 pending; no user flows or technical architecture started |

| 2026-10-06 | Resolve U2 as Modified Option B: Vardhaman/recognized external-college/university students, approved event-specific eligibility, no default ID upload, limited ID inspection, under-18 participation where permitted, and event-specific faculty/admin approval for non-students. | Owner adopted U2; U3–U11 pending; no user flows or technical architecture started |

| 2026-10-06 | Record Firebase Authentication as a provisional preference: Google Sign-In primary, passwordless email-link secondary, separate role assignment/authorization, possible later faculty/admin MFA. | Preference only; no configuration, packages, authentication code or final architecture decision; U1/U2 unchanged and U3–U11 pending |

| 2026-10-06 | Resolve U3 as Modified Option A: Primary and Backup Faculty Owners required for an active platform, edition Faculty Approvers, owner-managed staff assignments, no hardcoded owner email and recorded recovery handover. | Owner adopted U3; Asif Sir is expected current primary after a separate authorized assignment; U4–U11 pending; no user flows or technical architecture started |
| 2026-10-06 | Resolve U4 as Modified Option C: faculty-approved, event-level capacity, deadline, optional waitlist, walk-in, team-change/substitution and schedule-clash policies; no silent confirmed-capacity overflow. | Owner adopted U4; assigned coordinators propose only for their events, material policy changes require faculty approval, and later technical design must audit overrides; U5–U11 pending; no user flows or technical architecture started |
| 2026-10-06 | Resolve U5–U11 together under owner authorization: configurable results/appeals and certificates, private participant records with faculty-confirmed retention, email/notices/support, focused formats, one registering edition and institutional maintenance accountability. | Product choices resolved; faculty policy, staffing, funding, scale and launch confirmations outstanding; U1–U4 unchanged; no user flows, screen inventory, code or technical architecture started |
| 2026-10-06 | Create shared landing-page blueprint and provisional visual-system draft for Pulse/Panel/Flux; preserve CORE, LIQUID FLUX and TECH NETWORK / PORTAL plus readable interactive wordmark variants. | Planning documents complete; DRAFT — REQUIRES ASTRA REVIEW; scoped public mock prototypes require separate coding authorization, full product flows/inventory remain deferred, and no website/backend implementation started |
| 2026-10-06 | Complete immersive direction reset, animation ownership, Panel storyboard, Pulse Chrono Archive, provisional assets, performance/fallback budgets and three-way Flux experiment protocol. Supersede boxed Flux guidance; inspect existing React prototype without changing it. | Specification complete; no winner, code, integrations or final asset generation. Rebuild requires separate authorization; visual-system review and measured frontend QA remain pending |
| 2026-10-06 | Implement the explicitly authorized immersive public prototype: shared content, Pulse Chrono Archive, Panel intro, Flux A/B/C, quality tiers and browser QA at four sizes. | Working comparison ready; no Flux winner or subsequent product phase. Final artwork, real-device performance and full accessibility certification pending |
| 2026-10-06 | Apply ui-ux-pro-max and FESTRONIX skills for focused critique/polish: hero hierarchy, responsive actions, comparison-control placement, filters, navigation and archive keyboard controls. | Browser verified at four target sizes; approved immersive architecture preserved; no winner or new product phase |
| 2026-10-06 | Add theme-specific scroll motion, CSS 3D depth for Pulse/Panel, live Flux wallpaper and pulse controls; repair loader/readiness/overflow issues found in browser QA. | Implemented and tested at four viewports; production-build local preview retained; no next product phase or Flux winner |
