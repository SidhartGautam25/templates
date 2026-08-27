# Roadmap

Priorities after the **copy-once core starter kit** architecture. Ordered by impact on template developers and tempjs users.

---

## Near term (high value, low risk)

### 1. Maintainer docs & tooling clarity ✅ (in progress)

- Root [MAINTAINERS.md](./MAINTAINERS.md), updated docsite Maintainers section
- `pnpm dev:<id>` without forced sync
- `pnpm sync-templates --template <directory>` for single-template propagate

### 2. `tempjs doctor` + `GETTING_STARTED` in every template

Already in generated projects — ensure each template’s checklist is accurate after architecture change.

### 3. Template scaffolding CLI improvements

```bash
pnpm new-template bakery --name "Bakery" --with-docs
```

- Auto-add docsite registry stub
- Optional `--description` for `templates.json`
- Validate template folder builds (`pnpm install && pnpm exec tsc --noEmit`)

### 4. Reduce duplication inside templates

Hotel and real-estate still share similar Hero/Footer/admin shell. Move **truly identical** UI into core; keep vertical overrides in template only.

### 5. Hotel naming cleanup

Rename hotel admin `useProjects` / `ProjectsList` to room-type naming for maintainability.

---

## Medium term — optional core modules

**Goal:** Core features that are **not always needed** can be omitted at template creation or added later.

### Concept: `core-modules` manifest

```json
// packages/core/modules.json (future)
{
  "gallery": {
    "label": "Gallery CMS",
    "paths": ["app/gallery/", "lib/features/gallery/"],
    "prisma": "modules/gallery.prisma",
    "default": false
  },
  "leadrat": {
    "label": "LeadRat CRM hook",
    "paths": ["lib/integrations/leadrat/"],
    "default": false
  }
}
```

### CLI (future)

```bash
# At template creation (monorepo)
pnpm new-template hotel --modules gallery,leadrat

# In generated project (future tempjs)
tempjs add-module gallery
```

### Design rules

| Always in core | Optional module |
|----------------|-----------------|
| Auth, leads, health, DB client | Gallery, blog, CRM integrations |
| Navbar, sticky widgets | Extra admin tabs |
| Lead + PromoBanner models | Domain-specific is template, not module |

Modules copy files from `packages/core/modules/<name>/` into the template and append Prisma fragments to `domain.prisma`.

---

## Medium term — tempjs for client developers

| Feature | Benefit |
|---------|---------|
| `tempjs add-module <name>` | Add optional features to existing client site |
| `tempjs init` wizard in CLI | Same as docsite command builder, offline |
| `tempjs update --merge` UX | Clearer conflict report + dry-run summary |
| Per-template `tempjs info` | Show template-specific flags from manifest |
| `tempjs scaffold page <name>` | Add admin CRUD page from template patterns |

---

## Medium term — template developer experience

| Feature | Benefit |
|---------|---------|
| `pnpm template:validate hotel` | Lint + typecheck + prisma validate |
| `pnpm template:diff-core hotel` | See what differs from `packages/core` before propagate |
| Hot reload core into one template | Safer than full sync (preview diff) |
| Shared test fixtures in core | Seed helpers for leads/promo in all templates |

---

## Long term

- **Plugin registry** — third-party modules versioned separately from core
- **Visual theme editor** — export to `constants/site.ts` + CSS variables
- **CI matrix** — build every template in `templates.json` on PR
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
