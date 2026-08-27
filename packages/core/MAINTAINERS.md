# Shared foundation copied once into each new template.

Edit `packages/core` when a fix should apply to **future** templates (via `new-template`) or optionally to **existing** ones (via `pnpm sync-templates`).

## Normal workflow

**New template:** `pnpm new-template <id> [directory] --name "..."`  
**Existing template:** edit `templates/<directory>/` only — `pnpm dev:<id>`

**Do not run sync** unless you intentionally changed core and want to propagate.

See [README.md](./README.md) and repo [ARCHITECTURE.md](../../ARCHITECTURE.md).
