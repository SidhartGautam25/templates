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
3. For templates: add a **CHANGELOG.md** stub under the overlay

On `tempjs version check`, we:

1. `git diff` from the recorded commit → `HEAD` for watched paths
2. Include **uncommitted** changes in those paths (`git status`)
3. Report **up to date** or list changed files + suggested `inc` command

If `.tempjs-version.json` is missing, the first `check` initializes it from current versions and HEAD (everything marked up to date).

### Watched paths

| Scope | Paths |
|-------|--------|
| **CLI** | `cli/`, `package.json`, `templates.json` |
| **Each template** | `packages/core/`, `scripts/sync-templates.mjs`, overlay, merged template folder |

Changes to **`packages/core/`** appear in every template’s check (shared code). Bump all affected templates when core changes materially.

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
# If overlay/core/sync script changed since last bump, runs sync-templates:check first
tempjs version inc patch hotel
tempjs version inc minor real-estate

# Bump everything (CLI + all templates)
tempjs version inc patch all
```

### Recommended release loop

```bash
# 1. Develop
edit packages/core or templates/overlays/...
pnpm sync-templates
pnpm dev:hotel

# 2. Document
#    Edit templates/overlays/<template>/CHANGELOG.md

# 3. Check unreleased changes
tempjs version check

# 4. Bump versions (if check reported changes)
# Template inc auto-runs sync-templates:check when overlay/core changed
tempjs version inc minor hotel      # template feature release
tempjs version inc patch cli        # CLI-only fix

# 5. Commit
git add package.json templates.json .tempjs-version.json CHANGELOG.md
git commit -m "chore: hotel template v1.4.0, cli v2.1.1"

# 6. Publish CLI (when ready)
npm publish
```

---

## Semver guidance

| Level | CLI (`tempjs`) | Template (`hotel`, etc.) |
|-------|----------------|---------------------------|
| **patch** | Bugfix, docs, no new flags | Copy/seed fix, small overlay tweak |
| **minor** | New commands (`doctor`, `version`), new flags | New pages, features, non-breaking API |
| **major** | Breaking CLI behavior or manifest shape | Breaking schema, removed files clients rely on |

Template **major** bumps: clients on `tempjs update --check` see a version gap; document breaking changes clearly in `CHANGELOG.md`.

---

## Users & client developers

### Installing the CLI

```bash
npm install -g @navneet_25/tempjs
tempjs --help
```

The npm version is the **CLI version** only. It does not change your generated project until you run `tempjs update`.

### Generated project version

After `tempjs hotel`, see `.tempjs.json`:

```json
{
  "template": "hotel",
  "templateVersion": "1.3.0",
  ...
}
```

- **`templateVersion`** — snapshot of the template when generated or last merged update
- Compare with latest via `tempjs update --check`
- Read **`CHANGELOG.md`** in your project for what changed between versions

### `tempjs update` vs CLI version

| Command | Compares |
|---------|----------|
| `tempjs update --check` | Your project files vs latest template on GitHub |
| `tempjs version check` | Monorepo git state vs last maintainer bump (maintainers only) |

You do **not** need to bump the CLI for every template change. Publish a new CLI when the **tool** changes; bump **template version** when **template content** changes.

---

## Troubleshooting

**“Version tracking requires a git repository”** — Run from the cloned templates repo, not a generated client project.

**Check always shows changes after bump** — Uncommitted edits in watched paths. Commit or stash before checking, or bump again after committing.

**Baseline commit missing** — Re-run `tempjs version inc` for that scope to reset the baseline to current HEAD.

**Edited merged `templates/hotel-website-template/` only** — Prefer editing overlay + `pnpm sync-templates`. Direct merged edits are tracked but violate maintainer workflow.

**Version bump aborted: out of sync** — `tempjs version inc` for a template runs `sync-templates:check` when `packages/core/`, the overlay, or `scripts/sync-templates.mjs` changed since the last bump. Run `pnpm sync-templates` and retry.

---

## Files reference

| File | Purpose |
|------|---------|
| `package.json` | CLI semver (`@navneet_25/tempjs`) |
| `templates.json` | Per-template semver |
| `.tempjs-version.json` | Git baseline per scope |
| `templates/overlays/*/CHANGELOG.md` | Human-readable template release notes |
| Generated `.tempjs.json` | Client project template version stamp |
