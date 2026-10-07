---
name: browser-visual-qa
description: Verify rendered FESTRONIX frontend changes across desktop, tablet, and phone viewports before declaring them complete.
---

# Browser visual QA

Read `docs/AI_HANDOFF.md` and the intended design before verification. Frontend completion requires visual browser verification; successful compilation alone is insufficient.

Inspect the affected pages and relevant interaction states at these viewport sizes in CSS pixels:

- 390 × 844
- 768 × 1024
- 1440 × 900
- 1920 × 1080

Check horizontal overflow, typography, text wrapping, spacing, navigation states, media scaling, animations, hover versus touch behavior, layout shift, console errors, and broken assets. Exercise relevant menus and actions with keyboard and touch emulation where available; inspect reduced-motion behavior for animated changes.

Use realistic long content and loading/error states where relevant. Capture and inspect screenshots, and observe running animations rather than inferring appearance from source code. Address defects and recheck affected views.

Report the pages, sizes, and behaviors actually checked, along with remaining defects or unavailable checks. If browser access is unavailable, mark visual verification pending and do not declare the frontend visually complete.
