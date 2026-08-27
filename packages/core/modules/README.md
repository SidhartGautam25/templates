# Optional core modules

Copy on demand via `pnpm new-template --modules` or `pnpm template:add-module`.

## Available modules

| Id | Feature flag | Prisma | Admin route |
|----|--------------|--------|-------------|
| `enquiry-modal` | `enquiryModal` | — | — |
| `footer` | `footer` | — | — |
| `hero-simple` | `heroSimple` | — | — |
| `seo` | `seo` | — | — (sitemap, robots, JSON-LD) |
| `gallery` | `gallery` | `GalleryImage` | `/admin/content` |
| `reviews` | `reviews` | `Review` | `/admin/content` |
| `legal-pages` | `legalPages` | — | — |

Registry: `packages/core/modules.json`

## Example

```bash
pnpm new-template bakery bakery-website-template --name "Bakery" \
  --modules seo,hero-simple,footer,enquiry-modal,gallery,reviews,legal-pages

pnpm template:add-module bakery gallery,reviews
```

## SEO module

Production-grade:

- `app/sitemap.ts` — dynamic sitemap with module routes + `registerDynamicSitemapProvider()` for template listings
- `app/robots.ts` — host, sitemap URL, configurable disallow rules
- `lib/seo/json-ld.ts` — Organization/WebSite graph with safe serialization
- `lib/seo/metadata.ts` — canonical, Open Graph, Twitter cards
- `SiteJsonLd` wired into `app/layout.tsx` on install

## Gallery / reviews

- Appends Prisma models to `prisma/domain.prisma` and regenerates `schema.prisma`
- Public API + admin CRUD at `/admin/content`
- Homepage sections when wired via `app/page.tsx` generator

## Legal pages

- `/privacy-policy` and `/terms-and-conditions` from `SITE.privacyPage` / `SITE.termsPage`
- Works without SEO module (basic metadata); pair with `seo` for full Open Graph
