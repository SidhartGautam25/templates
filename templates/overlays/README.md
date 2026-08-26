# Template overlays

Each subdirectory here contains **template-specific** source only.

Shared code lives in `packages/core/`. Do not duplicate shared files here.

## Workflow

1. Edit files in this overlay (e.g. `hotel-website-template/`).
2. From repo root: `pnpm sync-templates`
3. Commit this overlay **and** the synced folder `templates/<name>/`.

## hotel-website-template

Hotel/resort domain: room types, facilities, reviews, gallery, hotel config.

## real-estate-website-template

Real-estate domain: property listings, project CRUD API.
