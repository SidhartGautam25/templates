# Templates

Each subdirectory is a **complete, standalone Next.js project** — what `tempjs` copies to clients.

## Develop a new template

```bash
pnpm new-template <id> <directory> --name "Display Name"
# e.g. pnpm new-template bakery bakery-website-template --name "Bakery Website"

cd templates/bakery-website-template   # or: pnpm dev:bakery
# 1. constants/site.ts — brand & theme
# 2. prisma/domain.prisma — your models (Lead/PromoBanner already from core copy)
# 3. lib/features/<domain>/ — business logic
# 4. app/ — pages, components, API routes
pnpm install && pnpm dev
```

`packages/core` was copied **once** at creation. You do not need it again for daily work.

## Develop an existing template

```bash
edit templates/hotel-website-template/
pnpm dev:hotel
```

## Optional: propagate a core fix

Only if you changed `packages/core` and want that in existing templates:

```bash
pnpm sync-templates
```

See [ARCHITECTURE.md](../ARCHITECTURE.md).
