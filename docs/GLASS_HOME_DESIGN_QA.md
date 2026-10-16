# FESTRONIX liquid-glass home

Implemented 2026-10-07; continuation and verification completed 2026-10-08. This follows the owner's new home-page direction and preserves the existing club gallery.

## Design decisions

The home page prioritizes three visitor questions: what can I do, where do I belong, and how do I plan my day? A bold festival identity leads directly to discovery; the immersive 3D gallery is an optional deeper destination. The design uses warm paper, charcoal, orange and restrained sage, with existing Manrope typography and supplied college/SAC logos.

Glass is concentrated in navigation, the directory surface and original optical X artwork. Reading surfaces remain stable. The menu groups destinations by intent with explicit subtitles: events, clubs, schedule, and campus. This is a design hypothesis about useful discovery, not a claim of measured conversion gains or psychological testing.

`ui-ux-pro-max` and repository context, design, motion, performance/accessibility and browser-QA guidance were applied. The broad skill query returned off-topic hospitality typography and testimonial layout; those recommendations were rejected. A narrower liquid-glass query supported selective material use and motion/contrast safeguards. React guidance supported modal focus ownership and effect cleanup.

## Implementation and content

- `GlassHome.tsx` and `glass-home.css` implement the new default route. Original CSS optical artwork requires no downloaded image or 3D asset.
- `main.tsx` loads `LegacyApp.tsx` only for explicit theme URLs. Previous Pulse, Panel and Flux experiences and source models remain available; the home makes no WebGL context.
- Event cards, detail sheets, schedule and FAQs read the existing shared `data.ts`. Interests with no supplied events clearly show programme-pending content. The five club preview images reuse locally rendered, licensed-source gallery posters.
- Login is a visual preview. Required email validation runs locally; Google/email buttons state that account services are unconnected. No credentials, API request, account session, registration or email delivery is implemented.
- Native modal dialogs keep the background inert, contain forward/reverse Tab at boundaries, close with Escape and restore trigger focus. Listeners and body scroll locks clean up. Scrollbar gutter reservation prevents layout movement when a modal opens.
- Entrances reveal on intersection and keyboard focus. Motion-off exposes all sections and disables smooth scrolling; OS reduced-motion CSS removes animations/transitions. Hero ambience pauses offscreen, when hidden and during modal use. Phones use still hero artwork.

## Verification

Browser CSS viewport inspection covered **390×844, 768×1024, 1440×900 and 1920×1080**. No horizontal overflow was observed. Phone hero/menu/login, tablet hero/cards/club row/menu, and desktop hero/menu/login were visually inspected. Native screenshot capture can crop a large CSS override; DOM width and scroll width were checked separately.

Exercised Workshops and Everything filters, pending Esports content, event details, Day 2 schedule and FAQ expansion. Empty email focuses the invalid field; a synthetic `preview@example.com` submission displays the no-email-sent message. Google preview gives an unconnected-state message. Menu-to-login, modal forward/reverse Tab and Escape/focus return work. Menu anchors reach the relevant section; returning home clears the sticky header. Manual motion-off has zero waiting sections and paused hero animation. Offscreen artwork reports paused. Actual OS preference emulation and physical touch/device testing were not performed.

The existing gallery link was exercised: it loads the legacy Flux route and reaches ready with one Canvas. Final normal console error/warning logs were empty. Screenshots are saved under `output/glass-home/` (ignored QA output).

`npm run build` passes TypeScript and Vite. Initial JS is **77.24 KB gzip**, home CSS **7.29 KB**; legacy JS **67.11 KB** and CSS **13.19 KB** are deferred. The GLTF chunk warning belongs to the optional gallery, not the home startup. No additional dependencies. These are bundle measurements, not field Core Web Vitals or sustained phone FPS claims.

## Remaining

Owner visual acceptance, confirmed dates/programmes, actual authentication and physical-device/performance testing remain pending. No backend work, publishing, push or deployment was performed. Local preview: http://127.0.0.1:4180/.
