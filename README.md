# FESTRONIX

A reusable annual technology-festival platform for Vardhaman College of Engineering.

## Visual preview

The local React/TypeScript prototype offers **Pulse, Panel, Flux and Campus** presentations backed by the same sample festival data. Campus includes an animated optical X and flat club symbols. Flux A uses flat club symbols; B/C retain their separate scene experiments. The old 3D Club Gallery is inactive.

```sh
cd prototypes/festronix-visual
npm ci
npm run dev
```

Open `http://127.0.0.1:4180/`. Use **Prototype controls** to compare themes. A specific version can be opened with `?theme=Pulse`, `?theme=Panel`, `?theme=Flux` or `?theme=Campus`.

Every theme provides login entry points and registration sign-in prompts. **Real frontend authentication and registration are not connected yet.** Google/email controls explain the pending setup and do not create accounts, accept money or store a mock login. Event content and dates are fictional. Reduced motion preserves readable content and working controls.

```sh
npm run build
```

This checks TypeScript and creates the preview build. Build output and dependencies are ignored by Git.

## Vercel preview hosting

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
