# Shared Core Package

This directory contains code shared across all website templates (auth, leads API, storage, admin shell pieces, Docker config, etc.).

**Do not edit generated template folders directly** for shared code. Edit here, then run:

```bash
pnpm sync-templates
```

## Layout (generated project structure)

After sync, developers receive a standard Next.js app with an organized `lib/` layer:

```
lib/
├── database/
│   ├── prisma.ts          # Prisma client singleton (MariaDB adapter)
│   └── index.ts
├── storage/
│   ├── StorageService.ts  # FTP upload service
│   └── index.ts
├── utils/
│   ├── slugify.ts
│   └── index.ts
├── features/
│   └── leads/             # Lead capture module (API + service layer)
│       ├── lead.controller.ts
│       ├── lead.service.ts
│       ├── lead.repository.ts
│       ├── lead.types.ts
│       └── index.ts
├── controllers/           # Legacy re-exports (deprecated paths)
├── services/
├── repositories/
├── db.ts                  # Shim → database/prisma
└── index.ts               # Barrel exports

app/
├── api/                   # Shared API routes (auth, leads, promo-banner, …)
├── admin/                 # Shared admin UI pieces
└── components/            # Shared public components (Navbar, PromoBanner, …)

auth.ts / auth.config.ts   # NextAuth configuration
constants/                 # Shared constants (not site.ts — template overlay)
```

## Import conventions

**Preferred (new code):**

```typescript
import { prisma } from "@/lib/database/prisma";
import { leadController } from "@/lib/features/leads";
import { storageService } from "@/lib/storage";
import { slugify } from "@/lib/utils";
```

**Legacy paths still work** (thin re-exports for compatibility):

```typescript
import { prisma } from "@/lib/db";
import { leadController } from "@/lib/controllers/LeadController";
```

## What belongs in core vs overlay

| Core (`packages/core`) | Template overlay (`templates/overlays/<name>/`) |
|------------------------|--------------------------------------------------|
| Auth, leads, FTP storage | Template-specific pages (Hero, gallery, properties) |
| Shared admin components | Prisma models for domain (RoomType, Project, …) |
| Docker, eslint, package.json base | `constants/site.ts` (brand per client) |
| Shared API routes | Domain API routes (`/api/room-types`, `/api/projects`) |

See `ARCHITECTURE.md` in this repo root for the full sync workflow.
