# Campus feedback refinement — 2026-10-17

## Changes

- Removed the duplicate “Find your experience” header link. Login and the Explore directory remain available; primary discovery stays in the hero.
- Enlarged the FESTRONIX wordmark and reduced the supporting hero stage from 590px to 460px on normal desktop, with responsive adjustments. The original glass-arm geometry, materials and 9-second float are retained; only its placement and surrounding composition changed.
- Trialled **Outfit** for Campus display/headings with shared **Manrope** body/UI text. This is a local visual refinement, not a final platform-wide typography decision. Outfit loads only when Campus mounts, via Google Fonts with `display=swap`; cleanup removes the link. No downloaded font files or new dependencies.
- Replaced the five bare line-symbol cards with original SVG club posters: gamepad/orbits, layered code window, illustrated book/bookmark, clapperboard/frame and graphic starburst. Shared palette, dotted texture, framing and category labels give them a consistent family. These remain two-dimensional illustrations, not official logos or a restored 3D gallery.
- Corrected the shared label to **Student Developers Club**, including inactive gallery source for consistency.
- Reduced section gaps and tightened information spacing while retaining readable body text, long event titles and phone touch targets.
- Removed the redundant “Back to exploring” event-dialog button. A single top Close control remains; the full-width primary action is “Log in to register.” Login still shows event context and explicit unconfigured account-service feedback.

## Checks actually performed

- TypeScript/Vite production build passed. Existing deferred Flux B/C chunk-size warning remains; no dependency additions or backend changes.
- Visual browser inspection at **390×844, 768×1024, 1440×900 and 1920×1080**, plus **375×812** narrow phone and **844×390** landscape checks. No measured horizontal overflow or wordmark clipping.
- Club posters inspected on desktop, tablet and phone. Tablet uses a centered 3+2 layout; phone uses two columns with a wide final poster. The full club name remains readable.
- Event dialog inspected on desktop and phone, measured on tablet and landscape. Landscape content scrolls internally within the viewport.
- Verified event detail → login retains Quantum Game Development Challenge; Escape closes and returns focus to the original event trigger. Tab after the single registration action wraps to Close.
- Manual Motion off pauses the original X and leaves zero waiting reveal items; original phone artwork is still. Existing OS reduced-motion styles remain. No actual OS preference emulation, largest system-text setting, physical-device audit or sustained performance claim.
- Final local browser error/warning log was empty. Initial review required restarting the stopped local server. One hot source refresh closed an open dialog during QA; it was reopened and rechecked.
- Local captures: `output/campus-feedback/` (ignored QA evidence). Final screenshots and live deployment verification are recorded after publication.

## Publication

- GitHub commit: `31c222fa5a8dcdae2fdb30209265fc0b24bccf8b` on `main`.
- Vercel deployment: `dpl_5tthx1b3e2MhUtL7k9ho1ZZQBMFC`, production, **READY**; build approximately 19.8 seconds. Git integration triggered automatically after push, so no duplicate deployment was created.
- URL: https://festronix2k27.vercel.app/.
- Public desktop/phone smoke check confirmed new posters, plural Developers name, removed header duplicate, event dialog with one dismissal and one primary action, and no horizontal overflow. Browser error/warning log empty. Live screenshot: `output/campus-feedback/live-clubs.png`; phone: `live-phone.png`.
- Platform build-log scope limitations from the original release remain; no monitoring, drains, or backend operation was added. Physical devices and actual OS preference changes remain unverified.

## Scope

Campus visual refinement only, with a shared club-name correction. Event datasets, product rules, three original themes, Firebase/backend/payment connections, roles and architecture are unchanged. The previously removed 3D Club Gallery remains inactive. The owner’s screenshots are visual feedback, not authorization to copy third-party assets or contact the people shown.
