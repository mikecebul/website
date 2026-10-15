# Purpose

This is my local consulting business website. I build websites, help businesses automate workflows with AI, and install hybrid meeting solutions such as Zoom Rooms. The main goals are local visibility and contact form submissions.

# Project rules

- Use TanStack Form for forms and follow its validation and accessibility practices.
- Use shadcn components whenever possible. Form fields use shadcn Field components.
- Use React Email for emails.
- Keep README.md short and useful to a human getting started.
- Put codebase management information in CODEBASE.md and visual conventions in DESIGN_SYSTEM.md. Link detailed procedures from those guides as needed.

# Read when relevant

Start with this file, then open the guide needed for the task:

- [CODEBASE.md](CODEBASE.md) — local setup, worktrees from origin/main, usable `.env` and SQLite databases, source map, checks, dependencies, and migrations. Read before changing code or repository tooling.
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — tokens, typography, shared components, forms, responsive behavior, admin, and email styling. Read before changing the UI.
- [Content and CMS](docs/CMS.md) — authoring, previews, submissions, user profiles, and MCP access.
- [Deployment and backups](docs/DEPLOYMENT.md) — production environment, Sentry, persistent storage, backup and restore.
- [Framework migration reference](docs/FRAMEWORK_MIGRATION.md) — historical context; read only when investigating the migration.

# GitHub CLI

Network access is restricted in the default sandbox. A sandboxed `gh auth status` may incorrectly report an invalid stored keyring token. Before asking the user to authenticate again, rerun `gh auth status -h github.com` with network escalation and treat that result as authoritative. Never print or request the token.
