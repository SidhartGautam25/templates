# Changelog — Real Estate Website Template

All notable template changes are documented here. When you run `tempjs update --check`, compare your `.tempjs.json` version with the latest in `templates.json`.

## [1.3.0] — 2026-08-26

### Added
- `GETTING_STARTED.md` — linear setup checklist
- `ARCHITECTURE.md` — folder map, admin, leads flow
- `README.md` — onboarding-focused project readme
- `GET /api/health` — database and env sanity probe
- `.vscode/extensions.json` and `settings.json` — ESLint, Tailwind, Prisma
- Tiered `.env.example` (required vs optional FTP / LeadRat)
- `CHANGELOG.md` (this file)

### Changed
- Demo brand: **Greenfield Properties** (Pune listings) — replaces Chanakya/Godrej placeholder content
- `package.json` name: `greenfield-properties-website`
- Demo property listings in `constants/default-projects.ts` and seed
- Generic `docker-compose.yml` for local MariaDB (`tempjs-mariadb`, `app_db`)
- New-launch stamp badge uses `SITE.brand.shortName` from `constants/site.ts`
- Default admin password fallback aligned with `.env.example`

### Removed from generated projects
- Root-level FTP test scripts (moved to maintainer `scripts/dev/` in the templates repo)

## [1.2.0]

- Shared core + overlay build via `pnpm sync-templates`
- `tempjs update --check` and `--merge` with `.tempjs.json` file hashes
- Non-interactive CLI flags (`--yes`, `--theme`, brand and DB options)

## [1.0.0]

- Initial real estate template: property listings, slug pages, admin, leads, FTP, LeadRat
