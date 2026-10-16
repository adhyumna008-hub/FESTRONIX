# Vercel visual-preview deployment

## Status — 2026-10-16

**LIVE — READY.** After connecting the Vercel plugin, the owner explicitly renewed publishing authorization with “yes.” Deployed the GitHub `main` commit containing the recovered original glass X. No browser login was needed for deployment through the connected plugin.

## Deploy result

- URL: https://festronix2k27.vercel.app/
- Target: production.
- Status: READY; production domain verified on the project and live page opened successfully without Vercel sign-in.
- Commit: `a7d9ea2c8640062c24d4a35aeeafeeaab70efd04`.
- Framework: Vite, Node.js 24.x.
- Remote build duration: approximately 37.4 seconds from reported building/ready timestamps.
- Project: `festronix2k27` / `prj_WiMAMhuc87fnn8YTdxiNazH2rQs9`.
- Deployment: `dpl_3TY934pA2LTqyAgSJ1y3b46WoGCa`.
- Account scope: `adhyumna008-6507s-projects` / `team_wZxBwK5enW11S4NK4ml8du2T`.
- Deployment URL: https://festronix2k27-g6ef1i6g1-adhyumna008-6507s-projects.vercel.app/ (deployment protection may apply).
- Secondary verified project domain: `festronix-2k27.vercel.app`. Added while the primary alias was being assigned; primary alias was subsequently confirmed on the ready deployment and publicly verified.

## Live verification and observability

Opened the public production hostname in a fresh browser tab. Campus renders the restored glass X with its 9-second float, institution images, shared sample content and header login. Inspected desktop 1440×900 and phone 390×844 screenshots; no horizontal overflow. Institution images loaded. Opened and closed login: account services correctly remain unconnected. Exercised the visible theme controls through Pulse, Panel, Flux and Campus; legacy theme modules loaded and each reported no horizontal overflow. This was a deployment smoke check, not a new exhaustive WebGL or accessibility audit.

- Browser error scan: no errors or warnings returned during this check.
- Platform build logs: unavailable through the current connection; the events endpoint returned a scope permission error. Explicit team-scoped reads also returned 403, while default-context project/deployment/domain reads and publishing succeeded. No CLI credentials were available, and permissions/protection were not weakened.
- Drains/production monitoring: not configured or audited in this deployment task. This static visual preview has no connected application backend.
- Screenshots: `output/vercel-deployment/campus-desktop.png`, `campus-phone.png` (ignored local QA output).
- Rollback: the release is pinned above. For a future replacement, inspect the intended project and ready deployment before any authorized rollback/promotion. No earlier FESTRONIX production deployment existed in this project.

## Prepared configuration

- Repository: `https://github.com/adhyumna008-hub/FESTRONIX`
- Production branch: `main`
- Project name: `festronix2k27`.
- Import with **Root Directory set to the repository root (`./`)**. The root `vercel.json` handles the nested frontend automatically.
- Framework: Vite.
- Install: `npm ci --prefix prototypes/festronix-visual`.
- Build: `npm run build --prefix prototypes/festronix-visual`.
- Published output: `prototypes/festronix-visual/dist`.
- No environment variables are required for the current visual preview.

Only frontend build output is served. The existing backend/database are not configured or deployed by these settings. Google/email entry points remain explicit unconfigured previews, and sample registrations/payments are not accepted. Campus is the default; Pulse, Panel and Flux remain selectable through the existing query parameters and prototype controls.

## Subsequent changes

The project was created with the existing GitHub repository and deployed from its `main` commit. Automatic deployment on a subsequent Git push has not been exercised by this task. Deployment-result documentation is saved locally after the release; the running website remains the pinned commit above.

Configuration follows Vercel's [project configuration](https://vercel.com/docs/project-configuration) and [Vite guidance](https://vercel.com/docs/frameworks/frontend/vite). A successful local build is not evidence of a completed Vercel deployment.
