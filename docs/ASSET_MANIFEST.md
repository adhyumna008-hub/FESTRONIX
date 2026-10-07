# FESTRONIX provisional immersive asset manifest

**Date:** 2026-10-07  
**Status:** Provisional procedural assets and the subsequent owner-directed, CC0-sourced Flux A hardware refinement are implemented. The sourced model/textures replace A's earlier procedural board; final visual approval, artwork and branding remain pending.  
**Scope:** Pulse, Panel and three competing Flux prototypes; see [direction reset](PROTOTYPE_DIRECTION_RESET.md) and [interaction architecture](IMMERSIVE_INTERACTION_ARCHITECTURE.md).

## 1. Status and provenance rules

**TEMPORARY PROTOTYPE ASSET** means an explicitly labeled local comparison aid, not approved branding, a real event photograph, sponsor commitment or evidence of a past edition. **FINAL ASSET REQUIRED** means a future reviewed deliverable needed before using that asset in a public release; it does not block a procedural local experiment. **OPTIONAL / DEFERRED** means do not procure or generate it until a working comparison demonstrates a need.

The visual-reference screenshots remain research-only. None of their copied characters, distinctive sculptures or logos is licensed for inclusion in the prototype merely by being present locally. The separately licensed Circuit Board source files under `references/flux/asset-candidates/circuit-board/` have explicit CC0 evidence and supply the derived runtime asset documented below; this does not license any source preview render. Do not generate close recreations. No generated image may impersonate a historical FESTRONIX photograph. No image generator should render essential event facts or the only readable FESTRONIX title.

Future manifest entries must record: ID, theme/usage, status, source/creator, original path, rights/license and permission evidence, generation provenance if applicable, edition ID, content approval, dimensions/format, compressed bytes, decoded/GPU cost, focal point/crops, alt/caption/credit, variants and replacement owner. Missing approval blocks final publication of that asset, not the whole temporary comparison.

Suggested future storage inside `prototypes/festronix-visual/public/assets/`: `shared/`, `pulse/archive/`, `panel/intro/`, `flux/core/`, `flux/liquid/`, `flux/network/`. The sourced hardware's actual runtime files are under `prototypes/festronix-visual/public/models/circuit-board/`; the suggested asset folders remain a plan. Source originals remain separate from derived runtime files. Filenames must not encode a final edition into the permanent logo.

## 2. Shared identity and functional assets

| ID | Status | Medium / requirement | Temporary path and final acceptance |
| --- | --- | --- | --- |
| SH-01 permanent FESTRONIX identity | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED | Current DOM wordmark / simple SVG mark now; human-reviewed year-independent vector later | Existing `src/main.tsx` identity is provisional. Final SVG needs monochrome/light/dark versions, clean paths/viewBox, clear small-size silhouette; no mandatory image loading for the h1 |
| SH-02 edition label | TEMPORARY PROTOTYPE ASSET; final approved content required | DOM/CSS text from edition.label | `2K27` remains editable and accessible; never baked into SH-01 or a scene texture |
| SH-03 typography | Provisional candidates -> FINAL ASSET REQUIRED for chosen licensed builds | Shared Manrope, active theme only: Space Grotesk / Barlow Condensed / Sora | System fallbacks first. Later self-host WOFF2 if approved; verify license notices, weights, ₹/punctuation and fallbacks. Shared body + active display <=180 KB compressed target. Do not load nine candidate families |
| SH-04 event visuals | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED if used publicly | Existing procedural SVG `src/Art.tsx` for three shared events; later original SVG or generated editorial illustration | 3:2 crop, suggested 1200×800 raster master, 600/900 responsive outputs <=100 KB each; meaningful alt if contentful, empty if duplicating caption |
| SH-05 controls/status symbols | TEMPORARY PROTOTYPE ASSET; review for final reuse | SVG/CSS icons and semantic text | Original simple arrows, close, motion/static marks; accessible names on controls, no icon-only status meaning |
| SH-06 sponsor/college identity | FINAL ASSET REQUIRED, supplied by authorized organization | Official supplied SVG/PNG, never generated | Prototype uses textual partner slots. Verify current-edition permission, correct colors, links and clear space before publishing |

## 3. Pulse assets

| ID | Status | Quantity / medium | Specification and acceptance |
| --- | --- | --- | --- |
| PU-01 hero accents | TEMPORARY PROTOTYPE ASSET; can become final after design review | 3–5 SVG/CSS geometric fragments | Flat cobalt/orange/ink, no large bitmap or GLB. Decorative and aria-hidden. Keep overall hero light and readable |
| PU-02 mock archive cards | TEMPORARY PROTOTYPE ASSET | 3 sample editions × 2 procedural SVG posters | Reuse Art primitives with explicit Sample archive / not historical media labels. Do not imply 2024/2025/2026 activities actually occurred |
| PU-03 historical photography | FINAL ASSET REQUIRED for truthful archive launch | Prefer 3–5 cleared photos per real edition, at least 1 per displayed entry | Real institutional archive only. Master preferably >=1600 px long edge; outputs 480/800/1200 WebP/AVIF with supported fallback, usually <=120 KB each at display size. Retain original securely in appropriate future asset workflow; do not expose private originals |
| PU-04 historical posters/captions | FINAL ASSET REQUIRED | Verified real posters, year, activity, caption, credit and optional highlight facts | Provide text equivalent for poster information. Confirm permissions for identifiable people and edition attribution through authorized owner. Omit unsupported statistics, do not fill gaps with generated history |
| PU-05 Chrono Dial | TEMPORARY PROTOTYPE ASSET; review for final reuse | One original SVG semicircle with CSS indicator | Coarse detents, no tiny functional labels, no franchise device or Doraemon cues. Direct HTML year controls own interaction. ViewBox-based, <=20 KB target |
| PU-06 tunnel | Procedural implementation requirement, not downloadable media | CSS perspective, maximum 6 planes using PU-02/03 | No cylindrical mesh, video, GLB, texture or extra image set needed. Static selected image is the fallback |

Pulse does not need generated photography, a 3D model or a launch video. Generated imagery may later supply clearly illustrated event graphics, never documentary archive evidence. If no cleared history exists, omit the production history section or show a truthful empty-state explanation; keep sample history only in the labeled review prototype.

## 4. Panel assets

| ID | Status | Quantity / medium | Specification and acceptance |
| --- | --- | --- | --- |
| PA-01 robotics fragment | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED | One original SVG sketch now; generated or commissioned illustration later | Robot gripper fitting an abstract component, no mascot/franchise likeness. 1200×900 raster master if needed; subject within central 60% for portrait crop |
| PA-02 coding fragment | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED | One vector code-block/process illustration | Use abstract tokens rather than unreadable pseudo-code rendered by an image generator. Actual BUILD/BREAK/DISCOVER labels are DOM/SVG text |
| PA-03 gaming fragment | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED | One original controller/circuit or play-field illustration | Avoid existing console marks and recognizable game assets; coherent ink/cream/red palette |
| PA-04 AI fragment | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED | One original signal-graph illustration | Diagrammatic nodes/curves or commissioned/generated ink image; not a copied AI logo. Combine with PA-02/03 for phone crop |
| PA-05 rules, speed lines, masks | TEMPORARY PROTOTYPE ASSET; eligible for final reuse after review | SVG/CSS procedural strokes and clipping paths | No raster needed, no moving halftone moire; textures outside reading area. Total vector motif payload <=40 KB target |
| PA-06 halftone/paper | OPTIONAL / DEFERRED raster; procedural first | SVG dots/CSS texture or <=256×256 repeat tile | Low-contrast static margins; never behind paragraphs/actions. <=15 KB if tile is justified |
| PA-07 settled cover / fallback | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED if illustration retained | Composition of PA-01–04 + CSS rules, not a separate mandatory video | Same final frame as hero. Use art-only 16:9 and portrait crops; logo/edition/action stay DOM. Total intro image transfer <=400 KB desktop / 220 KB phone |

Future image-generation briefs must specify original engineering subject matter, consistent ink weight/palette/light direction and no text/logos/characters. Review anatomy/mechanical coherence and crop safety. Use generated imagery as source material for reviewed layered assets; do not accept a flattened poster containing navigation. No audio, copyrighted panels, frame-by-frame rendered video or GLB required for the specified intro.

**Subsequent owner-directed motion refinement:** PA-07's existing original SVG pieces now have independent exit wrappers in `PanelIntro.tsx`, with Build/Code/Discover/Play departing diagonally and the central mark upward. A separate CSS paper layer retains the same assembled cover. No replacement art, raster, model or third-party animation asset was acquired. The existing semantic title, edition and actions remain DOM content.

## 5. Flux experiment assets

All three candidates remain available for comparison. Procedural forms supplied the first comparison pass; the owner's subsequent realism clarification authorized a detailed sourced hardware model for A. B/C retain their existing concepts and implementations. This asset refinement selects no Flux winner and does not approve final branding.

| ID | Status | Medium / quantity | Requirements |
| --- | --- | --- | --- |
| FX-A01 Core form | TEMPORARY PROTOTYPE ASSET; source rights verified, final visual approval pending | Benny Weimer's Circuit Board from Poly Haven, rendered by `src/RealHardwareBoard.tsx` | CC0 source; 14,430 original triangles with preserved UVs/normals. Seven visual assembly groups plus a rotor nested in the cooler; source appearance retained. Detailed hardware visualization, not a claimed scan, physical photograph, manufacturer CAD or accurate internal teardown. Previous `ComputeBoard.tsx` remains source history and is no longer active A |
| FX-B01 Liquid form | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED (reviewed geometry/shader) | Custom continuous folded surface with low-frequency shader displacement | Main surface <=30k FULL / 10k REDUCED triangles; intentional crossing silhouette, displacement <=.06 radius, correct moving normals. No real fluid cache or baked video |
| FX-C01 Network form | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED (reviewed geometry) | Procedural frames, instanced nodes and batched connections | Three frames, <=18 nodes/24 segments FULL; phone one frame/6 nodes; finite spatial environment, no copied sci-fi portal |
| FX-02 title junction/backing | TEMPORARY PROTOTYPE ASSET; final follows SH-01 | CSS depth + optional original extruded X | Font-aligned DOM source, year-independent. No full raster wordmark as sole title. Duplicate geometry remains decorative |
| FX-03 material/environment | TEMPORARY PROTOTYPE ASSET -> reviewed final configuration | A uses locally generated Three.js `RoomEnvironment` and PMREM, with source PBR materials and neutral scene lights | No extra HDRI download or copied preview lighting. Environment/render-target overhead counts toward the existing 64/24 MiB FULL/REDUCED residency targets; owned resources are disposed. B/C retain their current lighting/materials |
| FX-04 surface maps | TEMPORARY PROTOTYPE ASSET for A; source rights verified | Three derived WebP maps: base-color with source alpha, normal, and packed ambient-occlusion/roughness/metalness | Original downloaded 2k diffuse/normal/ARM/alpha inputs are preserved separately. Runtime maps are 1536 px FULL / 768 px REDUCED; alpha cutout corrected from the original source alpha. Approximate RGBA8 residency including mipmaps is 36 MiB / 9 MiB for these three maps, plus environment overhead. No generated texture or reference-image sampling |
| FX-05 particles/connections | Procedural implementation requirement | Batched points/lines, <=500 FULL / 100 REDUCED, default none on phone | Seeded layouts, no downloaded particle animation. No per-particle texture unless tiny shared sprite genuinely needed |
| FX-A06 Core poster | TEMPORARY PROTOTYPE ASSET; derived from licensed model, final visual approval pending | Locally rendered hardware stills: 900×900 desktop and 800×800 phone | 59,666 / 41,662 bytes. Captured through `tools/hardware-poster.tsx` at local port 4181 using our model/lighting; source preview render is excluded. Responsive decorative crops with title, edition and actions kept in DOM. Earlier `ComputeBoardPoster.tsx` remains source history and is no longer active A |
| FX-B06 / C06 posters | TEMPORARY PROTOTYPE ASSET -> FINAL ASSET REQUIRED | Current CSS/SVG fallback per candidate | Existing Liquid and Network silhouettes retained. Future own-scene renders target <=160 KB desktop at <=1600 px / 80 KB phone at <=800 px, with no baked title, date or action |
| FX-07 sourced model delivery | TEMPORARY PROTOTYPE ASSET for A | Gzip-compressed GLBs with embedded geometry and relative external WebP maps | `board-full.glb.gz` / `board-reduced.glb.gz`, each about 241 KB. Bounds-centered runtime scale and orientation; named parts and explicit loader ownership. Same original geometry in both tiers; texture sizes differ. Included in the existing scene transfer/geometry budgets, not an extra allowance |
| FX-08 bloom/refraction | Procedural implementation requirement, optional | Shader/composer configuration, not media | Off in baseline; half-resolution effects only within architecture budgets. No external effects library or decorative texture bundle solely for popularity |

## 6. Production method decisions

| Method | Use | Do not use for |
| --- | --- | --- |
| Image generation later | Original Panel illustrations, optional conceptual event graphics, exploratory material references | Real historical photography, official logos, factual posters, generated snapshots presented as evidence of past editions |
| SVG / procedural vectors | Logo placeholder, dial, rules, masks, circuits, event sample posters | Copying another reference's distinctive illustration or logo |
| WebGL geometry | All three Flux forms and optional decorative X | Functional text, controls, event data or every card |
| GLB | Owner-authorized, licensed detailed hardware for Core A; optional reviewed geometry where justified | Default dependency for Network, unnecessary download for Pulse or Panel |
| Texture | Source PBR material maps for Core A, locally generated environment, optional tiny paper tile | Giant baked backgrounds carrying readable facts or unlicensed reference imagery |
| Real photography | Permission-cleared FESTRONIX archive and genuine current event coverage | Fabricated past-edition proof |
| CSS-only | Readability scrims, title depth, buttons, static silhouettes, Pulse tunnel composition and simple motion | Complex simulation or a replacement for accessible semantic content |

## 7. Asset delivery gates and responsibilities

1. The initial authorized build used labeled procedural placeholders. The subsequent owner-authorized realism refinement uses the specifically licensed Core A asset below. Further assets need a scoped purpose, rights evidence and measured geometry/transfer cost; this manifest itself does not authorize generating final art.
2. After working comparisons, the owner reviews Flux selection and provisional identity/typography. Final art director/creator supplies original assets against the chosen direction; do not commission all three final scenes before comparison.
3. Faculty/authorized archive steward supplies actual archive media, year/caption accuracy, permissions and sponsor/institutional identities. No named person or staffing commitment is invented here.
4. Implementer exports responsive variants, records bytes/decoded cost and verifies focal crops at all four viewports, alt text, failure states, current-edition separation and shader/model resource cleanup.
5. Final publication requires rights and content approval per asset. Keep rejected/unverified media out of public bundles; approved source provenance stays linked in this manifest.

No missing final asset blocks a labeled procedural immersive rebuild. Final historical media, approved brand/font files and verified public facts are required before representing the experience as the real live festival.

## Sourced hardware refinement — 2026-10-07

The owner clarified that the preceding procedural board looked cartoonish and requested detailed product-style hardware with an animated separation of visible parts. Active Core A now uses [Circuit Board](https://polyhaven.com/a/circuit_board) by **Benny Weimer**, from Poly Haven. The [Poly Haven license](https://polyhaven.com/license) identifies its downloadable assets as **CC0**. This is a sourced, textured hardware visualization; it is not described as a photogrammetry scan, a literal physical photograph, manufacturer CAD, or a manufacturer-accurate internal teardown. Final visual approval remains pending.

Source GLTF/bin, original 2k diffuse/normal/ARM/alpha maps, Poly Haven API metadata and hash evidence are retained under `references/flux/asset-candidates/circuit-board/`. All primary downloads were validated against their published MD5 values. `prepare_asset.py` preserves all 14,430 source triangles, UVs and normals while assigning seven visual groups (`pcb`, `cooler`, `memory`, `io`, `chips`, `slots`, `capacitors`) and a pivoted rotor child within the cooler. The separated groups are visual inspection layers; no hidden manufacturer internals are invented. The original source alpha corrects the cutout material. Runtime provenance and byte/dimension records are also stored in `public/models/circuit-board/provenance.json`.

| Runtime output | Resolution / format | Bytes |
| --- | --- | --- |
| FULL geometry | Gzip GLB, embedded geometry | 241,000 |
| FULL surface / normal / ARM | Three 1536 px WebP maps | 472,582 / 386,310 / 395,758 |
| FULL model plus maps | Original detail, 14,430 triangles | **1,495,650** |
| REDUCED geometry | Gzip GLB, same original geometry | 241,010 |
| REDUCED surface / normal / ARM | Three 768 px WebP maps | 142,110 / 76,248 / 103,128 |
| REDUCED model plus maps | Same 14,430 triangles | **562,496** |
| Desktop fallback | Locally rendered 900×900 WebP | **59,666** |
| Phone fallback | Locally rendered 800×800 WebP | **41,662** |

Fallbacks were captured locally with `tools/hardware-poster.tsx` through port 4181 using the licensed model and our scene lighting. They do not copy Poly Haven's source preview render, whose rights are excluded from this acquisition. Posters contain no mandatory event facts. They remain decorative and hidden from assistive technology while semantic HTML provides the festival title, edition, facts and actions.

`RealHardwareBoard.tsx` owns uncached loading, AbortController cancellation, texture decoding, stale-result disposal, geometry/material/texture/ImageBitmap cleanup and a local RoomEnvironment/PMREM target. Asset readiness is reported after the primitive commits; Runtime gates compilation and the poster handoff on that signal. Scroll offsets derive directly from stored assembled transforms and current progress, including exact reverse restoration. FULL spins the actual pivoted rotor; REDUCED leaves it still. Pointer response remains in the existing scene root, with a tiny collective pulse response. B/C, the one-Canvas director and shared content remain; no winner has been selected.

The board maps' approximate mipmapped RGBA8 residency is **36 MiB FULL / 9 MiB REDUCED**, plus RoomEnvironment/PMREM overhead; no extra HDRI is downloaded. Model triangle count and texture dimensions remain within the existing geometric/texture targets. However, model/maps plus the current deferred Flux chunk (**259.13 KB gzip**) and matching poster total approximately **1.81 MB FULL / 863.29 KB REDUCED**, exceeding the earlier **1.5 MB / 700 KB** scene/media transfer targets. Transfer-budget acceptance is not claimed. Physical-device sustained FPS and comprehensive GPU-memory certification remain pending; browser counters are not an exact memory meter. Final optimization/visual approval and production branding remain review dependencies.

## Annotated Core update — 2026-10-06 (preceding procedural pass)

The owner initially requested a recognizable technology model and matching live wallpaper. That pass used the original procedural compute-board concept, with subtle fan rotation, bounded pointer tilt, pulse/indicator response and routed circuit signals in `src/SpatialWallpaper.tsx`. Its board was superseded by the sourced hardware refinement above; B/C retained their existing models. This historical pass selected no Flux winner or final identity.

That pass's matching fallback was the original vector in `src/ComputeBoardPoster.tsx`: 800×800 viewBox, transparent decorative background, responsive CSS placement, no mandatory factual text. Its textures/environment were created locally and added no model/image transfer. That procedural A observed 27 draw calls and 6,142 triangles in the browser; these are historical measurements, not current sourced-model counters. See [SCROLL_MOTION_QA.md](SCROLL_MOTION_QA.md) for measurement limits and responsive verification.
