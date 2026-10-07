# Scroll motion and interactive backgrounds

**Date:** 2026-10-06  
**Status:** Implemented and browser checked.  
**Preview:** http://127.0.0.1:4180/

## Latest correction: tile breakup and content entrances — 2026-10-06

The owner clarified that the Panel pieces should separate in different directions, rather than fading the entire cover together, and explicitly requested gradual text/card fade-and-pop entrances in every theme. This supersedes the earlier parent-only exit and opaque-copy-only entrance choices below.

- Five dedicated exit wrappers preserve the existing assembled art and its child intro timeline. Build moves diagonally up-left; Code up-right; Discover down-left; Play down-right; the central F× tile moves upward. Each briefly pops larger, turns slightly, then fades along its path. Paper/rules and replay controls settle separately. Scroll reversal reassembles all pieces.
- `useLandingMotion.ts` owns only the new wrappers for the breakup. PanelIntro keeps ownership of its existing child transforms, intro opacity and clipping. Phone travel is reduced; function-based dimensions refresh at responsive changes. The live hero clips escaping art to prevent page overflow, while copy/actions paint above it. Reduced/STATIC modes restore the original clipping and allow the storyboard disclosure to extend normally.
- All themes now reveal below-fold labels, headings, paragraphs, controls, event cards, schedule rows, visit facts, statistics, gallery/archive groups, sponsor slots, FAQ rows and CTA groups. Text rises 16 px with scale .985 → 1 over 1.05 s; boxes rise 24 px with scale .965 → 1 over 1.15 s. Both fade from 0 → 1. Small .08 s staggers separate groups; boxes have their own sequence so cards enter in reading order.
- Visible content never waits on a new effect after filtering or schedule changes. Keyboard focus finishes the affected section's entrances immediately. Reduced/STATIC removes entrance styles; baseline HTML/CSS remains fully visible without these JS effects. Entrances run once per viewed element in the current theme/motion session; Panel's exit reverses with scrolling.
- Applied the existing FESTRONIX motion/accessibility/QA guidance and verified local ui-ux-pro-max **Scroll Reveal** guidance. Timing was extended to match the owner's explicit request for slower entrances. No SplitText, new package, backend or scene architecture change.

### Checks for this correction

| Viewport | Verified behavior |
| --- | --- |
| 390×844 | Pulse/Panel/Flux intro and event-card waiting → revealing → shown states; inspected all three phone layouts. Panel's smaller five-direction breakup checked at p≈.4. No horizontal overflow |
| 768×1024 | All three event-grid entrances inspected; two visible cards with third waiting below. Panel split direction/refresh checked at p≈.4. No horizontal overflow |
| 1440×900 | All three intro fades watched; early opacity 0–.187 followed by fully shown headings. Panel split trajectories, fade, complete exit and reversal inspected. Final card stagger measured .662 / .550 / .417 opacity in reading order. No horizontal overflow |
| 1920×1080 | All three event-grid entrances inspected; three cards enter and reach full visibility. Panel breakup direction/refresh checked at p≈.4. No horizontal overflow |
| 750×715 | Extra check matching the annotation size: visible multi-direction tile separation; no horizontal overflow |

At completed Panel exit p=1, all five tile opacities were 0 and the stage was inert. Returning to top restored the assembled state. Reduce motion removed all reveal-state attributes/styles, restored tile opacity 1 and left the storyboard visible without hero clipping. Keyboard focus moved from an unseen event button to RoboRumble with all three event cards immediately at opacity 1. Rapid Code → All filtering returned three readable visible cards; Day 2 produced one readable row. FAQ navigation/expansion retained all six rows at opacity 1.

Used a clean temporary QA browser tab because the existing user tab contained browser comment overlays. The clean tab's comparison controls worked normally. A transient browser-control timeout during FAQ inspection was resolved after rereading the current state; FAQ expansion succeeded. No new page console errors/warnings were logged during normal final checks.

Final production build passes: initial JS 135.52 KB gzip, CSS 10.27 KB gzip, deferred Flux 245.12 KB gzip. The existing uncompressed Flux chunk warning remains. Source updates: `useLandingMotion.ts`, `PanelIntro.tsx`, `Heroes.tsx`, `ThroughTime.tsx`, `FluxNarrative.tsx`, `motion.css`. Existing WebGL models/camera ownership, semantic content, fictional data and all three themes remain.

Saved evidence: [Panel split during scroll](../prototypes/festronix-visual/output/panel-split-exit-desktop.jpg). Physical-device performance and full accessibility certification remain outside this local browser verification.

## Earlier changes (preceding pass)

- Pulse: gentle hero-art parallax, ordered section/card/row entrances and a low-contrast CSS 3D geometric background with pointer tilt.
- Panel: shallow hero-art motion, graphic art masks and staged content entrances; background depth uses original wire frames. The existing comic intro retains its own child-layer timeline.
- Flux: the five-chapter camera/object choreography remains deterministic. A real WebGL spatial grid now drifts behind the scene, with a restrained pulse ring and a little ambient orbital movement. FULL retains a low-frequency idle render schedule only while the opening scene is visible; REDUCED retains its demand/settle behavior.
- All themes have a keyboard/click/tap-accessible **Send a pulse** control. Flat-theme feedback originates at the activated control, including keyboard activation. STATIC/reduced-motion hide this optional animated control and retain the designed still backgrounds.

DOM animation never hides essential copy. Scene progress, camera and shaders remain owned by the existing Flux director/R3F loop. CSS cube transforms, pointer wrappers and pulse-ring transforms are separate layers. Scoped GSAP contexts revert on theme/preference changes; dynamic card and schedule contexts clean up after filtering/day changes. Focus settles an entering card rather than moving a focused control.

## Reliability fixes

1. Decorative backdrop width caused overflow with classic browser scrollbars. It now uses its container width and clips decorative painting. Checks compare document scroll width against client width, rather than innerWidth, which includes the scrollbar gutter.
2. A scene-module import failure previously escaped the loader and could blank the React page. A loading boundary now preserves title, events and fallback artwork. Stale visual assets offer a reload that retains the chosen Flux variant/quality via validated preview URL settings.
3. The load deadline could race a first valid frame during rapid theme/quality changes. Readiness now cancels that deadline synchronously, with lifecycle resets completed before painting.
4. The local development socket was unreliable in the in-app browser after the earlier session ended. Preview now serves the production build from a hidden local Vite preview process on port 4180. No production deployment was made. After future source edits, rebuild and reload this preview, or explicitly run the normal dev server instead.

## Checks performed

- Pulse, Panel and Flux checked at 390×844, 768×1024, 1440×900 and 1920×1080. Motion profiles and pulse controls were present, Flux reached ready, and no page overflow was found after the fix.
- Watched section/card motion and the flat-theme depth/pulse response. Clicked pulse controls and checked keyboard activation. The local halo coordinates update around the activated control, rather than disappearing above the visible phone viewport.
- Exercised all three Flux variants in FULL/REDUCED/STATIC. One Canvas in live modes; zero in STATIC. Pulse effects were checked on the live candidates. FULL Network sampled 49 draw calls; REDUCED removes dark frame backing and extra particles to retain its smaller draw budget.
- Verified Flux Activation via native scroll navigation at p≈.417. The information handoff and ordinary content entrances coexist; no scroll lock or precision gesture is required.
- Rapid filtering returned three event cards with no stale clipping/translation; schedule day selection produced the correct shared row without stale transforms.
- Reduce motion disabled DOM scroll motion, removed Canvas and pulse controls, and left cards without inline motion transforms. CSS wallpaper animation became none. Offscreen hero wallpaper was verified inactive with animation-play-state paused.
- Forced an unavailable scene module by temporarily renaming the generated, ignored Flux chunk. Title and all three event cards remained usable. Restoring the file and activating Reload visual assets recovered Liquid in REDUCED mode. All held assets were restored. Expected error logs from that injected fault were distinguished from normal verification; no new errors/warnings appeared in the subsequent normal workflows.
- TypeScript/Vite build passes. Initial JS approximately 134 KB gzip, CSS 10 KB gzip and deferred Flux approximately 243 KB gzip. The existing uncompressed chunk-size warning remains.

Screenshots were inspected in the browser session; no final media was generated. Physical-phone thermal/battery performance, full accessibility certification and every possible GPU/browser configuration remain unverified. These checks support the tested workflows rather than a claim that all future configurations are bug-free.

## Source ownership

New: `useLandingMotion.ts`, `LiveWallpaper.tsx`, `SpatialWallpaper.tsx`, `motion.css`. Updated: `main.tsx`, `Heroes.tsx`, `FluxScene.tsx`, `FluxNarrative.tsx`, `experience.ts`, `.gitignore`. No new dependency packages, backend, auth, payment or data architecture were introduced. All three Flux experiments remain available without a selected winner.

## Annotated artwork / realistic-model refinement — 2026-10-06

The two owner annotations authorize a focused Panel artwork exit and a recognizable, realistic technology subject for Flux Core A. The existing immersive composition and single-canvas architecture are retained.

- Panel's decorative parent now moves upward/outward, rotates slightly, shrinks to 90% and fades with native scroll. Scrolling back restores it. Its child intro animation keeps separate ownership. At exit progress >.82 the invisible stage is inert and ignores pointer input; cleanup restores it. Phone travel is smaller and function-based values refresh when crossing responsive breakpoints. The phone illustration remains the existing masked background beside the copy.
- Core A replaces the abstract bars/orbits with an original procedural compute board: rounded PCB, copper routing, metal chip lid and etched X, a spinning fan, ports, capacitors, screws, pins and components. Repeated parts/blades are instanced. Pulse increases fan activity and changes indicators; pointer tilt stays bounded. Activation raises the chip lid together with its marking.
- A's wallpaper now uses matching routed circuits with traveling signals and pulse feedback. Its static SVG shows the same board concept. Portrait and tablet scaling/placement were corrected after browser inspection. B/C retain their models and wallpaper treatment.

### Verification

| Viewport | Checks and result |
| --- | --- |
| 390×844 | Live board fully framed behind readable copy/actions; matching STATIC with zero Canvas; no horizontal overflow. Panel partial fade .905 at p=.304, .034 at p=.734, zero/inert at p=.973; reverse restoration and reduced-motion storyboard checked |
| 768×1024 | Board fit corrected so fan/connectors stay inside viewport. Panel composition preserved; native-scroll fade .865 at p=.331. No horizontal overflow |
| 1440×900 | Board arrival and Activation inspected at p≈.417; etched X remains attached. Pulse activation, all Flux variant switches and FULL/REDUCED tested with one Canvas. Panel opacity .554 at p=.472, zero/inert at completion and full restoration at top |
| 1920×1080 | Both hero compositions inspected; model fit, replay interrupted by scrolling, complete Panel exit and theme return checked. One live Canvas; no horizontal overflow |
| 916×715 | Additional check at the annotated browser size: live board, clear header/hero and no overflow |

Reduce motion reverts the exit to opacity 1, removes inert and inline exit state, sets DOM motion off and exposes **Show intro frames**. That disclosure was opened successfully. Essential copy/actions never animate to invisible. No new browser errors or warnings were logged in the final normal checks.

One reload while retaining a scrolled phone position reached the existing two-second enhancement deadline. The still board and public content remained available; **Try visual enhancement** recovered a ready live scene. This is recorded as a graceful fallback occurrence, not an assertion that every enhancement always loads within the deadline.

Observed Core A counters: FULL 27 draw calls / 6,142 triangles / 37 geometries / 4 textures; REDUCED 26 draw calls / 5,170 triangles / 35 geometries / 4 textures. These are scene observations, not physical-phone performance certification. Frame timing from this browser session included long scheduling stalls and is unsuitable for a sustained FPS claim. Original texture and geometry resources have explicit teardown; materials retain R3F disposal.

Final TypeScript/Vite production build passes: initial JS 134.93 KB gzip, CSS 10.09 KB gzip, deferred Flux 245.12 KB gzip. The existing uncompressed chunk warning remains. No new dependency package, downloaded model or external raster asset.

Saved local browser evidence (ignored build-output directory):

- [Core arrival, desktop](../prototypes/festronix-visual/output/core-board-desktop.jpg)
- [Panel partial scroll exit, desktop](../prototypes/festronix-visual/output/panel-scroll-exit-desktop.jpg)

New source: `ComputeBoard.tsx`, `ComputeBoardPoster.tsx`. Updated: `useLandingMotion.ts`, `FluxScene.tsx`, `FluxNarrative.tsx`, `SpatialWallpaper.tsx`, `motion.css`. Final visual approval, real-device GPU/thermal checks and comprehensive accessibility certification remain outside these verified local workflows.
