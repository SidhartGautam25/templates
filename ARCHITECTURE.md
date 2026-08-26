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
│   │   └── leads/          # Lead capture (shared across templates)
│   ├── controllers/        # Template domain + legacy re-exports
│   ├── services/
│   └── repositories/
├── constants/              # Site config, defaults
├── prisma/                 # Schema & seeds (template-specific)
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

### Change shared code (auth, leads, FTP, Navbar, …)

1. Edit `packages/core/`
2. Run `pnpm sync-templates`
3. Commit `packages/core/` **and** synced `templates/*-website-template/` folders
4. Push

### Change hotel-only code (rooms, gallery, facilities, …)

1. Edit `templates/overlays/hotel-website-template/`
2. Run `pnpm sync-templates`
3. Commit overlay + synced `templates/hotel-website-template/`

### Change real-estate-only code

1. Edit `templates/overlays/real-estate-website-template/`
2. Run `pnpm sync-templates`
3. Commit overlay + synced output

### Verify sync before PR

```bash
pnpm sync-templates:check
```

Fails if merged output does not match `core + overlay`.

## What goes where?

| Location | Examples |
|----------|----------|
| **packages/core** | `auth.ts`, leads module, FTP storage, `/api/leads`, Navbar, PromoBanner, Docker, `package.json` base |
| **Hotel overlay** | RoomType, Facility, Review models & APIs, gallery page, hotel Hero, `constants/site.ts` defaults |
| **Real-estate overlay** | Project model & APIs, property Hero, `app/data/projects.ts` |

## Code Placement Rules: What Goes Where?

To keep templates maintainable, adhere to these code separation guidelines:

| Directory | Purpose | Edit Strategy | Examples |
|---|---|---|---|
| `packages/core/` | Shared core dependencies, business logic, base configs | **Edit directly.** Any changes here will propagate to all templates. | Base `package.json`, shared Prisma client, lead controllers/services, global CSS variables, common utilities, FTP upload scripts. |
| `templates/overlays/<template-id>/` | Specific styling, unique pages, page-router components | **Edit directly.** Overrides identical files copied from `core`. | Template-specific Hero components, specialized Prisma DB seeds/schemas, domain constants (`site.ts`), page routes (`app/page.tsx`). |
| `templates/<template-id>/` | Compiled final output that the CLI copies. | **DO NOT EDIT MANUALLY.** Any changes made here are overwritten and lost on compilation. | Merged layout directories, package config, static folders. |

---

## Detailed Walkthrough: Adding a New Template

To illustrate how to add a template, let's take a simple example of adding a new **Restaurant Website Template** (`restaurant-website-template`) which will reuse the shared Lead Capture API from `packages/core` but feature a custom booking layout and menu page.

### Step 1: Create the Overlay Directory
Create the overlay folder under `templates/overlays/`. Only place template-specific files here. Let's create:
*   `templates/overlays/restaurant-website-template/constants/site.ts` (restaurant-specific name, domain, and colors)
*   `templates/overlays/restaurant-website-template/app/menu/page.tsx` (the restaurant menu view)
*   `templates/overlays/restaurant-website-template/prisma/schema.prisma` (adding a `Reservation` model to the DB schema)

### Step 2: Register in `templates.json`
Add the new template entry to the root [templates.json](file:///home/sidharthg/sid/project/free/templates/templates.json) file so the CLI knows it exists:
```json
{
  "restaurant": {
    "name": "Restaurant Website",
    "description": "Premium template for bistros, bars, and fine-dining restaurants.",
    "path": "templates/restaurant-website-template"
  }
}
```

### Step 3: Register in the Sync script
Add the template target definition to the `TEMPLATE_TARGETS` list in [scripts/sync-templates.mjs](file:///home/sidharthg/sid/project/free/templates/scripts/sync-templates.mjs#L19-L22):
```javascript
const TEMPLATE_TARGETS = [
  { id: "hotel-website-template", overlay: "hotel-website-template" },
  { id: "real-estate-website-template", overlay: "real-estate-website-template" },
  { id: "restaurant-website-template", overlay: "restaurant-website-template" }, // <-- Add this
];
```

### Step 4: Run the Sync Command
Execute the compiler script to merge the shared core files and restaurant overlay files into the final template folder:
```bash
pnpm sync-templates
```
#### What happens under the hood during Sync:
1. The script creates a temporary folder `.sync-staging/restaurant-website-template/`.
2. It copies the entire `packages/core/` directory to the staging folder (establishing the base framework).
3. It copies `templates/overlays/restaurant-website-template/` on top of the staging folder, overwriting any matching files (applying custom modifications).
4. It deletes the old `templates/restaurant-website-template/` folder and writes the staged, merged files to its place.

### Step 5: Verify and Commit
Verify that `templates/restaurant-website-template/` contains both your custom menu code and the shared database/FTP services from the core directory. Commit the files to Git:
```bash
git add templates/overlays/restaurant-website-template
git add templates/restaurant-website-template
git commit -m "feat: add restaurant website template"
```

---

## Why not npm core package?

Generated projects are meant to be **fully owned** by the client developer — fork, rename, customize every file. Copying merged source (Option 1) keeps all code in `lib/` and `app/` without depending on `@your-org/core` in `node_modules`.

See README **Shared core package** section for comparison with other approaches.
