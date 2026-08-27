# Command builders (docsite)

The docsite renders interactive **Quick commands** and **Build custom command** panels from JSON. Maintainers add or change commands without editing React components for most cases.

## Architecture

```
Page JSON (e.g. developers/optional-modules.json)
  └── { "type": "command-builder", "builderId": "developer-add-module" }
           │
           ▼
command-builders-registry.json  ──► presets + modes + wizardSteps
           │
           ▼
command-builder-fields.json     ──► field keys → flags / toggles / positional args
command-builder-options.json    ──► dropdown values (themes, fonts, coreModules, …)
           │
           ▼
CommandBuilder + CommandWizard  ──► shell command string (copy-paste)
```

**Template pages** (hotel, real-estate) use `templates-registry.json` → `commandBuilder` on each template entry. On those pages, use a `command-builder` block **without** `builderId`.

## Implemented builders

| Builder id | Config location | Docsite page |
|------------|-----------------|--------------|
| `template-hotel` | `templates-registry.json` | Developers → Templates → Hotel |
| `template-real-estate` | `templates-registry.json` | Developers → Templates → Real estate |
| `developer-add-module` | `command-builders-registry.json` | Developers → Optional modules |
| `developer-project-theme` | registry | Developers → Customization |
| `developer-project-brand` | registry | Developers → Customization |
| `developer-project-database` | registry | Developers → Docker & database |
| `developer-update` | registry | Developers → Updates & doctor |
| `maintainer-new-template` | registry | Maintainers → New template |
| `maintainer-template-add-module` | registry | Maintainers → Optional modules |
| `maintainer-template-assemble` | registry | Maintainers → Optional modules |
| `maintainer-sync-templates` | registry | Maintainers → Daily workflow |
| `maintainer-template-validate` | registry | Maintainers → Validate & diff-core |
| `maintainer-version-inc` | registry | Maintainers → Versioning |

Index table also lives on **Maintainers → Command builders** in the docsite.

---

## Show a builder on a page

1. Open the page JSON under `docsite/content/` (e.g. `developers/optional-modules.json`).
2. Add a block where you want the UI:

```json
{
  "type": "command-builder",
  "builderId": "developer-add-module"
}
```

3. For template guide pages, only:

```json
{ "type": "command-builder" }
```

(Uses `templateId` from the page + `templates-registry.json`.)

4. Run `pnpm docs:dev` and open the page — no `content.ts` change needed unless you add a **new page file**.

---

## Add a new segment builder

Example: document `pnpm template:extract-modules` with a custom wizard.

### Step 1 — Fields (`content/shared/command-builder-fields.json`)

Reuse existing keys when possible (`templateRef`, `moduleIds`, `yes`, …).

Add a new field if needed:

```json
"myNewFlag": {
  "flag": "--dry-run",
  "label": "Dry run only",
  "description": "Print what would run without writing files.",
  "type": "toggle",
  "default": false
}
```

**Field types**

| type | CLI output | Notes |
|------|------------|--------|
| `toggle` | flag when checked | Uses `field.flag`; omitted when false |
| `text` | `--flag value` | Skipped when empty |
| `select` | `--flag value` | Options from `optionSet` |
| `arg` | positional after base command | No flag prefix; use `argOrder` for multiple args |

Positional example (already used for `pnpm template:add-module hotel footer`):

```json
"templateRef": {
  "flag": "",
  "label": "Template id",
  "type": "arg",
  "argOrder": 0,
  "optionSet": "templates"
},
"moduleIds": {
  "flag": "",
  "label": "Module ids",
  "type": "arg",
  "argOrder": 1,
  "placeholder": "seo,gallery"
}
```

### Step 2 — Option sets (`content/shared/command-builder-options.json`)

For dropdowns, add a key matching `optionSet`:

```json
"coreModules": [
  { "value": "seo", "label": "seo — Sitemap, robots, JSON-LD" },
  { "value": "gallery", "label": "gallery — Gallery CMS" }
]
```

`templates` is filled automatically from `templates-registry.json` in `src/lib/content.ts`.

### Step 3 — Builder entry (`content/shared/command-builders-registry.json`)

```json
"maintainer-my-command": {
  "id": "maintainer-my-command",
  "label": "My maintainer command",
  "segment": "maintainers",
  "description": "Short description for the index table.",
  "pagePath": "/maintainers/my-page",
  "presets": [
    {
      "id": "quick",
      "label": "Quick example",
      "description": "One-click copy.",
      "command": "pnpm my-command hotel"
    }
  ],
  "modes": [
    {
      "id": "run",
      "label": "Run with options",
      "description": "Optional longer help text.",
      "baseCommand": "pnpm my-command",
      "wizardSteps": [
        {
          "id": "target",
          "title": "Target template",
          "description": "Optional step description.",
          "fieldKeys": ["templateRef", "myNewFlag"]
        }
      ]
    }
  ]
}
```

- **presets** — static commands on the “Quick commands” tab.
- **modes** — “Build custom command” tab; user picks a mode, then walks wizard steps.
- **wizardSteps** — groups of `fieldKeys`; empty array = preset-only mode (see `developer-update` check mode).
- **baseCommand** — first token(s) of the command (`tempjs hotel`, `pnpm new-template`, …).

### Step 4 — Wire the page

```json
{
  "type": "heading",
  "level": 2,
  "text": "Extract modules"
},
{
  "type": "command-builder",
  "builderId": "maintainer-my-command"
}
```

### Step 5 — Index (optional)

Add a row to `content/maintainers/command-builders.json` table so other maintainers can discover it.

---

## Add or extend a **template** builder (hotel, bakery, …)

Template generators are **per-template** because brand fields differ.

1. Add or edit an entry in `content/templates-registry.json`:

```json
{
  "id": "bakery",
  "label": "Bakery Website",
  "cliId": "bakery",
  "flagGroups": ["generate", "theme", "brand", "database"],
  "brandFields": ["name", "shortName", "baseUrl", "phone", "email"],
  "commandBuilder": {
    "presets": [
      {
        "id": "quick-copy",
        "label": "Quick copy",
        "description": "Copy only.",
        "command": "tempjs bakery --yes"
      }
    ],
    "modes": [
      {
        "id": "generate",
        "label": "Generate new project",
        "baseCommand": "tempjs bakery",
        "wizardSteps": [
          {
            "id": "options",
            "title": "CLI options",
            "fieldKeys": ["config", "yes", "force", "remote", "initGit"]
          },
          {
            "id": "brand",
            "title": "Brand",
            "fieldKeys": ["name", "baseUrl", "email"]
          }
        ]
      }
    ]
  }
}
```

2. Create `content/developers/templates/bakery.json` with `"templateId": "bakery"` and `{ "type": "command-builder" }`.
3. Register the page in `src/lib/content.ts` (`templatePages`) — `pnpm new-template --with-docs` does this automatically.

Reuse field keys from `command-builder-fields.json`. For template-specific brand flags, add keys to `init-fields.json` and `command-builder-fields.json`, then list them in `brandFields` and wizard `fieldKeys`.

---

## Updating an existing builder

| Change | Edit |
|--------|------|
| New preset button | `presets[]` on builder entry |
| New wizard step | `modes[].wizardSteps[]` |
| New flag on a command | `command-builder-fields.json` + add key to `fieldKeys` |
| New theme/font | `command-builder-options.json` |
| Rename section title | builder `label` in registry |
| Move to another page | change page JSON block; update `pagePath` on builder |

No deploy step beyond docsite build — content is imported at build time.

---

## When you need code changes

- New **field type** (e.g. multi-select modules) → extend `CommandBuilderFieldDef`, `FieldInput`, `build-command.ts`.
- New **option set source** (dynamic beyond templates registry) → extend `commandBuilderOptionSets` in `content.ts`.
- New **block type** → extend `PageRenderer` and `content.ts` types.

Most maintainer workflows stay in JSON.

---

## Local preview

```bash
cd docsite && pnpm dev
```

Open the target page and use **Build custom command** — empty fields are omitted from the output; toggles only add flags when enabled.

## Related files

| Path | Role |
|------|------|
| `src/components/command-builder/CommandBuilder.tsx` | Tabs: presets vs wizard |
| `src/components/command-builder/CommandWizard.tsx` | Step UI + command assembly |
| `src/lib/build-command.ts` | Flag and positional arg formatting |
| `src/lib/content.ts` | `getCommandBuilderConfig()`, option set merge |
| `src/components/PageRenderer.tsx` | Renders `command-builder` blocks |
