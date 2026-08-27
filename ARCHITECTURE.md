# Monorepo architecture

## Mental model

```
packages/core          →  starter kit (copy once)
        │
        │  pnpm new-template bakery
        ▼
templates/bakery-website-template/   →  full standalone app (you own this)
        │
        │  tempjs bakery
        ▼
client-project/        →  developer's machine
```

**After `new-template`, the template does not depend on `packages/core`.** All imports are local (`@/lib/...`, `@/auth`, etc.).

## What template developers do

### Create a new template

```bash
pnpm new-template bakery bakery-website-template --name "Bakery Website"
```

This copies `packages/core` + scaffold into `templates/bakery-website-template/`, merges Prisma, updates `templates.json`, adds `pnpm dev:bakery`.

Then build the vertical:

1. Edit `constants/site.ts` (brand, SEO, theme colors)
2. Add models in `prisma/domain.prisma` (not Lead/PromoBanner — those come from core copy)
3. Add `lib/features/<your-domain>/` (controller, service, repository)
4. Add `app/` pages, components, API routes
5. `pnpm dev:bakery`

### Work on an existing template (e.g. hotel)

```bash
edit templates/hotel-website-template/
pnpm dev:hotel
```

No sync. No overlays. The hotel folder **is** the product.

### Fix shared behavior (auth, leads, FTP) for all templates

1. Fix `packages/core/`
2. Optionally `pnpm sync-templates` to push into existing templates
3. Or patch each template manually if they've diverged

## What is in packages/core?

Generic only:

| Area | Examples |
|------|----------|
| Auth | `auth.ts`, `/api/auth` |
| Leads | `lib/features/leads`, `/api/leads` |
| Storage | FTP `StorageService` |
| Admin shell pieces | login page, promo banner form |
| Infra | Docker, `.env.example`, health API |
| Prisma base | `Lead`, `PromoBanner` |

Not in core: home page, Hero, domain CRUD, `constants/site.ts` content (stub only), template Prisma models.

## Prisma in each template

| File | Purpose |
|------|---------|
| `prisma/domain.prisma` | **You edit** — domain models only |
| `prisma/schema.prisma` | **Generated** — core + domain (rebuilt on `new-template` or optional `sync-templates`) |

## Why `sync-templates` still exists (optional)

It is **not** part of normal development. Use it only when you changed `packages/core` and want to **propagate** that change into existing templates without manually copying files.

```bash
pnpm template:diff-core hotel    # detailed drift report before propagate
pnpm sync-templates:check        # quick pass/fail all templates
pnpm sync-templates              # apply core files into all templates
pnpm sync-templates --template hotel-website-template
pnpm template:validate hotel    # prisma + tsc + lint before release
```

## Optional modules

### Core modules (`packages/core/modules/`)

Cross-vertical features registered in `packages/core/modules.json`:

| Module | Purpose |
|--------|---------|
| enquiry-modal, footer, hero-simple | UI building blocks |
| seo | sitemap, robots, JSON-LD, metadata helpers |
| gallery, reviews, legal-pages | CMS-style content |

Install at template creation (`pnpm new-template --modules …`), on existing templates (`pnpm template:add-module`), or in client projects (`tempjs add-module`).

### Template vertical modules (`templates/<dir>/modules/`)

Vertical slices with `template-modules.json`:

- **Hotel:** `room-types`, `facilities`, `slug-pages`
- **Real-estate:** `projects`, `slug-pages`

Maintainers edit `modules/<id>/` and run `pnpm template:assemble` to copy into the shippable template root. `pnpm template:extract-modules` reverses the flow for bootstrapping.

### Tracking

`.tempjs-modules.json` records `coreModules` and `templateModules` installed on a template or client project.

### Planned

- **Admin tab registry** — unified `app/admin/page.tsx` with `getAdminTabs()`; gallery/reviews via `registry.ts`; `tempjs add-module` wires CMS tabs
- **`--with-docs`** on `new-template` — auto docsite registry stub
- **Hotel naming cleanup** — room-type naming in admin hooks/components
- **Hero/Footer dedupe** — align shipped templates with `hero-simple` / `footer` modules

See [ROADMAP.md](./ROADMAP.md) and docsite → Maintainers → Optional modules.

## Versioning

- Bump CLI: `tempjs version inc patch cli`
- Bump template: `tempjs version inc patch hotel` (tracks `templates/hotel-website-template/` only)

See [VERSIONING.md](./VERSIONING.md).
