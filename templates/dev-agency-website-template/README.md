# Dev Agency Website Template

Freelance development agency landing page with admin-managed content.

## Sections

- **Hero** — `SITE.agency.hero` in `constants/site.ts`
- **Expertise** — skill cards (admin → Expertise tab)
- **Team** — team member grid (admin → Team tab)
- **Contact CTA** — enquiry modal trigger
- **Featured work** — auto-scrolling portfolio carousel (admin → Featured work tab)
- **Header / footer** — `SITE.agency.nav` and `SITE.agency.footer`

## Core modules (installed)

- `enquiry-modal` — lead capture
- `seo` — sitemap, robots, metadata helpers

## Optional modules (not installed by default)

```bash
tempjs add-module gallery,reviews,footer,legal-pages
```

### Example: Compose blog with sidebar

Add a technical blog with a docs-style article sidebar after the agency landing is live:

```bash
# Client project (after tempjs dev-agency)
tempjs add-module blog-compose+sidebar
pnpm prisma db push
pnpm dev
```

Monorepo:

```bash
pnpm template:add-module dev-agency blog-compose+sidebar
pnpm prisma db push
pnpm dev:dev-agency
```

`+sidebar` sets `SITE.features.blogSidebar`. add-module wires `/blog`, admin Blog articles tab, and Prisma `BlogPost` — it does not patch `HomePage.tsx`. To tease posts on the landing page, import `BlogSection` and add a `{ label: "Blog", href: "/blog" }` nav item in `SITE.agency.nav`.

Full walkthrough: docsite **Developers → Templates → Dev Agency Website** and **Developers → Blog → Compose module**.

## Local development (monorepo)

```bash
pnpm dev:dev-agency
cd templates/dev-agency-website-template && pnpm prisma db push && pnpm dev
```

Admin: `/admin` — manage expertise, team, portfolio, leads, theme, and logo.

## Customization

- Section copy: `constants/site.ts` → `SITE.agency`
- Seed defaults: `constants/default-agency-data.ts` (shown when DB is empty)
- Colors: admin Theme tab or `SITE.theme.colors`
