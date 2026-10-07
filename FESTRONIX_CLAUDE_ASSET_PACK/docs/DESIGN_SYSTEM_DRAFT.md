# FESTRONIX Design System Draft

**DRAFT — REQUIRES ASTRA REVIEW**  
**Status:** PROVISIONAL — NOT FINAL; proposed starting values for public visual prototypes  
**Date:** 2026-10-06  
**Companion:** [LANDING_PAGE_BLUEPRINT.md](LANDING_PAGE_BLUEPRINT.md)

## 1. Shared functional system

One semantic component set retains content, behavior, reading order, status meaning and accessibility across Pulse, Panel and Flux. Theme layers change visual tokens and decorative framing. Business components never duplicate event records or registration rules. Functional dashboards use the same calm Manrope system regardless of public theme. This document specifies design principles, not a framework, component API or backend contract.

### Layout and spacing

| Token family | Proposed values | Use |
| --- | --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px-equivalent | 4/8 for tight label relationships; 12/16 metadata; 24/32 component padding; 48+ section relationships. Use relative units later where text scaling matters |
| Content width | 1200 px default, up to 1320 px hero/gallery; prose 60–68 ch | Wide composition does not make body lines wider |
| Page gutter | 20 px phone, 32 px tablet, 48 px wide desktop | At 320 px allow 16 px where needed; preserve text/tap room |
| Section spacing | 64–96 px desktop, 40–56 px mobile | Denser schedule/help blocks can use 32–48 px; avoid full-screen padding on every section |
| Grid gap | 24 px desktop, 16–20 px mobile | Flexible columns, no card height derived from a short mock title |
| Functional radius | 6 px controls, 8 px dialogs/surfaces, 999 px small status chips only | Avoid giving every content block a pill or identical rounded-card shape |
| Border | 1 px default, 2 px emphasis/focus-independent graphic framing | Dividers can be subtle; necessary control boundaries must remain visible |

Content-driven starting breakpoints: below 640 px single column/mobile navigation; 640–1023 px tablet/two-column events when titles fit; 1024 px and above desktop navigation and up to three event columns. A hero can remain stacked beyond a nominal breakpoint if copy and scene no longer fit. Use the same breakpoints across themes, and respond to actual content instead of device names. Three-column cards do not imply equal heights that truncate descriptions.

### Typography hierarchy

**Body/UI:** Manrope, provisional. **Display:** Pulse Space Grotesk, Panel Barlow Condensed, Flux Sora. Load only active public display and necessary shared weights in later prototypes; the nine-font comparison page is not a delivery model. Keep the core brand/logo year-independent and edition presentation separate.

| Role | Desktop starting size / leading | Phone starting size / leading | Weight / treatment |
| --- | --- | --- | --- |
| Hero identity/title | 80–128 px / 1.02–1.08 | 40–56 px / 1.08–1.15 | Display 600–700 (Panel may test 700–800); fit content naturally, no synthetic compression |
| Hero supporting statement | 24–32 px / 1.25–1.4 | 20–24 px / 1.35 | Manrope 500–600; optional display for brief tagline |
| Section heading | 40–56 px / 1.1–1.2 | 28–36 px / 1.15–1.25 | Display 600–700; natural case except short Panel mastheads |
| Event card heading | 24–28 px / 1.15–1.3 | 22–26 px / 1.2–1.3 | Display where readable; Manrope 600–700 for compact functional views |
| Body | 16–18 px / 1.5–1.65 | 16–18 px / 1.5–1.65 | Manrope 400–500 |
| Controls/navigation | 16 px / 1.4–1.5 | 16 px / 1.4–1.5 | Manrope 500–600 |
| Metadata / compact admin | 14–16 px / 1.4–1.5 | 14–16 px / 1.5 | Manrope 500; don't shrink to preserve a row |
| Prominent numbers | 24–40 px / 1.2 | 24–32 px / 1.25 | Manrope 600–700 with clear units |

Body tracking near 0. Display may test −0.015 to 0 em; condensed Panel usually 0 to +0.01 em. Short uppercase eyebrows may use +0.04 to +0.08 em, never wide-spaced paragraphs. Heading sizes are ranges for review, not fixed pixels immune to zoom. Natural title wrapping is required: the specimen showed Sora/Syne's long event title using three phone lines. Reserve room instead of clipping it.

Shared lining/tabular figures are preferred for time, countdown and aligned admin numbers when supported by the selected font build. Prose can use proportional figures. Keep ₹, separators, amounts and units readable and connected. Optional shared mono for identifiers earns its place only after a later glyph/size test; none is mandatory. Manrope I/l ambiguity in short identifiers needs review. Do not use display faces for form errors or transaction references.

### Functional component principles

| Component | Shared behavior and hierarchy | Themeable surface |
| --- | --- | --- |
| Buttons / links | Primary, secondary, quiet text and destructive purposes; minimum 44 px preferred touch hit area, 12–20 px horizontal padding; visible hover/focus/pressed/disabled/loading. Loading preserves label/width and prevents repeated action; no fake actionable disabled link | Fill, border, radius and small decorative emphasis; labels and purpose unchanged |
| Inputs | Persistent label, help, value and textual error; 44–48 px minimum field height and 16 px input text; default/hover/focus/error/disabled/read-only. Placeholder supplements label; error explains recovery. No application form behavior implemented here | Background/border color and radius; stable typography and hit area |
| Event card | Graphic/image → category/format → title → time/venue → fee/eligibility/admission → short summary → View event. Emphasize deadline where useful; accommodate missing venue/time honestly. One explicit main destination; separate secondary controls are not nested inside one big link | Crop, frame, heading face and accent; no data or status changes |
| Badges | Category/format chips are informational, not fake buttons. Status chips include words and can use a shape/icon as redundant cue. Limit badge count; key facts can be ordinary metadata | Neutral/accent mapping and border; meaning stays fixed |
| Navigation | Identity, few scan-friendly destinations, participant access, event discovery. Mobile menu has named open/close controls, focus handling and Escape/return-focus behavior when overlaying. Active link is visually clear | Opaque theme header, typography accent and border |
| Sections | One meaningful heading, concise context, primary content and relevant onward link. Optional sections vanish without empty gaps. Anchor targets account for sticky header. No content reveal required before reading | Background field, graphic framing and bounded entry treatment |
| Dialog / modal | Reserved for a real bounded task; labeled heading, explanation, explicit action/cancel/close, contained focus and restored trigger focus. Mobile scrolls inside available viewport. Public discovery uses pages/links rather than obligatory dialogs | Stable opaque reading surface, theme border/radius; no glass behind dense text |
| FAQ | Question button, visible expanded/collapsed state and keyboard activation. Answers fully readable and not height-clipped; multiple open answers may be supported | Divider and heading treatment |
| Gallery | Static responsive images/captions, meaningful alternative text, optional explicit enlarge control; a viewer follows dialog rules | Image framing, not a novel interaction per theme |
| Schedule | Chronological time/event/venue rows, day context and onward link. Changes identified textually. Mobile stacks labels rather than shrinking columns | Ruled/boxed section styling |

### Status indicators

Visual design does not create new business states. Admissions show Not open/Open/Full/Paused/Closed plus event-specific waitlist availability. Postponed/Cancelled explain operation changes; Live/Completed describe event lifecycle separately. Payment verification pending is not Confirmed. Results show Provisional/Final and disputed holds; certificates show Issued/Replaced/Withdrawn only when that workflow applies. No state conveyed by color alone.

Prototype functional status candidates: success ink #146B42 on #E7F3EB; warning ink #754B00 on #FFF0CB; error ink #A11F2F on #FCE8EB; information ink #224A98 on #EAF0FF. These are proposed pairs, not measured accessibility claims. Keep readable filled status surfaces even on Flux; do not map statuses onto decorative hero lights. Text and icons maintain distinctions in grayscale.

## 2. Pulse visual layer

| Layer token / principle | Proposal |
| --- | --- |
| Canvas / reading surface | Warm #F7F6F0 / white #FFFFFF |
| Primary / secondary text | #171A22 / #48515E |
| Accent / accent action | Cobalt #234FE4 with white text; burnt orange #C94B24 for sparing decorative labels, not simultaneous competing primary actions |
| Border | #D4D7DD decorative divider; stronger #69717D for necessary controls |
| Shape | 8 px event-card corners, 6 px controls; open ruled schedules and unboxed prose |
| Graphic signature | Offset rectangular activity fragments, numbered section markers and small flat color blocks; no generic network blob |
| Typography | Space Grotesk display, natural-case Manrope content; uppercase identity only where short |
| Interaction | Border/color emphasis, 2 px maximum card lift, short 160–220 ms entry/hover |

Keep one dominant accent per area and ample whitespace. Photography, if used later, depicts real approved student activity with clear licensing/permission. Distinctiveness comes from festival copy, bold editorial hierarchy and graphic cadence, not cosmetic SaaS dashboard art.

## 3. Panel visual layer

| Layer token / principle | Proposal |
| --- | --- |
| Canvas / reading surface | Cream #F4EEDC / clean #FFFCF4 |
| Text / reverse surface | Ink #191919 / ink panels with pale text |
| Accent | Red #BB2035 for primary emphasis; warm yellow #F5CE59 only with dark readable text |
| Border | Ink 1–2 px structural panels; thin quiet dividers for body lists |
| Shape | 0–2 px event frames, 2–4 px controls, mostly rectangular; dialogs remain stable functional surfaces |
| Graphic signature | Original sequential-panel composition, selective halftone margins and short motion-line ornaments; no distressed text required |
| Typography | Barlow Condensed display at large sizes; Manrope body, forms and metadata. Contrast in proportions, not illegible novelty |
| Interaction | Short offset-shadow/border change; 180–260 ms optional panel-edge entrance, no repeated flashing wipe |

Asymmetry belongs to decorative composition, not semantic reading order. One expressive masthead can introduce a quiet series of event cards. Halftone density and scale must avoid interference with glyphs at phone resolution. No texture behind descriptions, menu, FAQ answers or error messages.

## 4. Flux visual layer

| Layer token / principle | Proposal |
| --- | --- |
| Canvas / reading surface | Near-black #090B14 / opaque #131827 |
| Primary / secondary text | #F4F5FF / #BCC3D5 |
| Accent | Pale violet #C0ABFF or cyan #8BDFEA, paired with dark action text where filled; choose one main action accent per composition |
| Border | #65718A for needed control boundaries; softer #2B354A decorative separators |
| Shape | 4–6 px modules/controls; straightforward ruled schedules; no universal pill/glass skin |
| Graphic signature | One original bounded hero scene, sparse local reflections, stable normal content below; same scene-derived material vocabulary across still graphics |
| Typography | Sora display + Manrope, substantial solid strokes; large heading areas protected from scene brightness |
| Interaction | 160–220 ms control feedback; damped stage pointer response, shallow depth, no movement of hit targets |

The A/B/C hero concepts and interactive-wordmark variants are specified in LANDING_PAGE_BLUEPRINT. No winner is selected. Scene/material palettes may vary within these token limits; controls do not inherit variable scene lighting. Peripheral translucency is optional and may be removed if contrast varies. No bloom on body text or interactive controls.

## 5. Motion system and purpose

| Motion role | Provisional range / limit | Purpose |
| --- | --- | --- |
| Press/focus feedback | Immediate to 100 ms | Acknowledge action and state; never delay input |
| Hover/border | 140–200 ms | Clarify interactivity |
| Menu/dialog entrance | 180–240 ms; shorter exit | Establish a bounded surface without delaying navigation |
| Section entrance | 220–320 ms, 4–8 px travel, once | Reinforce reading order; content remains available if animation fails |
| Scene settle / one light sweep | 500–900 ms, optional once | Introduce object depth; no competing multi-effect entrance |
| Pointer response | Damped small movement; decorative text depth 4–8 px, 1–2° maximum | Depth feedback only; no pointer lock |
| Ambient scene | Very slow, low amplitude, stopped offscreen | Atmosphere if measured cost permits; no infinite pulsing text |

Use consistent gentle deceleration for entrances, faster feedback for direct controls; no elastic bouncing on information. No scroll hijack, autoplay sound, full-page entry loader or repeated count-up statistics. Reduced motion removes translation, orbits, deformation, parallax and travelling light; controls retain clear state changes. An optional pause-motion control can stop ambient enhancement. Hero scroll separation affects decorative layers only; semantic identity remains assembled.

## 6. Responsive, accessibility and performance review

- Match content and action parity across themes. Preserve keyboard focus, meaningful headings, reading order and persistent field labels. Preferred touch areas are at least 44×44 px; text buttons may have larger invisible spacing rather than inflated letters.
- Target normal text contrast of at least 4.5:1, large qualifying text at least 3:1, and necessary component/focus boundaries at least 3:1. Validate actual token pairs, states and backgrounds later; this draft does not claim compliance.
- Check 320 px reflow, 390 px phone, tablet and desktop; allow 200% text enlargement and user spacing overrides. Long event titles, date lines, prices and status text must expand. Admin tables may use labeled contained scroll; landing cards/hero may not create page-wide horizontal overflow.
- Show useful text/actions and reserved graphic dimensions before loading fonts/images/3D. Favor shared body plus active display only; preserve fallback metrics and ₹/punctuation coverage. Do not use text rasterization for essential content.
- Flux starts with an immediately readable static stage and optional enhancement. Desktop may test around DPR 1–1.5 and mobile around 1 as starting quality caps, subject to measurement. Keep one focal object and few lights; cut particles, refraction and post-processing before compromising interaction.
- Prototype comparison targets, not promises: stable roughly 60 fps on suitable desktop and roughly 30 fps on a representative phone, with normal page input responsive. If sustained rendering is worse, reduce quality or use static fallback. Record device, browser and scene variant before claiming performance.
- Defer optional scene work until useful page content is available; pause offscreen/in background and dispose owned resources when changing concepts. Do not mount A/B/C simultaneously. Avoid real-time fluid simulation and many refractive objects merely to demonstrate a concept.
- Every concept has still/reduced-motion/no-WebGL alternatives. Context loss or loading failure leaves content and actions intact. No retry flow blocks registration discovery.

## 7. Draft decisions and implementation boundary

Shared component principles and provisional tokens are sufficiently specified for a separately authorized public comparison prototype. Fonts/colors and hero variants remain reviewable; no Flux winner or final logo is established. Review should compare hierarchy, distinctiveness, mobile readability, measured scene cost and functional parity, not just hero beauty.

This draft retains the handoff's **DRAFT — REQUIRES ASTRA REVIEW** designation. Review/implementation authorization remains outstanding. Before generating original raster/3D assets, create the required asset manifest; final photography, sponsors, dates and prize claims require appropriate confirmation before live use. Those institutional commitments do not block fictional labeled public prototypes. No framework, authentication configuration, persistence model or production API is selected here.
