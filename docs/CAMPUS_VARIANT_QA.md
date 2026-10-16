# Campus prototype update — 2026-10-16

The owner selected Campus as the fourth local visual option beside Pulse, Panel and Flux. Root and `/?theme=Campus` render the cream/orange home. Both comparison controls expose all four choices. Shared event/date/FAQ data is reused; no backend theme/schema change.

The glass hero X and model-poster club cards are replaced with original flat SVG category symbols. Flux A is renamed Club Symbols and renders `FlatClubHero`; the active 3D Club Gallery and links into it are removed. Historical source/model files remain inactive. Production JS contains no gallery import or club-model paths. Flux B/C retain their existing experiments.

## Actual verification

| View | 390×844 | 768×1024 | 1440×900 | 1920×1080 |
| --- | --- | --- | --- | --- |
| Campus | Inspected | Inspected | Inspected | Inspected |
| Flux A replacement | Inspected | Inspected | Inspected | Inspected |
| Horizontal overflow | None | None | None | None |

Both affected views had zero Canvas elements. Campus had zero model-poster images. The five club symbols were present; fixed inherited absolute arrow positioning and light number text on the new cards.

Checked Campus → Flux → Campus and Campus → Pulse → Panel → Flux → Campus through prototype controls. Checked Campus mobile menu/Escape dismissal and keyboard Motion off. Existing CSS system reduced-motion support remains; OS preference changes were not separately emulated. QA tab returned no console errors/warnings. Direct tab screenshots were used after an initial resized surface capture showed a stale frame.

Final `npm run build` passed, including TypeScript validation. Existing Flux B/C deferred scene exceeds Vite's 500 kB warning threshold; Campus/Flux A do not mount it. No backend tests repeated for isolated visual changes. Physical-device performance and comprehensive accessibility certification remain unverified.

Screenshots: `output/campus-variant/campus-desktop.png` (four-option control), `campus-mobile.png`, `campus-clubs.png`. Temporary QA tab closed and viewport overrides reset.
