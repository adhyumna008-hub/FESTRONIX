# FESTRONIX Club Gallery verification

Recorded 2026-10-07 against the local production build in `prototypes/festronix-visual`. This continues the authorized immersive rebuild and the owner's latest five-club request. It does not certify physical-device performance or final visual acceptance.

## Result and coverage

Flux A now presents Gaming, SDC, Literature, CINE and OTAKU through one continuous gallery. The corresponding sourced objects are a gamepad, laptop, books, video camera and katana on its stand. Detailed geometry, original UVs and PBR maps are retained. All six source objects are Poly Haven CC0; see [source provenance](../assets/3d/SOURCES.md), [asset sizes](ASSET_MANIFEST.md) and [implementation](REAL_3D_WORLD_IMPLEMENTATION.md).

| CSS viewport | Mode inspected | Observations |
| --- | --- | --- |
| 390×844 | REDUCED, STATIC, user motion reduction | All clubs readable; centered objects below copy; no horizontal overflow; SDC keyboard spotlight and focus return; five matching static stills and zero Canvas. |
| 768×1024 | REDUCED, STATIC | All clubs and chapter navigation checked; centered tablet camera/stacked composition; laptop fits; static anchor heading clears sticky header; no horizontal overflow. |
| 1440×900 | FULL, REDUCED, STATIC | Detailed model/material views, camera travel, CINE/OTAKU actual-mesh clicks, loading failure/retry, offscreen disposal and theme switches inspected; no horizontal overflow. |
| 1920×1080 | FULL | All five chapter anchors and DOM club actions checked with Enter/Escape; focus returns to trigger; one Canvas and no horizontal overflow. |

These are browser CSS viewport overrides, not actual phone/tablet hardware or touch-device certification. Native screenshot capture can crop wider CSS overrides; DOM dimensions and overflow were checked separately.

## Interaction and resilience

- CINE and OTAKU raycast clicks opened the matching spotlight. Every DOM club control opened with Enter, closed with Escape from the focused panel, and returned focus to its trigger. This does not claim a global Escape handler after every pointer selection.
- Native scroll and anchors change one camera path; slow fade/pop content entrances remain shared across themes. Completed keyboard-revealed content stays visible. No wheel replacement or scroll locking was added.
- Temporarily hiding the first model in `dist` produced the useful fallback: club/event content, five matching stills and zero Canvas. The file was restored; Retry returned to ready with one Canvas. No test backup remains.
- Scrolling to FAQ for ten seconds released Canvas (`suspended`, zero Canvas). Home recreated the ready scene with one Canvas, seven geometries and six textures.
- Pulse and Panel switch to zero Canvas; Flux A/B/C switches retain one Canvas. Institution logos and existing theme motions remain.
- The final normal browser run returned no warning/error console entries. The deliberate missing-file test is separate from normal operation.

## Corrections during inspection

Phone/tablet camera paths now center each subject and use the correct responsive FOV; tablet copy stacks above the subject. Static anchors clear the sticky header. Laptop LCD texture orientation was corrected. Focus-revealed entrances cannot restart invisibly. Loading percentage uses Content-Length only when the body is not HTTP-decoded, preventing compressed/decoded byte mismatches. Cancellation closes late bitmap results and releases partially parsed assets. The closing five-object group uses REDUCED texture files and model shading settings to avoid small-object shadow duplication.

## Build and cost observations

`npm run build` passes TypeScript and Vite. Gzip output is initial JS 139.24 KB, CSS 13.19 KB, lazy WorldScene 9.53 KB, shared deferred GLTF 251.32 KB and retained B/C 8.72 KB. Vite's existing large-chunk warning remains.

All five club runtime files total **2,877,454 bytes FULL / 1,588,350 REDUCED** and **66,612 source triangles**. The six locally rendered fallback stills total **43,786 bytes**. Nearest exhibits are scoped to current/adjacent clubs (maximum three); the finale uses five REDUCED assets. Compressed transfer size is not GPU memory.

Renderer snapshots before the final small-object shadow correction: arrival FULL 13 draws / 14,554 triangles / 7 geometries / 6 textures; fresh CINE FULL 19 / 37,240 / 11 / 12. Counters include current rendering/culling and are not universal scene budgets.

After the correction, the closing group was rechecked ready with all five assets, one Canvas and no overflow. At progress .9629 the camera reached z −115.47, beyond the arch at z −111, without intersecting the terminal plinth at z −129. Its observed steady counter was 26 draws / 74,720 triangles / 18 geometries / 25 textures; cached-shadow steady counters are not a direct before/after saving measurement.

Busy-session, cold-load and earlier multi-tab diagnostics observed FULL roughly 35–46 fps with p95 frame tails around 38–75 ms, and REDUCED 22–28 fps with tails around 50–64 ms. These were not isolated sustained benchmarks. They do not establish the scheduler's 60/30 active-fps targets or lag-free behavior. Adaptation, lower idle rates, capped DPR and offscreen suspension are implemented; physical device acceptance remains pending.

## Remaining limits

Physical midrange-phone testing, GPU timing and residency measurement, forced context loss, actual OS reduced-motion settings and sustained isolated frame-time tests remain unverified. Earlier 80k/25k triangle, 64/24 MiB texture residency and 1.5 MB/700 KB transfer targets are not certified for the expanded gallery. Source selection, final appearance, institution branding and factual club programs require owner review. Dates, events and archive editions remain fictional prototype content. No publication or deployment is claimed.
