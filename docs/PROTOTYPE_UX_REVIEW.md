# FESTRONIX focused visual / UX review

**Date:** 2026-10-06  
**Status:** Targeted critique and polish implemented; browser verified.  
**Preview:** http://127.0.0.1:4180/  
**Scope:** Preserve Pulse, Panel and Flux, the shared mock data, and the approved immersive architecture. No redesign, final art, backend or Flux winner selection.

## Method and skill evidence

Applied the installed `.codex/skills/ui-ux-pro-max/SKILL.md` alongside festronix-context, premium-web-design, immersive-webgl-r3f, motion-interaction, performance-accessibility and browser-visual-qa. Used targeted searches instead of generating another design system. The existing brand, fonts, palettes, section order, five Flux chapters and Three/R3F/GSAP ownership remain the starting direction.

Verified local skill matches: `focus not obscured` returned Web accessibility guidance for persistent overlays and focus; `orphan heading line balance` returned bounded measures, progressive balanced wrapping and readable line height. The initial React spacing query had no match; its single narrower retry, `useEffect cleanup`, returned effect cleanup and avoiding unnecessary effects. The system Python launcher lacked an installed interpreter, so the existing bundled Python runtime ran the skill successfully; no interpreter or packages were installed. Native app rules were not treated as interchangeable with web requirements; FESTRONIX retains its preferred 44 px targets.

## Findings and implemented response

| Priority | Observed problem | Targeted change / evidence |
| --- | --- | --- |
| High | Phone comparison dock covers the secondary hero action | At 390×844 the original Flux View schedule occupied y≈758–817 while the dock occupied y≈784–834. Phone comparison now opens from a named 44 px header Compare button; the closed bottom dock is absent. Escape/Close returns focus to Compare |
| High | Panel desktop masthead and stacked statement delay practical actions | Reduced display scale and tightened the cover/identity relationship while preserving condensed typography, framing and intro. Both hero actions now end around y=880 at 1440×900 |
| High | Mobile headline scale competes with festival identity and crowds facts | Rebalanced identity and statement sizes; retained 16 px body copy, strengthened date/campus type, increased small supporting-label readability and gave actions consistent 50 px height. All three themes expose both actions within the tested 390×844 first screen |
| Medium | Filters use outbound-style arrows and an unexplained All / 03 label | Use All events / category labels, visible counts and pressed state. A polite result status reports the complete context, e.g. 1 sample event in Code. Phone controls form a deliberate 2×2 grid |
| Medium | Navigation has no current-section feedback | Added semantic aria-current and a visible underline/accent from a scoped IntersectionObserver. It observes content sections only and never drives Flux progress or scene properties |
| Medium | Event metadata is small and controls have faint boundaries | Strengthened necessary control borders, regularized card metadata/status spacing, balanced headings and reserved a minimum two-line title area on desktop. Titles may still grow; nothing is clamped or truncated |
| Medium | Archive dial appears as a keyboard button with no activation behavior | Choose edition moves focus to the selected year. Year controls support Left/Right and Home/End, retain direct click/tap and existing Previous/Next controls; optional drag remains secondary. A handled drag does not also trigger the click action |
| Medium | Pointer/keyboard feedback is uneven | Added restrained color/press feedback and 44 px targets for intro disclosures and scroll links. Desktop/tablet dock yields visually when content has keyboard focus, while remaining tabbable and reappearing on its own focus |
| Low | Tiny decorative wording competes with the phone Panel foreground | Removed redundant tiny captions from the phone cover only and tightened peripheral art composition. Semantic identity, edition, facts and actions stay intact; original intro timing/art/timeline remain |

## Measured outcomes

At 390×844, after the completed pass:

| Theme | Primary action bottom | Schedule action bottom | Result |
| --- | ---: | ---: | --- |
| Pulse | ~707 px | ~767 px | Both visible; no comparison overlay |
| Panel | ~726 px | ~786 px | Both visible; original cover remains part of the opening |
| Flux | ~710 px | ~770 px | Both visible; full-background composition preserved |

All action heights measured 50 px. Header Compare measured approximately 74×44 px and Menu approximately 69×44 px. Desktop/tablet actions were also within the first tested viewport for all three themes at 768×1024, 1440×900 and 1920×1080. These measurements describe the current fixture and fonts/fallbacks, not a guarantee for every future text length, browser or zoom level.

Opaque token-pair spot checks: muted text ratios are Pulse 7.42:1, Panel 7.71:1 and Flux 10.12:1 against their page backgrounds. Necessary control-border ratios are 4.02:1, 4.31:1 and 5.59:1 respectively. This is not a complete contrast audit of animated backgrounds, all states or typography.

## Browser validation

- Inspected all three theme heroes at 390×844, 768×1024, 1440×900 and 1920×1080. Checked first-screen hierarchy, actions, spacing and page overflow. Additional 320 px reflow passed.
- Exercised all Flux A/B/C × FULL/REDUCED/STATIC at both 390 and 1440 widths (18 states). Live modes reached ready with one Canvas; STATIC had zero. No page overflow or console/shader errors observed.
- Checked event filtering, contextual result status, current-section navigation and desktop event-card alignment.
- Verified archive Choose edition focuses 2026; Left selects/focuses 2025; Home selects/focuses 2024. The existing depth transition still runs and reduced/static alternatives remain available.
- Verified keyboard focus in main content makes the comparison dock unobtrusive; Tab from the footer can still focus its summary and restore its visibility. It was deliberately not hidden with visibility/display on desktop, which would remove the keyboard route.
- Verified phone comparison Escape closes it, aria-expanded returns false and focus returns to Compare. Menu Escape returns focus to Menu.
- Replayed Panel intro and stopped it with Escape. Manual Reduce motion selected STATIC and exposed the still-frame disclosure. Its 3.2 / 2.4-second timeline was not reauthored.
- Captured and inspected browser screenshots during the session. These are conversation captures rather than new final artwork or saved image assets.
- `npm run build` passes. Initial app is approximately 132 KB gzip, CSS 9 KB gzip; the existing deferred Flux chunk remains approximately 242 KB gzip with Vite's uncompressed-size warning.

## Implementation boundaries and remaining review

New `src/polish.css` contains the focused overrides; `src/useSectionNavigation.ts` owns navigation feedback only. `main.tsx` changes comparison presentation and keyboard dismissal, `SharedContent.tsx` clarifies filtering, and `ThroughTime.tsx` clarifies archive controls. `FluxScene.tsx`, `FluxNarrative.tsx`, shader/camera code, data records, dependencies and approved scene architecture were not changed in this pass.

Final artwork/font approval, real historical media and physical-phone performance remain pending. Full screen-reader/text-zoom/spacing/animated-contrast audits and forced context loss remain outside the completed spot checks. The existing three Flux candidates remain equally available; this review does not rank or select them.
