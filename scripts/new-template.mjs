#!/usr/bin/env node
/**
 * Scaffold a new template overlay + templates.json entry.
 *
 * Usage:
 *   node scripts/new-template.mjs <template-id> [directory-name]
 *
 * Example:
 *   node scripts/new-template.mjs bakery bakery-website-template
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "templates.json");
const overlaysDir = join(root, "templates", "overlays");

const [templateId, directoryArg] = process.argv.slice(2);

if (!templateId) {
  console.error("Usage: node scripts/new-template.mjs <template-id> [directory-name]");
  console.error("Example: node scripts/new-template.mjs bakery bakery-website-template");
  process.exit(1);
}

const directory = directoryArg ?? `${templateId}-website-template`;
const overlayPath = join(overlaysDir, directory);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (manifest.templates[templateId]) {
  console.error(`Template id "${templateId}" already exists in templates.json`);
  process.exit(1);
}

if (existsSync(overlayPath)) {
  console.error(`Overlay directory already exists: ${overlayPath}`);
  process.exit(1);
}

const displayName = directory
  .replace(/-website-template$/, "")
  .split("-")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(" ");

mkdirSync(join(overlayPath, "constants"), { recursive: true });
mkdirSync(join(overlayPath, "prisma"), { recursive: true });
mkdirSync(join(overlayPath, "lib/features"), { recursive: true });
mkdirSync(join(overlayPath, "public"), { recursive: true });

writeFileSync(
  join(overlayPath, "package.json"),
  JSON.stringify(
    {
      name: directory.replace(/-website-template$/, "") + "-website",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "eslint",
        postinstall: "prisma generate",
      },
      prisma: { seed: "tsx prisma/seed.ts" },
      dependencies: {
        "@prisma/adapter-mariadb": "^7.8.0",
        "@prisma/client": "^7.8.0",
        "@tanstack/react-query": "^5.101.0",
        "basic-ftp": "^6.0.1",
        "lucide-react": "^1.17.0",
        "mariadb": "^3.5.3",
        next: "16.2.7",
        "next-auth": "5.0.0-beta.31",
        react: "19.2.4",
        "react-dom": "19.2.4",
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        dotenv: "^17.4.2",
        eslint: "^9",
        "eslint-config-next": "16.2.7",
        prisma: "^7.8.0",
        tailwindcss: "^4",
        tsx: "^4.22.4",
        typescript: "^5",
      },
    },
    null,
    2
  ) + "\n"
);

writeFileSync(
  join(overlayPath, "constants/site.ts"),
  `/**
 * Site configuration — customize for each client.
 */
export const SITE = {
  id: "${templateId}",
  brand: {
    name: "${displayName}",
    shortName: "${displayName.split(" ")[0]}",
    tagline: "Your tagline here",
    developerName: "${displayName}",
    channelPartner: "${displayName}",
    copyright: "${displayName}. All Rights Reserved.",
    managedBy: "Managed by ${displayName}.",
  },
  domain: {
    baseUrl: "https://example.com",
    wwwHost: "www.example.com",
  },
  contact: {
    phone: "9876543210",
    phoneDisplay: "+91 98765 43210",
    countryCode: "91",
    email: "hello@example.com",
    address: {
      locality: "City",
      region: "State",
      country: "IN",
      full: "City, State, India",
    },
  },
  seo: {
    defaultTitle: "${displayName}",
    defaultDescription: "Welcome to ${displayName}.",
    keywords: "${displayName}",
    locale: "en_IN",
    schemaType: "Organization" as const,
  },
  theme: {
    colors: {
      primary: "#1e40af",
      primaryHover: "#1e3a8a",
      accent: "#38bdf8",
      textMain: "#0f172a",
      textMuted: "#64748b",
      bgMain: "#f8fafc",
    },
  },
  assets: {
    logo: "/logo.svg",
    defaultProjectImage: "/assets/placeholder-project.svg",
  },
  admin: {
    displayName: "${displayName} Admin",
    portalTitle: "${displayName} Admin Portal",
    defaultUserName: "Admin",
    defaultUserEmail: "admin@example.com",
    leadsExportPrefix: "${templateId}_leads",
  },
} as const;
`
);

writeFileSync(
  join(overlayPath, "prisma/schema.prisma"),
  `// Template-specific models — Lead and PromoBanner are merged from packages/core on sync.

// Add your Prisma models here, e.g.:
// model Listing {
//   id   String @id @default(uuid())
//   name String
// }
`
);

writeFileSync(
  join(overlayPath, "prisma/seed.ts"),
  `import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("No seed data yet — add models and seed logic for ${displayName}.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
`
);

writeFileSync(
  join(overlayPath, "CHANGELOG.md"),
  `# Changelog — ${displayName} Template

## [1.0.0] — ${new Date().toISOString().slice(0, 10)}

- Initial scaffold via \`scripts/new-template.mjs\`
`
);

writeFileSync(
  join(overlayPath, "README.md"),
  `# ${displayName} Website Template

Scaffolded overlay — customize \`constants/site.ts\`, add pages under \`app/\`, and define Prisma models in \`prisma/schema.prisma\`.

Run from monorepo root:

\`\`\`bash
pnpm sync-templates
pnpm dev:${templateId}
\`\`\`
`
);

writeFileSync(
  join(overlayPath, "lib/features/index.ts"),
  `// Export template-specific features from subfolders, e.g.:
// export * from "./listings";
`
);

manifest.templates[templateId] = {
  directory,
  name: `${displayName} Website`,
  description: `${displayName} website template`,
  version: "1.0.0",
  stack: [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS 4",
    "Prisma",
    "MariaDB",
    "NextAuth",
  ],
  packageManager: "pnpm",
  node: ">=20",
  setupTime: "~10 min",
  docker: true,
  tags: ["admin", "cms", "leads"],
  features: ["Admin dashboard", "Lead capture", "Docker Compose for MariaDB"],
  docs: "GETTING_STARTED.md",
};

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`Created overlay: templates/overlays/${directory}/`);
console.log(`Added templates.json entry: "${templateId}" → ${directory}`);
console.log("\nNext steps:");
console.log("  1. Add app/ pages and lib/features/ for your domain");
console.log("  2. Define models in prisma/schema.prisma (Lead/PromoBanner live in core)");
console.log("  3. pnpm sync-templates");
console.log(`  4. Add "dev:${templateId}" script to root package.json if needed`);
console.log(`  5. pnpm dev:${templateId}`);
