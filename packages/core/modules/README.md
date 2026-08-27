# Optional core modules

Copy on demand via `pnpm new-template --modules`, `pnpm template:add-module` (monorepo), or `tempjs add-module` (client projects).

## Available modules

| Id | Feature flag | Prisma | Admin UI today |
|----|--------------|--------|----------------|
| `enquiry-modal` | `enquiryModal` | — | — |
| `footer` | `footer` | — | — |
| `hero-simple` | `heroSimple` | — | — |
| `seo` | `seo` | — | sitemap, robots, JSON-LD |
| `gallery` | `gallery` | `GalleryImage` | GalleryList tab on unified dashboard |
| `reviews` | `reviews` | `Review` | ReviewsList tab on unified dashboard |
| `legal-pages` | `legalPages` | — | — |

Registry: `packages/core/modules.json`

**Admin tab registry:** gallery/reviews update `app/admin/registry.ts` on install; unified `app/admin/page.tsx` uses `lib/admin/AdminShell` + `getAdminTabs()`.

## Monorepo

```bash
pnpm new-template bakery bakery-website-template --name "Bakery" \
  --modules seo,hero-simple,footer,enquiry-modal,gallery,reviews,legal-pages

pnpm template:add-module bakery gallery,reviews
```

## Client projects

```bash
tempjs add-module list
tempjs add-module seo,gallery,reviews
pnpm prisma db push
```

Published CLI ships `packages/core/modules/` and fetches from GitHub when not in the monorepo. Records installed ids in `.tempjs-modules.json`.

## SEO module

- `app/sitemap.ts` — `buildAppSitemap()` + `registerDynamicSitemapProvider()` for listing slugs
- `app/robots.ts` — host, sitemap URL, configurable disallow rules
- `lib/seo/json-ld.ts` — Organization/WebSite graph
- `lib/seo/metadata.ts` — canonical, Open Graph, Twitter cards
- `SiteJsonLd` wired into `app/layout.tsx` on install

Template vertical modules (hotel `lib/hotel/register-sitemap.ts`, real-estate `lib/real-estate/register-sitemap.ts`) register dynamic routes.

## Gallery / reviews

- Appends Prisma models to `prisma/domain.prisma` and regenerates `schema.prisma`
- Public API + admin CRUD components
- Scaffold templates: wires `app/page.tsx` and updates `app/admin/registry.ts` (removes legacy `/admin/content` if present)
- Shipped hotel/real-estate: custom `registry.ts` with vertical tabs; gallery/reviews tabs when modules are enabled

## Legal pages

- `/privacy-policy` and `/terms-and-conditions` from `SITE.privacyPage` / `SITE.termsPage`

## Template vertical modules (not in this folder)

Hotel and real-estate vertical slices live under `templates/<dir>/modules/` with `template-modules.json`. See `pnpm template:assemble` / `pnpm template:extract-modules`.
