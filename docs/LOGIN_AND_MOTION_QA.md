# Shared login and motion update — 2026-10-16

## Original glass X correction — later 2026-10-16

The owner's comparison was correct: the first recreation used broader, brighter arms, an 8-second float and an added moving highlight. Recovered original CSS from saved Git blob `0b0ad318687920f7edc056c6516ad96c2b88d118` and markup from `87ebb46202652b9b3629a1045e1abaaa7d8ac023`. Restored the artwork CSS verbatim, including 9-second X float, 10-second ticket float, original gradients/shadows, orbit perspective, dimensions and tablet keyframes. Existing original responsive rules again apply; phones use still X/ticket artwork.

Visually inspected 390×844, 768×1024, 1440×900 and 1920×1080. No horizontal overflow; desktop/tablet motion is running, login pauses both animations, Motion off pauses both, and phone computed animation names are `none`. Running transforms differed across observations, consistent with the original float. Five flat club SVG cards remain and Campus has zero Canvas elements. Browser error/warning logs were empty. TypeScript/Vite build passed; existing unrelated deferred Flux chunk warning remains. No dependencies or backend changes. Actual OS preference emulation and physical devices were not repeated. Captures: `output/glass-x-restore/`.

The implementation description below records the preceding pass; its recreated X treatment is superseded by this correction.

## Implemented behavior

Campus restores an animated optical X using CSS rather than a WebGL model. Flat club icons/cards and the flat Flux A replacement remain. The X pauses offscreen, in a hidden tab, when a dialog is open or when Motion off is selected; system reduced-motion CSS disables its animations.

All four themes now expose header login. A shared `LoginPanel` handles sign-in presentation, consistent labels, event context, Google/email controls, field validation, feedback, focus containment and dismiss/recovery. Legacy event cards expose Register directly; every theme's event detail provides Log in to register. Browsing events remains available without signing in.

**This is the frontend sign-in gate, not configured account services.** No Firebase client settings are supplied. Provider actions explain that setup is pending; no link is sent, no account/registration/payment is created, and no local storage flag pretends a user is authenticated. The existing independent backend requires real verified identity for protected operations.

Motion additions: native smooth anchor navigation, layered Campus content entrances, shorter eased legacy reveals, subtle button/card/label feedback and dialog/FAQ entrances. No wheel interception or additional animation dependency. Hidden reveal items become visible on keyboard focus. Motion off/reduced motion keep content and controls usable.

## Browser checks performed

| Theme | 390×844 | 768×1024 | 1440×900 | 1920×1080 |
| --- | --- | --- | --- | --- |
| Campus login | Checked | Checked | Checked | Checked |
| Pulse login | Checked | Checked | Checked | Checked |
| Panel login | Checked | Checked | Checked | Checked |
| Flux A login | Checked | Checked | Checked | Checked |

No horizontal overflow was measured in these states. Dialog widths stayed within the viewport. Phone dialogs scroll internally when the event context/feedback increases their height. Desktop and phone screenshots were visually reviewed; all size captures are saved locally under `output/login-motion/` (ignored by Git). These checks are desktop browser CSS viewport tests, not physical-device certification.

- Campus event detail → Log in to register displays Quantum Game Development Challenge in the sign-in prompt.
- Pulse, Panel and Flux direct event Register controls open the same prompt with the event retained.
- Google and syntactically valid test-email actions display explicit unconfigured feedback. No account/email success is claimed.
- Tab after the last sign-in control wraps to Close dialog. Escape closes and restores the original event button; background overflow locking is released.
- Phone login/menu/theme controls remain accessible. Fixed a temporary hidden Compare control caused by the new header layout.
- Campus computed X animation is running normally, paused while login is open and paused with Motion off. Motion off sets anchor scrolling to auto and leaves zero hidden reveal items; restoring motion returns smooth scrolling. Reveals were observed during navigation to discovery.
- Theme selection is reflected in the URL. System reduced-motion CSS is present; changing the OS preference during this final pass was not separately exercised. Hover feedback is implemented with pointer-specific CSS; no exhaustive mouse-hover audit was performed.
- QA tab returned no console errors/warnings. Browser inspection sometimes required a fresh snapshot after resize/source refresh; those tool-level transitions were not treated as application defects.

## Build and publication

Final `npm run build` passed including TypeScript. Existing deferred Flux B/C scene chunk remains approximately 259 kB gzip and triggers Vite's 500 kB uncompressed chunk warning. This update adds no dependencies. Backend code did not change; its preceding 58-test result remains documented separately rather than claimed as rerun here.

The owner authorized updating the existing FESTRONIX repository's main branch to the current workspace. Normal fast-forward publication preserves prior commits; removed Flux reference captures stay removed from the new tree. Dependencies, output, local databases/proofs and credentials are excluded. A credential-pattern scan of candidate source/text files found no credential-like literals before staging; this is a bounded check, not a full security certification.
