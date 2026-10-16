# FESTRONIX original mechanical prototype models

Date: 2026-10-07. These are locally authored, detailed modular mesh prototypes exported as standard glTF 2.0 binary assets. Their geometry, material definitions and small surface maps are original project implementation work. They contain no third-party mesh, manufacturer branding or borrowed texture. They are visual prototypes of engineered objects; they are not asserted to be physical scans, manufacturer CAD, certified mechanisms or production engineering designs.

Authoring source: `prototypes/festronix-visual/tools/build-mechanical-assets.mjs`. Regenerate from that prototype directory with `node tools/build-mechanical-assets.mjs`. The tool uses the already installed Three.js, `GLTFExporter`, `BufferGeometryUtils`, and built-in Node utilities. It adds no dependency. The generated files are replaceable model slots, and their articulated node names form the integration contract.

## Files and geometry

Served files live in `prototypes/festronix-visual/public/models/festronix/`. Each standard `.glb` also has a gzip transport copy and a `.json` metrics/provenance sidecar. A `.glb.gz` must be decompressed before GLTF parsing when its HTTP response is not automatically decompressed. Both representations contain the same glTF scene.

| Asset | Triangles | Material draws | Raw GLB bytes | Gzip bytes | Dimensions in metres |
| --- | ---: | ---: | ---: | ---: | --- |
| `x-core-full.glb` | 53,928 | 31 | 3,542,528 | 803,870 | 3.415 × 3.415 × 1.403 |
| `x-core-reduced.glb` | 33,760 | 31 | 2,212,504 | 461,251 | 3.426 × 3.426 × 1.403 |
| `robot-arm-full.glb` | 24,728 | 32 | 1,678,404 | 430,366 | 1.676 × 3.512 × 0.955 |
| `robot-arm-reduced.glb` | 16,096 | 32 | 1,069,772 | 243,315 | 1.676 × 3.512 × 0.955 |

These are asset-only counts, not scene totals or measured frame rates. Both versions preserve each model's articulated assemblies. Reduced models use fewer radial segments, fewer ventilation openings/cooling fingers, fewer rotor blades and lower-resolution embedded maps. No runtime procedural reconstruction is needed to display them. Static pieces merge by material within each moving frame; moving frames remain distinct.

## X-Core

The X silhouette is made of four diagonal machine housings around a central turbine/reactor assembly. Features include chamfered graphite shells, perforated titanium heat shields with actual apertures, recessed elastomer channels, copper conductor bars, insulated conductor bridges, connector contacts, hexagonal fasteners, external power/cable routing, a deep rear pressure housing with radial heat-exchanger fingers, layered machined bearing rings, swept turbine blades, a bearing/hub and a smoked inspection cover. Tiny mint/amber indicator windows are emissive; the chassis itself is not a glowing replacement for material detail.

Coordinate system: Y up, front +Z. The origin is the center of the X/turbine junction. The source model's `mechanical_xcore` root applies scale 1.25. FULL bounds: min `[-1.707592, -1.707592, -0.985625]`, max `[1.707592, 1.707592, 0.417500]`. The slight FULL/REDUCED width difference comes from polygon/chamfer sampling.

| Node | Purpose | Motion contract |
| --- | --- | --- |
| `xcore_chassis` | Merged stationary load-bearing assembly | Preserve assembled transform |
| `core_rotor` | Turbine blades, carrier plate and machined hub | Rotate about local Z; base translation Z = 0.181 source metres |
| `arm_panel_0` … `arm_panel_3` | Independently named diagonal heat-shield assemblies | Add up to 0.18 source metres to local Z; preserve original diagonal rotations |
| `inspection_shield` | Smoked inspection cover and retaining ring | Optional small local Y rotation; preserve original transform |

The source root scale multiplies the visible displacements. Save rest transforms before animation and derive activation directly from scroll progress so reverse scroll returns exactly to assembly. Rotor spin is separate from scroll position and should stop while the scene is hidden or suspended. Prototype maximum rotor speed metadata is 12 rpm; this is a visual choice, not an engineering claim.

## Robotics manipulator

The generic industrial manipulator has a floor-mounted plinth with eight fixing bolts, a waist bearing/turret, front and rear shoulder/elbow/wrist motor bearings, tapered cast aluminum upper/forearm shells, actual perforated service covers, copper trim, cable clips and conduits, a wrist coupling/flange and a parallel mechanical gripper. The original powder-coated gray/graphite finish is unbranded. The open-frame gripper and visible hinge axes keep it recognizable as a physical mechanism.

Coordinate system: Y up, front +Z, base close to Y = 0. `mechanical_robot` applies scale 0.9. FULL bounds: min `[-0.670379, 0.011250, -0.522815]`, max `[1.005230, 3.522896, 0.432000]`. A world integration can translate/rotate the whole object without changing the articulated contract.

| Node | Parent | Motion contract / rest value |
| --- | --- | --- |
| `robot_waist` | `mechanical_robot` | Small local Y swivel; position Y = 0.485 source metres |
| `robot_shoulder` | `robot_waist` | Local Z pitch; rest Z = −0.6 radians |
| `robot_elbow` | `robot_shoulder` | Local Z pitch; rest Z = 1.0 radians; position Y = 1.5 |
| `robot_wrist` | `robot_elbow` | Local Z pitch; rest Z = −0.3 radians; position Y = 1.24 |
| `robot_gripper` | `robot_wrist` | Parallel gripper parent |
| `gripper_left` | `robot_gripper` | Position X = −0.135; travel up to −0.044; mirrored source scale X = −1 |
| `gripper_right` | `robot_gripper` | Position X = 0.135; travel up to 0.044 |

Use bounded movement around rest values. Cable segments belong to the relevant articulated body so they do not remain floating in place when a joint moves. The shared clearances/poses are for visual use; a physics rig, accurate inverse kinematics, collision solver and engineering cable deformation are not included.

## Materials and maps

Standard physically based metallic/roughness materials include anodized graphite (metalness .82, roughness .32), satin titanium (.92/.27), black oxide steel (.9/.37), copper (.92/.25), powder-coated cast aluminum (.48/.44) and elastomer (.05/.82). Subtle indicator acrylic uses restrained emissive values. The X-Core's inspection glass uses low opacity and clearcoat, without expensive transmission. Models should be reviewed under neutral environment reflections and a directional light with bloom disabled.

Every GLB embeds two original deterministic PNG maps: a brushed-metal metallic/roughness map and a very subtle normal map. FULL maps are 256², REDUCED 128²; the normal strength is .3 and UV transform repeats 8×. Color comes from original PBR material factors. Geometry includes UVs; no logos or essential text are baked into maps. The maps are encoded and appended as standard GLB images using built-in Node PNG/CRC/zlib routines because browser-canvas image encoding is unavailable in Node's GLTF exporter.

## Ownership, replacement and remaining acceptance

Use these locally authored assets under the project's own implementation terms. No external attribution is required for their mesh/maps. External sourced objects used elsewhere in the world are independently recorded in `SOURCES.md`; these original models must not be labeled as Poly Haven content.

The models are available for visual inspection and integration. Final acceptance depends on their rendered quality, lighting and composition in the world. More intricate custom Blender/CAD/scanned art may later replace either file behind the same interface. Current assets should be described as detailed original modeled prototypes, with real mesh depth and physical components, rather than as photographs or exact reproductions of a commercial product.
