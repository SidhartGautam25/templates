# Website Templates

A single repository containing multiple website project templates, plus a small CLI that instantiates any template directly into your current directory.

## Quick start

```bash
# Install the CLI globally
npm install -g @navneet_25/tempjs

# Create a new project
mkdir hotel-client
cd hotel-client
tempjs hotel
git init
git add .
git commit -m "Initial project"
```

**Documentation site:** [`docsite/`](docsite/) — JSON-driven docs for developers and maintainers. Run `pnpm docs:dev` from repo root.

## Available templates

| ID            | Name                 | Description                                      |
|---------------|----------------------|--------------------------------------------------|
| `hotel`       | Hotel Website        | Hotel and resort site with admin, gallery, booking |
| `real-estate` | Real Estate Website  | Property listings with admin panel               |

List templates from the CLI:

```bash
tempjs list
```

## CLI reference

### Discover templates

#### `tempjs list`

Shows every available template with a short summary:

```bash
tempjs list
```

Output includes:

- Template **id** (what you pass to `tempjs hotel`, etc.)
- **Name** and **description**
- **Tags** (e.g. `admin`, `cms`, `gallery`)
- **Stack** preview (first few technologies)

Run `tempjs info <id>` for full details.

#### `tempjs info <template-id>`

Shows everything a developer needs before choosing a template:

```bash
tempjs info hotel
tempjs info real-estate
```

Displays:

| Field | Example |
|-------|---------|
| Version | `1.0.0` |
| Stack | Next.js 16, React 19, Prisma, MariaDB, … |
| Node.js | `>=20` |
| Package manager | `pnpm` |
| Typical setup time | `~10 min` |
| Docker | Yes / No |
| Tags | `admin`, `cms`, `gallery` |
| Features | Bullet list of capabilities |
| Source path | `templates/hotel-website-template` |
| Repository | `github.com/SidhartGautam25/templates` |
| Quick start commands | Copy-paste examples |
| Docs file | `DEVELOPER_GUIDE.md` (in generated project) |

If the template id is wrong:

```text
Unknown template: xyz
Run `tempjs list` to see available templates.
```

---

### Create a project

#### Basic (copy only)

```bash
mkdir my-client && cd my-client
tempjs hotel
```

Copies template files into the **current directory** (not a subfolder). Does not run theme, brand, or database setup.

#### Interactive full setup

```bash
tempjs hotel config
# or
tempjs hotel --config
```

After copying, prompts for:

1. **Theme** (theme1–theme5)
2. **Font pairing** (default, inter, lora-montserrat, …)
3. **Brand & contact** (name, URL, phone, email, address)
4. **Database & admin** (.env + optional `prisma db push`)

#### Non-interactive full setup

Use `--yes` (or `-y` / `--no-prompt`) to skip every prompt. Values come from flags; anything not provided uses template defaults.

```bash
mkdir mi-plaza && cd mi-plaza

tempjs hotel --config --yes \
  --theme theme2 \
  --name "Mi Plaza" \
  --base-url "https://miplaza.com" \
  --db-host localhost \
  --db-name mi_plaza_db \
  --admin-user admin \
  --admin-password mypass \
  --skip-db-push
```

#### Partial automation

Configure only what you care about; the rest uses defaults:

```bash
tempjs hotel --config --yes --theme theme3 --name "Mi Plaza"
```

Then configure the rest later in the same project directory:

```bash
tempjs init-db --yes --db-host localhost --db-name mi_plaza_db
tempjs brand --yes --name "Mi Plaza" --email "hello@miplaza.com"
tempjs theme --theme theme2 --yes
tempjs font --font inter --yes
```

#### Fetch progress

When downloading a template, tempjs reports size, file count, and duration:

```text
Fetching template "hotel"... done (4.2 MB, 130 files, 1.8s, download)
```

From a linked local dev copy (no network):

```text
Fetching template "hotel"... done (130 files, 0ms, local copy)
```

---

### Template versioning (`.tempjs.json`)

Every new project is stamped with a `.tempjs.json` file at the root:

```json
{
  "template": "hotel",
  "templateVersion": "1.2.0",
  "templateDirectory": "hotel-website-template",
  "generatedAt": "2026-08-26T04:52:13.543Z",
  "updatedAt": "2026-08-26T05:10:00.000Z",
  "repository": "SidhartGautam25/templates",
  "branch": "main",
  "fileHashes": {
    "package.json": "abc123…",
    "lib/database/prisma.ts": "def456…"
  }
}
```

| Field | Purpose |
|-------|---------|
| `template` | CLI id (`hotel`, `real-estate`) |
| `templateVersion` | Manifest version when last stamped |
| `generatedAt` | First `tempjs` run in this folder |
| `updatedAt` | Last successful `tempjs update --merge` |
| `fileHashes` | SHA-256 of each template file at stamp time (baseline for updates) |

**Commit `.tempjs.json`** to your client repo so you know which template version the project started from.

Check version in manifest:

```bash
tempjs list          # shows v1.2.0 next to template name
tempjs info hotel    # shows full version in details
```

When maintainers bump `"version"` in `templates.json` and push, clients can pull fixes safely.

**Two version numbers (don’t confuse them):**

| Version | Where | Meaning |
|---------|--------|---------|
| **CLI** (`@navneet_25/tempjs`) | npm / `package.json` in templates repo | The `tempjs` tool itself |
| **Template** (`hotel`, `real-estate`) | `templates.json` → your `.tempjs.json` | The website template snapshot |

Maintainers: see **[VERSIONING.md](./VERSIONING.md)** for `tempjs version check` / `tempjs version inc`.

---

### Update an existing project (`tempjs update`)

Use inside a project that has `.tempjs.json` (created by `tempjs hotel`, etc.).

#### Check what changed (read-only)

```bash
cd mi-plaza
tempjs update --check
```

Example output:

```text
Template update report: Hotel Website
  Project version:  1.1.0
  Latest version: 1.2.0

Safe updates (1) — template changed, you did not edit:
  ~ lib/utils/slugify.ts

Conflicts (1) — you modified these files:
  ! app/components/Hero.tsx

129 file(s) already match the latest template.
```

| Report section | Meaning |
|----------------|---------|
| **New files** | Added in latest template; not in your project yet |
| **Safe updates** | Template changed; you did **not** edit since generation → can auto-merge |
| **Conflicts** | You modified files that also changed in the template → manual review |
| **Removed from template** | No longer in template; **not deleted** from your project |

#### Apply non-conflicting updates

```bash
tempjs update --merge
# or without prompt:
tempjs update --merge --yes
```

Only **new files** and **safe updates** are copied. Conflicts are listed but never overwritten.

**Protected paths** (never touched by merge):

- `.env`, `.env.*` (except `.env.example`)
- `constants/site.ts` (brand/contact)
- `.tempjsrc`, `app/tempjs-theme.css`
- `.tempjs.json` (updated after merge with new version + hashes)

#### Full workflow example

```bash
# 1. Create client project (stamped v1.1.0)
mkdir mi-plaza && cd mi-plaza
tempjs hotel --config --yes --name "Mi Plaza"

# 2. Customize freely
#    edit app/components/Hero.tsx, constants/site.ts, .env …

# 3. Later — maintainer published template v1.2.0 with bug fixes in lib/

tempjs update --check     # see safe updates vs conflicts
tempjs update --merge --yes   # apply only non-conflicting fixes

# 4. Manually merge conflicts if any (e.g. Hero.tsx)
```

Use `--remote` to fetch the latest template from GitHub instead of a local linked copy:

```bash
tempjs update --check --remote
tempjs update --merge --remote --yes
```

---

### Post-init commands (inside a generated project)

Run these from the project root (where `package.json` exists):

| Command | Purpose |
|---------|---------|
| `tempjs theme` | Change color theme |
| `tempjs font` | Change font pairing |
| `tempjs brand` | Update brand name, URL, contact info |
| `tempjs init-db` | Create/update `.env` and sync Prisma schema |

Examples:

```bash
tempjs theme --theme theme3 --yes
tempjs brand --yes --name "New Name" --email "new@example.com"
tempjs init-db --yes --db-host 127.0.0.1 --db-name my_db --db-push
```

When re-running with `--yes`, unspecified fields keep existing values from `constants/site.ts` or `.env`.

---

### All CLI flags

#### General

| Flag | Short | Description |
|------|-------|-------------|
| `--config` | | Run theme + font + brand + database setup after copy |
| `--yes` | `-y` | Skip all prompts |
| `--no-prompt` | | Same as `--yes` |
| `--force` | `-f` | Overwrite existing files; auto-confirm overwrite warnings |
| `--remote` | | Fetch from GitHub even if local templates exist |
| `--init-git` | | Run `git init` after copying |
| `--help` | `-h` | Show help |

#### Theme & typography

| Flag | Values | Description |
|------|--------|-------------|
| `--theme` | `theme1` … `theme5` | Color theme id |
| `--font` | See table below | Font pairing id |

**Theme ids**

| Id | Name |
|----|------|
| `theme1` | Slate / Blue (default) |
| `theme2` | Forest / Green |
| `theme3` | Purple / Violet |
| `theme4` | Red / Crimson |
| `theme5` | Amber / Gold |

**Font ids**

| Id | Pairing |
|----|---------|
| `default` | Playfair Display + Outfit (default) |
| `inter` | Inter + Inter |
| `lora-montserrat` | Lora + Montserrat |
| `merriweather-open-sans` | Merriweather + Open Sans |
| `cinzel-montserrat` | Cinzel + Montserrat |

With `--yes`, if `--theme` / `--font` is omitted, the current or default id is used.

#### Brand & contact

| Flag | Example | Written to |
|------|---------|------------|
| `--name` | `"Mi Plaza"` | `constants/site.ts` → brand name |
| `--short-name` | `"Mi Plaza"` | Short / display name |
| `--base-url` | `"https://miplaza.com"` | Site URL (also derives `wwwHost`) |
| `--phone` | `"9876543210"` | Raw phone number |
| `--phone-display` | `"+91 98765 43210"` | Formatted display phone |
| `--country-code` | `"91"` | Phone country code |
| `--email` | `"info@miplaza.com"` | Contact email |
| `--address` | `"Pune, Maharashtra, India"` | Full address string |

Quotes are optional in the shell when the value has no spaces:

```bash
--email info@miplaza.com
--name "Mi Plaza"
--base-url=https://miplaza.com    # --key=value also works
```

#### Database & admin

| Flag | Example | Written to |
|------|---------|------------|
| `--db-host` | `localhost` | `.env` → `DATABASE_URL` host |
| `--db-port` | `3306` | Database port |
| `--db-user` | `root` | Database username |
| `--db-password` | `secret` | Database password |
| `--db-name` | `mi_plaza_db` | Database name |
| `--admin-user` | `admin` | `.env` → `ADMIN_USER` |
| `--admin-password` | `mypass` | `.env` → `ADMIN_PASSWORD` |
| `--db-push` | | With `--yes`, run `npx prisma db push` after writing `.env` |
| `--skip-db-push` | | With `--yes`, skip `prisma db push` |

Default database name (if not set): derived from the folder name, e.g. `mi-plaza` → `mi_plaza_db`.

**Prisma / database behavior**

| Mode | Behavior |
|------|----------|
| Interactive `init-db` | Prompts for DB fields; asks whether to run `prisma db push` |
| `--yes` without flags | Uses defaults / existing `.env` values; runs `prisma db push` |
| `--yes --skip-db-push` | Writes `.env` only; no Prisma |
| `--yes --db-push` | Explicitly runs `prisma db push` |

Ensure MySQL/MariaDB is running before `--db-push`.

---

### Manifest metadata (`templates.json`)

Each template entry can include metadata used by `tempjs list` and `tempjs info`:

```json
{
  "repository": {
    "owner": "SidhartGautam25",
    "repo": "templates",
    "branch": "main",
    "templatesPath": "templates"
  },
  "templates": {
    "hotel": {
      "directory": "hotel-website-template",
      "name": "Hotel Website",
      "description": "Modern hotel and resort website with admin panel, gallery, and booking features",
      "version": "1.0.0",
      "stack": ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Prisma", "MariaDB", "NextAuth"],
      "packageManager": "pnpm",
      "node": ">=20",
      "setupTime": "~10 min",
      "docker": true,
      "tags": ["admin", "cms", "gallery", "booking", "leads"],
      "features": [
        "Admin dashboard for rooms, facilities, reviews, and leads",
        "Gallery and promo banner management",
        "FTP asset upload pipeline"
      ],
      "docs": "DEVELOPER_GUIDE.md"
    }
  }
}
```

| Field | Required | Used by |
|-------|----------|---------|
| `directory` | Yes | CLI copy path |
| `name` | Yes | `list`, `info`, success messages |
| `description` | Yes | `list`, `info` |
| `version` | No | `info` |
| `stack` | No | `list`, `info` |
| `packageManager` | No | `info` |
| `node` | No | `info` |
| `setupTime` | No | `info` |
| `docker` | No | `info` |
| `tags` | No | `list`, `info` |
| `features` | No | `info` |
| `docs` | No | `info` — filename inside generated project |

Adding a new template: add the folder + one manifest entry. No CLI code changes required.

---

### Install & update the CLI

```bash
# First install
npm install -g @navneet_25/tempjs

# Update to latest (recommended after new templates or CLI features)
npm install -g @navneet_25/tempjs@latest
```

Current version: **2.1.0** (doctor, version tracking, copy-once core starter kit, optional sync propagate, update merge).

See also: [guide.md](./guide.md) for CLI architecture, [VERSIONING.md](./VERSIONING.md) for release workflow.

Verify:

```bash
tempjs --help
tempjs list
```

## CLI usage (quick reference)

```bash
tempjs list                  # show available templates
tempjs info hotel            # detailed template metadata (stack, features, setup)
tempjs hotel                 # create project from hotel template
tempjs hotel config          # interactive setup (theme, font, brand, database)
tempjs hotel --config --yes  # non-interactive setup with defaults
tempjs theme --theme theme3 --yes
tempjs brand --yes --name "Mi Plaza" --base-url "https://miplaza.com"
tempjs init-db --yes --db-host localhost --db-name my_db --skip-db-push
tempjs real-estate --force   # overwrite existing files
tempjs doctor                # readiness check (generated projects)
tempjs add-module list       # optional core modules available
tempjs add-module seo,gallery,reviews  # add modules to existing project
tempjs --help                # show help
```

### Optional core modules (client projects)

After `tempjs hotel`, add cross-vertical features without re-copying the template:

```bash
tempjs add-module list
tempjs add-module seo,gallery,reviews
pnpm prisma db push && pnpm dev
```

Modules: `enquiry-modal`, `footer`, `hero-simple`, `seo`, `gallery`, `reviews`, `legal-pages`. See `packages/core/modules.json` and docsite → Developers → Optional modules.

Shipped **hotel** and **real-estate** templates already include vertical features and adopted core modules where they overlapped bespoke code.

### Maintainer commands (monorepo root)

```bash
pnpm new-template bakery --name "Bakery" --modules enquiry-modal,footer,hero-simple,seo
pnpm template:add-module hotel gallery,reviews
pnpm template:assemble hotel          # vertical modules → template root
pnpm template:extract-modules hotel   # template root → modules/
pnpm sync-templates
pnpm dev:hotel
tempjs version check         # unreleased CLI/template changes?
tempjs version inc patch cli
tempjs version inc minor hotel
```

See [VERSIONING.md](./VERSIONING.md).

### Options (summary)

| Option | Description |
|--------|-------------|
| `--config` | Run full setup (theme, font, brand, db) after copying |
| `--yes`, `-y`, `--no-prompt` | Skip all prompts; use defaults or flag values |
| `--force`, `-f` | Overwrite files without prompting |
| `--theme`, `--font` | Theme/font id (see CLI reference above) |
| `--name`, `--base-url`, `--email`, … | Brand/contact fields (non-interactive) |
| `--db-host`, `--db-name`, `--admin-user`, … | Database and admin credentials |
| `--db-push` / `--skip-db-push` | Control `prisma db push` with `--yes` |
| `--remote` | Fetch from GitHub even when local templates exist |
| `--init-git` | Run `git init` after copying |

See **CLI reference** above for full flag tables, theme/font ids, and examples.

The CLI copies template **contents** into the current directory — not a nested folder:

```
hotel-client/
├── .gitignore
├── package.json
├── app/
├── public/
└── ...
```

Generated projects are fully independent. No submodule, worktree, or connection to this repository.

## Local development (without publishing)

From this repository root:

```bash
npm link

mkdir /tmp/hotel-client
cd /tmp/hotel-client
tempjs hotel
```

When templates exist locally under `templates/`, the CLI uses them directly (fast, no network). Use `--remote` to test GitHub fetching.

## Installation

### Global install (npm)

To install the CLI for the first time:
```bash
npm install -g @navneet_25/tempjs
```

To update an existing installation to the absolute latest version (bypassing local NPM caches):
```bash
npm install -g @navneet_25/tempjs@latest
```
*Use the `@latest` flag when you have recently pushed a new template or updated configuration, to ensure NPM fetches the updated `templates.json` mapping configuration immediately.*

### From this repository

```bash
git clone https://github.com/<username>/templates.git
cd templates
npm link
```

## Configuration

All template mappings and metadata live in **`templates.json`** at the repository root. See **Manifest metadata (`templates.json`)** in the CLI reference for every field.

Minimal example:

```json
{
  "repository": {
    "owner": "your-username",
    "repo": "templates",
    "branch": "main",
    "templatesPath": "templates"
  },
  "templates": {
    "hotel": {
      "directory": "hotel-website-template",
      "name": "Hotel Website",
      "description": "Modern hotel and resort website template"
    }
  }
}
```

For `tempjs info` and richer `tempjs list`, add `version`, `stack`, `tags`, `features`, etc. (documented above).

### GitHub repository URL

Configure in one place — `templates.json` or environment variables:

| Variable               | Description |
|------------------------|-------------|
| `TEMPLATES_REPO_URL`   | Full URL or `owner/repo` |
| `TEMPLATES_REPO_OWNER` | GitHub username or org |
| `TEMPLATES_REPO_REPO`  | Repository name |
| `TEMPLATES_REPO_BRANCH`| Branch (default: `main`) |
| `GITHUB_TOKEN`         | Optional — private repositories only |

Example:

```bash
export TEMPLATES_REPO_URL="https://github.com/myuser/templates"
tempjs hotel --remote
```

## How fetching works

`tempjs hotel` does **not** run `git clone` and does **not** call the GitHub REST API per file.

1. The CLI downloads **one** repository archive from `codeload.github.com` (a single HTTP request — no API rate-limit issues for public repos).
2. It extracts only `templates/hotel-website-template/` from that archive into a temp directory.
3. Files are validated, then copied into your project directory.

The archive contains the whole templates repo on the wire, but only the requested template folder is extracted locally. No `GITHUB_TOKEN` is required for public repositories.

## Repository structure

```
templates/                          # this repository root
├── ARCHITECTURE.md                 # copy-once core + standalone templates
├── MAINTAINERS.md                  # maintainer handbook
├── ROADMAP.md                      # planned improvements
├── packages/
│   └── core/                       # starter kit (copied once via new-template)
├── templates/
│   ├── hotel-website-template/     # full hotel project (what tempjs copies)
│   └── real-estate-website-template/
├── scripts/
│   ├── new-template.mjs
│   └── sync-templates.mjs          # optional: propagate core fixes
├── package.json                    # CLI package + maintainer scripts
├── templates.json
├── cli/
│   └── ...
```

## Shared core starter kit (copy-once)

`packages/core/` is **generic boilerplate** copied once when you run `pnpm new-template`. After that, each template under `templates/<name>/` is a **standalone** Next.js project — edit it directly. Use `pnpm sync-templates` only when you intentionally propagate a fix from core into existing templates.

**Full design doc:** [ARCHITECTURE.md](./ARCHITECTURE.md) · **Maintainer guide:** [MAINTAINERS.md](./MAINTAINERS.md)

### Quick maintainer commands

```bash
# Create a new template (copies core + scaffold once)
pnpm new-template bakery bakery-website-template --name "Bakery Website"

# Daily dev (no sync)
pnpm dev:hotel

# Optional: after fixing packages/core, propagate to existing templates
pnpm sync-templates
pnpm sync-templates:check
```

### What developers receive

A normal Next.js project with organized `lib/`:

- `lib/database/` — Prisma client
- `lib/features/leads/` — shared lead module
- `lib/storage/` — FTP uploads
- `lib/features/<domain>/` — template-specific modules (rooms, projects, …)
- `app/` — routes and UI

All source is on disk; no submodule, no `@tempjs/core` npm dependency in client projects.

### Comparison (other approaches)

| Approach | User gets full source? | Maintained in this repo |
|----------|------------------------|-------------------------|
| **Copy-once core** (current) | Yes | `packages/core` starter + `templates/<name>/` |
| CLI merge at copy time | Yes | `packages/core` only in git |
| npm `@tempjs/core` package | Partial (core in node_modules) | Published package |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for diagrams and adding new templates.

---

## Shared core package — design options (reference)

Hotel and real-estate templates share a large amount of code (auth, admin shell, leads, FTP, Prisma patterns). A **shared core** reduces duplicate maintenance, but you must decide how that core reaches the **generated project** when someone runs `tempjs hotel`.

Generated projects must remain **standalone** — no submodule, no link to the templates repo, no `npm install` required just to get source files from your monorepo layout.

Below are the main approaches and what each means for `tempjs` users.

### The core question

| Where core lives (your repo) | What `tempjs hotel` must produce |
|------------------------------|----------------------------------|
| `packages/core/` (shared) | `hotel-client/` with **all** code needed to build and deploy |

The user never sees `packages/core/` as a separate install step unless you explicitly choose that design.

---

### Option 1: Pre-merge into each template (recommended for tempjs)

**How it works**

- You maintain shared code in `packages/core/` (or `shared/core/`) inside the templates monorepo.
- A **build/sync script** copies (or rsyncs) core files into each template before commit:

  ```bash
  pnpm run sync-templates
  # merges packages/core → templates/hotel-website-template/
  # merges packages/core → templates/real-estate-website-template/
  ```

- What is **committed** under `templates/hotel-website-template/` already contains the merged code.
- `tempjs hotel` only extracts that folder — user gets one flat, complete project.

```
YOUR REPO (maintenance view)          WHAT USER GETS (tempjs hotel)
─────────────────────────          ─────────────────────────────
packages/core/                     hotel-client/
  lib/auth.ts          ──sync──►      lib/auth.ts
  lib/leads.ts                       lib/leads.ts
templates/hotel-website-template/  app/ (hotel-specific)
  app/ (hotel-specific)              package.json
```

**Pros**

- Simplest for CLI — no merge logic in `tempjs`
- User gets 100% source in their repo; easy to customize
- No extra npm dependency on `@you/template-core`
- Works with current tarball fetch

**Cons**

- Duplicated core **in git** across template folders (larger repo)
- Must run sync script when core changes (can be a CI check)

**Maintenance**

1. Fix bug in `packages/core/`
2. Run `pnpm sync-templates`
3. Commit updated `templates/hotel-website-template/` and `templates/real-estate-website-template/`
4. Push — users fetch updated template on next `tempjs hotel`

---

### Option 2: CLI merges core at copy time

**How it works**

- Core stays only in `packages/core/` (not duplicated in each template folder).
- `tempjs` downloads/extracts **two** paths from the tarball:
  1. `packages/core/`
  2. `templates/hotel-website-template/`
- CLI merges them into the user's directory (template files override core on conflict).

```
tempjs fetch
    ├── extract packages/core/     → temp/core/
    └── extract templates/hotel/   → temp/hotel/
              merge(core, hotel)   → user's hotel-client/
```

**Pros**

- Single source of core in git — no duplication in template folders
- User still gets a flat, standalone project (all files copied locally)

**Cons**

- More complex CLI (merge rules, conflict handling, ordering)
- Must define what overrides what (template wins over core)
- Harder to debug if merge goes wrong

**Maintenance**

- Edit `packages/core/` only
- Push — CLI merges on every `tempjs hotel` (no per-template sync commit)

---

### Option 3: Published npm package dependency

**How it works**

- Publish shared code as `@navneet_25/template-core` on npm.
- Each template's `package.json` includes:

  ```json
  "dependencies": {
    "@navneet_25/template-core": "^1.0.0"
  }
  ```

- `tempjs hotel` copies only the **thin** template (pages, schema, config).
- User runs `pnpm install` → core lands in `node_modules/@navneet_25/template-core`.

**What the user gets**

```
hotel-client/
├── app/                    # from template (hotel-specific)
├── package.json            # lists @navneet_25/template-core
└── node_modules/
    └── @navneet_25/template-core/   # shared code HERE, not in src/
```

**Pros**

- Clean separation; one core package versioned independently
- Template folders stay small in the templates repo

**Cons**

- **Not ideal for agency white-label work** — clients customize by editing `node_modules` or you need a build step anyway
- Requires publishing and versioning core on every fix
- Generated project depends on your npm package forever (or until they eject)
- `tempjs` only transfers template files; **core is not in the tarball path** unless user runs install

**When to use**

- Internal products where you control upgrades
- Not ideal if every client project must be fully forkable and editable as plain source

---

### Option 4: pnpm workspace (dev only) + publish flattened templates

**How it works**

- Monorepo:

  ```
  packages/core/
  packages/hotel-app/          # imports from @local/core via workspace
  packages/real-estate-app/
  ```

- Dev with `workspace:*` references.
- **Release pipeline** builds each app and outputs a **flattened** tree into `templates/hotel-website-template/` for the CLI (bundle or copy with a tool like `tsup` / custom script).

Same end result as Option 1 for users; workspace only helps local dev.

---

### Comparison

| Approach | User gets full source? | Core in git once? | CLI complexity | Client customization |
|----------|------------------------|-------------------|----------------|----------------------|
| **1. Pre-merge sync** | Yes | No (duplicated in templates) | Low | Easy |
| **2. CLI merge** | Yes | Yes | High | Easy |
| **3. npm package** | Partial (core in node_modules) | Yes | Low | Harder |
| **4. Workspace + flatten** | Yes | Yes (in packages/) | Medium (build step) | Easy |

---

### Recommendation for your project

**Start with Option 1 (pre-merge sync script)** unless the repo size or sync friction becomes painful.

Reasons:

1. Matches your current `tempjs` design (single folder extract, flat copy).
2. Agencies and clients get **all** code in `app/`, `lib/`, etc. — no hidden package.
3. No change to tarball fetch or rate limits.
4. You can add a GitHub Action: `on push to packages/core → run sync-templates → fail if templates out of date`.

**Sketch of a sync script**

```bash
# scripts/sync-core-to-templates.sh
CORE=packages/core
for tpl in hotel-website-template real-estate-website-template; do
  rsync -a --delete "$CORE/" "templates/$tpl/" \
    --exclude template-specific paths if needed
done
```

Hotel-specific files stay only in the hotel template; only truly shared files live in core. Template-specific overrides stay in the template folder and are not overwritten if you rsync with care (e.g. sync only `lib/`, `app/components/admin/`, etc.).

**When to move to Option 2**

- Many templates (5+) and core duplication in git becomes unwieldy.
- You want a single `packages/core/` commit without touching every template folder.

**Avoid Option 3** if your main users are developers who fork, rename, and heavily customize each client site.

---

### What does *not* work well with tempjs

| Pattern | Problem |
|---------|---------|
| Git submodule in generated project | User gets submodule reference, not standalone repo |
| `workspace:*` in published template | Broken after copy — no monorepo parent |
| Copy only template without core | Incomplete project unless core is npm dependency |

The rule: **everything required to `pnpm install && pnpm build` must either be in the copied folder or in declared npm dependencies.**

## Adding a new template

1. Add a directory under `templates/`, e.g. `templates/restaurant-website-template/`.
2. Include a template-specific `.gitignore` for that stack (Next.js, Vite, etc.).
3. Add metadata to `templates.json` (recommended):

```json
"restaurant": {
  "directory": "restaurant-website-template",
  "name": "Restaurant Website",
  "description": "Restaurant website with menu and reservations",
  "version": "1.0.0",
  "stack": ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"],
  "packageManager": "pnpm",
  "node": ">=20",
  "tags": ["admin", "menu", "reservations"],
  "features": ["Menu management", "Reservation leads"],
  "docs": "DEVELOPER_GUIDE.md"
}
```

4. Commit and push. No CLI source changes required.

## Gitignore rules

### Template repository (this repo)

The root `.gitignore` keeps the templates repository clean:

- `node_modules/`, `.next/`, `dist/`, build caches, logs
- `.env` files (but not `.env.example`)
- OS and IDE junk
- Nested `.git/` directories inside templates

### Generated projects

Each template has its own `.gitignore` (e.g. Next.js ignores). That file is copied into the generated project. The **root** repository `.gitignore` is never copied.

## Safety

- Non-empty directories: warns and prompts before overwriting (use `--force` to skip).
- Never copies `.git` from templates.
- Warns if the target directory is already a Git repository.
- Does not run `npm install`, builds, or other scripts automatically.
- Downloads to a temp directory first; cleans up on failure.

## Tech stack (current templates)

Both current templates use:

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Prisma** + MariaDB
- **NextAuth**

After generating a project:

```bash
pnpm install
cp .env.example .env   # configure database credentials
pnpm dev
```

## Contributing

1. Fork and clone this repository.
2. Make changes inside `templates/<template-name>/`.
3. Update `templates.json` if adding a new template.
4. Test locally with `npm link` and `tempjs <id>`.
5. Open a pull request.

## License

MIT
