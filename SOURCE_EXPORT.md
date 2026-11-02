# Source export notes

This source snapshot preserves the real Board.Dev frontend structure, API/authentication wiring, stores, components, styles and tests. No new application behavior or replacement UI was introduced. The original manifest and lockfile are unchanged.

The private GitLab CI file is excluded. `env.example` contains localhost-only defaults. The support/home links, role-description link and embedded corporate account value are placeholders. The existing logo component uses a neutral placeholder image. Technical field names—including client-specific API field names—are retained to avoid altering the backend contract.

Validation performed on this local copy:

- `yarn install --frozen-lockfile --ignore-scripts --non-interactive`: passed.
- `yarn test --runInBand`: **52 tests passed in 14 suites**.
- `yarn build`: TypeScript and Vite production build passed.

Checks used Node 24.22.1 and Yarn 1.22.22. The original `.nvmrc` (20.13.0) and `packageManager` (Yarn 1.22.21) remain unchanged; the originally pinned runtime was not separately verified. The existing dependency tree emits peer-dependency warnings; build output includes Sass deprecation and large-bundle warnings. Dependencies were not upgraded.

Authenticated browser workflows, backend integration and deployment were not exercised. A compatible API and local accounts are required. This is an exported application source snapshot, not a hosted service.

No Git history, original CI or environment credentials are included. Source attribution is retained and no new license is added. The fresh export history represents this source snapshot, not the original development history.
