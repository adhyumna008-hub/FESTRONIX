# FESTRONIX Typography Directions

**Status:** EXPLORATION — PROVISIONAL, NOT FINAL  
**Date:** 2026-10-06  
**Scope:** Typography strategy and candidate pairings only. No rendered specimens, font downloads, application changes or complete design-system decisions.

## Shared requirements

FESTRONIX needs a recognizable typographic voice that survives changing editions, themes, event titles and staff. The reference register supports clean content hierarchy for Pulse, expressive identity over quiet reading surfaces for Panel, and protected copy beside atmospheric scenes for Flux. These are conceptual influences; candidate families below are not claims about the fonts used by reference websites.

| Use | Shared requirement |
| --- | --- |
| Huge hero titles | Strong silhouette, intentional line breaks and solid readable letterforms; festival name and practical details remain readable without effects |
| Navigation and buttons | Clear mixed-case labels, medium/semibold weight, short wording; avoid decorative lettering for actions |
| Event titles | Accommodate long names and mixed-case abbreviations; display face only at a comfortable size, shared body face for dense cards |
| Descriptions and rules | Open counters, clear punctuation, ordinary sentence case and comfortable line length |
| Dates/times | Distinguishable digits, explicit month/time notation; never depend on decorative numeral styling to explain a date |
| Prize amounts | Clear rupee symbol, commas, decimals and units; keep amount and currency visually connected |
| Countdowns | Stable-width digits with readable unit labels; no required rolling or flickering numerals |
| Forms | Body face for labels, input, help and errors; readable names, email addresses and transaction references |
| Admin/coordinator/participant dashboards | One stable functional typography system across themes; clear table alignment, statuses and long values |
| Mobile | Reflow, generous line height, readable metadata, intact actions; content cannot shrink to preserve a desktop composition |

**Body candidate:** Manrope, provisionally 400–500 for paragraphs, 500–600 for navigation/forms/buttons, 600–700 for functional headings. Its geometric character can connect the brand across three different display voices. It must still pass small-size reading review; its appearance alone does not establish accessibility. Source Sans 3 is a possible replacement if later real-device comparisons show better dense-interface readability, rather than a fourth font to ship alongside it.

**Numbers:** Prefer the shared body's lining, tabular numerals for aligned tables, dates and countdowns where supported by the selected build. Use proportional numerals in ordinary prose. An optional IBM Plex Mono accent may serve short technical references or countdowns, but is not required for all metadata or amounts. Verify numeral-feature support rather than assuming every candidate has it. Check `₹1,25,000`, `09:05 AM`, `2K27`, `0/O`, `1/I/l`, `8/B`, `–`, `+` and decimal separators in later specimens.

**Exploration ranges, not final tokens:** Body 16–18 px equivalent, line height 1.5–1.65; metadata about 14–16 px; event titles about 22–32 px; section headings about 32–64 px. Desktop hero experiments may start around 80–160 px and mobile around 40–64 px, depending on wording and available width. Use relative sizing later and allow content-driven growth; no fixed-height copy boxes. Aim for roughly 45–70 characters per paragraph line, with shorter phone lines naturally accepted.

**Accessibility:** Normal text should meet 4.5:1 contrast; qualifying large text 3:1. Keep content usable with 200% text resizing, narrow-width reflow and user spacing overrides. The WCAG text-spacing test values are overrides the layout must tolerate, not a mandatory default tracking style. Check real backgrounds, not only flat palette samples. These requirements come from [WCAG 2.2, contrast, resize, reflow and text spacing](https://www.w3.org/TR/WCAG22/#contrast-minimum); no compliance testing has occurred in this exploration.

## Pulse — three directions

Pulse borrows UX London's decisive hierarchy and Hatch's quiet metadata, with selective festival play from Config/OFFF/Forward. Energy should come from scale, rhythm and letterform character rather than futuristic ornament.

### P1 — Characterful modern grotesk

- **Combination:** Space Grotesk display + Manrope body; shared body numerals, optional mono only for short references.
- **Display characteristics:** Broad, clear grotesk with distinctive details; enough personality for a technology festival while remaining readable in event headings.
- **Body characteristics:** Calm geometric sans with open spacing and clearly differentiated functional weights.
- **Case:** FESTRONIX and brief hero emphasis may use uppercase; event names, navigation and body preserve normal case.
- **Tracking:** Hero −0.02 to 0 em; body near 0; short uppercase labels +0.04 to +0.08 em. Never apply tight hero tracking to small labels.
- **Weights:** Display/headings 500–700; body 400–500, controls 500–600.
- **Hero behavior:** Confident two-line composition where needed; one accent word or contrasting weight, solid fills and intact letters. Keep dates/location/action outside the oversized title block.
- **Mobile:** Reduce scale and negative tracking before forcing narrower letters; support long event titles with natural wraps. Use Manrope for dense card titles where display lettering crowds metadata.
- **Tradeoff:** Can drift toward a familiar startup look if surrounded by generic badges and gradients. Festival composition and editorial pacing must supply identity.

### P2 — Expressive festival headline

- **Combination:** Syne display + Manrope body; body numerals for all operational values.
- **Display characteristics:** Unusual expansive shapes and pronounced heavy-weight personality, reserved for short headings.
- **Body characteristics:** Plain, steady reading texture to counter the display's changing proportions.
- **Case:** Mixed-case headlines can feel playful; uppercase only for short brand statements. Ordinary case for every action and description.
- **Tracking:** Hero roughly −0.02 to 0 em after optical review; small caps labels +0.04 em; body 0.
- **Weights:** Display 600–800; body 400–500, controls 600.
- **Hero behavior:** Short phrases with generous horizontal room, one expressive display area per section; event cards use Manrope semibold instead of squeezing heavy Syne.
- **Mobile:** Expect heavy shapes to wrap earlier. Use a less expansive weight and fewer words per line; do not horizontally compress text to fit.
- **Tradeoff:** Strongest playful alternative, but excess heavy lettering can overwhelm the festival information.

### P3 — Warm geometric clarity

- **Combination:** Plus Jakarta Sans display + Manrope body; shared tabular numeral treatment.
- **Display characteristics:** Friendly geometric construction, strong bold hierarchy and softer visual rhythm without novelty shapes.
- **Body characteristics:** Neutral, readable paragraphs and metadata; keep pairings differentiated mainly by scale and weight.
- **Case:** Predominantly sentence/title case; uppercase brand and brief date/category labels only.
- **Tracking:** Headings −0.015 to 0 em; body 0; uppercase labels +0.04 to +0.06 em.
- **Weights:** Display 600–800; body 400–500, controls 500–600.
- **Hero behavior:** Large clear statement with spacious supporting copy; numerals remain ordinary and easy to scan.
- **Mobile:** Robust mixed-case wraps and modest weight contrast; avoid oversized bold paragraphs.
- **Tradeoff:** Practical but least distinctive of the three. Two similar sans families may not justify their combined loading cost after comparison.

## Panel — three directions

Panel follows Tokyo's expressive identity, beyond tellerrand's separation of masthead and reading panel, and Presstival's framed program hierarchy. Typography provides editorial tension; illustration and framing provide comic energy. Body copy remains plain.

### N1 — Condensed editorial impact

- **Combination:** Barlow Condensed display + Manrope body; Manrope numerals for prices/times, optional mono for tiny technical identifiers only.
- **Display characteristics:** Tall condensed sans with strong weight and crisp forms; a sophisticated poster voice rather than handwritten comic lettering.
- **Body characteristics:** Normal-width sans offers deliberate contrast and comfortable paragraphs inside quiet panels.
- **Case:** Uppercase hero and short graphic labels; natural-case event names and descriptions. Never uppercase a paragraph or participant name.
- **Tracking:** Display 0 to +0.01 em; graphic labels +0.04 to +0.08 em; body 0. Avoid crushing condensed counters with negative tracking.
- **Weights:** Display 600–800; body 400–500, controls 600.
- **Hero behavior:** Short stacked lines in framed space; mild compositional offset can suggest panel movement without skewing every letter. Solid lettering first; outline only as redundant decoration.
- **Mobile:** Less asymmetry, fewer stacked lines, no narrow display below comfortable title sizes; long card titles switch to Manrope. Texture stays outside glyphs and body surfaces.
- **Tradeoff:** Condensed text can seem loud or cramped; use it sparingly and preserve whitespace.

### N2 — Heavy press masthead

- **Combination:** Archivo display + Manrope body; body tabular figures for operational values.
- **Display characteristics:** Heavy, robust sans and controlled width variation for editorial mastheads; no simulated distress needed.
- **Body characteristics:** Lighter normal-width sans separates explanation from graphic impact.
- **Case:** Uppercase identity and category ribbons; mixed-case content headings and standard body case.
- **Tracking:** Heavy headlines −0.015 to 0 em; ribbons +0.03 to +0.06 em; body 0.
- **Weights:** Display 700–900; body 400–500, controls 500–600.
- **Hero behavior:** Bold ink-like mass against a quiet field, large edition label separate from permanent identity. Use natural family width where available, never stretch letters manually.
- **Mobile:** Favor a less wide setting, flexible lines and intact words; maintain readable panel margins and metadata.
- **Tradeoff:** Most practical card-heading option, but typography alone gives a poster feel rather than manga; graphic composition must establish Panel.

### N3 — Contemporary editorial contrast

- **Combination:** Fraunces display + Manrope body; body numerals for countdowns/prizes.
- **Display characteristics:** Expressive serif with substantial strokes; restrained optical/softness choices rather than exaggerated whimsical alternates.
- **Body characteristics:** Plain sans keeps rules and event cards functional and gives clear serif/sans contrast.
- **Case:** Mixed-case editorial headlines; uppercase limited to Manrope labels. Avoid all-caps long serif headlines.
- **Tracking:** Display about −0.01 to 0 em after review; body 0; labels +0.04 em.
- **Weights:** Display 600–800; body 400–500, controls 600.
- **Hero behavior:** A few large editorial words anchored in a frame; no thin hairlines, warped text or serif body paragraphs over halftone.
- **Mobile:** Reconsider optical settings at small sizes, allow extra leading, and move dense titles to Manrope.
- **Tradeoff:** Premium editorial alternative, but least directly comic in tone; high softness can become cute. Keep as the deliberate contrast option, not the default.

## Flux — three directions

Flux follows Lusion's readable type/content separation and Hatom's reserved text space. Type should remain legible as the scene changes; atmosphere comes from composition and depth rather than a sci-fi alphabet.

### F1 — Cinematic geometric precision

- **Combination:** Sora display + Manrope body; shared stable-width numerals, optional IBM Plex Mono for a short countdown if later review supports it.
- **Display characteristics:** Clear geometric sans, substantial strokes and broad presence; recognizable letters without techno cuts.
- **Body characteristics:** Comfortable normal-width sans on protected, quiet surfaces; no thin gray microcopy.
- **Case:** Uppercase FESTRONIX with mixed-case supporting headings; natural-case navigation/buttons/body.
- **Tracking:** Hero −0.02 to 0 em; uppercase eyebrow +0.05 to +0.08 em; body 0. Avoid widely tracked multi-line titles.
- **Weights:** Display 500–700; body 400–500, controls 500–600.
- **Hero behavior:** Large solid title beside or in front of a reserved scene region. An object may overlap decorative space, never essential strokes, dates or action labels. Keep title readable in a static fallback.
- **Mobile:** Copy and action lead, simpler portrait scene follows; hero wraps naturally and stays opaque. Do not scale the entire desktop scene and typography down together.
- **Tradeoff:** Can feel conventionally technical; restrained composition and original art carry the cinematic identity.

### F2 — Sculptural contemporary display

- **Combination:** Syne display + Manrope body; body numerals rather than decorative display digits for small data.
- **Display characteristics:** Sculptural, expansive heavy forms echo a material object without imitating it.
- **Body characteristics:** Calm sans with clear separation from the hero's strong silhouette.
- **Case:** Brief uppercase or mixed-case title, ordinary-case content and actions.
- **Tracking:** Hero −0.015 to 0 em after optical review; labels +0.04 to +0.07 em; body 0.
- **Weights:** Display 600–800; body 400–500, controls 600.
- **Hero behavior:** Very short headline balanced against the 3D focal object; no transparent, bloom-lit or constantly morphing essential title.
- **Mobile:** Lower weight/expansion, intentional line breaks and generous width; use Manrope for content-section headings if Syne competes with cards.
- **Tradeoff:** Distinctive, but the title and object can compete. Reusing Pulse's Syne alternative would reduce theme separation if both were selected.

### F3 — Quiet spatial confidence

- **Combination:** Outfit display + Manrope body; shared tabular data treatment, no extra mono required.
- **Display characteristics:** Smooth geometric forms with strong medium/bold weights, quieter than Syne.
- **Body characteristics:** Stable reading texture for ordinary dark content modules and dashboards.
- **Case:** Mixed-case content headings with optional uppercase brand; normal-case actions and text.
- **Tracking:** Display −0.015 to 0 em; body 0; short uppercase labels +0.05 em.
- **Weights:** Display 500–700; body 400–500, controls 500–600.
- **Hero behavior:** Large, calm lettering with ample negative space around an original object; visual drama stays in the scene, not every heading.
- **Mobile:** Strong uncomplicated letterforms and ordinary wrapping; preserve body contrast and increase space between title and metadata.
- **Tradeoff:** Least theatrical option, but can outperform a louder face when the scene is complex. Similarity to Manrope must justify the additional family.

## Cross-theme recommendation

Recommend **A with a shared functional layer: one body/UI family, one numeral policy and a distinct display family for each public theme**. Manrope is the provisional body choice for public descriptions, navigation, buttons, forms, metadata and all three dashboards. Display families affect public hero/section/event-heading treatment only where readable. The permanent logo remains an independent brand asset; this document does not replace it with a font setting.

Completely separate systems would multiply font loading, wrapping issues, editorial training and regression review without improving participant tasks. Shared information hierarchy and body typography make FESTRONIX recognizable; public display proportion, weight and case supply theme differences. Theme switches do not change facts or functional meaning. A mono accent is optional and shared, not a different font for each theme.

### Availability and performance guardrails

Google Fonts repository metadata was checked on 2026-10-06 for the nine display/body candidates below; each is listed with an OFL license. Text metadata alone was retrieved; no font binaries were downloaded. OFL supports practical use, but the exact chosen release, license notices and any redistribution conditions must be reviewed before later delivery. Family availability does not verify rupee coverage, all requested weights or tabular features in every served subset.

| Family | Official metadata / availability source |
| --- | --- |
| Manrope | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/METADATA.pb) |
| Space Grotesk | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/spacegrotesk/METADATA.pb) |
| Syne | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/syne/METADATA.pb) |
| Plus Jakarta Sans | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/plusjakartasans/METADATA.pb) |
| Barlow Condensed | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/METADATA.pb) |
| Archivo | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/METADATA.pb) |
| Fraunces | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/METADATA.pb) |
| Sora | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/sora/METADATA.pb) |
| Outfit | [Google Fonts metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/outfit/METADATA.pb) |

IBM Plex is documented as open source and available through Google Fonts by [IBM's typeface documentation](https://www.ibm.com/design/language/typography/typeface/). Optional mono use still needs glyph/build review.

Later delivery should load only the shared body and active theme's display, with mono only if it earns its cost. Compare a small static weight set with a limited variable build using actual transfer sizes; variable is not automatically smaller. Keep useful fallback text visible, assess font-swap layout movement and avoid loading every family from this shortlist. Do not sacrifice participant names, ₹ or punctuation through careless subsetting. Any future Indian-language content needs a separate script-coverage assessment. Dashboards should not need public hero fonts or decorative assets to render.

Before final selection, compare the same festival title, long event name, paragraph, fee, time, form error and table row at desktop and narrow widths. Include 320/390 px layouts, text enlargement, weak-network fallback and typical student-phone rendering. Review actual numeral features, glyph coverage, line breaks, optical weight and contrast over scene/texture states. No specimens, payload measurements or real-device font tests have been performed yet; the favorites are aesthetic/product recommendations pending that authorized review.

## Ranked shortlist and provisional favorites

| Theme | Rank | Combination | Reason |
| --- | --- | --- | --- |
| Pulse | 1 | Space Grotesk + Manrope | Distinctive modern energy with readable supporting content |
| Pulse | 2 | Syne + Manrope | Strongest festival play; use short display copy |
| Pulse | 3 | Plus Jakarta Sans + Manrope | Warm practical option; check whether two similar families earn their cost |
| Panel | 1 | Barlow Condensed + Manrope | Poster/panel impact with clear display/body contrast |
| Panel | 2 | Archivo + Manrope | Robust editorial masthead and easier mixed-length headings |
| Panel | 3 | Fraunces + Manrope | Sophisticated serif contrast; less directly comic |
| Flux | 1 | Sora + Manrope | Clear cinematic silhouette over reserved scene space |
| Flux | 2 | Syne + Manrope | Sculptural alternative when scene/title competition is controlled |
| Flux | 3 | Outfit + Manrope | Calm spatial voice for visually complex scenes |

**Pulse favorite — PROVISIONAL — NOT FINAL:** Space Grotesk display + Manrope body/UI.  
**Panel favorite — PROVISIONAL — NOT FINAL:** Barlow Condensed display + Manrope body/UI.  
**Flux favorite — PROVISIONAL — NOT FINAL:** Sora display + Manrope body/UI.  
**Shared-body recommendation — PROVISIONAL — NOT FINAL:** Manrope across themes and dashboards; shared numeral treatment, optional IBM Plex Mono only for justified short data accents.

## Specimen test

2026-10-06: Temporary comparison at `experiments/typography-specimen/index.html`, served at http://127.0.0.1:4177/. All nine pairings were visually inspected at 1440 px desktop and 390×844 mobile, using identical content, weight 700, sizes and neutral surfaces; Flux also inspected on a plain dark surface. All nine unique families reported loaded. Browser requests fonts remotely; no font files were vendored. This test supplements the earlier exploration's unrendered status and does not finalize fonts or evaluate a production composition.

- Space Grotesk + Manrope remains strongest for Pulse; Barlow Condensed + Manrope gives Panel the clearest display/body contrast; Sora + Manrope remains strongest for Flux, with Outfit a practical close alternative. These are provisional visual judgments.
- At 390 px, Syne and Sora wrap the long event title into three lines; other tested faces use two. Syne also wraps the tagline. Avoid fixed-height titles/cards and budget extra vertical space; Barlow's compact letterforms should not become small metadata. Navigation wraps into two rows, with Dashboard on the second row.
- Body copy, ₹ amounts, dates, countdown and labels remained readable in these samples. No page-level horizontal overflow was found in the nine standalone mobile views. The compact 380 px admin table needs its contained horizontal scroll at mobile width; all columns cannot be assumed visible simultaneously.
- A faint dark placeholder was corrected in the specimen and reinspected. Manrope's small `I/l` distinction remains a caution for identifiers; do not assume this sample validates every glyph or tabular-numeral feature.
- No pairing needs elimination for a rendering defect. Fraunces is least aligned with the intended Panel manga/comic voice and can be deprioritized on stylistic grounds; retain it in the comparison. Space Grotesk/Sora still need original composition to avoid startup sameness. Network/fallback, 200% text resizing, physical-device rendering and WebGL-background contrast remain untested.
