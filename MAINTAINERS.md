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
| **Diff one template vs core** | `pnpm template:diff-core hotel` |
| **Validate template (prisma, tsc, lint)** | `pnpm template:validate hotel` |
| **Add core module to template** | `pnpm template:add-module bakery footer` |
| **Assemble template vertical modules** | `pnpm template:assemble hotel` |
| **Extract paths into modules/** | `pnpm template:extract-modules hotel` |
| **Version check** | `tempjs version check` / `tempjs version check hotel` |
| **Version bump** | `tempjs version inc patch hotel` / `tempjs version inc patch cli` |
| **CLI help** | `tempjs --help` |

You **do not** run sync for normal template feature work.

---

## Optional core modules

Cross-vertical UI/features live in `packages/core/modules/` and are **not** copied by default. Install at template creation or later.

### Registry

`packages/core/modules.json` lists available modules. Current modules:

| Module id | What it adds |
|-----------|----------------|
| `enquiry-modal` | Lead capture modal → `/api/leads` |
| `footer` | Site footer (legal, RERA blocks from `SITE`) |
| `hero-simple` | Carousel hero from `SITE.hero` + assets |
| `seo` | sitemap.xml, robots.txt, JSON-LD, Open Graph metadata helpers |
| `gallery` | Gallery CMS — model, `/gallery`, admin at `/admin/content` |
| `reviews` | Testimonials — model, homepage section, admin at `/admin/content` |
| `legal-pages` | Privacy policy + terms pages from `SITE` |

### Commands

```bash
# At template creation — lean starter with selected UI
pnpm new-template bakery bakery-website-template --name "Bakery" --modules enquiry-modal,footer,hero-simple

# Add to existing template in monorepo
pnpm template:add-module bakery footer,hero-simple
```

### What happens on install

1. Copies files from `packages/core/modules/<id>/` into the template (e.g. `app/components/Hero.tsx`)
2. Sets `SITE.features.<flag>` to `true` in `constants/site.ts`
3. Writes `.tempjs-modules.json` with installed module ids
4. Wires `app/page.tsx` when UI modules are added (imports only installed components)
5. Records `coreModules` on the `templates.json` entry when using `new-template`

### Configuration

| Module | Configure via |
|--------|----------------|
| `enquiry-modal` | `SITE.enquiry.*`, optional `listingsApiPath` for dropdown API |
| `footer` | `SITE.footer.*`, `SITE.legal.*` |
| `hero-simple` | `SITE.hero.*`, `SITE.assets.heroDesktop` / `heroMobile` |

Templates with domain listings can set `SITE.enquiry.listingsApiPath` to e.g. `/api/projects` so the modal dropdown loads from your API.

### Client projects (`tempjs add-module`)

After `tempjs hotel` (or any template), add optional core modules from the same `packages/core/modules.json` registry:

```bash
tempjs add-module list
tempjs add-module seo,gallery,reviews
```

Uses local `packages/core` when running from the monorepo; published CLI fetches core modules from GitHub. Updates `constants/site.ts` feature flags, merges Prisma fragments, and records ids in `.tempjs-modules.json`.

---

## Template-level vertical modules

Vertical features live under `templates/<directory>/modules/<module-id>/` with a `template-modules.json` registry (same shape as core modules).

| Template | Module ids |
|----------|------------|
| hotel | `room-types`, `facilities`, `slug-pages` |
| real-estate | `projects`, `slug-pages` |

```bash
# Maintainer: copy template root paths into modules/ (bootstrap)
pnpm template:extract-modules hotel

# Maintainer: copy modules/ back into template root (after editing module source)
pnpm template:assemble hotel
pnpm template:assemble hotel room-types,facilities
```

Shipped templates are **assembled** (files at template root for `tempjs`); `modules/` is maintainer source-of-truth for vertical slices.

Hotel and real-estate adopt core `seo`, `gallery`, and `reviews` (hotel) where they overlapped bespoke code; dynamic sitemap routes register via `lib/hotel/register-sitemap.ts` and `lib/real-estate/register-sitemap.ts`.

### Future

- More core modules as needed
- `tempjs add-template-module` for vertical modules in client projects (optional)

See [ROADMAP.md](./ROADMAP.md).

---

## Template validate & diff-core

Quality and drift checks for `templates/<name>/`. Run from **monorepo root**.

### Command reference

| Command | What it does |
|---------|----------------|
| `pnpm template:diff-core hotel` | Detailed report: matches / differs / missing vs `packages/core`, plus template-only files |
| `pnpm template:diff-core` | Same for all templates in `templates.json` |
| `pnpm template:validate hotel` | `prisma validate` → `tsc --noEmit` → `pnpm lint` |
| `pnpm template:validate` | Validate all templates |
| `pnpm template:validate hotel --skip-install` | Skip auto-install if `node_modules` is missing |

Both commands accept template **id** (`hotel`) or **directory** (`hotel-website-template`).

**Exit codes:** `template:diff-core` exits `1` if propagate would change files (differs or missing core paths) — same idea as `sync-templates:check`, but with a richer per-file report.

### `pnpm template:diff-core`

**What it does (read-only):**

1. Lists every file under `packages/core` that sync would copy (excludes `scaffold/`, `scripts/dev/`, maintainer docs).
2. SHA-256 compares each core file to the same path in `templates/<directory>/`.
3. Rebuilds expected `prisma/schema.prisma` from core schema + template `prisma/domain.prisma` and compares to the template’s merged schema.
4. Lists **template-only** files (Hero, domain features, seeds, assets) that sync never touches.

| Symbol | Category | Meaning |
|--------|----------|---------|
| ✓ | matches core | Byte-identical to core — propagate would not change it |
| ≠ | differs from core | Sync would **overwrite** this path |
| − | missing in template | Sync would **add** this file |
| + | template-only | Only in template — sync ignores |

**When to use:**

- Before `pnpm sync-templates` — preview overwrites
- After editing `packages/core` — see which templates need propagate
- After accidentally editing a core-owned file in a template (e.g. `auth.ts`)
- CI — fail if templates drift from core without intentional propagate

**Scenarios:**

```bash
# A — Fixed lead bug in core; hotel template still has old code
edit packages/core/lib/features/leads/lead.service.ts
pnpm template:diff-core hotel          # expect ≠ lead.service.ts
pnpm sync-templates --template hotel-website-template
pnpm template:diff-core hotel          # expect 0 differs

# B — Normal feature work (Hero only)
edit templates/hotel-website-template/app/components/Hero.tsx
pnpm template:diff-core hotel          # core paths still match; Hero in template-only list

# C — Hotel customized Navbar on purpose
# diff-core shows ≠ Navbar.tsx — do NOT run sync blindly or you lose the customization
```

**Scripts:** `scripts/template-diff-core.mjs`, `scripts/template-cli-utils.mjs`, `scripts/template-core-utils.mjs`

### `pnpm template:validate`

**What it does:**

1. **Install** — `pnpm install` in template folder if `node_modules` missing (skip with `--skip-install`)
2. **prisma validate** — schema syntax and config via `prisma.config.ts`
3. **tsc --noEmit** — full TypeScript check
4. **pnpm lint** — ESLint

**When to use:**

- Before `tempjs version inc` — do not ship broken templates
- After changing `prisma/domain.prisma` or new API routes
- After `pnpm new-template` — confirm scaffold builds
- Before opening a PR

**Scenarios:**

```bash
# D — Release hotel 1.4.0
pnpm template:validate hotel
tempjs version check
edit templates/hotel-website-template/CHANGELOG.md
tempjs version inc minor hotel

# E — New domain model + features
# prisma validate catches bad domain.prisma; tsc catches wrong Prisma client types

# F — Deps already installed (CI / fast local)
pnpm template:validate hotel --skip-install
```

**Scripts:** `scripts/template-validate.mjs`

### Compare to sync commands

| Command | Writes? | Best for |
|---------|---------|----------|
| `pnpm template:diff-core` | No | Detailed preview + template-only list |
| `pnpm sync-templates:check` | No | Quick pass/fail all templates |
| `pnpm sync-templates` | Yes | Apply core into templates |
| `pnpm template:validate` | No | Quality gate (not about core drift) |

**Typical core-fix loop:** edit `packages/core` → `template:diff-core hotel` → `sync-templates --template …` → `template:validate hotel` → version bump.

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
| `scripts/template-validate.mjs` | Prisma + tsc + lint gate |
| `scripts/template-diff-core.mjs` | Diff template vs core |
| `docsite/` | Documentation website |
| `templates.json` | CLI manifest |

---

## Further reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) — design details
- [ROADMAP.md](./ROADMAP.md) — planned improvements (next tasks below)
- [VERSIONING.md](./VERSIONING.md) — release process
- Docsite → **Maintainers** section (mirrors this guide)

---

## Next tasks (roadmap)

| Priority | Task | Benefit |
|----------|------|---------|
| Near | `pnpm new-template --with-docs` | Auto-add docsite registry stub |
| Near | Hotel admin naming cleanup | `useProjects` → room-type naming |
| Near | Dedupe Hero/Footer into core | Less duplication between templates |
| Near | `tempjs doctor` + GETTING_STARTED audit | Accurate per-template checklist |
| Medium | Optional core modules (`--modules`) | Gallery, CRM at copy or via `tempjs add-module` |
| Medium | CI matrix on PR | `pnpm template:validate` for every template |
| Medium | `tempjs init` wizard in CLI | Offline command builder |
| Long | Template preview URLs | Demo deploy per release |
| Long | Plugin registry | Third-party modules separate from core |

See [ROADMAP.md](./ROADMAP.md) for full detail.
