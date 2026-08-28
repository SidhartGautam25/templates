# Scaffold overlay (`packages/core/scaffold`)

Copied on top of `packages/core` when you run `pnpm new-template`.

## Theme CSS (required practice)

`app/globals.css` ships with:

- `:root` CSS variables (synced from `constants/site.ts` via `ensureTemplateThemeGlobals`)
- Tailwind v4 `@theme` mappings (`bg-bg-tan`, `text-text-main`, …)
- `@layer base` body wired to variables + transition

**Do not** hardcode page background/text hex in components — use theme utility classes.

**Do not** put `SITE.theme.colors` inline on `<html>` in `layout.tsx` — it blocks `theme-modes`.

Optional dark/light toggle: `tempjs add-module theme-modes` (or include in `--modules` at creation).
