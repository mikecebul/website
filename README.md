# MIKECEBUL website

The public consulting website runs on TanStack Start, with shadcn components, TanStack Form, React Email, and Payload CMS `4.0.0-beta.0` with native admin views and a custom studio dashboard and notifications tab.

## Local development

Use Node 24.15.0 or newer and pnpm 11 or newer. Run `pnpm install`, copy `.env.example` to `.env`, and configure MongoDB and email delivery. `docker compose up -d` starts the existing MongoDB and Mailpit services. Run `pnpm dev` and open http://localhost:3000; the CMS is at `/admin`.

`pnpm typecheck`, `pnpm lint`, and `pnpm test` verify the app. `pnpm build` produces a Nitro Node server; `pnpm start` runs `.output/server/index.mjs`. Builds do not connect to MongoDB or run database migrations. Database, email, and S3 credentials are supplied at runtime.

Use `pnpm generate:types` and `pnpm generate:importmap` after modifying Payload collections or editor components.

## Admin workspace

The studio dashboard keeps Payload’s native views, dashboard editor and sidebar tabs. Navigation is organized into Content, Business and Settings. The brand uses `public/favicon1.svg` and “mikecebul llc”; the lighthouse asset and generation prompt are in `public/admin/`. Existing dashboard preferences can be updated with Dashboard → Reset Layout.

The Business → Form submissions collection retains the existing `contacts` database collection and records. Valid public contact submissions are saved as unread before attempting React Email delivery. Delivery failures are logged without discarding the inquiry or asking the visitor to resubmit. Anonymous collection reads, writes and inbox actions are denied; editors and administrators can review submissions. The Notifications tab lists the newest 20 unread submissions, refreshes every 30 seconds and on window focus, and supports individual or displayed-batch read actions. Read status is shared across the staff team. Older records without a read flag count as unread. All submissions remain available in the collection, where the Read checkbox can also be cleared.

## Migration notes

The app was scaffolded with `pnpm dlx shadcn@latest init --name website-start --template start --preset nova --base base --no-monorepo --yes`, followed by `pnpm dlx create-payload-app@canary --use-pnpm --no-agent` inside that scaffold, selecting MongoDB. The public pages, CSS, content, shadcn component sources, drawer, and contact form were transferred from `origin/main`. Payload packages were subsequently upgraded together to `4.0.0-beta.0`.

The public routes retain their existing URLs. Blogs load through server functions with access control, publication filtering, and pagination. Authenticated previews retain `/next/preview` and `/next/exit-preview`; a preview cookie alone never grants draft access. The login screen uses the Payload SDK. The public signup screen remains the existing account-creation template; it does not enable public CMS registration or GitHub OAuth.

Sentry runs through the React and Node SDKs, the existing tunnel endpoint, and Payload error hooks. The existing diagnostic page and test API remain available. The migration uses the Sentry SDKs directly because the canary plugin's admin provider imported Next.js. CI source-map uploads use the Vite plugin when `CI` and `SENTRY_AUTH_TOKEN` are configured. Umami's public analytics script is retained; the customized admin analytics dashboard was removed with the other admin customizations.

`VITE_SERVER_URL` and `VITE_SENTRY_DSN` are browser build settings. Existing `NEXT_PUBLIC_SERVER_URL` and `NEXT_PUBLIC_SENTRY_DSN` names remain supported to match deployment secrets. The robots and sitemap endpoints respect `VITE_IS_LIVE` or the existing `NEXT_PUBLIC_IS_LIVE` setting.

MongoDB collection names, content, roles, access checks, S3 configuration, and email templates are retained. V4 uses built-in slug fields, explicit trusted Local API reads for role invariants, `storage` adapters, and the Sharp upload transformer. New media thumbnails and social variants retain the original dimensions and WebP settings. The official MongoDB `sizes` → `variants` migration is registered in `src/migrations/20261011_213804_v4_media_variants.ts`. It preserves stored variant metadata and updates the corresponding indexes. No database or S3 files are migrated by the build or server startup.

Nitro explicitly traces `strtok3` because `file-type` imports it dynamically when serving uploaded media. Keep this runtime dependency in the standalone server output.

The migration was checked with the production Node server and an isolated local MongoDB database. Checks cover public routes and metadata, first-user setup and public login, published/draft access, authenticated previews, pagination, HTTP redirects and 404s, and media uploads. Contact submission was tested in development against Mailpit, including the saved inquiry, rendered React Email, and thank-you screen. Desktop screenshots of the homepage and website case study were compared with `origin/main`; mobile drawer navigation was exercised in Chromium.

## Migration guide review

Reviewed against the [v4 migration guide](https://payloadcms.com/docs/beta/migration-guide/v4) and the installed beta packages.

| Area                      | Repository handling                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime and framework     | Node 24.15+, TypeScript 6.0.3+, TanStack adapter, default admin CSS.                                                                                                               |
| Local API and query depth | Trusted role/contact operations explicitly bypass access; public reads enforce access and publication status. Blog queries retain depth 1.                                         |
| Versions and authorship   | V4 history is enabled for Blogs, Media, and Contacts. Authorship tracks creators and editors across all four collections. Users disable versions per the auth-collection guidance. |
| Version access            | Blog and Media histories require authentication. Contact history inherits its staff-only read rule.                                                                                |
| API keys                  | Removed the obsolete enable checkbox. Existing super-admin mutation permissions remain; v4 supplies last-four display and redaction.                                               |
| Stored media              | Official predefined migration handles legacy `sizes`, historical variants, and indexes. S3 configuration and URLs are retained.                                                    |
| Upload processing         | Sharp transformer owns resizing and variants; request-time transforms remain disabled.                                                                                             |
| Lexical and types         | Existing editor features and blocks retained; strict generated types refreshed.                                                                                                    |
| Other guide sections      | No custom jobs, globals, localization, schema generators, MCP, ecommerce, or affected plugin callbacks are configured.                                                             |

The configured database currently has no Blog, Media, or Contact records and has two User accounts (checked October 11, 2026). V4 history and authorship defaults are the chosen behavior. Keep the existing user accounts. The media migration remains available if legacy uploads are added or another database is used.

Before deployment, restore a database backup into a separate staging database and run `pnpm payload migrate:status`, then `pnpm payload migrate` using the beta checkout and that database's environment. Verify existing media, credentials, and content there. For the production cutover, back up MongoDB, pause application writes, run the same migration from a repository checkout with production environment variables, and then start the beta application. Run the media migration before v4 writes upload documents. The standalone runtime image does not contain the migration CLI/source checkout.

Tokens without the v4 authentication header must be replaced by a new login. API keys created before v3.46.0 and never re-saved need regeneration. Keep the existing Payload secret so stored key indexes and encrypted values remain usable. API keys are now revoked with `apiKey: null`.

The dedicated fixture check exercises variant metadata/URLs, historical records, index renaming, collision protection, idempotence, rollback, private history, v4 authorship and version tracking, first-user roles, JWT compatibility, and API-key authentication/redaction/revocation:

```sh
DATABASE_URI=mongodb://127.0.0.1:27018/website_v4_migration_fixture \
PAYLOAD_SECRET=local-migration-test-secret S3_ENABLED=false pnpm test:migration
```

This command only accepts the named fixture database on a local host, requires S3 to be disabled, and removes its fixture records afterwards. It does not validate a production database copy or contact external email/storage services.
