# Deployment and backups

### Environment configuration

Use `SERVER_URL` and `SENTRY_DSN` at build time and runtime. Vite explicitly maps those public values to `import.meta.env.VITE_SERVER_URL` and `import.meta.env.VITE_SENTRY_DSN` for browser code. You do not need separate Vite-prefixed deployment entries. Credentials such as `SENTRY_AUTH_TOKEN`, `PAYLOAD_SECRET`, and S3 access keys remain server/build secrets.

`IS_LIVE` controls robots, sitemap publication, and indexing headers at runtime. Set it to `true` for production and `false` for development/staging. `S3_HOSTNAME` and `UPLOAD_PREFIX` are read by Payload at runtime; they do not need a browser prefix or GitHub build entries.

Migrate the existing deployment settings before building this version:

| Previous name               | New name        | Where to configure                           |
| --------------------------- | --------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SERVER_URL`    | `SERVER_URL`    | GitHub Production secret and Dokploy runtime |
| `NEXT_PUBLIC_SENTRY_DSN`    | `SENTRY_DSN`    | GitHub Production secret and Dokploy runtime |
| `NEXT_PUBLIC_IS_LIVE`       | `IS_LIVE`       | Dokploy runtime only                         |
| `NEXT_PUBLIC_S3_HOSTNAME`   | `S3_HOSTNAME`   | Dokploy runtime only                         |
| `NEXT_PUBLIC_UPLOAD_PREFIX` | `UPLOAD_PREFIX` | Dokploy runtime only                         |

Copy the previous values into the new entries; use the new Sentry Cloud DSN. Legacy names are no longer read. Remove the old entries after deploying this version. GitHub no longer uses `DATABASE_URI` or `PAYLOAD_SECRET` during the image build; keep both configured in Dokploy. Keep `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` as repository secrets; the deployment job can read them alongside Production environment secrets. GitHub secrets cannot be read back, so re-enter their values from Dokploy or your password manager when creating the replacement entries.

### Sentry Cloud setup

In Sentry, open **Settings → Projects → your project → Client Keys (DSN)** and copy the DSN. Use the same value for the browser build and runtime tunnel. `SENTRY_DSN` is used for both the browser build and runtime server. The browser DSN is embedded during the build, so changing it requires rebuilding the Docker image.

In GitHub **Settings → Environments → Production**, configure these entries alongside the `SERVER_URL` secret described above:

| Type               | Name                | Value                                            |
| ------------------ | ------------------- | ------------------------------------------------ |
| Secret             | `SENTRY_DSN`        | The new project's DSN                            |
| Secret             | `SENTRY_AUTH_TOKEN` | A Sentry upload token (organization or personal) |
| Variable           | `SENTRY_ORG`        | Organization slug from the Sentry settings URL   |
| Variable           | `SENTRY_PROJECT`    | Project slug from the Sentry settings URL        |
| Variable, optional | `SENTRY_URL`        | `https://sentry.io` (the default)                |

Create the upload token in Sentry **Settings → Organization → Auth Tokens** using the source-map/CI upload permission (`org:ci`). A personal token also works with Project **Read & Write**, Release **Admin**, and Organization **Read** permissions. Keep it in GitHub secrets; the Docker builder receives it through a BuildKit secret mount and the running app does not require it. Uploads run in CI when the token is configured, and the build requires organization and project slugs alongside it. The deployment workflow validates these settings before publishing an image. Pull-request builds do not need these credentials.

In Dokploy's application runtime environment, set `SENTRY_DSN` to the same new DSN and `SENTRY_ENVIRONMENT=production`. Replace any existing GlitchTip DSN. GitHub's build secrets do not automatically populate the running container. The production image builds browser events with the `production` environment label.

After rebuilding and deploying, visit `/sentry-example-page` and click **Throw Sample Error**. Confirm both `SentryExampleFrontendError` and `SentryExampleAPIError` appear in the new project's Issues page with environment `production`. Confirm the frontend stack trace resolves to the original TSX source, and check the project's **Source Maps** settings for uploaded artifacts. The page checks configuration only; Sentry's Issues page confirms delivery. Locally, set the DSN in `.env` and restart the dev server; development builds do not upload source maps.

The app uses Payload’s SQLite adapter with numeric document IDs, WAL mode and a five-second busy timeout. Collection configuration, roles, access checks, S3 configuration and React Email templates are retained. This is a fresh database switch: MongoDB records, users and media metadata are not imported. Existing MongoDB volumes and S3 objects are not deleted. Create a new first admin account after cutover. V4 uses built-in slug fields, storage adapters, the Sharp upload transformer, history and authorship.

Nitro explicitly traces `strtok3` because `file-type` imports it dynamically when serving uploaded media. Keep this runtime dependency in the standalone server output.

The framework migration was originally checked with the production Node server and an isolated local MongoDB database; the current SQLite adapter has its own isolated production-schema fixture suite. Checks cover public routes and metadata, first-user setup and public login, published/draft access, authenticated previews, pagination, HTTP redirects and 404s, and media uploads. Contact submission was tested in development against Mailpit, including the saved inquiry, rendered React Email, and thank-you screen. Desktop screenshots of the homepage and website case study were compared with `origin/main`; mobile drawer navigation was exercised in Chromium.

## SQLite deployment and nightly backups

Use one application replica on one Dokploy server. Set `DATABASE_URI=file:/app/data/payload.db` in the website application's **runtime** environment. The image runs as UID/GID 1001 and prepares `/app/data` with that ownership. Add a Docker **named volume** mounted at `/app/data` under Advanced → Volumes. Never store the live DB in the disposable container layer. Deploy with stop-first ordering rather than briefly starting a second replica during updates.

When Payload first initializes and connects to SQLite in production, it runs the committed `prodMigrations`, applying the initial schema on an empty volume and recording completed migrations. Later startups reuse the existing schema and data. Development uses Payload's automatic schema push. For future collection changes, generate and commit a SQL migration and its JSON snapshot with `pnpm payload migrate:create <name>`; never generate migrations against the live database.

Live backups run `sh /app/scripts/backup-sqlite.sh` as a Dokploy **Application Schedule**, with Shell Type **Sh**, timezone **America/Detroit** and nightly cron `0 3 * * *`. The image includes SQLite, rclone and flock. No application shutdown is needed. Keep the previously prepared stop-container Volume Backup disabled.

Add only `BACKUP_DESTINATION=s3://your-private-backup-bucket/mikecebul/website/sqlite` to the website's runtime environment. The script reuses `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION` and `S3_ENDPOINT`, translating them into temporary rclone environment settings. Existing keys must allow object writes and reads in that bucket/prefix. If the media key is restricted, set both `BACKUP_S3_ACCESS_KEY_ID` and `BACKUP_S3_SECRET_ACCESS_KEY`; the endpoint and region remain shared. A partial override is rejected rather than mixing keys. Dokploy's S3 destination name is not necessarily the actual bucket name. Never use a publicly readable media bucket for database snapshots; an object ACL cannot override a public bucket policy.

The script checks the source file, prevents overlapping executions with an OS lock, uses SQLite's online `.backup` API, validates the snapshot, compresses it, retries uploads and downloads the uploaded object to compare bytes. A failed snapshot/upload/verification exits nonzero for Dokploy logs. Temporary files are removed on exit. Credentials are not written to configuration files or passed as command arguments. Uploads use private ACLs. [SQLite online backup documentation](https://sqlite.org/backup.html), [rclone S3 documentation](https://rclone.org/s3/).

Use the backup bucket's lifecycle configuration to expire this dedicated prefix after 30 days; the job does not delete remote objects. Test manually before enabling the schedule. Restore a downloaded snapshot into a separate SQLite file, run `PRAGMA integrity_check;` expecting `ok`, and verify admin login and submissions. For a production restore, stop the application and restore onto an unused named volume rather than overwriting an open database or leaving old WAL files next to the restored file.

For local use, `pnpm backup` runs the same script. It reads the process environment rather than sourcing `.env` automatically; load local test variables explicitly. The standalone container runs the script directly and does not require pnpm or the repository package.json.

Database backups include users, forms, blog content and media metadata. Uploaded files stored in S3 require their own retention/versioning policy. When S3 is disabled, mount and back up `/app/public/media` separately. Database files and journals are excluded from Git and Docker build context.

The fixture check runs only against a disposable local SQLite file and exercises the production migration, first-user roles, submissions/read status, private history, authorship/spoof protection, JWT compatibility, API-key authentication/redaction/revocation, and MCP schema discovery, draft editing and access control:

```sh
DATABASE_URI=file:/tmp/website-sqlite-fixture-local.db \
NODE_ENV=production PAYLOAD_SECRET=isolated-fixture-secret \
S3_ENABLED=false RESEND_API_KEY=local-test-only pnpm test:database
```

The file-path guard prevents this command from targeting the live database. Fixture records are removed afterwards. It does not contact external email/storage services.
