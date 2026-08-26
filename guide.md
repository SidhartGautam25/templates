# tempjs CLI — technical guide

This document explains how the **tempjs** CLI is structured, how template fetching, versioning, and updates work internally. For day-to-day usage examples, see [README.md](./README.md).

---

## CLI module map

The CLI is split into small modules — each file has a single responsibility:

| Module | Responsibility |
|--------|----------------|
| `index.js` | Command routing, help text, orchestration |
| `parse-args.js` | Flag parsing (`--yes`, `--theme`, `--check`, …) |
| `config.js` | Load `templates.json`, resolve GitHub repo env overrides |
| `template-resolver.js` | Local template vs remote tarball (single entry point) |
| `fetch.js` | Download GitHub archive, extract one template folder |
| `copy.js` | Copy template tree into target directory |
| `fs-ignore.js` | Shared skip rules (`.env`, `node_modules`, protected paths) |
| `file-tree.js` | Walk directories, SHA-256 hashes, diff algorithm |
| `project-stamp.js` | Read/write `.tempjs.json` |
| `update.js` | `update --check` report and `update --merge` apply |
| `progress.js` | Format bytes, duration, fetch completion line |
| `prompt.js` | Shared yes/no confirmation |
| `info.js` | `tempjs info` output |
| `theme-manager.js` | Themes, fonts, `.tempjsrc` |
| `brand-manager.js` | `constants/site.ts` brand fields |
| `db-setup.js` | `.env` + optional `prisma db push` |

**DRY principles used:**

- Skip rules live in `fs-ignore.js` (used by `copy.js`, `fetch.js`, `file-tree.js`, `update.js`).
- Template resolution is centralized in `template-resolver.js` (used by `index.js` and `update.js`).
- Confirmations use `prompt.js` instead of duplicating readline logic.

---

## Template fetching

### Strategy

`tempjs hotel` does **not** run `git clone` or per-file GitHub API calls.

1. Download **one** tarball from `codeload.github.com/{owner}/{repo}/tar.gz/{branch}`.
2. Extract only `templates/<template-directory>/` from the archive.
3. Validate (`package.json` exists), copy into the user's directory.

This avoids GitHub API rate limits (60 req/hr unauthenticated) and is fast for typical template repos.

### Progress feedback

After resolve completes, the CLI prints:

```text
Fetching template "hotel"... done (4.2 MB, 130 files, 1.8s, download)
```

| Metric | Source |
|--------|--------|
| Size | Tarball bytes on disk (0 for local copy) |
| Files | Count of template files after extract (excluding skipped paths) |
| Duration | `performance.now()` around download + extract |
| Source | `local copy` or `download` |

Implementation: `fetch.js` returns `{ templateRoot, cleanupDir, stats }`; `progress.js` formats the line.

### Local development

When the CLI package is linked from this repo, `template-resolver.js` uses `templates/hotel-website-template/` on disk (no network). Stats show `0ms, local copy`.

Force remote: `tempjs hotel --remote` or `TEMPLATE_USE_REMOTE=1`.

---

## Project stamping (`.tempjs.json`)

### When it is created

After a successful `tempjs <id>` copy, `project-stamp.js` writes `.tempjs.json` containing:

- Template id and **manifest version** (`templates.json` → `"version"`).
- `generatedAt` timestamp (preserved on updates).
- `fileHashes`: SHA-256 of every file in the template tree (baseline for updates).

Hashes are computed from the template source **before** user customization (`file-tree.js` + `fs-ignore.js`).

### Example

```json
{
  "template": "hotel",
  "templateVersion": "1.2.0",
  "templateDirectory": "hotel-website-template",
  "generatedAt": "2026-08-26T04:52:13.543Z",
  "repository": "SidhartGautam25/templates",
  "branch": "main",
  "fileHashes": {
    "lib/features/leads/lead.service.ts": "a1b2c3…"
  }
}
```

After `tempjs update --merge`, `templateVersion` and `fileHashes` refresh; `updatedAt` is set.

### Manifest versioning

Maintainers bump per-template version in `templates.json`:

```json
"hotel": {
  "directory": "hotel-website-template",
  "version": "1.2.0",
  ...
}
```

`tempjs list` and `tempjs info` surface this version. Clients compare their `.tempjs.json` `templateVersion` against the manifest when running `update --check`.

---

## Template update algorithm

### Commands

| Command | Action |
|---------|--------|
| `tempjs update --check` | Fetch latest template, diff, print report — **no writes** |
| `tempjs update --merge` | Apply safe updates + new files; refresh stamp |
| `tempjs update --merge --yes` | Merge without confirmation prompt |

Requires `.tempjs.json` in the current directory.

### Three hash sets

For each file path in the **latest** template:

| Hash | Meaning |
|------|---------|
| `baseline` | From `.tempjs.json` `fileHashes` at last stamp |
| `current` | File on disk in the client project now |
| `latest` | File in the newest template from GitHub/local |

### Classification

```
if current === latest     → up to date (skip)
if current === baseline && latest !== baseline → SAFE UPDATE (template changed, user didn't)
if current !== latest && current !== baseline → CONFLICT (user edited)
if file missing in project → NEW FILE (add)
if file in baseline but not in latest → REMOVED FROM TEMPLATE (warn only, do not delete)
```

### Protected paths

Never overwritten by `--merge` (`fs-ignore.js` → `UPDATE_PROTECTED_PATHS`):

- `.env`, `.env.*` (except `.env.example`)
- `constants/site.ts`
- `.tempjsrc`, `app/tempjs-theme.css`
- `.git`

Brand, secrets, and theme choices stay under client control.

### Merge apply

`update.js` copies only safe + new paths from a temp template directory (`copyTemplateFile` per file), then re-stamps with the new manifest version and refreshed `fileHashes` from the latest template tree.

Conflicts remain for manual resolution (e.g. merge `app/components/Hero.tsx` by hand).

---

## Flow diagrams

### Create project

```
tempjs hotel
    → resolveTemplateSource()     # local or tarball
    → copyTemplate()              # flat copy to cwd
    → writeProjectStamp()         # .tempjs.json + fileHashes
    → (optional) theme/brand/db
```

### Update project

```
tempjs update --check
    → readProjectStamp()
    → resolveTemplateSource()     # latest template
    → collectFileHashes() × 3   # baseline, current, latest
    → diffTemplateTrees()
    → printUpdateReport()

tempjs update --merge
    → same diff
    → copy safe/new files only
    → writeProjectStamp(isUpdate: true)
```

---

## Maintainer checklist

When shipping template fixes:

1. Edit `packages/core/` or `templates/overlays/<template>/`.
2. `pnpm sync-templates`
3. Bump `"version"` in `templates.json` for affected templates.
4. Commit, push, publish CLI if needed.
5. Clients run `tempjs update --check` then `tempjs update --merge`.

---

## Related docs

- [README.md](./README.md) — usage examples for developers
- [ARCHITECTURE.md](./ARCHITECTURE.md) — monorepo core + overlay sync model
- [packages/core/README.md](./packages/core/README.md) — shared library layout in generated projects
