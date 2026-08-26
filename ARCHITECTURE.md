# Monorepo architecture (Option 1 — pre-merge sync)

This repository uses a **shared core + template overlays** model. When a developer runs `tempjs hotel`, they receive a **single, flat, fully standalone** Next.js project with all source code on disk — nothing hidden in npm packages or git submodules.

## Repository layout

```
templates/                          # Repo root
├── packages/
│   └── core/                       # Shared source (edit shared code here)
├── templates/
│   ├── overlays/
│   │   ├── hotel-website-template/ # Hotel-only files
│   │   └── real-estate-website-template/
│   ├── hotel-website-template/     # OUTPUT: core + hotel overlay (for tempjs)
│   └── real-estate-website-template/
├── scripts/
│   └── sync-templates.mjs
└── cli/                            # tempjs CLI
```

## Data flow

```
┌─────────────────┐     ┌──────────────────────┐
│  packages/core  │     │  templates/overlays/ │
│  (shared code)  │     │  (template-specific) │
└────────┬────────┘     └──────────┬───────────┘
         │                         │
         └───────────┬─────────────┘
                     │  pnpm sync-templates
                     ▼
         ┌───────────────────────────┐
         │ templates/hotel-website-    │
         │ template/  (merged, in git)│
         └─────────────┬─────────────┘
                       │  tempjs hotel
                       ▼
         ┌───────────────────────────┐
         │  client-project/          │
         │  (developer's machine)    │
         └───────────────────────────┘
```

## Generated project structure (what developers get)

```
client-project/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (shared + template-specific)
│   ├── admin/              # Admin dashboard
│   ├── components/         # UI components
│   └── ...
├── lib/                    # Business logic (organized by layer)
│   ├── database/           # Prisma client
│   ├── storage/            # FTP asset pipeline
│   ├── utils/              # Shared utilities
│   ├── features/           # Domain modules
│   │   ├── leads/          # Lead capture (shared core)
│   │   ├── room-types/     # Hotel overlay example
│   │   └── projects/       # Real-estate overlay example
│   ├── controllers/        # Template domain + legacy re-exports
│   ├── services/
│   └── repositories/
├── constants/              # Site config, defaults
├── prisma/                 # Merged schema (core Lead/PromoBanner + overlay models)
├── public/
├── auth.ts
└── package.json
```

### Import style

Developers can use clear paths:

```typescript
import { prisma } from "@/lib/database/prisma";
import { leadController } from "@/lib/features/leads";
import { storageService } from "@/lib/storage";
```

Legacy paths (`@/lib/db`, `@/lib/controllers/LeadController`) remain as thin re-exports.

## Maintainer workflow

### Daily loop

```bash
# Edit packages/core OR templates/overlays/<template>/
pnpm sync-templates
pnpm dev:hotel          # or pnpm dev:real-estate
# Bump templates.json version + overlay CHANGELOG.md
git commit              # pre-commit runs sync-templates:check
```

Enable hooks once per clone:

```bash
pnpm setup-hooks
```

### Change shared code (auth, leads, FTP, Navbar, …)

1. Edit `packages/core/` (shared Prisma: `Lead`, `PromoBanner` in `prisma/schema.prisma`)
2. Run `pnpm sync-templates`
3. Commit `packages/core/` **and** synced `templates/*-website-template/` folders
4. Push

### Change hotel-only code (rooms, gallery, facilities, …)

1. Edit `templates/overlays/hotel-website-template/` — domain code in `lib/features/room-types`, `facilities`, `reviews`, `hotel-config`
2. Run `pnpm sync-templates`
3. Commit overlay + synced `templates/hotel-website-template/`

### Change real-estate-only code

1. Edit `templates/overlays/real-estate-website-template/` — `lib/features/projects`
2. Run `pnpm sync-templates`
3. Commit overlay + synced output

### Verify sync before PR

```bash
pnpm sync-templates:check
```

Fails if merged output does not match `core + overlay` (also runs on `git commit` when hooks are enabled).

## What goes where?

| Location | Examples |
|----------|----------|
| **packages/core** | `auth.ts`, leads module, FTP storage, `/api/leads`, Navbar, PromoBanner, `prisma/schema.prisma` (Lead, PromoBanner), Docker |
| **Hotel overlay** | `lib/features/room-types`, facilities, reviews, hotel-config; gallery; hotel Hero |
| **Real-estate overlay** | `lib/features/projects`; property Hero |

## Code Placement Rules: What Goes Where?

To keep templates maintainable, adhere to these code separation guidelines:

| Directory | Purpose | Edit Strategy | Examples |
|---|---|---|---|
| `packages/core/` | Shared core dependencies, business logic, base configs | **Edit directly.** Any changes here will propagate to all templates. | Base `package.json`, shared Prisma client, lead controllers/services, global CSS variables, common utilities, FTP upload scripts. |
| `templates/overlays/<template-id>/` | Specific styling, unique pages, page-router components | **Edit directly.** Overrides identical files copied from `core`. | Template-specific Hero components, specialized Prisma DB seeds/schemas, domain constants (`site.ts`), page routes (`app/page.tsx`). |
| `templates/<template-id>/` | Compiled final output that the CLI copies. | **DO NOT EDIT MANUALLY.** Any changes made here are overwritten and lost on compilation. | Merged layout directories, package config, static folders. |

---

## Detailed Walkthrough: Adding a New Template

Use the scaffold script (reads/writes `templates.json` automatically):

```bash
pnpm new-template bakery bakery-website-template
pnpm sync-templates
pnpm dev:bakery   # add matching script to root package.json
```

This creates `templates/overlays/bakery-website-template/` with `constants/site.ts`, `package.json`, `prisma/schema.prisma`, `CHANGELOG.md`, and a `templates.json` entry.

### Manual steps (if you prefer)

1. Create overlay under `templates/overlays/<name>/`
2. Add entry to `templates.json` (or use `pnpm new-template`)
3. `pnpm sync-templates` — targets are loaded from `templates.json`
4. Commit overlay + synced `templates/<name>/`

---

## Why not npm core package?

Generated projects are meant to be **fully owned** by the client developer — fork, rename, customize every file. Copying merged source (Option 1) keeps all code in `lib/` and `app/` without depending on `@your-org/core` in `node_modules`.

See README **Shared core package** section for comparison with other approaches.
