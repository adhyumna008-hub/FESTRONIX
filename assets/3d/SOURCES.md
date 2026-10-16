# FESTRONIX real 3D model sources

Updated 2026-10-07 for the owner's continuous Flux world authorization and
subsequent five-club gallery correction. Detailed club objects now take priority
over the preceding generic machinery concept. Source files and original X-Core /
robot prototypes are retained for traceability. External primary objects are
authored meshes with their original UVs and PBR maps, not claimed photogrammetry,
manufacturer CAD or physical photographs. No reference-site models, ripped game
assets or copyrighted anime characters are included.

## Current five-club object collection

The owner requested Gaming Club, SDC (Student Developer Club), Literature Club,
CINE Club and OTAKU (anime) Club, with more clubs later. All external models in
this collection are verified **CC0 1.0 Universal** from Poly Haven; the license
and source-file checksums are preserved. These are real three-dimensional mesh
objects with source surface maps. Material/framing acceptance belongs to the
current browser review; file preparation is not a visual approval or FPS claim.

| Club | Source model / creator | Primary source | Runtime slot |
| --- | --- | --- | --- |
| Gaming | Gamepad — Josh Dean | [Poly Haven](https://polyhaven.com/a/gamepad) | `/models/clubs/gamepad/gamepad-{full\|reduced}.glb.gz` |
| SDC | Classic Laptop — Arrangemonk | [Poly Haven](https://polyhaven.com/a/classic_laptop) | `/models/clubs/classic_laptop/classic_laptop-{full\|reduced}.glb.gz` |
| Literature | Four complete volumes from Book Encyclopedia Set 01 — John Malcolm | [Poly Haven](https://polyhaven.com/a/book_encyclopedia_set_01) | `/models/clubs/book_encyclopedia_set_01/book_encyclopedia_set_01-{full\|reduced}.glb.gz` |
| CINE | Vintage Video Camera — James Ray Cock and Jenelle van Heerden | [Poly Haven](https://polyhaven.com/a/vintage_video_camera) | `/models/clubs/vintage_video_camera/vintage_video_camera-{full\|reduced}.glb.gz` |
| OTAKU | Antique Katana 01 — Tal Swicegood; Katana Stand 01 — Rico Cilliers | [Katana](https://polyhaven.com/a/antique_katana_01), [stand](https://polyhaven.com/a/katana_stand_01) | `/models/clubs/otaku_display/otaku-display-{full\|reduced}.glb.gz` |

Ordinary `.glb` representations are provided beside the gzip files. Both contain
all runtime images; no provider CDN/API is needed in the browser. FULL source
maps are encoded at 1024 pixels and REDUCED at 512 pixels, with
`EXT_texture_webp`. No Draco, Meshopt or KTX2 decoder is required.

| Runtime object | Triangles | Material primitive groups | FULL raw / gzip bytes | REDUCED raw / gzip bytes |
| --- | ---: | ---: | ---: | ---: |
| Gamepad | 9,546 | 1 | 416,592 / 301,481 | 292,188 / 177,267 |
| Classic Laptop | 14,450 | 4 across 3 nodes | 802,460 / 526,252 | 604,988 / 328,733 |
| Four encyclopedia volumes | 13,484 | 2 | 814,708 / 474,082 | 588,524 / 250,372 |
| Vintage Video Camera | 18,682 | 2 | 1,094,968 / 791,086 | 806,068 / 502,193 |
| Combined katana display | 10,450 | 2 | 908,920 / 784,553 | 454,224 / 329,785 |

Material groups are source batches, not measured total rendering calls: glass,
shadow and environment passes can change runtime counters. In particular,
camera glass uses the provider's separate alpha map restored into RGBA because
the JPEG-only glTF export omitted it. Original diffuse, normal and packed
metalness/roughness remain; no uniformly gray or emissive substitute material is
used during preparation.

The laptop keeps its physical stand/base/screen nodes and detailed keycaps,
trackball and connectors. Its exported source screen is a dark opaque material;
the runtime LCD modification is documented below. The
gamepad is a generic retro controller; source maps inspected without visible
manufacturer branding. The camera's source markings are generic artist-made
PH JNL labels. No real manufacturer association is asserted.

Literature retains `book_encyclopedia_set_01_book01` through `book04` in full;
all triangles, UVs and normals belonging to those four physical volumes remain.
Their original translations are baked and stationary surfaces batched into two
cover/paper material groups. Six original surface maps remain. The scene can
rotate the upright source row about Z to present a horizontal book stack;
the current gallery uses +π/2.
This is source mesh selection/batching, not reconstruction from boxes.

OTAKU uses a supported physical display: the source katana and stand retain their
original metre scales. `assets/3d/tools/combine_otaku.py` only remaps GLB indices,
concatenates their embedded buffers and authors node poses. The blade is bare;
no scabbard is included. It points −X, with the wrapped hilt +X, +Y up and +Z front.
The real wooden uprights sit at X ≈ ±0.102 m; source triangle cross-sections
position the blade near their cradle, with approximately 0.8 mm clearance at
the lower sampled contact. This is a visually authored exhibit pose, not an
engineering/collision simulation.

Combined source bounds: min `(-0.501472,0.000054,-0.019857)`;
max `(0.501472,0.190543,0.073515)`; center
`(0,0.095299,0.026829)`; dimensions `(1.002944,0.190489,0.093373)` m.
The katana node rotates Z = π/2 and translates
`(0.194848,0.143857,0.026829)`; the original stand remains at ground origin.
Individual source katana/stand runtime files also remain for traceability.
No copyrighted character, anime mark or franchise object was acquired.

The optional **Filmstrip Projector 8mm** by **PeterM**,
[Poly Haven](https://polyhaven.com/a/filmstrip_projector_8mm), CC0, was prepared as
a CINE alternative but the lower-group-count video camera is the primary slot.
It has 32,697 source triangles, 16 mesh components and genuine feed/takeup spool
pivots; supplied film alpha is restored. FULL raw/gzip: 1,522,740 / 933,748 bytes;
REDUCED: 1,221,532 / 632,457 bytes. Files live under
`/models/clubs/filmstrip_projector_8mm/` and are not implicitly loaded by preparing
them.

Exact source originals/API JSON/MD5 evidence are under `assets/3d/sources/`.
Each club runtime directory contains `provenance.json` and prepared SHA-256
hashes. `prepare_polyhaven.py --collection clubs` reproduces the prepared source
slots; `inspect_prepared.py --collection clubs` checks container bounds, embedded
WebP signatures and unchanged geometry/hierarchy or retained-book batch hashes.
All fourteen individual and two combined OTAKU club GLBs passed those file
inspections. Browser
materials, mobile performance and final visual approval remain pending.

### Current gallery runtime modifications — 2026-10-07

These changes occur in the scene; the source files and prepared GLB checksums
above remain unchanged. They are original FESTRONIX staging/display work rather
than newly acquired provider artwork.

- **Laptop LCD:** `src/ClubDisplayTexture.ts` draws an original 512×512 canvas
  editor illustration labeled `SDC / build.js`. `WorldModel.tsx` assigns it only
  to the original `classic_laptop_screen` material/mesh and derives planar UVs
  from that LCD geometry's local X/Y bounds. Geometry positions, normals,
  physical keys/ports/hinge and the sourced body maps remain. The texture serves
  base-color and low-intensity emissive display appearance; it is decorative,
  with no factual club program, working editor or registration state implied.
  All readable club descriptions/actions remain semantic HTML. The generated
  CanvasTexture is included in the model owner's texture disposal.
- **Normalized exhibit placement:** `WorldModel.tsx` applies the configured
  object rotation, measures the resulting bounds, uses one uniform scale to
  fit the requested maximum dimension, centers X/Z and seats minimum Y at
  `ground=-0.798` on the gallery plinth. It adds the club's world translation
  through a separate root wrapper. Source topology and relative dimensions
  within each exhibit are retained; world display sizes are authored gallery
  composition, not a claim that all enlarged objects share real-world scale.
  The current Literature row rotates Z=+π/2 into a stack. Pointer response is
  bounded root rotation/highlight, not deformation of the source object.
- **Combined OTAKU sources:** the active slot is the combined
  `otaku_display/otaku-display-{full|reduced}.glb.gz`, with the source katana
  and wooden stand kept at their original relative metre scales and source PBR
  surfaces. The previously recorded composition pose aligns a bare blade above
  the stand's actual cradle. Only GLB index remapping/buffer concatenation and
  wrapper poses were authored; no copyrighted character or generated sword/
  support geometry was substituted. Whole-exhibit runtime scaling follows the
  same placement rule as other clubs.

Prepared texture counts are source definitions, not browser GPU measurements:
Gamepad 3, Laptop 3 plus the runtime LCD CanvasTexture, Literature 6, CINE 6
texture definitions referencing 3 embedded image blobs, and combined OTAKU 6.
The current owned loader decodes each embedded image once per model owner and
shares a `THREE.Source` across texture definitions referring to that image.
Definitions still have distinct Texture objects/associations for their UV and
material usage. In the installed Three.js renderer, matching Source, sampler and
color-space parameters can share the GPU upload; incompatible views can require
separate storage. CINE's six definitions therefore need not allocate six
independent images. Actual renderer counters/residency remain a QA question.
The final five-object display uses REDUCED files. Multi-object residency,
transfers, rendering counters and browser material quality remain **PENDING**
current QA; compressed file sizes alone do not certify those costs.

### Locally rendered club fallbacks — 2026-10-07

The root captured these stills through the prototype's `tools/world-poster.tsx`,
using the current `WorldScene`, licensed club meshes/maps and
original gallery environment/lighting. They are local derivative renders, not
downloaded source-preview artwork, copied reference media or generated proof of
a real festival. The preceding Circuit Board poster remains historical; the
current club gallery uses these matching fallback files.

Runtime directory: `prototypes/festronix-visual/public/models/clubs/posters/`.

| File | WebP dimensions / decoded source mode | Compressed bytes |
| --- | --- | ---: |
| `arrival.webp` | 1000×700 / RGB | 8,768 |
| `gaming.webp` | 550×540 / RGB | 6,250 |
| `sdc.webp` | 550×540 / RGB | 8,868 |
| `literature.webp` | 550×540 / RGB | 6,770 |
| `cine.webp` | 550×540 / RGB | 8,276 |
| `otaku.webp` | 550×540 / RGB | 4,854 |
| **Total six files** | | **43,786** |

Arrival is decorative with empty alt in the loading/static/error backdrop.
Compact STATIC/error club sections lazy-load their matching illustrations with
artifact descriptions as alt; factual copy/actions stay HTML. The crops contain
no mandatory title, dates or controls. Rights derive from the listed CC0 object
files plus locally authored scene work; provider preview renders/logos are not
included. File dimensions/bytes were checked locally. Final crop/material
approval and current browser/failure/device QA remain **PENDING** root results.

## Preceding machinery collection — preserved source history

All four Poly Haven model sources below carry **CC0 1.0 Universal**. This was
verified on their individual source pages and [Poly Haven's license
page](https://polyhaven.com/license) on 2026-10-07. Poly Haven permits modification
and redistribution of the asset files. Its logos, website copy and example
renders have separate rights: none of those example renders is shipped here.
Models and textures are served from FESTRONIX's local public directory; runtime
does not depend on the provider's API or CDN.

| Asset | Creator | Primary source | World use / status |
| --- | --- | --- | --- |
| Circuit Board | Benny Weimer | [Poly Haven](https://polyhaven.com/a/circuit_board) | Existing compute hardware, available for X-Core computation assemblies |
| Industrial Microscope | Lukas Walzer | [Poly Haven](https://polyhaven.com/a/industrial_microscope) | Prepared for Creator / Innovation inspection station |
| Gamepad | Josh Dean | [Poly Haven](https://polyhaven.com/a/gamepad) | Prepared for Gaming / Cyber controller station |
| Drill Press 01 | Viktor | [Poly Haven](https://polyhaven.com/a/drill_press_01) | Prepared for Creator / Innovation fabrication machinery |

### Circuit Board

- Runtime: `prototypes/festronix-visual/public/models/circuit-board/`.
- Preserved source/evidence: `references/flux/asset-candidates/circuit-board/`.
- Modifications from the preceding hardware pass: retained all 14,430 source
  triangles, UVs and normals; grouped connected geometry into PCB, cooler,
  memory, I/O, chips, slots and capacitors, plus a nested physical fan rotor.
  Restored the supplied alpha map omitted from the JPEG-only glTF export.
  Encoded FULL1536 / REDUCED768 WebP maps and gzip GLB containers.
- FULL geometry + maps: 1,495,650 bytes; REDUCED: 562,496 bytes. Matching posters
  are locally captured renders of the licensed model, not provider previews.
- Existing `provenance.json` carries source-file URLs, sizes and checksums.

### Industrial Microscope

- Runtime: `/models/world/industrial_microscope/industrial_microscope-full.glb`
  and `industrial_microscope-reduced.glb`. Optional same-name `.gz` containers
  are also prepared for an owned decompression loader.
- Source geometry: 16,598 triangles; two node meshes named
  `industrial_microscope` and `industrial_microscope_cable`; no animation clips.
- Source bounds, metres with +Y up: min `(-0.093764,-0.001622,-0.331485)`;
  max `(0.120771,0.460122,0.166605)`; dimensions
  `(0.214535,0.461744,0.498091)`; center
  `(0.013503,0.229250,-0.082440)`. Cable contributes to depth.
- One opaque PBR material, preserved source double-sided flag. Embedded diffuse,
  tangent-space OpenGL normal and packed roughness/metalness maps.

### Gamepad

- Runtime: `/models/world/gamepad/gamepad-full.glb` and
  `gamepad-reduced.glb`; optional gzip containers beside them.
- Source geometry: 9,546 triangles; one mesh `gamepad_01_mesh_case` on node
  `gamepad`; no animation clips. The source controller is a worn,
  generic retro controller with D-pad, four face buttons and cable. Source
  diffuse map inspected; no visible manufacturer logo is present.
- Source bounds, metres with +Y up: min `(-0.210504,-0.000592,-0.214305)`;
  max `(0.193547,0.018332,0.220656)`; dimensions
  `(0.404052,0.018924,0.434961)`; center
  `(-0.008479,0.008870,0.003176)`. Face is +Y; the cable spans most of its source
  footprint. A scene can rotate about X to present the face toward a +Z camera.
- One opaque PBR material; diffuse, OpenGL normal and packed roughness/metalness.
  Connected pieces remain joined in the exported source.

### Drill Press 01

- Runtime: `/models/world/drill_press_01/drill_press_01-full.glb` and
  `drill_press_01-reduced.glb`; optional gzip containers beside them.
- Source geometry: 58,526 triangles; 13 source node/mesh components; no clips.
  Component nodes remain distinct so authored movement can act on genuine
  physical pieces: `drill_press_01`, `_plate`, `_catch`, `_lid`, `_belt`,
  `_gear_b`, `_gear_a`, `_handle`, `_button_a`, `_limiter`, `_bit`, `_plug`,
  `_button_b`, all with the full `drill_press_01` prefix.
- Source bounds, metres with +Y up: min `(-0.205880,0,-0.353005)`;
  max `(0.159983,0.901565,0.245780)`; dimensions
  `(0.365863,0.901565,0.598785)`; center
  `(-0.022949,0.450783,-0.053612)`.
- Preserved useful physical node pivots: bit at
  `(0.000748,0.464140,0.129612)`; handle at
  `(0.049227,0.546427,0.064018)`; gear A at
  `(0.002960,0.709294,-0.238228)`; gear B at
  `(0.000750,0.714232,0.111876)`. Scene movement should compose from these base
  transforms rather than accumulating offsets.
- One opaque PBR material with visible painted casting, scratches and metal
  detail; diffuse, OpenGL normal and packed roughness/metalness maps.

## Preparation and load cost

`assets/3d/tools/prepare_polyhaven.py` downloads the provider's 1K glTF and its
explicit dependencies, validates every download against the provider API's MD5,
and records exact source URLs/checksums locally. It preserves source geometry,
normals, UVs, material assignments and node transforms. FULL re-encodes source
maps at 1024 pixels; REDUCED at 512 pixels. Both tiers keep the original mesh
detail. Textures are embedded in the GLB using `EXT_texture_webp`; stock Three.js
GLTFLoader supports this without Draco, Meshopt, KTX2 or another decoder.

| Model | FULL GLB | REDUCED GLB | FULL gzip | REDUCED gzip |
| --- | ---: | ---: | ---: | ---: |
| Industrial Microscope | 985,824 B | 711,416 B | 682,441 B | 407,951 B |
| Gamepad | 416,592 B | 292,188 B | 301,481 B | 177,267 B |
| Drill Press 01 | 2,340,032 B | 2,019,756 B | 1,371,464 B | 1,051,113 B |

These are authored-file costs, not measured frame rates or a claim of physical
phone performance. Later stations should load near their chapter and release
owned GPU resources when no longer needed. Drill press is the largest model;
REDUCED decreases texture cost but retains 58,526 triangles. Any further mesh
simplification must be visually inspected before replacing it.

Exact glTF API responses, original glTF/binary/maps and prepared inspection JSON
are under `assets/3d/sources/{asset}/`. Every runtime model directory has
`provenance.json` with its creator, license link, modifications, node names,
bounds, source MD5 evidence and prepared GLB SHA-256 hashes.

## Reviewed candidates not integrated

- **Security Camera 01**, Alexander Otterbeck (modeling/texturing), Yann Kervran
  (Blender rigging), [Poly Haven](https://polyhaven.com/a/security_camera_01),
  CC0. Downloaded source/evidence only under
  `assets/3d/sources/security_camera_01/`. The downloadable glTF has one joined
  mesh, 13,571 triangles and no animation clips or rig despite the Blender
  source's rigging credit. It is a CCTV device, not an industrial robotic arm.
  Its JPEG-only transparent glass would need the separate original alpha map
  reconstructed before shipping. No camera runtime model is included.
- Sketchfab's CC-BY industrial-arm candidates were researched through their
  primary creator pages, including
  [Cyril43's Industrial robot](https://sketchfab.com/3d-models/industrial-robot-3cfa3a6932f4437298bc06d61c50c94f)
  and
  [Anton Alpha Mathew's Industrial Robotic Arm](https://sketchfab.com/3d-models/industrial-robotic-arm-2b0f1e4c88a44b50a9fc0ad66503362b).
  Their asset downloads require an authenticated official download workflow;
  no viewer data was extracted and no unverified mirror was used. These models
  do not ship. CC-NC and CC-NoDerivs candidates were excluded.
- Robonaut 2 was considered but not included: the allowed external-license
  shortlist for this task is CC0/CC-BY, and this candidate also involves an
  identifiable real research product. An original articulated mechanical GLB
  is authored locally for the robotics station instead.

## Original FESTRONIX mechanical assets

The owner explicitly permits detailed original modular-mesh construction when
an appropriate licensed primary asset is unavailable. Two separate original
mechanical GLBs have been authored and exported in this workspace; integration
and final material/framing acceptance belongs to the rendered-world QA pass.
See [ORIGINAL_MODELS.md](ORIGINAL_MODELS.md) for authored component and material
details. There is no third-party mesh/image license for these originals: source
geometry and small procedural material textures were created for FESTRONIX.

| Original asset | Runtime path | Geometry / physical assemblies | Role |
| --- | --- | --- | --- |
| FESTRONIX X-Core | `/models/festronix/x-core-full.glb`, `x-core-reduced.glb`, optional gzip containers beside each | FULL 53,928 / REDUCED 33,760 triangles, 31 source draw groups, eight PBR materials; core rotor, four mechanical arm panels and inspection cover; 3.415×3.415×1.403 m bounds | Signature mechanical computation artifact and final-stage counterpart |
| FESTRONIX articulated robot arm | `/models/festronix/robot-arm-full.glb`, `robot-arm-reduced.glb`, optional gzip containers beside each | FULL 24,728 / REDUCED 16,096 triangles, 32 source draw groups, eight PBR materials; hierarchical waist, shoulder, elbow, wrist and two gripper jaws; 1.676×3.512×0.955 m bounds | AI / Robotics fabrication manipulator |

Their original deterministic brushed normal and metallic/roughness PNG maps are
embedded at 256 pixels FULL / 128 REDUCED. Materials include graphite, titanium,
copper and aluminum. The exported pieces are genuine three-dimensional geometry
with physical pivots and independently movable components. They remain original
industrial and science-fiction prototypes; they are not claimed to be a
manufacturer product model, physical scan or verified engineering assembly.

Original authored asset costs before rendered-world integration:

| Asset | FULL GLB | REDUCED GLB | FULL gzip | REDUCED gzip |
| --- | ---: | ---: | ---: | ---: |
| X-Core | 3,542,528 B | 2,212,504 B | 803,870 B | 461,251 B |
| Robot arm | 1,678,404 B | 1,069,772 B | 430,366 B | 243,315 B |

The model source authoring script is `tools/build-mechanical-assets.mjs` inside
the prototype. These authored interfaces should remain replaceable if the owner
later commissions final mechanical art.
