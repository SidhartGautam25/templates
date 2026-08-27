# Versioning

This repo tracks **two independent version numbers**. They mean different things and are bumped separately.

| What | Where stored | Who cares | Example |
|------|----------------|-----------|---------|
| **tempjs CLI** | Root `package.json` (`@navneet_25/tempjs`) | npm publish, `npm install -g` users | `2.1.0` |
| **Template** | `templates.json` per template id | Generated `.tempjs.json`, `tempjs update` | `hotel` → `1.3.0` |

Client projects stamp **template version** only (in `.tempjs.json`). They do not embed the CLI version beyond whatever `tempjs` binary they installed.

---

## How tracking works

File: **`.tempjs-version.json`** (committed in this repo)

On each `tempjs version inc`, we:

1. Bump semver in `package.json` (CLI) or `templates.json` (template)
2. Record **current `git HEAD`** as the baseline for that scope
3. For templates: add a **CHANGELOG.md** stub under `templates/<directory>/`

On `tempjs version check`, we:

1. `git diff` from the recorded commit → `HEAD` for watched paths
2. Include **uncommitted** changes in those paths (`git status`)
3. Report **up to date** or list changed files + suggested `inc` command

If `.tempjs-version.json` is missing, the first `check` initializes it from current versions and HEAD (everything marked up to date).

### Watched paths

| Scope | Paths |
|-------|--------|
| **CLI** | `cli/`, `package.json`, `templates.json` |
| **Each template** | `templates/<directory>/` (e.g. `templates/hotel-website-template/`) |

Changes to **`packages/core/`** do not auto-bump templates — after a core fix, run optional `pnpm sync-templates` if you want templates updated, then bump template versions if the propagated change is user-facing.

---

## Maintainer commands

Run from **monorepo root** (where `templates.json` lives):

```bash
# See if anything changed since last release bumps
tempjs version check
pnpm version:check          # same

# Check one template
tempjs version check hotel

# Bump CLI (npm package)
tempjs version inc patch cli
tempjs version inc minor cli
tempjs version inc major cli

# Bump one template (templates.json + CHANGELOG stub)
tempjs version inc patch hotel
tempjs version inc minor real-estate

# Bump everything (CLI + all templates)
tempjs version inc patch all
```

### Recommended release loop

```bash
# 1. Develop template
edit templates/hotel-website-template/
pnpm dev:hotel

# 2. Optional: if you also fixed packages/core
edit packages/core/
pnpm sync-templates

# 3. Document
#    Edit templates/hotel-website-template/CHANGELOG.md

# 4. Check unreleased changes
tempjs version check

# 5. Bump versions (if check reported changes)
tempjs version inc minor hotel      # template feature release
tempjs version inc patch cli        # CLI-only fix

# 6. Commit
git add package.json templates.json .tempjs-version.json CHANGELOG.md
git commit -m "chore: hotel template v1.4.0, cli v2.1.1"

# 7. Publish CLI (when ready)
npm publish
```

---

## Semver guidance

| Level | CLI (`tempjs`) | Template (`hotel`, etc.) |
|-------|----------------|---------------------------|
| **patch** | Bugfix, docs, no flag changes | Seed fix, copy path fix, docs in template |
| **minor** | New command, new optional flags | New pages, new API routes, non-breaking schema |
| **major** | Breaking CLI or flag behavior | Breaking schema migration, removed routes |

---

## Client developers

Generated projects contain:

```json
// .tempjs.json
{
  "template": "hotel",
  "templateVersion": "1.3.0",
  ...
}
```

`tempjs update --check` compares the client project to the **template version** in `templates.json`, not the CLI version.

---

## Troubleshooting

**Edited `templates/hotel-website-template/` only** — Correct workflow. Bump with `tempjs version inc patch hotel`.

**Edited `packages/core/`** — Run `pnpm sync-templates` if you want existing templates updated, then bump affected template versions.

**Version bump aborted** — (Legacy) sync check was removed from version inc; if checks fail elsewhere, run `tempjs version check` for details.

---

## Related files

| File | Role |
|------|------|
| `.tempjs-version.json` | Git baselines per scope |
| `templates.json` | Template ids and semver |
| `package.json` | CLI semver |
| `templates/<dir>/CHANGELOG.md` | Human release notes |
