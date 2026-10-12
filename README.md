# MIKECEBUL website

The public consulting website runs on TanStack Start, with shadcn components, TanStack Form, React Email, and Payload CMS `4.0.0-beta.0` with native admin views and a custom studio dashboard and notifications tab.

## Local development

Use Node 24.15.0 or newer and pnpm 11 or newer. Run `pnpm install`, copy `.env.example` to `.env`, and configure email delivery. SQLite defaults to `file:./data/payload.db`; no separate database service is needed. `docker compose up -d` starts Mailpit. Run `pnpm dev` and open http://localhost:3000; the CMS is at `/admin`.

`pnpm typecheck`, `pnpm lint`, and `pnpm test` verify the app. `pnpm build` produces a Nitro Node server; `pnpm start` runs `.output/server/index.mjs`. Builds do not open the SQLite database or run migrations. Database, email, and S3 credentials are supplied at runtime.

Use `pnpm generate:types` and `pnpm generate:importmap` after modifying Payload collections or editor components.

## Admin workspace

The studio dashboard keeps Payload’s native views, dashboard editor and sidebar tabs. Navigation is organized into Content, Business and Settings. The brand uses `public/favicon1.svg` and “mikecebul llc”; the lighthouse asset and generation prompt are in `public/admin/`. Existing dashboard preferences can be updated with Dashboard → Reset Layout.

The Business → Form submissions collection retains the existing `contacts` database collection and records. Valid public contact submissions are saved as unread before attempting React Email delivery. Delivery failures are logged without discarding the inquiry or asking the visitor to resubmit. Anonymous collection reads, writes and inbox actions are denied; editors and administrators can review submissions. The Notifications tab lists the newest 20 unread submissions, refreshes every 30 seconds and on window focus, and supports individual or displayed-batch read actions. Read status is shared across the staff team. Older records without a read flag count as unread. All submissions remain available in the collection, where the Read checkbox can also be cleared.

## Migration notes

The app was scaffolded with `pnpm dlx shadcn@latest init --name website-start --template start --preset nova --base base --no-monorepo --yes`, followed by `pnpm dlx create-payload-app@canary --use-pnpm --no-agent` inside that scaffold, selecting MongoDB. The public pages, CSS, content, shadcn component sources, drawer, and contact form were transferred from `origin/main`. Payload packages were subsequently upgraded together to `4.0.0-beta.0`.

The public routes retain main’s latest `/websites` and `/hybrid-meeting-solutions` pages and the permanent redirects from `/services` and the older case-study URLs. Blogs load through server functions with access control, publication filtering, and pagination. Authenticated previews retain `/next/preview` and `/next/exit-preview`; a preview cookie alone never grants draft access. The login screen uses the Payload SDK. The public signup screen retains main’s account-access request page; it does not enable public CMS registration or GitHub OAuth.

Sentry runs through the React and Node SDKs, the existing tunnel endpoint, and Payload error hooks. The existing diagnostic page and test API remain available. The migration uses the Sentry SDKs directly because the canary plugin's admin provider imported Next.js. CI source-map uploads use the Vite plugin when `CI` and `SENTRY_AUTH_TOKEN` are configured. Umami's public analytics script is retained; the customized admin analytics dashboard was removed with the other admin customizations.

`VITE_SERVER_URL` and `VITE_SENTRY_DSN` are browser build settings. Existing `NEXT_PUBLIC_SERVER_URL` and `NEXT_PUBLIC_SENTRY_DSN` names remain supported to match deployment secrets. The robots and sitemap endpoints respect `VITE_IS_LIVE` or the existing `NEXT_PUBLIC_IS_LIVE` setting.

The app uses Payload’s SQLite adapter with numeric document IDs, WAL mode and a five-second busy timeout. Collection configuration, roles, access checks, S3 configuration and React Email templates are retained. This is a fresh database switch: MongoDB records, users and media metadata are not imported. Existing MongoDB volumes and S3 objects are not deleted. Create a new first admin account after cutover. V4 uses built-in slug fields, storage adapters, the Sharp upload transformer, history and authorship.

Nitro explicitly traces `strtok3` because `file-type` imports it dynamically when serving uploaded media. Keep this runtime dependency in the standalone server output.

The framework migration was originally checked with the production Node server and an isolated local MongoDB database; the current SQLite adapter has its own isolated production-schema fixture suite. Checks cover public routes and metadata, first-user setup and public login, published/draft access, authenticated previews, pagination, HTTP redirects and 404s, and media uploads. Contact submission was tested in development against Mailpit, including the saved inquiry, rendered React Email, and thank-you screen. Desktop screenshots of the homepage and website case study were compared with `origin/main`; mobile drawer navigation was exercised in Chromium.

## Migration guide review

Reviewed against the [v4 migration guide](https://payloadcms.com/docs/beta/migration-guide/v4) and the installed beta packages.

| Area                      | Repository handling                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime and framework     | Node 24.15+, TypeScript 6.0.3+, TanStack adapter, default admin CSS.                                                                                                               |
| Local API and query depth | Trusted role/contact operations explicitly bypass access; public reads enforce access and publication status. Blog queries retain depth 1.                                         |
| Versions and authorship   | V4 history is enabled for Blogs, Media, and Contacts. Authorship tracks creators and editors across all four collections. Users disable versions per the auth-collection guidance. |
| Version access            | Blog and Media histories require authentication. Contact history inherits its staff-only read rule.                                                                                |
| API keys                  | Removed the obsolete enable checkbox. Existing super-admin mutation permissions remain; v4 supplies last-four display and redaction.                                               |
| Stored media              | Fresh SQLite schema uses v4 variants. S3 configuration is retained; old object files are not imported or deleted.                                                    |
| Upload processing         | Sharp transformer owns resizing and variants; request-time transforms remain disabled.                                                                                             |
| Lexical and types         | Existing editor features and blocks retained; strict generated types refreshed.                                                                                                    |
| Other guide sections      | No custom jobs, globals, localization, schema generators, MCP, ecommerce, or affected plugin callbacks are configured.                                                             |

## SQLite deployment and nightly backups

Use one application replica on one Dokploy server. Set `DATABASE_URI=file:/app/data/payload.db` in the website application's **runtime** environment. The image runs as UID/GID 1001 and prepares `/app/data` with that ownership. Add a Docker **named volume** mounted at `/app/data` under Advanced → Volumes. Never store the live DB in the disposable container layer. Deploy with stop-first ordering rather than briefly starting a second replica during updates.

Production startup runs the committed `prodMigrations` through Payload, applying the initial schema on an empty volume and recording completed migrations. Later startups reuse the existing schema and data. Development uses Payload's automatic schema push. For future collection changes, generate and commit a SQL migration and its JSON snapshot with `pnpm payload migrate:create <name>`; never generate migrations against the live database.

Dokploy's [Volume Backups](https://docs.dokploy.com/docs/core/volume-backups) support application named volumes and existing S3 destinations. Recommended setup:

1. Add a backup for the website's `/app/data` named volume.
2. Choose the existing S3 backup destination and a prefix such as `mikecebul/website/sqlite`.
3. Set a nightly schedule (for example `0 3 * * *`, 03:00 in the scheduler's timezone; confirm that timezone in Dokploy).
4. Enable **Turn off Container**. Dokploy recommends this for SQLite consistency; the website is unavailable briefly while the backup runs.
5. Test a backup and restore it to a new, unused volume before relying on the schedule. Keep the original volume while testing. Check the restored database with `sqlite3 /app/data/payload.db 'PRAGMA integrity_check;'`, expecting `ok`, then check admin login and submissions.

Copying a live SQLite file directly is not a safe backup strategy, especially with WAL. If uninterrupted service becomes necessary, use SQLite's online backup API or `sqlite3 .backup` in a scheduled snapshot job, then upload the completed snapshot. [SQLite backup documentation](https://sqlite.org/backup.html)

Database backups include users, forms, blog content and media metadata. Uploaded files stored in S3 require their own retention/versioning policy. When S3 is disabled, mount and back up `/app/public/media` separately. Database files and journals are excluded from Git and Docker build context.

The fixture check runs only against a disposable local SQLite file and exercises the production migration, first-user roles, submissions/read status, private history, authorship/spoof protection, JWT compatibility and API-key authentication/redaction/revocation:

```sh
DATABASE_URI=file:/tmp/website-sqlite-fixture-local.db \
NODE_ENV=production PAYLOAD_SECRET=isolated-fixture-secret \
S3_ENABLED=false RESEND_API_KEY=local-test-only pnpm test:database
```

The file-path guard prevents this command from targeting the live database. Fixture records are removed afterwards. It does not contact external email/storage services.
