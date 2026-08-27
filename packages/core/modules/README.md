# Optional core modules

Files in `packages/core/modules/<id>/` are **not** copied during a plain `new-template`. Install explicitly:

```bash
pnpm new-template bakery --modules enquiry-modal,footer,hero-simple
pnpm template:add-module bakery footer
```

## Available modules

| Id | Component path | Feature flag |
|----|----------------|--------------|
| `enquiry-modal` | `app/components/EnquiryModal.tsx` | `SITE.features.enquiryModal` |
| `footer` | `app/components/Footer.tsx` | `SITE.features.footer` |
| `hero-simple` | `app/components/Hero.tsx` | `SITE.features.heroSimple` |

Registry: `packages/core/modules.json`

## Adding a new module

1. Create `packages/core/modules/<id>/` with files mirroring template paths
2. Register in `modules.json` (`paths`, `featureFlag`, `label`)
3. Add `SITE.features.<flag>` to `constants/site.ts` if needed
4. Document in MAINTAINERS.md

Modules are excluded from `sync-templates` / `template:diff-core` core file lists (under `modules/` prefix).
