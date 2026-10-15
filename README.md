# MIKECEBUL website

The website for my local consulting business: websites, AI workflow automation, and hybrid meeting rooms. It helps potential clients learn about my work and get in touch.

## Run it locally

Install Node 24.15+ and pnpm 11+. Docker is used for the local email inbox; SQLite runs inside the app.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
docker compose up -d
pnpm dev
```

Open the [website](http://localhost:3000), [admin](http://localhost:3000/admin), or [local email inbox](http://localhost:8025).

The setup command creates a private `.env` with local defaults. On first startup, the app creates its database, sample blog posts, and a development admin account. Existing `.env` files are left alone; see [local setup](CODEBASE.md#local-environment) if you already have one.

## Working on the site

- [Start a worktree from origin/main](CODEBASE.md#worktrees-from-originmain), with its own environment and database.
- [Codebase guide](CODEBASE.md): structure, commands, dependencies, database changes, and [production preview](CODEBASE.md#previewing-the-production-build-locally).
- [Design system](DESIGN_SYSTEM.md): colors, typography, components, and responsive layouts.
- [Manage content](docs/CMS.md): blog authoring, previews, submissions, and agent access.
- [Deploy and back up](docs/DEPLOYMENT.md): production settings, Sentry, and SQLite backups.

[AGENTS.md](AGENTS.md) is the starting point for coding agents.
