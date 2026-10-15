# Framework migration reference

Historical context for the move from Next.js/MongoDB to TanStack Start/SQLite. For current commands and versions, use [CODEBASE.md](../CODEBASE.md) and package.json.

## Migration notes

The app was scaffolded with `pnpm dlx shadcn@latest init --name website-start --template start --preset nova --base base --no-monorepo --yes`, followed by `pnpm dlx create-payload-app@canary --use-pnpm --no-agent` inside that scaffold, selecting MongoDB. The public pages, CSS, content, shadcn component sources, drawer, and contact form were transferred from `origin/main`. Payload packages were subsequently upgraded together to `4.0.0-beta.0`.

The public routes retain main’s latest `/websites` and `/hybrid-meeting-solutions` pages and the permanent redirects from `/services` and the older case-study URLs. Blogs load through server functions with access control, publication filtering, and pagination. Authenticated previews retain `/next/preview` and `/next/exit-preview`; a preview cookie alone never grants draft access. The login screen uses the Payload SDK. The public signup screen retains main’s account-access request page; it does not enable public CMS registration or GitHub OAuth.

Sentry runs through the React and Node SDKs, the existing tunnel endpoint, and Payload error hooks. The existing diagnostic page and test API remain available. The migration uses the Sentry SDKs directly because the canary plugin's admin provider imported Next.js. CI source-map uploads use the Vite plugin when `CI` and `SENTRY_AUTH_TOKEN` are configured. Umami's public analytics script is retained; the customized admin analytics dashboard was removed with the other admin customizations.

## Migration guide review

Reviewed against the [v4 migration guide](https://payloadcms.com/docs/beta/migration-guide/v4) and the installed beta packages.

| Area                      | Repository handling                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime and framework     | Node 24.15+, TypeScript 6.0.3+, TanStack adapter, default admin CSS.                                                                                                               |
| Local API and query depth | Trusted role/contact operations explicitly bypass access; public reads enforce access and publication status. Blog queries retain depth 1.                                         |
| Versions and authorship   | V4 history is enabled for Blogs, Media, and Contacts. Authorship tracks creators and editors across all four collections. Users disable versions per the auth-collection guidance. |
| Version access            | Blog and Media histories require authentication. Contact history inherits its staff-only read rule.                                                                                |
| API keys                  | Removed the obsolete enable checkbox. Existing super-admin mutation permissions remain; v4 supplies last-four display and redaction.                                               |
| Stored media              | Fresh SQLite schema uses v4 variants. S3 configuration is retained; old object files are not imported or deleted.                                                                  |
| Upload processing         | Sharp transformer owns resizing and variants; request-time transforms remain disabled.                                                                                             |
| Lexical and types         | Existing editor features and blocks retained; strict generated types refreshed.                                                                                                    |
| MCP                       | Official v4 MCP plugin, standard tools, user API-key authentication and existing collection/field access rules.                                                                    |
| Other guide sections      | No custom jobs, globals, localization, schema generators, ecommerce, or affected plugin callbacks are configured.                                                                  |
