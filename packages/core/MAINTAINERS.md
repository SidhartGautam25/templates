# Shared Core Package

This directory contains code shared across all website templates (auth, leads API, storage, admin shell pieces, Docker config, etc.).

**Do not edit generated template folders directly** for shared code. Edit here, then run:

```bash
pnpm sync-templates
```

## Maintainer daily loop

```bash
# 1. Edit packages/core OR templates/overlays/<template>/
# 2. Sync merged output
pnpm sync-templates

# 3. Run hotel (or real-estate) dev server
pnpm dev:hotel
# pnpm dev:real-estate

# 4. Bump version in templates.json + overlay CHANGELOG.md
# 5. git commit (pre-commit runs sync-templates:check)
```

## Prisma

Shared models (`Lead`, `PromoBanner`) live in `packages/core/prisma/schema.prisma`.

Template-specific models live in overlay `prisma/schema.prisma` only. `pnpm sync-templates` merges them into `templates/<name>/prisma/schema.prisma`.

## Dev-only scripts

FTP test utilities are in `scripts/dev/` — excluded from generated client projects.

## New template

```bash
node scripts/new-template.mjs <id> [directory-name]
pnpm sync-templates
```

## Git hooks

```bash
pnpm setup-hooks   # enables .githooks/pre-commit → sync-templates:check
```

See `ARCHITECTURE.md` in the repo root for the full sync workflow.
