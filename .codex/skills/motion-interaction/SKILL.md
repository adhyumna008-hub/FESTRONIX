---
name: motion-interaction
description: Design or implement FESTRONIX page animation, scroll storytelling, and interaction feedback.
---

# Motion and interaction

Read `docs/AI_HANDOFF.md` and the applicable theme direction. Give every motion a purpose: storytelling, hierarchy, feedback, or atmosphere. Never add animation solely because it looks flashy.

- Establish motion hierarchy: primary narrative changes, interaction feedback, then restrained ambient motion. Avoid simultaneous competing effects.
- Use micro-interactions to clarify hover, focus, pressed, loading, and completion states.
- Keep cursor and pointer responses subtle; provide equivalent feedback for keyboard and touch input.
- Use section transitions and scroll storytelling to reinforce content order. Keep reading and navigation available throughout.
- Use GSAP when sequencing or control warrants it; use ScrollTrigger or an equivalent only when scroll coordination is justified. Prefer simpler native transitions for simple state changes.
- Avoid scroll hijacking and effects that delay access to essential content. Choose timing and easing consistently within the theme.
- Provide reduced-motion alternatives that retain state feedback and content visibility.
- Scope animations to their components. Revert GSAP contexts, kill owned triggers/timelines, cancel animation frames, and remove listeners during cleanup; avoid duplicate effects after remounts or resize.

For 3D rendering details, use the immersive scene guidance. Verify actual motion in the browser, including touch and reduced-motion behavior.
