# tempjs docsite

Next.js docs for **tempjs** — developers (client projects) and maintainers (monorepo templates).

## Run locally

```bash
cd docsite && pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

From repo root: `pnpm docs:dev`

## Content model

- **Pages** — JSON under `content/developers/` and `content/maintainers/` (blocks: paragraphs, headings, command-ref, command-builder, …).
- **Commands reference** — `content/shared/commands.json` (syntax, examples, flag groups).
- **Command builders** — interactive generators on many pages (see below).
- **Templates** — `content/templates-registry.json` + per-template pages under `content/developers/templates/`.

## Command builders

Pages can embed a **Command generator** (quick presets + step-by-step wizard) via JSON:

```json
{ "type": "command-builder", "builderId": "developer-add-module" }
```

Template pages omit `builderId` and use `commandBuilder` from `templates-registry.json`.

**Maintainer guide (read this to add or change builders):** [COMMAND_BUILDERS.md](./COMMAND_BUILDERS.md)

Registry files:

| File | Purpose |
|------|---------|
| `content/shared/command-builders-registry.json` | Segment builders (add-module, new-template, sync, …) |
| `content/templates-registry.json` | Per-template generate commands (hotel, real-estate) |
| `content/shared/command-builder-fields.json` | Reusable flags and positional field defs |
| `content/shared/command-builder-options.json` | Dropdown option sets |

Implemented builders are listed on **Maintainers → Command builders** in the site.

## Adding a new docs page

1. Create `content/<audience>/<slug>.json` with `title`, `description`, `blocks`.
2. Register in `src/lib/content.ts` (`developerPages` or `maintainerPages`).
3. Add nav entry in `content/navigation.json`.

For new templates, use `pnpm new-template <id> --with-docs` to stub registry + page + content.ts import.

## Build

```bash
pnpm docs:build
```
