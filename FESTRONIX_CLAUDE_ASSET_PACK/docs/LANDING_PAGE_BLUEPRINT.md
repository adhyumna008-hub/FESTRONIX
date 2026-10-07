# FESTRONIX Landing-page Blueprint

**Status:** PROVISIONAL — public prototype planning, not final brand approval  
**Date:** 2026-10-06  
**Companion:** [DESIGN_SYSTEM_DRAFT.md](DESIGN_SYSTEM_DRAFT.md)  
**Basis:** AI_HANDOFF, PRODUCT_SPEC, OWNER_DECISIONS U1–U11, THEME_REFERENCES and TYPOGRAPHY_DIRECTIONS including the specimen test.

The owner has authorized this blueprint as the next planning step toward public visual prototypes. This is one reusable annual festival landing page with three presentation systems. The content, actions, section order and event facts are shared. No website, production integration, backend or API is created by this document. Fonts, palettes, motion and artwork remain provisional.

## 1. Shared page order

| Order | Section | Purpose, content and behavior |
| --- | --- | --- |
| 1 | Navigation + conditional operational notice | Year-independent FESTRONIX identity and Vardhaman attribution; Events, Schedule, Visit & help, FAQ; Sign in/My participation and primary Explore events action. A timestamped urgent notice can sit immediately beneath navigation without becoming a promotional banner |
| 2 | Hero | FESTRONIX with separately configured edition label; college identity; concise theme statement/tagline; approved dates and campus/location; clear admission availability; Explore events primary, View schedule secondary. Essential facts and actions are visible before decorative assets load |
| 3 | Introduction / festival promise | A short explanation of what students will do: build, compete, learn and share. One concrete paragraph plus up to three concise activity statements; avoid another full-screen manifesto or generic innovation claims |
| 4 | Flagship events + category discovery | Three to six curated approved events, followed by compact category links to the directory. Cards carry title, format/category, date/time, venue, fee, eligibility summary, admission status and View event action. Categories appear only if used; this is a preview, not a second full event directory |
| 5 | Schedule teaser | A short day selector and three to five chronological sessions with time, event and venue. Link to the full schedule. Explicit changed/postponed/cancelled notices; no independent manually typed schedule |
| 6 | Visit & participant essentials | Campus directions/location, arrival/ID expectations where applicable, accessibility/help contact, practical entry advice and approved help hours. Events accept internal/external students under their own rules; no blanket eligibility or campus-entry guarantee |
| 7 | Verified edition highlights — optional | Up to three meaningful verified values, such as published events, participating institutions from a stated past edition, or confirmed aggregate prize commitments. Include edition/date/basis; omit if no reliable evidence. Never present mock figures as real achievements |
| 8 | Previous-edition story / gallery — optional | Three to five licensed/permission-cleared images with captions and year; link to labeled archive. No automatically playing carousel, public participant directory or assumed consent. First editions may omit this section |
| 9 | Sponsors — conditional | Approved current-edition partners, tiers and links with adequate logo space. No fabricated logos or stale yearly commitments. Title-sponsor acknowledgement may also appear as a small hero credit; this does not reorder the main page |
| 10 | FAQ | Six to eight practical questions: eligibility, event fees/manual verification, teams, deadlines, arrival/check-in, certificates and help. Answers follow approved event policies; concise summaries link to relevant detail |
| 11 | Final event-discovery CTA | Restate dates and the invitation to choose an event. Explore events primary; My participation secondary for signed-in users. No general fest-pass sale, blanket confirmation or single “Register for fest” action |
| 12 | Footer | College/edition attribution, monitored contacts, practical/policy links, archive link and approved socials. Clearly distinguish historical content and current registration |

**Changes to the starting structure:** Combine category discovery with flagship events to reduce repeated card sections. Add practical visit/help information where people can act on the schedule. Keep statistics and gallery conditional. Preserve sponsors/FAQ before the final action. Infinium informs graphic pacing only; this order follows FESTRONIX participant needs.

## 2. Shared content and state rules

- Keep one meaningful reading order, one hero headline and a consistent card information order. At narrow widths, DOM reading order remains title/context → facts → action → supporting artwork.
- Hero statement candidate: **Build. Break. Discover.** It describes experimentation, not rule-breaking or unsafe activity. Supporting candidate: “Competitions, workshops and ideas built by students at Vardhaman College of Engineering.” Copy is a draft.
- `2K27` is an editable edition display label, not embedded in the permanent brand. Dates, sponsors, contacts, featured events and content refresh independently of visual theme. October 18–19, 2027 and specimen prize amounts remain explicitly fictional unless faculty confirms them.
- Prototype content uses labeled mock events, images and schedules consistently across themes. View event and schedule destinations may be clearly identified static demonstrations when implementation is separately authorized; a visual prototype must not collect real registration/payment data.
- Event status uses distinct explanations: not open, open, full, waitlist available if configured, paused, closed, postponed or cancelled. “Live” describes event operation, not admission availability. Fee/eligibility/team details come from the approved event; a free event does not imply all events are free.
- Before publication, faculty controls approved content and material commitments. Coordinators propose their assigned-event facts. Theme choice never alters event eligibility, fee, capacity, payment review or certificate rules.
- If schedule or registration is not ready, say so and show available browsing/help. Do not display an active-looking registration button with no destination. Past editions never offer current registration.
- Countdown is optional, tied to an approved date, with visible date/time text. It never substitutes for practical details, urgency policy or admission status.

## 3. Pulse treatment

**Distinction:** Confident typography and the visual rhythm of an organized student festival, with a few crisp playful graphic interruptions. Avoid startup-style feature grids and repeated floating pills.

| Area | Treatment |
| --- | --- |
| Hero | Left-aligned Space Grotesk identity and headline; separate edition/date strip; supporting copy/action group; right-side original “build/break/discover” arrangement of offset rectangular event fragments. Flat geometry or licensed activity imagery, no 3D needed. Preserve large quiet margins |
| Navigation | Solid light header with clear text links; one strong cobalt action. College attribution remains readable. Compact opaque sticky treatment after scroll, with no shrinking text |
| Rhythm | Generous hero → concise intro → denser event grid → ruled schedule → practical information. Alternate full-width quiet fields and bounded content, rather than different card styles for every section |
| Cards / events | Rectangular image/graphic field above title, then calm metadata and solid action. Subtle 8 px corners; no round-card uniformity. Selected flagship can receive more image area, while information order remains the same |
| Buttons | Solid ink/cobalt primary and bordered secondary; short verb labels in Manrope. No shiny gradients. Full-size focus and pressed feedback |
| Backgrounds | Warm off-white, white reading surfaces, ink text; one cobalt accent and sparing burnt-orange category markers. Color blocks have editorial purpose; no ambient gradient wallpaper |
| Hover / focus | Border emphasis and at most 2 px lift for genuinely interactive cards; graphic fragment may shift slightly. Keyboard focus is explicit, never depends on hover |
| Transitions | Small section-entry opacity/translation, once only; 160–220 ms interactions. Content exists before any animation; no scroll pauses |
| Mobile | Identity/context then actions then optional reduced graphic. One-column cards and schedule rows; compact category wrapping, no required horizontal carousel. Menu replaces wrapped desktop navigation. Keep long event names intact |

References: borrow UX London/Hatch clarity and selective Config/OFFF/Forward festival personality. Original graphic arrangements, student activity copy and strong schedules distinguish FESTRONIX from generic SaaS.

## 4. Panel treatment

**Distinction:** Editorial sequence of framed scenes and information panels; forceful condensed titles contrast with normal-width reading text. Manga influence comes from composition and ink vocabulary, not fan art or childish fonts.

| Area | Treatment |
| --- | --- |
| Hero | Barlow Condensed title in an original asymmetric ink/cream panel composition; a small red edition label and ruled practical-info panel. Original abstract workshop/circuit/process illustration can support the theme. Front-face letters and CTA have texture-free space |
| Navigation | Opaque cream/ink masthead, generous links, rectangular action label. Never use tiny comic captions as navigation; avoid repeated torn strips |
| Rhythm | Hero as cover → intro as editorial inset → events as sequential panels → schedule as timetable → visit as clear fact panel. Controlled changes in panel scale and alignment within shared reading order |
| Cards / events | Crisp 1–2 px ink framing, short category label, title in Barlow only at readable display sizes. Body/details in Manrope. Different graphic crops may add personality; repeated card information stays aligned. No overlapping panels covering another event's text |
| Buttons | Rectangular filled ink or red action, outlined secondary. Optional small fixed graphic shadow; hover shortens its offset without moving the hit target |
| Backgrounds | Cream paper and solid ink blocks; restrained red and warm-yellow highlights. Halftone in margins/art fields only, no noisy texture behind paragraphs or forms |
| Hover / focus | Ink border/label emphasis; a short decorative motion-line accent on pointer hover is optional. Keyboard focus gets a clean outline, not an animation |
| Transitions | Brief panel-edge reveal or 4–6 px translation tied to reading order. No flashing, repeated wipes, rapid zooms or rotated body copy |
| Mobile | Flatten asymmetry into ordered single-column panels; remove decorative gutters/side labels and shrink illustration, not text. Keep borders, edition labels and a few halftone fields as identity. No sideways reading or diagonal tap targets |

References: Tokyo's expressive identity and beyond tellerrand/Presstival's quiet reading panels. Use original artwork; do not reproduce Infinium typography, torn boundaries, comic characters or exact layout.

## 5. Flux common treatment

**Distinction:** One bounded immersive hero with protected typography, followed immediately by ordinary readable dark festival content. No scene interaction is necessary to discover events.

| Area | Treatment |
| --- | --- |
| Hero | Sora heading/wordmark, Manrope practical copy, static solid actions. Desktop copy/action column plus a scene stage occupying approximately half the width; decorative depth can span behind the title only in reserved safe regions. Essential text never waits for WebGL |
| Navigation | Quiet solid near-black header, readable links and a solid light/violet action. Limited translucency may decorate peripheral chrome after contrast review, never dense information |
| Rhythm | Immersive hero → opaque intro → dark flagship modules → ruled schedule and visit blocks. Continue a restrained material/border accent below the hero, rather than new 3D scenes for every section |
| Cards / events | Opaque near-black surface, separated image/title/metadata/action. Original scene-derived stills may serve graphics; no canvases in each card, glowing text or glass behind long descriptions |
| Buttons | Solid high-contrast actions, thin restrained secondary border; bounded highlight on hover. No refraction of controls, magnetic cursor or delayed activation |
| Backgrounds | Dark atmospheric depth through a small palette and scene lighting. Violet/cyan accents local to focal geometry; normal content uses stable solid surfaces |
| Hover / transitions | Small surface/border change for controls. Scene pointer response limited to the stage and damped. Hero exit may simplify/de-emphasize the object as ordinary content enters; no pinned cinematic corridor or hijacked scrolling |
| Mobile | Copy/actions first, compact poster or simplified scene afterward. Retain meaningful object silhouette at portrait scale. Normal single-column content; no desktop nav rails or microcopy |

Lusion supports the transition to readable modules; Hatom supports reserved copy space and portrait scene composition. Hatom Labs' mobile clipping is explicitly an anti-pattern. No exact sculptures, landscapes or financial UI are copied.

## 6. Three competing Flux heroes — all retained

| Concept | Original visual idea | Desktop interaction / narrative | Mobile and fallback | Risks to compare |
| --- | --- | --- | --- | --- |
| A — FESTRONIX CORE | Faceted technological nucleus with two or three incomplete orbit structures; “building together” rather than a generic neon sphere | Pointer orientation changes by a few degrees; localized light follows the nearest core facet. One bounded transformation from compact components to a stable assembled core can demonstrate the festival's build theme | Simplified fixed core with one orbit or still poster; reduced motion uses assembled state. Static fallback keeps the same silhouette and content | Can look generic if centered in a void; relate forms to workshop/engineering activity, avoid particle overload and automatic repeated transformation |
| B — LIQUID FLUX | Original folded ribbon or continuous organic sculpture, dark metallic body and sparse warm/violet reflection | Slow small deformation/material response in reserved stage, damped pointer orientation. A single gentle settle conveys experimentation; no essential letter or button deforms | Low-detail silhouette with baked-looking lighting or poster; reduced motion uses still form. No fluid simulation prerequisite | Attractive material can dominate the festival context; compare copy clarity, deformation cost and resemblance to stock glossy blobs |
| C — TECH NETWORK / PORTAL | Bounded open-frame portal with a few connected nodes suggesting making, computing and discovery; no full virtual campus | Pointer slightly changes depth/light; a short highlight passes between nodes and toward the X. Decorative nodes do not become hidden event navigation. Scroll can reveal the portal's finite structure before content takes over | Fewer nodes and fixed portal perspective or still image; reduced motion stops traversing light. Static fallback preserves original portal outline | Crowded lines, visual noise and confusing “click nodes to register” expectation; test against clear HTML actions and restrained depth |

All three use the same hero copy, typography, action position, stage footprint, content below and conservative quality settings for fair comparison. Test them sequentially, not three concurrent canvases. Neither concept A, B nor C is selected as the winner. Selection later depends on festival distinctiveness, text clarity, mobile composition and measured loading/frame cost.

## 7. Interactive FESTRONIX 2K27 typography

The wordmark is a **temporary hero typography treatment**, not a redesign of the permanent logo. One readable semantic HTML identity/heading remains the accessible source. Decorative 3D lettering, echoes and edition layers are hidden from assistive reading and do not duplicate announcements. Maintain a solid readable front face throughout; effects live on depth, edges or the backdrop.

| Technique | A — CORE | B — LIQUID FLUX | C — NETWORK / PORTAL | Readability guardrail |
| --- | --- | --- | --- | --- |
| Subtle extruded depth | Shallow bevel/depth echo facing core lighting | Smooth edge/depth highlight alongside sculpture | Crisp wire-like backing behind a solid face | No rotation to an edge-on word or loss of front-face contrast; do not require 3D text to load before HTML identity |
| Pointer parallax / perspective | Title backing moves less than orbit structure | Title remains steady while object responds | Portal shifts behind quieter title layer | Suggested max decorative translation 4–8 px and rotation 1–2°; direct pointer only, no device-motion permission |
| X energy junction | Core's visual alignment points toward X intersection | A material glint passes behind X | A short node highlight terminates at X | X remains an intact recognizable letter; no replacing its strokes with a glowing symbol |
| Secondary 2K27 layer | Small near-static orbit-adjacent plate | Floating-depth plate with subtle reflection | Separate layer near portal edge | Stable readable HTML edition label always present; decorative duplicate cannot look like another edition/date |
| Travelling light | One short edge highlight after settling | Soft reflection sweep across depth edge | One contained highlight following portal line | No pulsing/flashing through essential text; bounded once-only sweep, stable text fill |
| Controlled refraction | Optional distortion of background behind depth echo | Optional object/background refraction behind text | Optional portal-edge background distortion | Never refract the readable front-face letters, metadata or controls. Reject if perceived as damaged lettering |
| Scroll separation/reassembly | Decorative depth/orbit layers gently separate then settle | Sculpture/depth echo recedes rather than stretching text | Portal backing expands slightly then resolves | Original word stays assembled and readable; only decorative backing layers separate. No scroll locking or reverse-reading sequence |

**Desktop:** Fine pointer can drive bounded stage response. Header, CTA hit areas and text remain stable. Keyboard users get the same content and focus feedback; there is no meaningful hidden hover interaction to reproduce. Keep optional scroll response shallow and end it when the hero leaves view.

**Mobile:** Disable pointer-follow and scroll separation by default. Use solid flat wordmark + readable edition label, with optional restrained object orientation only if measured performance permits. No accelerometer/gyro access, drag-to-enter gesture or forced landscape. Long titles can wrap naturally; never split FESTRONIX into unreadable fragments to preserve one desktop line.

**Reduced motion:** Static assembled wordmark/edition and object or poster. Stop light traversal, orbits, deformation, parallax and scroll choreography. Keep instantaneous state/focus feedback and all content visible.

**No WebGL / loading / failure:** Same HTML title, facts and controls with a reserved still/graphic stage. Font fallback remains readable. On scene failure/context loss or sustained poor rendering, retain the still and release optional scene resources later in implementation. No loader overlay, retry loop, missing-wordmark state or mandatory “enter experience” screen.

## 8. Prototype review and prerequisites

Later authorized prototypes should compare Pulse, Panel and each Flux hero using one shared fictional content set. Inspect desktop, tablet and approximately 390 px phone width, plus 320 px reflow, long titles, text enlargement, keyboard and reduced-motion/no-WebGL states. A prototype theme/concept selector may exist in an external review toolbar; it is not a new public theme-switching product feature.

Review success: dates/action visible promptly; event facts scan clearly; schedule/help reachable without a spectacle; Panel body stays texture-free; Flux identity stays legible; all variants preserve content and state meaning. Measure optional scene cost on a representative student phone before claiming good performance. No performance or accessibility result is established by this planning document.

**Prototype implementation prerequisites:** Separate explicit coding authorization; review of this blueprint and the provisional system (draft remains marked for Astra review). Asset generation requires `ASSET_MANIFEST.md` first under the existing project rule; placeholder geometry/clearly labeled mock media can avoid a dependency on final artwork in an authorized prototype. Fonts/colors and the Flux winner may remain provisional during comparison. Faculty policy/staffing/real-date confirmations gate live operation, not a labeled mock public prototype. Full product USER_FLOWS and SCREEN_INVENTORY remain separate deferred deliverables; this scoped landing blueprint does not silently create them.
