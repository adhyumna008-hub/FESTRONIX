# FESTRONIX

A reusable annual technology-festival platform for Vardhaman College of Engineering.

## Visual preview

The local React/TypeScript prototype offers **Pulse, Panel, Flux and Campus** presentations backed by the same sample festival data. Campus retains its animated optical X; technical-track artwork now covers game development, software, AI/data, robotics/electronics and cybersecurity. Flux A uses flat technical symbols; B/C retain their scene experiments. The old 3D Club Gallery is inactive.

```sh
cd prototypes/festronix-visual
npm ci
npm run dev
```

Open `http://127.0.0.1:4180/`. Use **Prototype controls** to compare themes. A specific version can be opened with `?theme=Pulse`, `?theme=Panel`, `?theme=Flux` or `?theme=Campus`.

Every theme provides the same temporary demo sign-in and registration prompts. **Real frontend authentication and registration remain unconnected.** The public demo accounts below operate only on fictional browser-local data; they never authenticate against Firebase or the backend. Reduced motion preserves readable content and working controls.

### Interactive operational previews

- `/?view=events` — searchable technical events with Details/Register actions.
- `/?view=schedule` — event times, venues and links to the event directory.
- `/?view=help` — visit information, faculty contact and FAQs.
- `/?view=participant` — fictional registration, manual-proof status, demo QR, results/appeal and past editions.
- `/?view=coordinator` — two-event quota, owned-event drafts/review, roster/payments, event helpers, check-in and provisional results.
- `/?view=admin` — edition/CMS/theme, staff, approvals, event archives, safe yearly rollover and faculty closeout.

Add `&theme=Campus|Pulse|Panel|Flux` to compare the same workspace/data. Changes persist **only in that browser's local storage** and synchronize between tabs on the same origin, not between devices. Use fictional information only; demo QR codes are not valid admission. Admin can reset the sample dataset. See [scope and permissions](docs/PLATFORM_UI_SCOPE.md) and the [current test guide and limitations](docs/EVENTS_DEMO_QA.md).

| Username | Password | Initial demo role |
|---|---|---|
| admin | admin123 | Institutional admin |
| user1 | user1 | Participant |
| user2 | user2 | Second participant |
| user3 | user3 | Quantum / Signal coordinator |
| user4 | user4 | RoboRumble / Circuit coordinator |
| user5 | user5 | Quantum check-in helper |
| user6 | user6 | RoboRumble check-in helper |

The default current edition is **2026 / 2K26**. Admin settings include editable edition presets through **2030**; choosing a future year opens its settings and preview. Annual activation is explicit and preserves previous records.

Confirmed entries expose one unique QR per member. Assigned staff scan individual passes; reports update individual attendance. Coordinators download their event's `.xlsx`; admin downloads individual events or all events with a consolidated attendee sheet. Exported files exclude QR credentials and payment evidence. New staff records illustrate assignment but do not automatically create additional login credentials.

```sh
npm run build
npm test
```

These check TypeScript, create the preview build and run the demo behavior/report tests. Build output and dependencies are ignored by Git. Core workflow checks and repairs are recorded in [the functional QA report](docs/FUNCTIONAL_QA_2026-10-18.md). All 32 automated tests passed; phone/native desktop browser checks passed with larger screenshot and physical-device limits documented there.

## Vercel preview hosting

Live preview URL: **https://festronix2k27.vercel.app/**. GitHub `main` is linked to Vercel automatic deployment; verify the matching READY commit before assuming an update is live. Real login, registration and payments remain unconnected.

Import this repository into Vercel with Root Directory `./`. The root `vercel.json` builds the nested visual prototype and publishes its `dist` folder. Preferred project name: `festronix2k27`, subject to availability. See [deployment status and settings](docs/VERCEL_DEPLOYMENT.md). This publishes the visual preview only; account services and the backend remain unconnected.

## Backend foundation

`backend/` contains the Fastify/TypeScript API, PostgreSQL migrations and Firebase Admin identity verification, scoped roles, event approvals, manual-payment review, QR tickets and individual attendance. The documented local integration suite has 58 passing checks. Genuine Firebase, database/TLS and private storage configuration are required before live use.

Start with [backend setup](docs/BACKEND_SETUP.md) and [architecture](docs/BACKEND_ARCHITECTURE.md). Secrets, local proof files and development databases are ignored; never publish them. The visual prototype is currently independent of this backend.

## Project record

- [Current handoff](docs/AI_HANDOFF.md)
- [Product specification](docs/PRODUCT_SPEC.md)
- [Owner decisions](docs/OWNER_DECISIONS.md)
- [Visual blueprint](docs/LANDING_PAGE_BLUEPRINT.md)
- [Asset provenance](docs/ASSET_MANIFEST.md)

Reference images and past experiments are research/history, not permission to copy third-party artwork. College approval, final brand choices and production operating policies remain separate from the local prototype.
