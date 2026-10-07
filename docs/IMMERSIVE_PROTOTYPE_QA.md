# Immersive public prototype implementation and QA

**Date:** 2026-10-06  
**Prototype:** `prototypes/festronix-visual/`  
**Local preview:** http://127.0.0.1:4180/  
**Scope:** Public fictional-data visual prototype only. No Flux winner selected.

## Implemented experience

- One shared React shell, edition/event/FAQ fixture, filters, schedule selection, event dialogs and practical sections. Presentation changes retain content state and restore the nearest semantic section where layout heights change.
- Flux: one edge-to-edge sticky background Canvas spans arrival, reveal, activation, category invitation and information handoff. ScrollTrigger supplies deterministic progress; R3F owns camera/object/light/shader updates. Detailed event cards use opaque normal-flow content. Scene requests stop while hidden/occluded/offscreen; offscreen scenes release after ten seconds and recreate at the current progress on return.
- Core: four engineered X struts, layered plates, incomplete orbital rails, activated energy junction, reactive light and category signals. Liquid: custom indexed folded surface, corrected deformed normals, moving thin-film shading and scroll-driven unfolding. Network: finite layered portal frames, nodes, batched connections and scroll-driven data paths. Mobile cameras stay fixed and receive fewer structures; no precision 3D navigation.
- Hybrid title: semantic DOM front face, aligned decorative backing, X anchor projection, separate edition depth, restrained pointer response and one scroll-seeked edge sweep. Desktop identity remains visible through the reveal, then leaves with the hero. No essential letters are warped or blurred.
- Panel: original SVG technical fragments and a GSAP cover sequence, 3.2 seconds desktop / 2.4 phone. First visit, skip, replay, Escape/scroll/navigation interruption and a reduced-motion static frame disclosure. Phone art composes behind a protected foreground rather than autoplaying out of view below the hero. Intro-seen state lasts within the current page session; refresh can play again.
- Pulse: sample 2024/2025/2026 archive, direct year buttons, Previous/Next, optional coarse horizontal dial gesture, perspective planes approaching/passing on desktop, short phone cross-slide, immediate STATIC/reduced changes and an ordinary all-editions disclosure. All imagery is explicitly labeled procedural placeholder art.
- FULL/REDUCED/STATIC controls, OS reduced-motion subscription, user motion reduction, desktop/mobile initial quality defaults and measured downgrading. Manual quality selection disables adaptation so reviewers can inspect a forced tier; Adapt quality can be re-enabled. STATIC mounts no Canvas. No new packages were added.

## Browser evidence

Used the real Codex in-app browser, with viewport overrides in CSS pixels. Captured and inspected screenshots in the conversation; these captures were not saved as image files. Browser screenshots at a phone-sized viewport are not physical phone performance tests.

| Viewport | Pulse FULL / REDUCED / STATIC | Panel FULL / REDUCED / STATIC | Flux A / B / C × all three modes | Result |
| --- | --- | --- | --- | --- |
| 390×844 | Checked | Checked | Checked | No page overflow; live scene ready in both WebGL modes; zero Canvas in STATIC |
| 768×1024 | Checked | Checked | Checked | Same layout/state results; tablet composition visually inspected |
| 1440×900 | Checked | Checked | Checked | Same results; all desktop candidate arrival compositions inspected |
| 1920×1080 | Checked | Checked | Checked | Same results; wider negative space and content widths inspected |

This is 60 theme/variant/mode states: two non-Flux themes plus three Flux variants, times three modes, times four viewports. FULL screenshots were examined for each composition at every size; other tiers were exercised through their live controls and scene/DOM state, with additional static/reduced screenshots and interactions. Do not interpret this as sixty full-page recordings or formal accessibility certification.

Additional behavior checked:

- Portal forward scroll captured Reveal (p≈.162), Activation (.367), Event Universe (.642), Handoff (.916) and completion (1.0); reverse returned to .642. Core and Liquid arrival/scroll responses were also inspected. The title's desktop reveal visibility was corrected and rechecked. Category action still targets shared HTML event discovery.
- Pointer input changed bounded title/scene targets; phone compositions omit pointer-follow. Touch-sized controls and click/tap-style activation were checked; actual touch hardware was unavailable.
- Panel first-entry state was `playing`; explicit replay ran; Skip and Escape reached `settled`; manual Reduce motion replaced playback with Show intro frames. Static frames were opened and inspected.
- Pulse Previous/Next updated year/title in both directions, with visible depth-plane transitions on desktop. On phone, motion-reduced selection switched immediately with an identity transform. The mock-history disclaimer stays visible.
- Mobile menu focuses Events when opened and returns focus to Menu on Escape. Event dialog handles a long title, internal scrolling and Escape; focus returns to its View event trigger.
- Manual motion reduction forces STATIC and removes Canvas. STATIC is an intentionally designed procedural fallback for every candidate. Theme/variant/mode cycles retained at most one Canvas, with none for Pulse/Panel/STATIC. Browser console inspection reported no application warnings/errors or WebGL shader errors during these checks.
- Offscreen cleanup was explicitly checked: after navigating to FAQ and allowing the ten-second grace period, the host reported `suspended` with zero Canvas. Returning via FESTRONIX home recreated one Canvas and reached `ready`. A missed re-entry wake was found and fixed with a passive lifecycle visibility check and a stale-timer guard; ScrollTrigger remains the only progress writer. Additional 320 px Flux reflow had no page overflow.

## Build and cost observations

`npm run build` passes TypeScript and Vite. Initial app JS is approximately 131 KB gzip and CSS approximately 8 KB gzip; the separately loaded Flux chunk is approximately 243 KB gzip. Vite emits its standard >500 KB uncompressed chunk warning for the ~895 KB Three/R3F chunk. It is already deferred and within the specification's compressed optional scene budget; no warning suppression or new effects package was added.

Scene diagnostics were sampled in the browser: Core around 25 draws / 2,660 triangles FULL, Liquid 3 draws / 11,080 triangles FULL, Network 47 draws / 456 triangles FULL. Network REDUCED is designed for 30 draws or fewer; geometry/particle limits are below the specified caps. No texture images, GLB downloads, postprocessing or shadow maps are used. Each scene exposes counters on the decorative host for future measurements.

Frame samples varied with browser capture/load (for example Portal FULL p95 samples around 19–29 ms). These are spot observations, not an accepted desktop/phone benchmark or proof of the 60 fps target. Adaptive quality measures consecutive active-frame windows, excludes idle/background gaps and startup, and includes genuinely slow frames rather than silently dropping them. Real student-phone performance and field Core Web Vitals remain unverified.

## Defects addressed

- Removed the boxed Flux scene, monolithic hero layout and independent title/scene drivers.
- Broadened the Liquid procedural form into an asymmetric folded silhouette and corrected its deformed surface normals.
- Integrated the phone Panel intro into the opening composition so playback can be seen.
- Corrected first-entry Panel playback under React Strict Mode's effect replay.
- Kept desktop FESTRONIX visible during the reveal chapter, protected it from underlying copy and excluded sticky title treatment in STATIC.
- Added the mobile menu's matching controlled ID and verified keyboard focus return.
- Reset pointer decoration on menus/dialogs; combined visibility conditions and distinguished suspended scene state.
- Prevented rapid archive input from queuing journeys; clear timeline contexts and temporary compositor hints on settle/unmount.

## Known limits and pending validation

The subsequent focused UI/UX polish is recorded in [PROTOTYPE_UX_REVIEW.md](PROTOTYPE_UX_REVIEW.md). It adds four-size hierarchy verification, 320 px reflow, 18 Flux variant/mode states at phone/desktop sizes and keyboard/interaction checks. Earlier measurements in this document describe the initial immersive rebuild; the new report records the current hero geometry and comparison-control placement.

- Final artwork, permanent logo/font approval and truthful historical photographs are intentionally absent; all edition facts remain fictional. Fonts still come from Google Fonts, with system fallbacks.
- Physical Android/iOS rendering, sustained memory/GPU measurements, thermal/battery behavior, field metrics and full text-zoom/spacing/contrast audits have not been certified.
- Manual reduction and the OS subscription path are implemented. The browser tool did not expose OS preference emulation; a real OS preference toggle remains a separate verification item.
- STATIC and shader/error/context-loss boundaries exist, but forced GPU context loss and blocked scene imports were not injected through this browser tool. No naturally occurring scene errors were observed.
- Optional dial dragging is secondary; visible edition buttons are the tested primary interaction. No wheel capture or forced journey is used.
- Comparison is ready for human viewing. The owner must choose Flux after reviewing working candidates; no theoretical winner or production release is implied.
