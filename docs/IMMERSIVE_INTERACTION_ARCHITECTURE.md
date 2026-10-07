# FESTRONIX immersive interaction architecture

**Date:** 2026-10-06  
**Status:** Implementation specification for a separately authorized local prototype; no implementation or measured performance in this task.  
**Authority:** [Direction reset](PROTOTYPE_DIRECTION_RESET.md) overrides earlier boxed-hero guidance. [Asset manifest](ASSET_MANIFEST.md) defines temporary and final media. Business scope stays in PRODUCT_SPEC.

## 1. Composition and React architecture

Retain React, TypeScript, Vite, Three.js, React Three Fiber, selective Drei helpers, and GSAP/ScrollTrigger already declared in `prototypes/festronix-visual/package.json`. Check the existing lockfile at rebuild time; do not upgrade libraries during the fair comparison. Do not introduce a smooth-scroll engine, physics engine, fluid solver, second animation framework or global state package for this scope.

Proposed responsibilities (module names are future file boundaries, not existing files):

```text
AppShell
  SharedContentState                edition/events/filter/day/dialog/menu
  ExperiencePreferences            theme/variant/motion/quality/intro-seen
  Header + operational notices     stable DOM above all decoration
  ThemeExperience
    PulseHero + shared sections + ChronoArchive
    PanelHero + PanelIntroDirector + shared sections
    FluxNarrative
      SemanticChapters             hero -> intro -> category invitation
      SceneHost                    poster + one lazy Canvas + error boundary
        CameraRig / Lights / TypographyAnchor / Effects
        CoreScene OR LiquidScene OR NetworkScene
      ProgressDirector             single scroll source for narrative
  SharedEventGrid -> Schedule -> Visit -> Highlights -> Gallery -> Sponsors
  FAQ -> final action -> Footer
```

Theme decorators never own duplicate event data. Flux's event-category invitation belongs at the beginning of the shared events section; the detailed cards immediately following it are outside the immersive region. Pulse replaces only the gallery's presentation with Chrono Archive. Panel's intro lives inside the hero. No theme changes the underlying section order or event actions.

### Full-width scene host

Use an isolated CSS grid for the Flux narrative. Its content track and decorative track share the same grid area. Semantic blocks establish normal document height; a sticky decorative layer aligns to the start of that area with height `100svh`, width 100%, and top 0. It is constrained by this narrative's bottom, not fixed behind the entire site. Avoid transformed or scrolling ancestors that break sticky behavior. Do not apply overflow rules to the narrative ancestor that create an unintended scroll container; clip inside the decorative layer.

Initial desktop content allocation: hero min-height 100svh, introduction/activation min-height 110svh, event-category invitation/handoff min-height 110svh; total target 320svh. These are minimums, not fixed text boxes. Tablet target 260svh; phone 200svh. At enlarged text or short landscape heights use normal-flow content with a static backdrop, no artificial empty runway. The sticky layer takes no additional height beyond the content track. Only the scenery stays pinned; no scroll interception, snap requirement or forced completion.

Layer order: near-black base → CSS/SVG poster → Canvas → dark readability scrim → decorative typography backing → solid semantic title/copy/actions → header, focus rings and dialogs. Canvas and decorative layers use `pointer-events:none`, `aria-hidden=true` and cannot become focusable. Pointer sampling comes from the narrative host with passive behavior; no OrbitControls or canvas hit-testing requirement.

Reserve a calm reading lane (desktop roughly left 8–52% of the viewport, with object center near 68% width); the title may span more width at the top. On portrait screens the scene frames the bottom/right periphery of copy rather than becoming a smaller desktop card. A scrim follows text bounds with generous padding and a minimum dark floor. Bloom stays under the scrim. A solid title and scrim, not a measured background-color guess, guarantee a stable composition to test for contrast.

### Runtime state contract

One non-React mutable frame record carries `progress`, `chapter`, `pointerTarget`, `pointerDamped`, `viewportProfile`, `quality`, `visible`, `motionAllowed`, `themeGeneration`, and `activeTime`. React state carries discrete preferences and component lifecycle only. No per-frame React setState.

Each scene implements the same contract: initialize owned resources; sample chapter state from progress; apply bounded pointer/idle offsets; report first valid frame; dispose owned resources. Its chapter sampling is a pure mapping, reproducible at any progress, including reverse scroll and restored browser positions. Uniform and transform changes happen in one R3F frame callback per responsibility. Use no time-accumulated scroll transformation.

Lifecycle: `poster -> requested -> ready -> active/suspended -> disposed`, or `failed -> static`. Generation tokens invalidate stale asynchronous scene callbacks after theme/variant changes. Content never waits for readiness. A 2-second enhancement deadline starts when the scene is requested, not on navigation. A late result is disposed unless a new explicit retry owns it. Errors are shown only as a quiet optional visual-unavailable status near the quality control, never a blocking dialog.

## 2. Flux scroll choreography

ScrollTrigger owns a measured progress `p = clamp((scrollY - narrativeStart)/(narrativeHeight - viewportHeight), 0, 1)`. In the default 320svh desktop region this is approximately 220svh of travel. Recalculate after settled resize, font readiness and content-height changes. Use raw scroll-linked progress (no separate scrub smoothing); camera/object sampling uses smoothstep within each chapter, so DOM and scene do not lag by different amounts. Bounded pointer damping is independent and decorative.

Natural DOM hero text scrolls away once; it is never faded out by an animation before normal scrolling takes it out of view. The header retains the compact brand. Introduction and category headings remain real flow content. Chapter numbers are decorative and never announced every frame. Anchor navigation can bypass all chapters instantly.

| Chapter / trigger | Camera | Object | Typography | Background | UI / transition |
| --- | --- | --- | --- | --- | --- |
| Arrival, p 0–0.10 | Establish wide stable view; no automatic fly-in | Recognizable dormant silhouette, complete geometry already loaded or poster | FESTRONIX, 2K27, tagline, facts and actions solid at first paint; backing depth appears only if aligned | Near-black, peripheral material reflection, no full-screen flash | Normal header and actions, visible Skip to events and Reduce motion. At .10 begin alignment |
| FESTRONIX reveal, .10–.28 | Small approach with fixed roll; focal point tracks the DOM X while it is visible | A rails align; B fold-edge aligns; C junction connects to nearest frame | Front faces unchanged; shallow backing/light makes the title feel spatial. 2K27 backing has half the main backing travel | One narrow illumination path behind X, quiet text lane | No control moves. At .28 transfer object attention toward intro; no mandatory viewing time |
| Activation, .28–.50 | Ease laterally into intro composition, maximum total yaw 8 degrees | A plates open; B membrane unfolds; C links light in sequence | Hero leaves through native scrolling; intro heading enters naturally. Only decorative letter backs may separate by <=12 px, then reassemble before exiting | Peripheral energy spreads, ambient points remain sparse | Intro promise/copy readable throughout. At .50 transition to category signals |
| Event universe, .50–.78 | A/B pull back slightly; C progresses into finite portal without passing close to geometry | Three track regions form. A orbit endpoints; B three fold tips; C three node clusters | Code / Build / Discover are semantic DOM links in consistent positions, not tiny 3D labels | Depth recedes from reading surfaces; event surfaces start becoming opaque | Hover OR keyboard focus on a category may emphasize its region; link works without enhancement. Selecting navigates/filters the same shared event list. At .78 start handoff |
| Information handoff, .78–1.00 | Settle and stop; no closing fly-through | Compact/recede emblem, deformation amplitude tends to zero | Category invitation stays normal flow; detailed event heading/cards arrive without reveal gating | Opaque page surface reaches full opacity by .92; backdrop ends at narrative bottom | No WebGL behind detailed card reading. Suspend rendering at full occlusion; when outside region release resources after 10 s. Reverse scroll restores current sampled state, never restarts an intro |

Entry blending is an optional 200 ms opacity transition when ready, omitted for reduced motion. Narrative transitions depend on scroll position, not elapsed playback time. Stop idle motion after 8 seconds without input and resume only on new scroll/pointer input; a public Reduce motion control also removes scroll motion. Hidden documents do not accumulate animation time.

### Candidate construction and camera keyframes

Normalized world coordinates use Y up; objects approximately radius 1 around origin, camera looks toward the object center. Seed stochastic details identically across runs. Use perspective FOV 42 degrees desktop, near 0.1, far 40; no roll, collision, full turns or rapid zoom. Starting keyframes below are deliberate prototype tuning values, constrained by screen-space safe zones. At p=.10 use the same camera as p=0; interpolate smoothstep between remaining keys. Object screen placement comes from a layout root offset determined by camera framing, not by hardcoding world position for each browser width.

| Variant | Camera positions at p=0 / .28 / .50 / .78 / 1 | Construction and transformations |
| --- | --- | --- |
| Core | (0,0,7) / (.2,.1,6.7) / (.6,.2,6.6) / (.3,.2,7.4) / (0,0,8) | Four beveled struts and three offset plates, two incomplete rails. Junction stays open behind the X; plates separate <=.35 world units at activation. Three signals form on rails at event chapter; final scale .65. Idle root rotation <=3 degrees, not endless spinning |
| Liquid | (0,0,7) / (.15,.1,6.7) / (.4,.2,6.8) / (.2,.15,7.4) / (0,0,8) | One continuous asymmetric parametric folded strip with thickness/edge treatment; seed fixed. Two low-frequency displacement terms, amplitude <=.06 object radius. Unfold parameter 0 -> .55 -> .8 then settle; topology unchanged. Match displaced normals or use analytic/finite-difference shader normals. No CPU remeshing or real fluid simulation |
| Network / Portal | (0,0,8) / (.2,.1,7.5) / (.4,.15,6.8) / (.2,.1,5.8) / (0,0,6.4) | Three asymmetric rectangular frames at z=0,-2,-4, <=18 nodes and <=24 connection segments FULL. Camera advances only 2.2 units, never crosses first frame. Three clusters match categories; no labyrinth, infinite tunnel or clickable hidden nodes |

Pointer normalized to [-1,1]; root yaw contribution <=4 degrees and pitch <=2 degrees, camera lateral offset <=.12 world units; reduce to half at category chapter and zero at handoff. Damping coefficient 5/s, dt clamped to .05 s after interruptions. A moves a localized key light toward the junction; B moves reflection orientation rather than increasing deformation; C biases foreground/background separation. Pointer leaving, menu/dialog opening or focus moving to controls returns decorative offsets to zero. Touch never requires dragging the scene.

Material plan: use MeshStandardMaterial or a small derivative shader for A/C; a custom vertex/material shader for B with the same lighting intent. At most two local lights plus ambient/environment fill, no real-time shadows. Three.js manages geometry/materials; R3F manages their React lifecycle. Drei is selective utility use (e.g. geometry/loader helpers), not a mandate to use stock MeshDistortMaterial for the final Liquid silhouette. Optional bloom is a measured second pass in experimentation, with a no-bloom baseline for all three. No new postprocessing dependency is necessary for the first build; use emissive materials first, and a Three composer only if bloom earns its cost.

## 3. FESTRONIX 2K27: interactive typography

FESTRONIX is an opaque semantic h1 in the provisional Sora face, with an intact X span. 2K27 is ordinary accessible edition text outside the permanent logo. One accessible reading of each; decorative replicas are hidden from assistive technology. Text and controls never enter a WebGL texture as their only rendering path.

| Effect | Owner / technique | Reason and boundary |
| --- | --- | --- |
| Readable front faces, body and edition | DOM/CSS | Selection, semantics, zoom, fallback fonts and instant rendering. No per-letter transforms of essential title |
| Shallow extrusion | CSS layered text-shadow/duplicate backing initially; optional actual extruded X only | Whole-word WebGL text adds font, glyph and alignment costs. A decorative WebGL X can share scene lighting without making all letters GPU-dependent |
| Hybrid scene registration | TypographyAnchor samples DOM X bounding rectangle after layout, projects its center to NDC, intersects camera ray with chosen decorative plane | Scene junction visually meets the real title. Recompute from cached document bounds plus scroll each frame; remeasure only on resize/font/layout change. Do not read layout repeatedly inside useFrame |
| Pointer parallax / spatial perspective | DOM backing nested wrapper from shared frame record; scene object offset from same pointer | Backing <=6 px translation, <=1 degree rotation; front face stable. Edition backing <=3 px. No movement of links or CTA hit areas |
| Illumination through letterforms | SVG/CSS mask on decorative edge copy; WebGL emissive junction aligned to X | One edge sweep in reveal chapter. No change to core text fill, no strong pulsation. Masks match selected font only after fonts ready; omit otherwise |
| Occlusion | Layered DOM above scene | Letter front faces occlude the object, linking spaces without hiding strokes. No foreground geometry over essential letters |
| Refraction | Optional FULL shader samples scene-only offscreen target behind text | WebGL cannot refract arbitrary DOM. Use a small scissored background effect or omit; never screenshot DOM into an animated texture. Off by default and first to cut |
| Scroll separation / reassembly | Decorative backing copies only, sampled from p .28–.50 | <=12 px split then return, base title remains intact; skip if title has scrolled out. No blur or continuous morph |
| Bloom | Canvas-only optional composer | Never bloom DOM title, metadata or controls. Screen-space composition, not postprocessing, provides the brand connection |

If font, wrapping, zoom or resize causes alignment uncertainty, hide the backing and keep the intact DOM face; re-enable only after measurement. The X anchor drives scene placement while h1 intersects viewport; after it exits, blend over p=.28–.50 to the scene's intro anchor, rather than chasing offscreen text. Test system fallback fonts before custom font completion. Do not introduce Troika/SDF full-word text just for shallow depth; revisit only if an actual rotating decorative text object proves necessary in a later approved experiment.

## 4. Animation ownership and lifecycle

| Concern / mutable property | Sole writer | Inputs / cleanup |
| --- | --- | --- |
| Narrative global progress | One ScrollTrigger in ProgressDirector | Measured native scroll; kill owned trigger/context on teardown. No competing Lenis, ScrollControls or wheel handler |
| Camera position, quaternion, target | R3F CameraRig | Pure chapter sample + bounded pointer offset; never GSAP tween the camera as well |
| Object transforms / shader uniforms / light positions | Scene module's R3F updater | Shared p and activeTime; shader time does not advance when paused/hidden |
| DOM narrative decoration | GSAP timeline seeked from same progress callback | Its own backing wrapper only. CSS does not also animate that wrapper's transform |
| Typography alignment | TypographyAnchor | ResizeObserver, font-ready event, cached bounds; disconnect observers/listeners |
| Simple hover/pressed/focus | CSS | Distinct control properties; no effect on scene targets or semantic layout |
| Pointer sample | Host pointer adapter | Fine mouse only; passive, rAF coalesced; reset/remove on teardown |
| Theme/variant/preferences | React ExperiencePreferences | Discrete state; abort old async generation, preserve content/filter/day and focus |
| Reduced-motion state | One matchMedia subscription + user override | Effective motion = allowed by OS AND allowed by user; OS reduce cannot be overridden by a decorative replay |
| Panel intro | One scoped GSAP timeline | Wall-clock sequence; skip/complete seeks settled state; revert on unmount |
| Pulse edition selection | React archive reducer | Controls update selection; GSAP animates only decorative CSS plane transforms; last requested edition wins |
| Visibility/quality | SceneHost | `documentVisible && regionIntersects && !fullyOccluded`; context-loss and timeout fail to STATIC |

No observer writes `active` independently. The current prototype's visibility logic is replaced with the conjunction above. Use on-demand R3F rendering when settled: progress/pointer updates invalidate; while damping or the bounded ambient interval is active, request the next frame until settled. Stop scheduling frames offscreen or hidden. Avoid a second requestAnimationFrame loop that separately mutates Three objects.

On theme or variant switch: store nearest semantic section ID and its viewport offset; end Panel/Pulse playback; remove old triggers/listeners/observers; invalidate async generation; unmount/dispose scene; mount new presentation; refresh layout; restore section offset without animated scroll. Keep keyboard focus on the review control. When switching at the top, remain at the top; when at an event, preserve that event. Browser restoration/deep links sample current progress immediately, without returning to arrival.

Resource ownership: each scene owns its geometry, material instances and render targets. Cached textures have explicit shared ownership; do not dispose a cached texture while another instance uses it. Clear unused scene-specific caches on permanent exit, release loader references, and dispose manually created textures/targets and cloned materials. R3F-managed resources follow its lifecycle; externally supplied primitives require explicit disposal. Detach context-loss and visibility listeners. One WebGL context at a time; switch A/B/C sequentially. Context loss immediately exposes poster and unmounts scene; no automatic retry loop.

Implementation basis checked on 2026-10-06: R3F documents demand rendering, invalidation, resource reuse, instancing and adaptive performance; GSAP documents ScrollTrigger's progress, refresh and cleanup mechanisms. The ownership and budgets here are project choices, not library guarantees. See [R3F scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) and [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Three cleanup documentation retrieval failed during this review; do not treat that as verified evidence. Verify actual disposal behavior against installed versions during implementation.

## 5. Panel intro storyboard

**Desktop/tablet duration: 3.2 seconds.** In-place decorative hero sequence with normal DOM identity and actions readable from t=0. Use original vector/raster fragments of a robot gripper fitting a component, abstract code blocks, a game-controller circuit and an AI signal graph. These are visual motifs, not new advertised events. No franchise characters, Marvel framing, logo tunnel, recognizable branded poses or borrowed panels.

| Time | Frame and motion | Type / handoff |
| --- | --- | --- |
| 0–.40 s | Cream cover field, two ink rules draw inward 24 px; faint static halftone margins | Stable FESTRONIX and 2K27 already readable; header, date/action rail and Skip are present |
| .40–1.00 s | Robot fragment slides into left panel <=40 px, crop ends cleanly at its border | Decorative BUILD label; no long caption or title displacement |
| 1.00–1.60 s | Right panel reveals code/game circuitry through a straight editorial mask, not a white flash | Decorative BREAK label. Two simultaneous panels maximum |
| 1.60–2.20 s | AI signal fragment replaces right art with a 120 ms crossfade; short static speed-line fan in outer margin | DISCOVER label. No strobe, high-contrast inversion or rapid repeated cuts |
| 2.20–2.80 s | Panel rules converge toward a small X-shaped registration junction beside the existing brand; decorative fragments recede <=24 px | Secondary fragments resolve into original FESTRONIX cover framing; essential word never dissolves |
| 2.80–3.20 s | Settle to exact hero composition; art opacity/position reach their static values | Same DOM hero continues, no second entrance, no delayed CTA. Skip becomes Replay intro |

State machine: `unseen -> eligible -> playing -> settled`; reduced motion, skip, missing assets, scroll, navigation, menu/dialog opening or document-hidden transition go straight to settled. Persist `seen` at start to prevent interrupted reload loops in a versioned localStorage key (`festronix:panel-intro:v1:<edition-id>`). Storage failure falls back to in-memory session state; failure never blocks content. An unseen Panel entry is eligible only at page top and without a deep link. Theme switching never scrolls someone back to watch. No asset wait beyond 500 ms; if missed, mark settled and offer manual replay once assets are ready.

Skip: always available with a 44×44 px minimum target, first hero control in normal focus order. Escape while playing and any scrolling stop animation without preventing the input. Do not auto-focus the intro or trap focus. If Skip had focus when it ends, retain the same DOM button and relabel it Replay intro; otherwise focus remains where the user placed it. Replay starts only when the hero is in view, affects decoration only and never scrolls the page; outside the hero the replay control is absent. Completion is not repeatedly announced.

Mobile: 2.4 s sequence, 0–.4 cover, .4–1.1 robot, 1.1–1.8 combined code/game/AI panel, 1.8–2.4 convergence. One moving panel at a time, <=16 px travel, no page-turn perspective. Tablet can retain 3.2 s with simpler framing. Low-power uses this light version regardless of viewport. Reduced motion is settled cover immediately, Replay becomes a nonanimated Show intro frames disclosure with four static labeled images. If art fails, CSS rules and type supply the cover. No WebGL required in any Panel mode, and no audio asset or media autoplay.

## 6. Pulse Chrono Archive interaction

Use CSS perspective image planes, SVG dial marks and GSAP transforms; this does not justify downloading Three.js into Pulse. The tunnel is invisible geometry, not a rendered cylinder. Content stays on a stable DOM plane, with an ordinary archive list always available. The section begins in the newest available past edition and remains still until a user chooses another.

Data contract: `editionId`, `yearLabel`, `title`, `caption`, `highlights[]`, `images[]` (src, dimensions, alt, focal crop, credit/rights status), and optional verified archive URL. For the prototype supply three clearly labeled mock edition entries, e.g. 2024/2025/2026, each with two procedural images; labels must say these are samples, not historical facts. Empty real datasets omit the section. One entry yields a static story without disabled ornamental dial controls.

Desktop layout: broad visual field left/center, stable year/caption and coarse semicircular dial below, Previous/Next and direct year controls adjacent. A simple horizontal list of year buttons supplies selection semantics (`aria-pressed`); do not call it a slider unless full slider semantics are implemented. For many editions use a labeled native select plus Previous/Next. Disable buttons at endpoints, no wraparound. Current edition's registration never appears in past-edition content.

### Spatial transition

At each selection, update semantic year/caption immediately and set the selected button. Run a 650 ms decorative transition only when motion is allowed. Image pool: six planes maximum FULL, three REDUCED, one STATIC. Conceptual cylinder radius 280 CSS px, camera perspective 900 px; planes around the viewing axis at angles -55, +55, -125, +125 degrees with fixed small y offsets. Do not rotate the camera. Images face the viewer sufficiently to remain recognizable; cap plane yaw at 18 degrees.

| Local time | Image/depth behavior | Stable content |
| --- | --- | --- |
| 0–.15 | Chosen edition images appear in far field z=-900, opacity 0 -> .6 | Year, caption and highlights already show chosen edition; optional polite announcement only for explicit control activation |
| .15–.65 | Two main planes approach z=-180, opacity reaches 1; side history planes move outward | Dial indicator advances to chosen detent; buttons stay fixed |
| .65–1 | Previous planes move past the side edges at z=+120 and fade before clipping; selected main plane settles at z=0, peripheral planes fade | One clear selected image and caption remain; no ambient carousel |

Backward selection reverses travel direction without reversing text or flipping photographs. Direct jumps travel once to the requested edition; do not animate every intervening year. Rapid inputs cancel the previous decorative tween from its current state and resolve to the latest requested entry; never queue a long journey. Once settled, remove will-change from all but the active image. Virtualize hidden image planes and decode only selected and adjacent images.

Input: year buttons/select and Previous/Next support keyboard Enter/Space and touch. Optional drag applies only to the labeled dial handle, with a 24 px movement threshold and one edition per 60 px horizontal displacement, capped to one change per 180 ms; dragging beyond bounds clamps. Preserve vertical `touch-action:pan-y`; capture only an intentional horizontal handle drag, handle pointercancel by settling current selection. Never prevent page wheel scrolling; no wheel-based edition changes. No precision gesture is necessary. When the section enters view, reveal its static layout only; scrolling through it cannot trigger a tunnel journey.

At 390 px, replace the cylinder with one main image and one incoming image moving <=16 px with a 220 ms crossfade. Year/caption/buttons remain beneath, not over imagery. Reduced motion and STATIC replace instantly with no scale, depth, parallax or fade. Touch-only desktop/tablet uses explicit controls with no hover requirement. Missing image gives an honest neutral frame and caption, not another year's photo. No WebGL support is required. Image alt text belongs to the static selected figure; animated duplicates have empty alt and are aria-hidden. An ordinary View all editions disclosure exposes a semantic list without animation; absent verified archive URLs must not become dead links.

## 7. Performance budgets and adaptive quality

These are initial acceptance targets to measure, not achieved results or hardware detection promises. Polygon caps count visible rendered triangles across the entire scene, including duplicates; draw-call caps include effects. Prefer fewer translucent overlapping pixels over simply fewer triangles. Desktop default FULL, phone/tablet default REDUCED, user Static and OS reduced motion choose STATIC. Do not rely on user-agent names to infer GPU power. Save-Data, where available, defaults to STATIC; low-power behavior elsewhere comes from conservative initial mode and measured frame time, not an unreliable battery API.

| Budget | FULL | REDUCED | STATIC |
| --- | --- | --- | --- |
| DPR | desktop 1–1.5, cap 1.25 at 1920×1080; mobile opt-in <=1.25 | desktop/mobile 1, allow .75 after poor samples | Native DOM/responsive still, no Canvas |
| Frame target while active | 60 fps desktop; p95 frame interval <=20 ms | >=30 fps ordinary phone; p95 <=36 ms | No animation loop |
| Visible triangles | <=80,000; main liquid surface <=30,000 | <=25,000; liquid <=10,000 | 0 |
| Draw calls, including effects | <=60 | <=30 | 0 WebGL |
| Simultaneous particles | <=500 batched, no per-particle React mesh | <=100 batched, default 0 on phone | 0 |
| Scene textures | <=2048 px longest edge; prefer 1024; one <=512 environment map | <=1024 px, environment <=256 | poster <=1600 desktop / 800 phone |
| Estimated texture + target residency | <=64 MiB | <=24 MiB | one decoded responsive poster plus ordinary page images |
| Postprocessing | Baseline none; optional custom half-resolution bloom, <=6 additional fullscreen draws within the 60-call total; no SSAO/DOF | None; emissive color only | None |
| Refraction | Optional one scene-only target within memory budget; off in comparison baseline | Off | Off |
| Shadows/lights | No real-time shadow maps; max 2 local lights + ambient/environment | 1 key + ambient/environment | Baked/procedural still |
| Optional active-theme scene/media transfer | <=1.5 MB compressed after useful content | <=700 KB compressed after useful content | <=160 KB desktop / 80 KB phone poster target |
| Initial useful page resources | <=350 KB compressed JS+CSS; shared body + active display <=180 KB additional | Same ceiling; never all theme fonts/scenes | Same shared shell; no 3D dependency download |

Texture residency is not compressed download size: budget decoded dimensions, mipmaps, environment cubes and all render targets. Estimate RGBA8 at width×height×4 (mipmaps about 4/3); HDR formats and multisampling cost more. Renderer counters are useful trends, not an exact GPU memory meter. If dependencies alone exceed initial JS ceiling, lazy-load decorative systems rather than quietly raising the target.

Load useful semantic content first; request only selected Flux scene after first content paint and when near its region. Pulse history enhancement/images load within 600 px of the section. Panel first-visit artwork has a total compressed target <=400 KB desktop, <=220 KB phone; otherwise use vectors or skip. Initial fonts use visible fallbacks. No automatic preloading of all three Flux candidates. Decode bounded archive images, reserve media dimensions and defer offscreen gallery/sponsor assets.

Adaptive downgrade: ignore initial shader warm-up (first 2 s); sample active-frame intervals in 3-second windows, excluding hidden/offscreen gaps. Two consecutive windows with p95 >24 ms in FULL drop to REDUCED. Two REDUCED windows with p95 >40 ms drop to STATIC. Remove bloom/refraction first, then lower DPR/particles and geometry. Long freeze/context loss can fail immediately to poster. Apply changes without altering content layout; do not restart at chapter zero. Never automatically upgrade within the same visit (prevents oscillation); an explicit Try higher quality starts a new sample period. User preferences and OS motion limits always win.

Measure production build, cold and warm loads under recorded network/CPU conditions, then a 60-second scroll/idle/reverse sequence on an integrated-GPU laptop and at least one physical 4–6 GB midrange Android phone. A desktop mobile viewport is not a phone performance test. Lab targets: LCP <=2.5 s, CLS <=.1, input response p75 <=200 ms on agreed test conditions; field INP cannot be claimed from this prototype. Record devices/browser versions, throttling, actual transfers, frame p50/p95, draw calls, triangles and quality downgrades. After ten theme/variant cycles, resource counters must return near their warmed baseline without monotonic growth. Render scheduling must stop while hidden, offscreen or fully occluded.

## 8. Responsive experience matrix

| Feature | 1920×1080 | 1440×900 | Tablet 768×1024 | Phone ~390×844 |
| --- | --- | --- | --- | --- |
| Flux field | Edge-to-edge scene, content max 1320 px; more negative space rather than larger text lines; 320svh narrative | Same structure, tighter camera crop; 320svh narrative | Portrait camera composed around lower-right of copy, 260svh narrative; REDUCED default | Whole background remains immersive; two short content beats totaling about 200svh, no standalone scene card; REDUCED or still |
| Core | Two rails and four struts, X aligns in upper reading band | Same assets, narrow peripheral spread | One rail, 3 foreground struts plus complete X silhouette | Single junction and partial arc behind lower-right; activation by light/color, minimal displacement |
| Liquid | Broad folds occupy periphery, small readable negative-space crossing | Rotate layout root to retain crossing rather than crop it away | One vertical fold with fewer surface segments | One elongated portrait silhouette, tiny material shift; no large screen-scale deformation |
| Portal | Three frames with finite depth | Tighter frame widths, same category zones | Two frames, 9 nodes maximum, camera travel halved | One frame, 6 nodes maximum; no forward flight, three simple signals |
| Flux typography | ~96–128 px title, <=6 px backing parallax, year separate | ~80–112 px, same stable front faces | ~60–80 px as fits, no mouse response on coarse pointer | ~40–48 px adjusted to preserve whole word at 350 px content width; edition on own line; no backing motion |
| Flux choreography | Five chapter states, low-amplitude camera path | Same state/trigger definitions | Same p chapters, half lateral travel | Arrival/reveal compressed to first beat; activation/category/handoff in second; fixed camera and background/object state changes only |
| Panel intro | 3.2 s, two-panel composition, wide quiet action rail | Same timing with tighter crops | 3.2 s, reduced asymmetry and no perspective turn | 2.4 s, one moving panel; facts/actions in normal flow |
| Pulse history | Six decorative planes, coarse arc and direct years | Six planes, smaller radius; captions not over image | Three planes, shallow depth, no image passing toward viewer | Two-image shallow cross-slide, explicit buttons/select; no dial drag necessary |
| Navigation/content | Stable horizontal nav; restrained shared grids | Same, wrap supporting facts naturally | Compact menu, two event columns only if titles fit | Compact menu; one-column content, 44 px controls, 16 px body and 14–16 px metadata |

Breakpoints remain shared (<640, 640–1023, >=1024), but content height and pointer capability determine motion. At 200% text zoom, 320 px reflow or viewport height <600 px, prefer normal-flow STATIC decoration and remove narrative minimum-height padding. No squeezed letters, hidden descriptions, forced landscape or page-level horizontal scrolling. Recompute on orientation changes without replaying arrival. Use stable svh sizing to avoid browser-toolbar-induced progress jumps.

## 9. Accessibility and fallback contracts

| Feature | Keyboard / semantics | Reduced motion | WebGL unavailable | Low power / touch |
| --- | --- | --- | --- | --- |
| Flux background/camera | Decorative Canvas hidden; normal anchors and reading order; Skip to events bypasses story | STATIC poster and normal-flow content, no long scroll runway | Same static composition, no essential information loss | REDUCED fixed mobile camera or STATIC; touch scroll remains native |
| Flux title/depth | One solid h1 + edition, no duplicate announcements; text remains selectable | All backs still or absent | DOM wordmark plus CSS depth if useful | No pointer/depth response on coarse input; intact letters |
| Category signals | Ordinary visible links/buttons; focus triggers same optional highlight as hover | Immediate border/state change only | Same shared filter/navigation works | Tap once activates DOM action; never search for a 3D hit target |
| Panel intro | Skip/Replay in normal focus order; no modal/trap; Escape/scroll exit | Settled hero, optional static storyboard disclosure | No WebGL used | Small vector/two-panel version; skip on resource failure |
| Pulse tunnel/dial | Previous/Next, direct year buttons/select, selected state and meaningful figure/caption; live notice only for user selection | Instant image/year replacement, all-editions list | CSS/DOM feature unaffected | Shallow transition/instant; precision drag optional; vertical scrolling preserved |
| Quality/preferences | Named controls, visible chosen mode, focus retained | OS reduction overrides user animation request | Static shown clearly, optional retry | No GPU/gyro permissions; conservative defaults |

All text must be checked against actual animated states: normal text >=4.5:1, qualifying large text >=3:1, necessary control boundaries/focus >=3:1. Test at beginning/middle/end and brightest effect state. Avoid flash/inversion effects entirely; cuts stay inside art panels without full-screen luminance changes. No essential data in images alone, hover-only captions, autoplay carousel or sound. Disable smooth scrolling under reduced motion; a preference changed mid-session immediately settles timelines and preserves the current selected edition, section position and focus.

Failure of fonts yields readable system fonts; failure of imagery yields labeled neutral placeholders; failure of scene import, shader compilation or context yields poster. Build static content with semantic HTML before enhancement. The existing client-only React scaffold is not a no-JavaScript site; do not claim it is. If a public release later requires no-JS content, plan prerendering separately. For this prototype test decorative failure with the shared React content still operating.

## 10. Three Flux experiments and fair comparison

Implement A/Core, B/Liquid and C/Network as interchangeable scene modules in one harness. They share exact `data.ts` edition/event copy, FESTRONIX/2K27 title, provisional font weights, DOM layout, five progress chapters, CTA/category positions, viewport, lights' overall exposure range, controls, quality budgets, poster-first loading and reduced-motion/no-WebGL behavior. Same random seed, maximum pointer bounds and optional effects policy. One canvas at a time; equal development/polish time (initial allocation one implementation pass plus one defect-fix pass each). Give each an equally intentional temporary poster and mobile composition.

Required for every candidate: full-width backdrop through introduction/category invitation; X alignment and separate year depth; one visible activation transformation; three category signals; readable handoff to detailed cards; native scroll/reverse/deep-link behavior; fine-pointer response and touch equivalence; shared failure and quality controls. No candidate may substitute a video or polished generated hero while others use raw primitives.

Test each at 1920×1080, 1440×900, 768×1024, 390×844, plus 320 px reflow. Capture p=0,.19,.39,.64,.92,1 and watch the transitions; stills alone cannot establish motion quality. Exercise menu/dialog, keyboard, long titles, 200% text, font/image failure, reduced-motion toggled mid-scroll, static mode, context loss, theme changes during loading and reverse travel. Record all pending checks honestly.

Use at least six reviewers for directional evidence (preferably four students on their own phones and two organizers/design reviewers). Counterbalance order ABC/BCA/CAB and reversed orders; label candidates A/B/C without promoting a favorite. Ask each reviewer to identify festival/year, find event fee/eligibility and reach schedule/help before judging spectacle. Small-sample ratings are qualitative, not statistical proof. Keep raw ratings/comments and technical measurements together.

| Criterion | Weight | 1-point / 3-point / 5-point anchors |
| --- | ---: | --- |
| Wow factor | 10 | Forgettable / engaging moment / memorable coherent sequence |
| FESTRONIX identity | 12 | Generic object / some X relationship / inseparable from FESTRONIX idea |
| Originality | 8 | Familiar template / original arrangement / distinct form and motion language |
| Technology-fest relevance | 8 | Unrelated spectacle / technical cues / clear making-computing-discovery connection |
| Typography integration | 10 | Text pasted on / some alignment / convincing shared depth with instant reading |
| Scroll storytelling | 10 | Unrelated motion / understandable chapters / strong activation-to-events progression |
| Interaction quality | 8 | Jittery/unclear / bounded useful response / precise response across pointer, keyboard and touch |
| Readability | 10 | Interference / occasional competition / identity, facts and actions clear throughout |
| Mobile viability | 10 | Shrunk desktop / acceptable simplification / intentional portrait experience |
| Performance | 9 | Repeated failure / meets reduced tier / meets selected-tier targets with headroom |
| Maintainability | 5 | Tangled/coupled / isolated modules / clear ownership, simple parameters and reliable cleanup |
| **Total** | **100** | Weighted score = sum(weight × rating / 5) |

Reviewers score the first nine experience criteria; an implementer supplies performance/maintainability scores using recordings, counters and code inspection. Average each criterion before weighting; retain desktop/mobile scores separately as well as the combined result. Hard gates precede ranking: intact readable brand/actions, no scroll trap, identical content, accessible fallback, working phone composition and tier budgets. A failed gate disqualifies a candidate until repaired regardless of total. If results are close (within five points), run targeted tests on the disputed criteria. The owner chooses only after seeing the working prototypes and measured evidence; this specification selects no winner.

## 11. Rebuild sequence and completion evidence

After coding authorization: (1) extract shared shell/content and implement preferences/static layout; (2) build full-width scene host, deterministic progress and cleanup with procedural geometry; (3) build all three candidates and hybrid title; (4) add Panel storyboard and Pulse archive using temporary assets; (5) run the comparison/QA matrix, fix failures, record measurements; (6) present working candidates for selection. These are future steps, not work performed by this documentation task.

Definition of prototype-ready: no final images or faculty systems required, but all shared interaction contracts implemented, all fallback states usable, specified viewport recordings inspected and failures reported. Physical-phone performance evidence is mandatory before claiming student-phone quality. Font/logo approval, archive rights and live dates/prizes/sponsors remain later release dependencies. The next build does not need Firebase, APIs, databases, authentication or a Flux winner decided in advance.
