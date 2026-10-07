---
name: immersive-webgl-r3f
description: Design or implement Flux and other FESTRONIX interactive 3D scenes using Three.js, React Three Fiber, and Drei.
---

# Immersive 3D

Read `docs/AI_HANDOFF.md` and approved Flux direction before work. These are implementation guidelines for authorized 3D tasks, not a decision to adopt a production stack now.

- Organize scenes by responsibility: asset loading, objects, camera, lighting, interaction, and effects. Keep render-loop state changes intentional.
- Use Three.js, React Three Fiber, and Drei features where they simplify the scene; avoid unnecessary abstractions.
- Inspect GLTF/GLB scale, transforms, materials, textures, and animation clips before integration. Reuse shared resources deliberately.
- Compose cameras for the surrounding HTML content and adapt framing to viewport changes.
- Establish depth through lighting and materials first. Add custom shaders, particles, and post-processing only for a specific visual purpose.
- Keep bloom selective and restrained; preserve UI legibility and avoid excessive post-processing passes.
- Make pointer response bounded and provide touch behavior. Use scroll-linked 3D only when it contributes to the page narrative and does not obstruct scrolling.
- Adapt DPR, texture sizes, particle counts, lighting, and scene complexity to mobile GPU capacity. Measure frame time, load cost, and memory on representative devices before increasing visual complexity.
- Clean up listeners, render-loop subscriptions, and owned GPU resources on teardown. Dispose geometries, materials, textures, and render targets when no longer shared or used; avoid disposing cached assets still in use.

Essential information and actions must remain available in semantic HTML without WebGL. Provide a graceful static fallback for unsupported, failed, or constrained rendering. Respect `prefers-reduced-motion` with a still or restrained scene that preserves meaning.
