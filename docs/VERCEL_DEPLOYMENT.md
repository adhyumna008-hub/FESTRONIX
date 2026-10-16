# Vercel visual-preview deployment

## Status — 2026-10-16

Owner authorized publishing the existing GitHub project to Vercel, with preferred hostname `festronix2k27.vercel.app`. Deployment is **pending Vercel sign-in**. The browser dashboard redirected to login; GitHub sign-in also required a user session. No Vercel project or hostname has been claimed or verified.

## Prepared configuration

- Repository: `https://github.com/adhyumna008-hub/FESTRONIX`
- Production branch: `main`
- Preferred project name: `festronix2k27` (availability must be checked in Vercel).
- Import with **Root Directory set to the repository root (`./`)**. The root `vercel.json` handles the nested frontend automatically.
- Framework: Vite.
- Install: `npm ci --prefix prototypes/festronix-visual`.
- Build: `npm run build --prefix prototypes/festronix-visual`.
- Published output: `prototypes/festronix-visual/dist`.
- No environment variables are required for the current visual preview.

Only frontend build output is served. The existing backend/database are not configured or deployed by these settings. Google/email entry points remain explicit unconfigured previews, and sample registrations/payments are not accepted. Campus is the default; Pulse, Panel and Flux remain selectable through the existing query parameters and prototype controls.

## Completion checks after sign-in

1. Inspect existing Vercel projects before creating a duplicate. Import/connect this repository if needed.
2. Use the prepared root configuration and request project name `festronix2k27`. If unavailable, choose a clearly related available name and record the actual URL.
3. Deploy `main`; confirm the remote build is Ready and the production alias is assigned.
4. Open the actual live URL, inspect desktop/mobile Campus, switch themes, and check login feedback and browser errors. Record the deployed commit and real URL here.

Configuration follows Vercel's [project configuration](https://vercel.com/docs/project-configuration) and [Vite guidance](https://vercel.com/docs/frameworks/frontend/vite). A successful local build is not evidence of a completed Vercel deployment.
