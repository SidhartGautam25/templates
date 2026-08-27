# packages/core — starter kit (not a runtime dependency)

This folder is a **copy-once boilerplate** for new templates. It contains only generic, reusable pieces:

- Auth (`auth.ts`, NextAuth routes)
- Leads feature (`lib/features/leads`, `/api/leads`)
- Database client (`lib/database/prisma`)
- FTP storage (`lib/storage`)
- Shared UI (`Navbar`, `StickyWidgets`, `PromoBanner`, admin login)
- Health / promo API routes
- Docker, Prisma base models (`Lead`, `PromoBanner`)
- Default `constants/site.ts` stub (customized per template after copy)

**No hotel names, no real-estate names, no template-specific pages.**

## When is this used?

| Action | Uses core? |
|--------|------------|
| `pnpm new-template bakery …` | **Yes** — full copy into `templates/bakery-website-template/` |
| Day-to-day hotel development | **No** — edit `templates/hotel-website-template/` only |
| `pnpm dev:hotel` | **No** — runs the template folder directly |

## Optional: propagate a core bugfix

If you fix a shared bug in `packages/core` and want that fix in **existing** templates:

```bash
pnpm sync-templates              # all templates
pnpm sync-templates --template hotel-website-template   # one template
```

This overwrites core-owned files in the template. Template-only files (`app/page.tsx`, domain features, `constants/site.ts`, etc.) are **not** deleted.

You do **not** need sync for normal template work.

## Maintainer tooling

From monorepo root:

```bash
pnpm template:diff-core hotel       # preview core drift before propagate
pnpm template:validate hotel          # prisma validate + tsc + lint
```

See [MAINTAINERS.md](../../MAINTAINERS.md) and docsite **Maintainers → Validate & diff-core**.

## Typecheck

```bash
cd packages/core && pnpm install && pnpm typecheck
```
