# Detailed Flux A hardware QA

**Date:** 2026-10-07  
**Scope:** Current Flux A asset refinement, preserving the immersive prototype.  
**Preview:** http://127.0.0.1:4180/?theme=Flux&variant=A&quality=FULL#main

The owner requested convincing physical hardware detail and an exploded-parts scroll animation. A now uses [Circuit Board by Benny Weimer](https://polyhaven.com/a/circuit_board), with verified [Poly Haven CC0 asset licensing](https://polyhaven.com/license). It is a detailed textured model, not claimed to be a photograph, scan, exact manufacturer device or engineering CAD. The source preview render is not shipped; the fallback is our own local render of the licensed geometry and scene lighting.

## Implementation verified

- Source geometry retains all 14,430 triangles, UVs and normals. Connected pieces are grouped into PCB, cooler, memory, I/O, chips, slots and capacitors. The rotor is a child of the cooler with its own physical-axis pivot. Grouping is a visual disassembly, not a claim of accurate internal construction.
- R3F owns camera, pointer tilt, materials and object transforms; the existing ScrollTrigger director supplies native scroll progress. Part transforms are derived from recorded assembled transforms on every frame, without accumulated offsets. FULL rotor motion is 0.8 rad/s; REDUCED stays still. No new dependency or simultaneous Canvas was introduced.
- Three texture maps share corrected source alpha. FULL uses 1536² maps, REDUCED 768² with identical geometry. A local RoomEnvironment supplies reflections with neutral key/fill lighting. No bloom or extra HDRI download.
- Asset loading waits for all image decodes and model parsing. Fetches abort on teardown; late image/GPU resources close/dispose. The static poster is visible until model readiness and first scene compilation; A's deadline is eight seconds. Adaptive sampling resets its warmup at actual readiness.
- The desktop product was resized and lowered after visual inspection found the old framing cutting through the cooler behind the identity band. Narrow screens preserve their existing background composition and readable actions.

## Browser evidence

| CSS viewport | Observed result |
| --- | --- |
| 390 × 844 | Hero actions visible; source model behind copy; reduced separation; no horizontal overflow. At p=.5209 cooler offset=.03496 and memory=.02253 in source units. |
| 768 × 1024 | Complete board and actions fit the composition; tablet travel; no overflow. At p=.3888 cooler=.04123, memory=.01926. |
| 1440 × 900 | Complete source object below title, clear surface detail and separate component groups. At p=.4267 cooler=.07820, memory=.04079. |
| 1920 × 1080 | Full layout/object inspected with a full-page clipped viewport capture; no overflow. At p=.4175 cooler=.07496, memory=.03816. |
| 750 × 715 | Owner's annotation size inspected; complete object in the existing responsive background treatment; no overflow. |

Reverse navigation to the hero restored progress=.0000 and both measured separations=.00000. Rotor angle advanced while FULL was active and was .000 in REDUCED. Source axes and bounds are recorded in the served provenance file.

Interaction and lifecycle checks:

- Keyboard Enter on Send a pulse updated the scoped pulse marker and requested a frame.
- Reduce motion removed the Canvas, retained a loaded matching image and left zero waiting reveal attributes; all semantic content remained available.
- Temporarily held only the REDUCED production GLB to test failure. The poster remained loaded, both hero actions remained, Canvas count was zero and Try visual enhancement appeared. Restored the file immediately; keyboard retry recreated exactly one ready Canvas. No `.qa-held` file remains.
- B/C both loaded with one Canvas; Pulse/Panel had zero. Panel retained its five exit tiles. Quick A→B→A changes during loading recovered A with no duplicate Canvas or logged error.
- Final inspected browser error/warning log was empty. The preview initially needed restarting after its earlier process had ended; the failed navigation tab was replaced, separately from application failure testing.
- Native viewport screenshots can clip to the app surface at very large dimensions. A `fullPage:true` capture with a 1920×1080 clip confirmed the entire large composition. The local 900×900 poster capture was inspected after layout settled.

Evidence files in `prototypes/festronix-visual/output/`:

- `real-hardware-qa.json`: serialized browser measurements.
- `real-hardware-arrival-desktop.jpg`: complete assembled hero.
- `real-hardware-exploded-desktop.jpg`: activation chapter with separated components.
- `real-hardware-phone.jpg`: phone composition.
- `hardware-poster.jpg`: canonical locally rendered still.

![Detailed hardware during activation](../prototypes/festronix-visual/output/real-hardware-exploded-desktop.jpg)

## Build, cost and limits

Final TypeScript/Vite build passes. Initial JS is 134.78 KB gzip; CSS 10.28 KB gzip; deferred Flux 259.13 KB gzip. Vite retains its existing >500 KB uncompressed deferred-chunk warning.

| Tier | Board transfer | Poster | Approx. enhancement including Flux chunk |
| --- | ---: | ---: | ---: |
| FULL | 1,495,650 bytes | 59,666 bytes | 1.81 MB |
| REDUCED | 562,496 bytes | 41,662 bytes | 863.29 KB |

These exceed the earlier 1.5 MB / 700 KB enhancement targets. Maps with mipmaps are approximately 36 MiB FULL / 9 MiB REDUCED plus the local environment. The source board remains within both geometry targets. Observed scene counters were 16 draws / 15,230 triangles / 16 geometries / 4 textures FULL, and 16 / 14,830 / 16 / 4 REDUCED; wallpaper geometry accounts for the extra triangles. These are snapshots, not a sustained GPU/FPS certification.

Real phone/GPU performance, actual OS motion setting, browser diversity, forced context loss and cold constrained-network timing remain unverified in this pass. The existing graceful fallback and adaptive quality remain. Human visual acceptance, final branding and a Flux winner remain undecided; no other product phase or deployment was started.
