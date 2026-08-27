# Maintainer guide

Quick reference for developing **tempjs** and website templates in this monorepo.

**Developers** who run `tempjs hotel` only need the docsite **Developers** section. This file is for people who change templates or the CLI.

---

## Mental model

```
packages/core     →  starter kit (generic, no template names)
        │
        │  pnpm new-template <id>     ← copies core ONCE
        ▼
templates/<name>/ →  full standalone Next.js app (you edit this)
        │
        │  tempjs <id>
        ▼
client-project/
```

After `new-template`, the template **does not depend** on `packages/core`. All imports are local (`@/lib/...`).

---

## Commands cheat sheet

| Task | Command |
|------|---------|
| **New template** | `pnpm new-template bakery bakery-website-template --name "Bakery Website"` |
| **Dev existing template** | `pnpm dev:hotel` or `cd templates/hotel-website-template && pnpm dev` |
| **Optional: push core fix to templates** | `pnpm sync-templates` or `pnpm sync-templates --template hotel-website-template` |
| **Check if templates match core** | `pnpm sync-templates:check` |
| **Version check** | `tempjs version check` / `tempjs version check hotel` |
| **Version bump** | `tempjs version inc patch hotel` / `tempjs version inc patch cli` |
| **CLI help** | `tempjs --help` |

You **do not** run sync for normal template feature work.

---

## What is in `packages/core`?

Copied into every new template. Generic only:

| Area | Paths (examples) |
|------|------------------|
| Auth | `auth.ts`, `auth.config.ts`, `app/api/auth/` |
| Leads | `lib/features/leads/`, `app/api/leads/` |
| Storage | `lib/storage/StorageService.ts` |
| Shared UI | `app/components/Navbar.tsx`, `StickyWidgets`, `PromoBanner` |
| Admin shell | `app/admin/login/`, promo/logo forms |
| Health | `app/api/health/` |
| Infra | `docker-compose.yml`, `.env.example`, `next.config.ts` |
| Prisma base | `Lead`, `PromoBanner` in `prisma/schema.prisma` |

**Not in core:** home page, Hero, domain CRUD, real `constants/site.ts` content (stub only), template Prisma models.

See [packages/core/README.md](./packages/core/README.md).

---

## Develop a new template

```bash
pnpm new-template bakery bakery-website-template --name "Bakery Website"
```

Then in `templates/bakery-website-template/`:

1. **`constants/site.ts`** — brand, SEO, theme colors, copy
2. **`prisma/domain.prisma`** — your models (do not redefine Lead/PromoBanner)
3. **`lib/features/<domain>/`** — controller, service, repository
4. **`app/`** — pages, components, `app/api/<domain>/`
5. **`prisma/seed.ts`** — demo data
6. Docs: `GETTING_STARTED.md`, `ARCHITECTURE.md`, `CHANGELOG.md`

```bash
pnpm install
pnpm dev:bakery
```

Test CLI copy:

```bash
mkdir /tmp/bakery-test && cd /tmp/bakery-test
tempjs bakery --yes
```

Register docs: add entry to `docsite/content/templates-registry.json` + template JSON page.

---

## Develop an existing template

```bash
edit templates/hotel-website-template/
pnpm dev:hotel
```

Commit changes in `templates/hotel-website-template/` only.

---

## When to use `pnpm sync-templates` (optional)

Use only when you **intentionally fixed** shared code in `packages/core` and want that fix in **existing** templates:

```bash
pnpm sync-templates                              # all templates in templates.json
pnpm sync-templates --template hotel-website-template
pnpm sync-templates:check                        # dry-run diff
```

Sync **overwrites core-owned paths** in the template. It does **not** delete template-only files (`app/page.tsx`, domain features, your `constants/site.ts`).

**Prisma:** edit `prisma/domain.prisma` in the template; sync rebuilds `prisma/schema.prisma` from core + domain.

---

## Prisma layout per template

| File | Who edits | Contents |
|------|-----------|----------|
| `prisma/domain.prisma` | Maintainer | Domain models only |
| `prisma/schema.prisma` | Generated | Core + domain (do not edit by hand) |

After changing `domain.prisma`:

```bash
pnpm prisma db push
```

---

## Versioning

Two version numbers:

| | Stored in | Example |
|---|-----------|---------|
| CLI | root `package.json` | `@navneet_25/tempjs` 2.1.0 |
| Template | `templates.json` | `hotel` → 1.3.0 |

```bash
tempjs version check
tempjs version inc patch hotel
tempjs version inc patch cli
```

Template bumps track `templates/<directory>/` changes. See [VERSIONING.md](./VERSIONING.md).

---

## Repo map

| Path | Purpose |
|------|---------|
| `cli/` | tempjs CLI |
| `packages/core/` | Starter kit (copy once) |
| `packages/core/scaffold/` | Minimal app shell for new templates |
| `templates/<name>/` | Shippable template projects |
| `scripts/new-template.mjs` | Create template from core |
| `scripts/sync-templates.mjs` | Optional core propagation |
| `docsite/` | Documentation website |
| `templates.json` | CLI manifest |

---

## Further reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — design details
- [ROADMAP.md](./ROADMAP.md) — planned improvements
- [VERSIONING.md](./VERSIONING.md) — release process
- Docsite → **Maintainers** section (mirrors this guide)
