# Board.Dev — frontend application

The actual React/TypeScript frontend of a platform connecting technology leaders with nonprofit board opportunities. It includes candidate and organization applications, role-aware administration, matching, candidate comparisons, corporate-client configuration and reusable interface components.

The backend is maintained separately and is not publicly available.

Bartosz Kozikowski worked on the frontend as part of the product team and communicated directly with the client. His contributions include application forms and validation, matching views and candidate comparison workflows. This repository preserves the team application's structure; it does not claim sole authorship of the whole product or its backend.

## Source layout

- `src/forms`: application configuration, React Hook Form controls, validation and MobX form state.
- `src/matches`: match lists, details and comparisons.
- `src/users` and `src/corporateClients`: role-aware user and organization workflows.
- `src/api`, `src/auth`, `src/RootStore.ts`: real API integration, authentication and stores.
- `src/theme`, `src/utils`, `.storybook`: shared UI, utilities, hooks and stories.

React 18, TypeScript, Vite, MobX, Mantine, React Hook Form, Zod, Sass modules, Jest and Testing Library. The original package manifest and Yarn lockfile are retained.

## Local development

Use the Node version in `.nvmrc` and Yarn `1.22.21`:

```sh
yarn install --frozen-lockfile
cp env.example .env.local
yarn dev
```

The frontend opens at `http://localhost:5173`. Configure `VITE_API_BASE_URL` for a compatible locally running Board.Dev API. The example points to localhost; authenticated workflows require the real backend and suitable local accounts. No replacement backend, seeded production database or mock UI is bundled.

```sh
yarn test --runInBand
yarn build
yarn lint
yarn storybook
```

These are the original application commands. Historical dependencies and existing test/build limitations are documented in `SOURCE_EXPORT.md`; this source snapshot is not a claim of a production-ready deployment.

## Portfolio export

This export keeps the original application, components and tests. Private CI configuration is excluded. Client contact links, the embedded corporate account identifier and the logo image are replaced with inert example values or a neutral image. Technical field names and API contracts are preserved. No Git history, credentials, database export or production environment is included.

Original and third-party attribution is retained. No new license is asserted by this snapshot. Published as a sanitized source snapshot with a fresh export history.
