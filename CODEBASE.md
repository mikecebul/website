# Codebase guide

## Local environment

Use Node 24.15+ and pnpm 11+. Install dependencies with `pnpm install --frozen-lockfile`.

Run `pnpm setup:local` once in a new checkout. It creates `.env` from `.env.example`, generates Payload and preview secrets, sets local URLs and email settings, and creates `data/`. Payload creates the SQLite schema and sample content when you first run `pnpm dev`. No database server or production credentials are needed.

The script refuses to overwrite an existing `.env`. For an existing checkout, keep your working environment or copy missing settings from `.env.example` manually. Set `CONTACT_TO_EMAIL` to the notification recipient; it has no hardcoded fallback. The example `hello@example.test` address works locally because Mailpit captures development email regardless of the recipient address. Keep `IS_LIVE=false`, `S3_ENABLED=false`, and Sentry credentials blank for local work. The unused Google Maps, Unsplash, and Umami API settings are no longer needed; the public Umami script is configured in the app layout.

`docker compose up -d` starts Mailpit. It captures all development email; view it at `http://localhost:8025`. The app runs without Mailpit, but email delivery will fail. Contact inquiries are still saved in the CMS.

Development initialization creates or restores the Super Admin `mikecebul@gmail.com` with password `password`, enables auto-login, and adds three sample blogs if their slugs are missing. Restarting preserves blog edits, but resets that development account's password and role. Set `DEV_SEED=false` and restart to test normal authentication. Seeding and auto-login never run in production or tests.

`DATABASE_URI=file:./data/payload.db` is resolved from the current checkout. Keep it local to that checkout. `.env`, SQLite files, and local uploads under `public/media/` are ignored by Git. Do not point a development server at a production database.

## Worktrees from origin/main

Run these commands in an existing clone. Replace `my-change` with your task name:

```sh
git fetch origin main
git worktree add -b codex/my-change ../website-my-change origin/main
cd ../website-my-change
pnpm install --frozen-lockfile
pnpm setup:local --port 3010 --mailpit-smtp-port 1035 --mailpit-ui-port 8035
docker compose up -d
pnpm dev
```

Open `http://localhost:3010`, `/admin` on that same port, and Mailpit at `http://localhost:8035`. Choose another unused set of ports for each simultaneous worktree. `DEV_PORT` sets the app port; `SERVER_URL` must match it. Vite fails if the port is busy so URLs and preview cookies stay consistent. `EMAIL_PORT` and `MAILPIT_SMTP_PORT` must match.

The setup command gives each checkout a separate Compose project and Mailpit volume. Each worktree gets its own `node_modules`, `.env`, SQLite database, and local media. Git does not copy these ignored files into a new worktree. In Codex, create the worktree from `origin/main`, then run the install and setup commands in the returned directory.

### Copy an existing local database

To use existing local content instead of starting fresh, add `--copy-db` to the setup command **before the first server start**:

```sh
pnpm setup:local --port 3010 --mailpit-smtp-port 1035 --mailpit-ui-port 8035 \
  --copy-db /absolute/path/to/original-checkout/data/payload.db
```

This uses SQLite's online backup API, including committed WAL data, and refuses to overwrite the destination database or `.env`. Do not copy just an open `.db` file with `cp`. If the source uses local uploads, copy its `public/media/` directory to the new worktree too. The setup script does not copy storage credentials or uploaded files. A database copy contains users and inquiries; use a local development source. Development seeding still applies unless you set `DEV_SEED=false` before startup.

### Finish or revisit a worktree

Stop `pnpm dev` with Ctrl-C. Run `docker compose stop` in that worktree to pause its inbox, or `docker compose down` to remove its containers while retaining the Mailpit volume. `git worktree list` shows all checkouts. Commit and push the changes you want to keep before removing a worktree.

Worktree removal also removes ignored files, including `.env`, SQLite, and local uploads. Save anything needed outside that directory first. From the original clone, run `git worktree remove ../website-my-change`; if Git refuses because of local files, inspect them before deciding what to discard. Avoid `--force` as a routine cleanup step.

## Source map

| Location                           | Responsibility                                                             |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `src/routes/`                      | TanStack file routes, public pages, API handlers, Payload admin/API mounts |
| `src/components/marketing/`        | Public layouts, navigation, contact form, and journal                      |
| `src/components/ui/`               | Local shadcn component sources                                             |
| `src/styles.css`                   | Tailwind and public design tokens/styles                                   |
| `src/lib/website-content.json`     | Shared business copy, services, contact details, portfolio content         |
| `src/server/`                      | CMS queries, previews, contact delivery, development seed                  |
| `src/payload.config.ts`            | Collections, SQLite, editor, storage, email, MCP, admin configuration      |
| `src/collections/`, `src/access/`  | Blogs, Media, Contacts, Users and access rules                             |
| `src/migrations/`                  | Committed production SQLite migrations and snapshots                       |
| `src/emails/`                      | React Email templates and shared shell/theme                               |
| `scripts/`                         | Local setup, database verification, backup tooling                         |
| `vite.config.ts`                   | Payload RSC, TanStack, Tailwind, Nitro, Sentry build integration           |
| `.github/workflows/`, `Dockerfile` | CI checks and production image                                             |

The app uses React 19, TanStack Start/Router/Form, Payload 4 beta, and SQLite. Vite builds a Nitro Node server at `.output/server/index.mjs`. Keep secrets and database access in server code; browser code only receives explicitly mapped public values.

## Commands and checks

| Command                      | Purpose                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm dev`                   | Local development; uses `DEV_PORT` (default 3000)                                                   |
| `pnpm preview`               | Preview the built site with its own `data/preview.db`; first run needs an admin account             |
| `pnpm typecheck`             | TypeScript checks                                                                                   |
| `pnpm lint`                  | ESLint; existing unused-variable warnings may remain                                                |
| `pnpm test`                  | Unit tests, including backup-script fixtures (needs `sqlite3`)                                      |
| `pnpm build` / `pnpm start`  | Build / run the production Node server                                                              |
| `pnpm email:dev`             | Email preview on port 3025; choose `pnpm exec email dev -d src/emails -p 3035` for another worktree |
| `pnpm generate:types`        | Regenerate `src/payload-types.ts` after collection changes                                          |
| `pnpm generate:importmap`    | Regenerate the admin component import map                                                           |
| `pnpm generate-routes`       | Regenerate the TanStack route tree                                                                  |
| `pnpm migrate:create <name>` | Generate a production SQL migration and snapshot                                                    |
| `pnpm test:database`         | Run guarded, disposable production-schema fixtures (environment below)                              |

Run typecheck, lint, tests, and a production build after dependency or framework changes. Run database fixtures for Payload, auth, schema, media, or MCP changes:

```sh
DATABASE_URI="file:/tmp/website-sqlite-fixture-$(date +%s).db" \
NODE_ENV=production PAYLOAD_SECRET=isolated-fixture-secret \
S3_ENABLED=false RESEND_API_KEY=local-test-only pnpm test:database
```

The fixture guard permits only `/tmp/website-sqlite-fixture-*.db`. It checks migrations, roles, submissions, version access, authorship, JWTs, API keys, media, and MCP without sending external email or using S3. Remove the disposable database and its WAL/SHM files afterwards.

To verify development seeding separately:

```sh
dev_seed_db=$(mktemp /tmp/website-dev-seed-XXXXXXXX.db)
DATABASE_URI="file:$dev_seed_db" NODE_ENV=development DEV_SEED=true \
PAYLOAD_SECRET=isolated-dev-fixture-secret S3_ENABLED=false \
pnpm payload run scripts/verify-dev-seed.ts
rm -f "$dev_seed_db" "$dev_seed_db-wal" "$dev_seed_db-shm"
```

### Previewing the production build locally

```sh
pnpm build
pnpm preview
```

Preview uses production code and migrations, with a separate `data/preview.db`. It loads local environment settings but overrides `DATABASE_URI` for the preview process and disables indexing. Your development database and `.env` stay unchanged. The preview database persists between runs. Create its first admin account at `/admin`; development seeding and auto-login are disabled. Email follows the production Resend configuration.

Do not run raw `vite preview` against the development database. Development schema pushes leave a migration marker (`batch = -1`), and production migrations prompt about potential data loss. Cancel that prompt and use `pnpm preview` for an isolated production preview or `pnpm dev` for existing development content. The wrapper also refuses to use a preview database carrying that development marker. If you intentionally ran dev against `data/preview.db`, move that file and its journals aside with the server stopped before creating a new preview database.

Builds do not open SQLite or run migrations. For a local production smoke test, supply runtime variables explicitly (Node does not load `.env` in `pnpm start`), use a separate database, and configure production email with Resend. See [deployment](docs/DEPLOYMENT.md).

## Changing the application

Use `@/` for `src/` imports and `@payload-config` for the CMS config. Update the source definitions and regenerate types/import maps/routes rather than hand-editing generated files.

Keep public blog reads filtered to published content and enforce access with `overrideAccess: false` for operations on behalf of a user. Preview requires an authenticated Editor/Admin/Super Admin as well as the preview secret; a preview cookie alone does not grant draft access. Pass `req` through nested Payload operations in hooks so they share the transaction.

The contact handler validates on the server, stores the inquiry as unread, then attempts React Email delivery. Email failure must not discard the saved inquiry or ask the visitor to submit it again. Staff share read status in the submissions collection and Notifications tab.

SQLite uses WAL mode and a five-second busy timeout. Development automatically pushes schema changes; production applies committed `prodMigrations` on initialization. Generate and commit migrations plus JSON snapshots for schema changes, and test on a disposable database. Never generate a migration against the live database. See [production storage and backups](docs/DEPLOYMENT.md#sqlite-deployment-and-nightly-backups).

## Dependencies

Use pnpm and commit both `package.json` and `pnpm-lock.yaml`. Keep Tailwind and `tw-animate-css` declared once. Tailwind and its Vite plugin belong in devDependencies: the builder needs them, while the running server uses compiled CSS. Build plugins belong in devDependencies; runtime packages belong in dependencies.

- Upgrade `payload` and every retained `@payloadcms/*` package to the same exact beta version. Verify the production schema and admin after an upgrade.
- Keep `graphql` 16 as a Payload peer even though the public GraphQL endpoint is disabled.
- Keep `nitro` in devDependencies. Our Vite config uses it to produce the standalone `.output` server copied by Docker. Payload's blank template instead uses `srvx` with `dist/`; changing to that setup requires a deployment change.
- Keep `esbuild` in devDependencies. The installed Payload adapter explicitly selects esbuild for CSS minification and calls it in its React DOM/RSC workaround. Vite 8 makes esbuild an optional peer; a compatible direct declaration avoids relying on a transitive version.
- Keep `strtok3` and Nitro's `traceDeps` entry: Payload's `file-type` dependency reads binary data through it and hides its Node import from static tracing. Removing both builds successfully but makes standalone media requests fail with `ERR_MODULE_NOT_FOUND`. Verify media against a copy of `.output` in a temporary directory outside the repository, so ancestor `node_modules` cannot mask a missing runtime package.
- `react-email` supplies templates/rendering at runtime; `@react-email/ui` supplies the local preview interface. Keep these at the same exact version; the CLI requires a match. [React Email 6 upgrade guide](https://resend.com/blog/react-email-6).
- Keep the app’s `sharp` version aligned with `@payloadcms/transformer-sharp`’s pinned dependency. The transformer imports its bundled Sharp even when passed our instance; different versions can load conflicting native libvips libraries on macOS.
- The Vite config excludes `lucide-react` from dependency optimization to preserve RSC client boundaries and removes Payload’s unused Azure `events` optimizer entry. Keep Payload’s other optimizer defaults intact.
- Tailwind runs through `@tailwindcss/vite`. There is no second PostCSS pipeline.
- Keep ESLint 9 while `eslint-plugin-jsx-a11y` requires it, and TypeScript 6 while `typescript-eslint` requires `<6.1`. Motion and Vitest major upgrades need their own migration checks.
- Use `pnpm outdated`, inspect peer requirements/release notes, update compatible packages with `pnpm update`, and run the checks above. Removing a direct dependency does not imply it vanishes transitively.

For authoring and CMS operations, read [CMS.md](docs/CMS.md). For environment variables, Sentry, deployment, backups and restore, read [DEPLOYMENT.md](docs/DEPLOYMENT.md). Historical framework decisions are in [FRAMEWORK_MIGRATION.md](docs/FRAMEWORK_MIGRATION.md).
