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

## Available templates

| ID            | Name                 | Description                                      |
|---------------|----------------------|--------------------------------------------------|
| `hotel`       | Hotel Website        | Hotel and resort site with admin, gallery, booking |
| `real-estate` | Real Estate Website  | Property listings with admin panel               |

List templates from the CLI:

```bash
tempjs list
```

## CLI usage

```bash
tempjs list                  # show available templates
tempjs hotel                 # create project from hotel template
tempjs real-estate --force   # overwrite existing files
tempjs --help                # show help
```

### Options

| Option        | Description |
|---------------|-------------|
| `--force`     | Overwrite files in the current directory without prompting |
| `--remote`    | Fetch from GitHub even when a local template copy exists |
| `--init-git`  | Run `git init` after copying (optional) |
| `--help`      | Show help |

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

All template mappings live in **`templates.json`** at the repository root:

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

### GitHub repository URL

Configure in one place — `templates.json` or environment variables:

| Variable               | Description |
|------------------------|-------------|
| `TEMPLATES_REPO_URL`   | Full URL or `owner/repo` |
| `TEMPLATES_REPO_OWNER` | GitHub username or org |
| `TEMPLATES_REPO_REPO`  | Repository name |
| `TEMPLATES_REPO_BRANCH`| Branch (default: `main`) |
| `GITHUB_TOKEN`         | Optional token for higher API rate limits |

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
├── README.md
├── package.json                    # CLI package (bin: tempjs)
├── templates.json                  # manifest + repo config
├── .gitignore                      # for THIS repo only (not copied to projects)
├── cli/
│   ├── index.js
│   ├── config.js
│   ├── copy.js
│   └── fetch.js
└── templates/
    ├── hotel-website-template/
    │   ├── .gitignore              # copied to generated projects
    │   ├── package.json
    │   ├── app/
    │   └── ...
    └── real-estate-website-template/
        └── ...
```

## Adding a new template

1. Add a directory under `templates/`, e.g. `templates/restaurant-website-template/`.
2. Include a template-specific `.gitignore` for that stack (Next.js, Vite, etc.).
3. Add one entry to `templates.json`:

```json
"restaurant": {
  "directory": "restaurant-website-template",
  "name": "Restaurant Website",
  "description": "Restaurant website with menu and reservations"
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
