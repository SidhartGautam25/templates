# Roadmap

Priorities after the **copy-once core starter kit** architecture. Ordered by impact on template developers and tempjs users.

---

## Completed recently ✅

### Optional core modules

- `packages/core/modules.json` — enquiry-modal, footer, hero-simple, seo, gallery, reviews, legal-pages
- `pnpm new-template --modules …` and `pnpm template:add-module`
- `tempjs add-module` / `tempjs add-module list` for client projects
- `.tempjs-modules.json` tracks `coreModules` (and `templateModules` on shipped templates)

### Template vertical modules

- `templates/<name>/modules/<id>/` + `template-modules.json`
- Hotel: `room-types`, `facilities`, `slug-pages`
- Real-estate: `projects`, `slug-pages`
- `pnpm template:assemble` / `pnpm template:extract-modules`

### Shipped template adoption

- Hotel: core `seo`, `gallery`, `reviews` (keeps bespoke room `app/gallery/page.tsx`)
- Real-estate: core `seo`
- Dynamic sitemap via `registerDynamicSitemapProvider` + `buildAppSitemap()`

### Maintainer docs & tooling

- Docsite Maintainers section, validate & diff-core, module pages
- `pnpm sync-templates --template <directory>` for single-template propagate

### Admin tab registry & docs scaffolding

- Unified `app/admin/page.tsx` dashboard with `getAdminTabs()` registry (`lib/admin/AdminShell`, core + template panels)
- Gallery/reviews modules update `registry.ts` and remove legacy `/admin/content` when installed
- `pnpm new-template --with-docs` — `docsite-stub.mjs` adds `templates-registry.json` + `developers/templates/<id>.json`
- Hotel admin naming — `useRoomTypes`, `RoomTypesList`, `RoomTypeFormModal`, `RoomTypesPanel`
- Real-estate Hero/Footer aligned with `hero-simple` / `footer` core modules (`listingsApiPath`, `singleProject` alias)

---

## Near term (high value, low risk)

### 5. `tempjs doctor` + `GETTING_STARTED` audit

Ensure each template’s checklist reflects copy-once core, optional modules, and adopted core modules.

---

## Medium term — tempjs for client developers

| Feature | Status |
|---------|--------|
| `tempjs add-module` | ✅ |
| `tempjs init` wizard in CLI | Planned — offline command builder parity with docsite |
| `tempjs update --merge` UX | Clearer conflict report + dry-run summary |
| Per-template `tempjs info` | Show template-specific flags from manifest |
| `tempjs scaffold page <name>` | Add admin CRUD page from template patterns |

---

## Medium term — template developer experience

| Feature | Status |
|---------|--------|
| `pnpm template:validate hotel` | ✅ |
| `pnpm template:diff-core hotel` | ✅ |
| `pnpm template:assemble` / `extract-modules` | ✅ |
| Hot reload core into one template | Safer than full sync (preview diff) |
| Shared test fixtures in core | Seed helpers for leads/promo in all templates |
| CI matrix on PR | `pnpm template:validate` for every template |

---

## Long term

- **Plugin registry** — third-party modules versioned separately from core
- **Visual theme editor** — export to `constants/site.ts` + CSS variables
- **Template preview URLs** — deploy demo instances per release

---

## What we are not doing

- **Overlay layer** — removed; templates are standalone
- **Mandatory sync on every dev** — sync is optional propagate only
- **npm `@tempjs/core` in client projects** — clients get flat copy, full ownership

---

## How to propose changes

1. Open an issue or PR with the user story (template dev vs client dev)
2. If it touches core, note whether it should be **always copied** or **optional module**
3. Update `templates.json` + docsite registry when shipping a new template
