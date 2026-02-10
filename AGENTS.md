# AGENTS.md

Project instructions for coding agents in `/Users/mikecebul/Code/website`.

## Core Rules

- Keep changes minimal, typed, and aligned with existing patterns.
- Prefer editing existing modules over adding new abstractions.
- Treat `src/payload.config.ts` as the CMS/runtime source of truth.
- Run relevant validation before handoff:
  - `pnpm run typecheck`
  - `pnpm run lint`
  - `pnpm run generate:types` when schema or Payload config changes
  - `pnpm run generate:importmap` after adding or updating custom payload components


## Architecture Anchors

- Frontend routes: `src/app/(frontend)/`
- Payload admin/API routes: `src/app/(payload)/`
- Collections: `src/collections/`
- Globals: `src/globals/`
- Blocks: `src/blocks/`
- Form runtime logic: `src/forms/`
- Shared components: `src/components/`

## Progressive Discovery

Read only what is needed for the task, in this order:

1. `README.md` for product and deployment context.
2. `CLAUDE.md` for project workflow and conventions.
3. `package.json` for active scripts and tooling.
4. `src/payload.config.ts` for CMS/plugins/runtime behavior.
5. `src/forms/` for form runtime behavior and field rendering.
6. Relevant feature module (collection/block/global/component) being edited.

External reference:

- [TanStack Form (React) docs](https://github.com/TanStack/form/blob/main/docs/framework/react/reference/index.md)

## High-Value Project Notes

- Env var for database is `DATABASE_URI`.
- Build runs migrations; treat build failures as possible migration/config issues.
- Revalidation hooks are part of content freshness; preserve them unless intentionally changing cache behavior.
