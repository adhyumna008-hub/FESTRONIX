---
name: performance-accessibility
description: Improve or review FESTRONIX accessibility, responsive usability, loading speed, and student-phone performance.
---

# Usability and performance

Read `docs/AI_HANDOFF.md` and the relevant design direction. Visual quality must preserve usability on typical student phones.

- Use semantic HTML, meaningful labels, and appropriate heading order. Keep core content and actions available without decorative effects.
- Support keyboard navigation, visible focus, sensible focus order, and focus management for menus/dialogs. Avoid keyboard traps.
- Check color contrast in real component states; do not communicate meaning through color alone. Provide readable text and adequate touch targets.
- Preserve layout and functionality across responsive widths, text zoom, and long content. Avoid hover-only access to information or actions.
- Respect reduced-motion preferences without hiding content or removing essential feedback.
- Compress assets, serve appropriate image dimensions/formats, reserve media space, and lazy-load nonessential content. Do not defer the primary visible content unnecessarily.
- Assess Core Web Vitals: loading of primary content, interaction responsiveness, and layout stability. Use measured bottlenecks to prioritize work.
- Account for mobile CPU, GPU, memory, and network limits. Preserve semantic HTML and a graceful WebGL fallback; defer decorative 3D when needed.

For scene-specific optimization use the immersive 3D guidance. For rendered viewport inspection use browser visual QA; report measurement conditions and unresolved limitations rather than claiming compliance from a build alone.
