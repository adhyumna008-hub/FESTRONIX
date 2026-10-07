# FESTRONIX immersive prototype direction reset

**Date:** 2026-10-06  
**Status:** Build-ready specification for the next authorized prototype; not implementation or final brand approval.  
**Companions:** [Interaction architecture](IMMERSIVE_INTERACTION_ARCHITECTURE.md), [asset manifest](ASSET_MANIFEST.md), [handoff](AI_HANDOFF.md).

## 1. Authority and scope

The current owner brief supersedes the bounded Flux hero, half-width stage and hero-only motion in LANDING_PAGE_BLUEPRINT sections 5–7, DESIGN_SYSTEM_DRAFT sections 4–6, and earlier reference synthesis. Their shared content order, functional components, typography candidates and readability requirements survive. This document and the interaction architecture govern conflicts about immersive presentation. PRODUCT_SPEC's business rules are unchanged. The draft design system still awaits human/Astra review; this task does not invoke another agent or grant coding approval.

Work is restricted to planning the public React prototype. No application changes, generated assets, dependency additions, authentication, Firebase, persistence or API connections are part of this task. The existing prototype is real local work even though the older handoff says implementation had not begun; that statement is historical, not current inventory.

## 2. Why the boxed scene is wrong

In `prototypes/festronix-visual/src/main.tsx`, FluxScene is mounted in `.hero-visual` inside `.hero-grid`. `styles.css` gives that grid two columns and `.flux-stage` a fixed-height presentation. `FluxScene.tsx` animates local sculptures from elapsed time and pointer coordinates; only the network candidate moves the camera, and no narrative progress enters the scene. The title's backing has a separate hero-only ScrollTrigger.

This proves theme switching, three procedural sketches, deferred Canvas loading and static fallback feasibility. It does not prove the intended immersive composition: the sculpture reads as an illustration beside copy, the page and scene have unrelated timelines, and the scene disappears at the exact point a narrative should develop. Enlarging the same card or adding more glow would preserve that structural problem.

The replacement is an edge-to-edge background environment spanning identity, introduction and event-category discovery. A single camera and scene progress through those chapters. The scene relinquishes dominance before the first detailed event card. Full-page immersion describes composition and continuity, not an obligation to render WebGL behind the entire document.

## 3. Reference study and evidence limits

The four requested public URLs were opened in the browser on 2026-10-06. Initial and scrolled states were inspected. Browser snapshots were approximately 603×527 for Techfest and 1280×720 for the other three; these are research observations, not the four-size FESTRONIX QA suite. Intro durations, implementations, mobile behavior and device performance were not established by these observations.

| Evidence | Observed principle | FESTRONIX interpretation / exclusion |
| --- | --- | --- |
| [Techfest](https://techfest.org/) | Scenic imagery occupies the viewport. After scroll, palace/foreground/atmospheric composition changes while edge navigation stays available; accessibility tree identifies separate scenery and fog image layers | Use foreground/midground/background continuity and a stable UI plane. Do not copy its fantasy palace, character, framing or edge rails. Observations do not establish whether its effects use WebGL |
| [Vibe](https://vibebevvy.com/) | Full-bleed hero photography with very large foreground lettering and a distinct action; scrolling leads to quiet cream content and a product grid | Borrow large-scale composition followed by a deliberate reading surface. Do not import commerce, beverage imagery, claims or identity; no sustained 3D scroll scene was verified |
| [AEON](https://www.mu-aeon.com/) | Initial title/date state resolved into a spacious starfield identity and event action; a scrolled statement retains the atmospheric field | Borrow continuity and a clear action ladder, not its planet mark, stars or exact typography. Intro timing and the site's mobile simplification remain unverified |
| [Infinium](https://felicity.iiit.ac.in/infinium/) | Graphic identity, texture, then dates/action and a quieter flagship-event region; content remains semantic in the accessibility tree | Borrow a cover-to-program rhythm. The live visit did not establish its comic intro timing. Do not copy logo, torn divider, characters, sponsor-first order or business flows |
| `references/pulse/ux-london-mobile.jpg` | Large readable heading, restrained geometry and clear date/action blocks at phone width | Pulse keeps information hierarchy and strong spacing as its base |
| `references/panel/presstival-program-live.jpg` | Framed photography, strong headline bands and consistent metadata | Panel uses calm metadata outside original dramatic artwork, with substantially less text density on phones |
| `references/flux/Screenshot 2026-10-05 154416.png` | OPTICORE still shows luminous folds with reversed visual balance across sections | Liquid uses a coherent original material across chapters. A still is not evidence of deformation, scroll triggers or frame rate |
| `references/infinium-landing/Screenshot (373).png` and registered 368–375 sequence | Full-bleed comic crops and dominant identity in the archived sequence | Panel uses original engineering fragments and its own framing; no borrowed comic characters or logo animation |

The full local inventories and family descriptions in THEME_REFERENCES were consulted; the four named local images above were directly viewed in this task. The excluded dashboard is not design evidence. Mobile simplification below is our design proposal supported by local mobile reference examples, not a claim about all four live sites. Reference imagery will never ship as prototype art.

## 4. Corrected Pulse: professional festival, with a journey through history

Preserve warm neutral surfaces, cobalt emphasis, clear event facts, Space Grotesk/Manrope as provisional typography, and brief interaction feedback. Open immediately on useful festival content. No opening tunnel, artificial loading counter or cinematic delay.

The standout interaction belongs in the existing Previous Editions position after visit/highlights and before sponsors. Three concepts were considered:

| Concept | Strength | Cost / weakness | Decision |
| --- | --- | --- | --- |
| Cylindrical Time Tunnel | Images emerge from depth and pass the visitor; clearly communicates travel through editions | Continuous forced travel risks nausea, obscures captions and gives wheel users ambiguous control | Preserve its spatial image grammar, reject forced wheel capture |
| Chrono Dial | Clear edition selection, repeatable, compact and easy to pair with buttons | A literal precision rotary dial can become ornamental or difficult on touch | Preserve coarse detents and direct year choices; dragging optional |
| Chrono Archive: dial + short tunnel transition | Explicit user intent drives a brief spatial movement, then a stable readable archive | Requires separate motion and semantic layers | **Recommended for implementation** |
| Editorial timeline / contact sheet | Lowest cost, best scanning and simplest fallback | Less immersive | Mandatory STATIC alternative and archive index, not a competing mandatory animation |

The recommended hybrid uses Previous/Next, directly selectable editions and an optional drag arc. Each edition change drives a short trip through an invisible cylinder of image planes, ending at a still image/caption. Native page scrolling only brings the section into view; it does not select editions. Thus a visitor can leave immediately. Mobile uses a shallow two-image cross-slide with the same controls. Details, state rules and failure behavior are fixed in the architecture.

Use explicitly labeled mock years and procedural posters for comparison; never generate fake historical photographs. Real archive photos and verified captions are needed before a truthful historical launch. With no cleared history, omit the live section; with one edition, show a static story.

## 5. Corrected Panel: original cinematic comic opening

Use an optional 3.2-second first-visit composition inside the homepage hero: engineering/coding/gaming/AI fragments assemble into an original FESTRONIX cover. Four controlled editorial cuts create pace, not flashing or a Marvel-like logo tunnel. The final composition is the hero itself, so there is no black frame or second reveal afterward.

Header, facts, event action, skip control and readable FESTRONIX identity remain above the decorative sequence from the first frame. No fullscreen modal, scroll lock, audio or fake loader. Any scrolling, navigation, reduced-motion preference or Skip ends the decoration immediately. Replay is explicit; repeated theme changes do not replay it. Mobile receives a shorter 2.4-second, two-panel sequence. Semantic copy and actions remain stable. Exact timings are in the architecture.

After the intro, return to a restrained editorial page: ink/cream, selective halftone margins, strong headings and quiet event details. Generated original illustrations may be commissioned later; prototype vector fragments are sufficient.

## 6. Corrected Flux: continuous background, three equal candidates

All candidates use one full-width Canvas behind semantic HTML, with a calm text region and a spatial relationship to the X in FESTRONIX. The year remains independent configuration, never baked into a permanent logo. Core content appears before optional scene code.

| Candidate | Original construction and identity connection | Scroll evolution | Main uncertainty to test |
| --- | --- | --- | --- |
| A — FESTRONIX CORE | Four machined energy struts terminate around an open X junction; incomplete orbital rails and shallow stacked plates suggest students building a system | Dormant junction → aligned rails → controlled energizing → three track signals branch outward → compact emblem recedes | Can the assembled X feel specific to FESTRONIX without resembling a stock reactor? |
| B — LIQUID FLUX | One asymmetric folded membrane with an intentional negative-space crossing; custom continuous geometry, slow bounded vertex deformation and moving reflection | Closed fold → edge reflection aligned behind X → controlled opening → three folds direct attention to tracks → flatten into a quiet material horizon | Can an organic sculpture communicate experimentation without becoming an anonymous glossy blob? |
| C — TECH NETWORK / PORTAL | Three offset rectangular frames with sparse connected category nodes, connected to an X-shaped spatial junction | Near frame establishes depth → junction aligns → links illuminate → camera advances partway into a finite network → frame resolves as a content boundary | Can spatial technology remain readable and original without implying hidden node-based registration? |

None is selected. All must be built to the same interaction, content, viewport and budget requirements before scoring. Each needs more than a replacement central primitive: full-background negative space, camera progression, title anchoring, mobile composition and content handoff are part of the experiment.

## 7. Theme-specific arrival and loading

| Theme | Arrival | Slow network / repeat visit |
| --- | --- | --- |
| Pulse | Immediate hero; small CSS emphasis only | Same usable page; history enhancement deferred until nearby |
| Panel | Optional 3.2 s in-place first-visit intro, 2.4 s phone | If art is not ready within 500 ms of hero readiness, skip the intro for this visit. Never play it late. Repeat visit shows settled cover; Replay is available |
| Flux | Immediate background still/procedural silhouette and HTML; optional 200 ms scene blend after first valid render | No loader curtain. If enhancement is not ready within 2 s of requesting it, keep still for this visit and offer an unobtrusive Try visual enhancement control; asynchronous completion cannot force a late scene switch |

Reduced motion removes all arrival motion. Loading is distinct from storytelling; do not falsify percentages or force a minimum wait. No theme gets autoplay sound.

## 8. Migration: keep, refactor, discard

This is a source inspection classification, not a claim that current interactions have passed browser QA. The project is not currently a Git repository; no commit/diff baseline was available.

| Current source / symbol | Classification | Next-prototype action |
| --- | --- | --- |
| `package.json`, Vite/React/TypeScript entry | KEEP | Existing React 19, Three, R3F, Drei, GSAP dependency families suffice; preserve resolved versions during comparison, add no library for fashion |
| `src/data.ts`: edition, events, faqs, FestivalEvent | KEEP | Single shared fictional fixture; use identical copy across all candidates. Separate new mock archive records; no invented real history |
| `src/main.tsx`: categories, day selection, FAQ details, event/schedule content, demo disclaimers | KEEP logic/content | Extract shared components; preserve state across presentation changes. Existing event/dialog data is visual-demo behavior only |
| Theme and A/B/C review controls; useReducedMotion | REFACTOR | Central preferences/quality controller with live media-query handling; keep review controls distinct from public product features |
| Main App monolith, menu, dialogs | REFACTOR | Split shell, content and theme decorators. Verify dialog labels, initial/return focus and menu behavior; do not assume current accessibility is complete |
| `Art.tsx` procedural SVG | KEEP as TEMPORARY PROTOTYPE ASSET | Useful event and archive placeholders; not final Panel artwork or historical photography |
| CSS tokens, content widths, opaque event surfaces | KEEP intent / REFACTOR values | Restore draft's 16 px body and 14–16 px metadata intent where current prototype is smaller; remove fixed title-height assumptions |
| `.hero-grid`, `.hero-visual`, `.flux-stage`, `.scene-caption` as Flux composition | DISCARD for Flux | Replace the half-width card and fixed-height scene with narrative backdrop and separate review HUD. Pulse/Panel can retain useful grid rules after isolation |
| `FluxScene.tsx`: Canvas, lazy/Suspense, SceneBoundary, static fallback | REFACTOR pattern | Keep resilience concept; new host owns lifecycle, visibility, quality, resources and context loss. Poster must cover shader/import failure too |
| `Sculpture` variant branches, stock torus-knot, generic rings and independent camera mutation | DISCARD as candidate implementation | Original scene modules and deterministic chapter sampling replace them. Primitive feasibility sketches remain untouched in this task |
| `.wordmark-back` GSAP drift, local pointer CSS variables, edition ambient animation | DISCARD as independent drivers | One typography bridge and single ownership map prevent drift between DOM and scene |
| Generic `[data-reveal]` effects | REFACTOR | Keep limited ordinary-content feedback; never use it as the Flux narrative. Essential content stays visible without animation |
| Visibility/context-loss handlers | REFACTOR | Combine document visibility AND intersection; clean up explicit handlers. Current callbacks separately overwrite active state and visibility check only tests bottom > 0 |

## 9. Readiness and remaining dependencies

Three Flux experiments: **specification ready, unbuilt, no winner**. Panel intro: **implementation specification ready**. Pulse Chrono Archive: **implementation specification ready**. Numerical budgets and visual quality remain hypotheses to validate in working prototypes.

Before rebuild: separate explicit coding authorization and the existing visual-system review gate remain. No further product/backend architecture is needed for labeled local comparisons. Final logo/font approval, real historical media permissions and faculty-approved live facts are release prerequisites, not reasons to delay procedural comparison prototypes. Physical student-phone access is needed before making performance claims. The architecture defines the exact acceptance work; none of that future QA is reported as passed here.
