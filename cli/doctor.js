import { pathToFileURL } from "node:url";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createConnection } from "node:net";
import { loadManifest } from "./config.js";
import { readProjectStamp } from "./project-stamp.js";

const REQUIRED_ENV_KEYS = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "ADMIN_USER",
  "ADMIN_PASSWORD",
];

/**
 * @typedef {{
 *   name: string,
 *   ok: boolean,
 *   detail: string,
 *   hint?: string,
 *   optional?: boolean
 * }} DoctorCheck
 */

/**
 * @param {string} requirement e.g. ">=20"
 * @param {number} version
 */
function satisfiesNodeRequirement(requirement, version) {
  const match = requirement.match(/^>=\s*(\d+)/);
  if (!match) return true;
  return version >= Number(match[1]);
}

/**
 * @param {string} a
 * @param {string} b
 */
function compareVersions(a, b) {
  const pa = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da !== db) return da < db ? -1 : 1;
  }
  return 0;
}

/**
 * @param {string} filePath
 */
function loadEnvFile(filePath) {
  /** @type {Record<string, string>} */
  const env = {};
  const content = readFileSync(filePath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

/**
 * @param {string} databaseUrl
 */
function parseDatabaseUrl(databaseUrl) {
  const match = databaseUrl.match(
    /^(?:mysql|mariadb):\/\/([^:@]+)(?::([^@]*))?@([^:/]+)(?::(\d+))?\/([^?]+)/
  );

  if (!match) return null;

  return {
    user: decodeURIComponent(match[1]),
    password: decodeURIComponent(match[2] ?? ""),
    host: match[3],
    port: Number(match[4] || 3306),
    database: match[5],
  };
}

/**
 * @param {string} host
 * @param {number} port
 * @param {number} timeoutMs
 */
function probeTcp(host, port, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const socket = createConnection({ host, port });
    const timer = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeoutMs);

    socket.on("connect", () => {
      clearTimeout(timer);
      socket.end();
      resolve(true);
    });

    socket.on("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

/**
 * @param {string} projectDir
 * @param {Record<string, string>} env
 */
async function checkDatabase(projectDir, env) {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    return {
      ok: false,
      detail: "DATABASE_URL is empty",
      hint: "Set DATABASE_URL in .env (see .env.example)",
    };
  }

  const parsed = parseDatabaseUrl(databaseUrl);
  if (!parsed) {
    return {
      ok: false,
      detail: "DATABASE_URL format is invalid",
      hint: "Expected mysql://user:pass@host:3306/dbname",
    };
  }

  const reachable = await probeTcp(parsed.host, parsed.port);
  if (!reachable) {
    return {
      ok: false,
      detail: `Cannot reach ${parsed.host}:${parsed.port}`,
      hint: "Run docker compose up -d or check your database host",
    };
  }

  const mariadbEntry = join(projectDir, "node_modules", "mariadb", "package.json");
  if (!existsSync(mariadbEntry)) {
    return {
      ok: false,
      detail: "TCP reachable but mariadb driver not installed",
      hint: "Run pnpm install, then tempjs doctor again",
    };
  }

  try {
    const mariadb = await import(
      pathToFileURL(join(projectDir, "node_modules/mariadb/index.js")).href
    );
    const conn = await mariadb.createConnection({
      host: parsed.host,
      port: parsed.port,
      user: parsed.user,
      password: parsed.password,
      database: parsed.database,
      connectTimeout: 5000,
    });
    await conn.query("SELECT 1");
    await conn.end();
    return { ok: true, detail: `Connected to ${parsed.database} on ${parsed.host}:${parsed.port}` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      detail: `Auth or query failed: ${message}`,
      hint: "Verify credentials in DATABASE_URL and that the database exists",
    };
  }
}

/**
 * @param {string} projectDir
 */
async function checkHealthEndpoint(projectDir) {
  const urls = ["http://localhost:3000/api/health", "http://127.0.0.1:3000/api/health"];

  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2500) });
      const body = await response.json();

      if (response.ok && body?.status === "ok") {
        return { ok: true, detail: `${url} → status ok` };
      }

      return {
        ok: false,
        detail: `${url} → ${body?.status ?? response.status}`,
        hint: "Fix env or database issues reported by /api/health",
        optional: true,
      };
    } catch {
      // try next url
    }
  }

  return {
    ok: true,
    detail: "Dev server not running (optional)",
    optional: true,
  };
}

/**
 * @param {DoctorCheck[]} checks
 */
function printChecks(checks) {
  for (const check of checks) {
    const icon = check.ok ? "✓" : "✗";
    const label = check.name.padEnd(16);
    console.log(`${icon} ${label}${check.detail}`);
    if (!check.ok && check.hint) {
      console.log(`    → ${check.hint}`);
    }
  }
}

/**
 * @param {string} projectDir
 */
export async function runDoctor(projectDir) {
  /** @type {DoctorCheck[]} */
  const checks = [];
  const manifest = loadManifest();

  const nodeVersion = process.versions.node;
  const nodeMajor = Number.parseInt(nodeVersion.split(".")[0], 10);
  const stamp = readProjectStamp(projectDir);
  const templateEntry = stamp ? manifest.templates[stamp.template] : null;
  const nodeRequirement = templateEntry?.node ?? ">=20";

  const nodeOk = satisfiesNodeRequirement(nodeRequirement, nodeMajor);
  checks.push({
    name: "Node.js",
    ok: nodeOk,
    detail: `v${nodeVersion} (template requires ${nodeRequirement})`,
    hint: nodeOk ? undefined : `Upgrade Node.js to ${nodeRequirement}`,
  });

  const packageJsonPath = join(projectDir, "package.json");
  if (!existsSync(packageJsonPath)) {
    checks.push({
      name: "package.json",
      ok: false,
      detail: "Not found in this directory",
      hint: "Run tempjs from your generated project root",
    });
  } else {
    checks.push({ name: "package.json", ok: true, detail: "found" });
  }

  const nodeModulesPath = join(projectDir, "node_modules");
  checks.push({
    name: "node_modules",
    ok: existsSync(nodeModulesPath),
    detail: existsSync(nodeModulesPath) ? "installed" : "missing",
    hint: existsSync(nodeModulesPath) ? undefined : "Run pnpm install",
  });

  const envPath = join(projectDir, ".env");
  const envExamplePath = join(projectDir, ".env.example");

  if (!existsSync(envPath)) {
    checks.push({
      name: ".env",
      ok: false,
      detail: "missing",
      hint: existsSync(envExamplePath) ? "Run cp .env.example .env" : "Create .env with required variables",
    });
  } else {
    const env = loadEnvFile(envPath);
    const missing = REQUIRED_ENV_KEYS.filter((key) => !env[key]?.trim());
    checks.push({
      name: ".env",
      ok: missing.length === 0,
      detail:
        missing.length === 0
          ? `all required keys set (${REQUIRED_ENV_KEYS.length})`
          : `missing: ${missing.join(", ")}`,
      hint: missing.length > 0 ? "Fill required values in .env" : undefined,
    });

    if (missing.length === 0) {
      const dbCheck = await checkDatabase(projectDir, env);
      checks.push({
        name: "Database",
        ok: dbCheck.ok,
        detail: dbCheck.detail,
        hint: dbCheck.hint,
      });
    } else {
      checks.push({
        name: "Database",
        ok: false,
        detail: "skipped — fix .env first",
      });
    }
  }

  if (stamp) {
    const latestVersion = templateEntry?.version ?? "0.0.0";
    const behind = compareVersions(stamp.templateVersion, latestVersion) < 0;
    const changelogPath = join(projectDir, "CHANGELOG.md");

    let versionDetail = `${stamp.template} v${stamp.templateVersion}`;
    if (templateEntry) {
      versionDetail += behind
        ? ` (latest manifest: v${latestVersion})`
        : ` (matches manifest v${latestVersion})`;
    }

    checks.push({
      name: ".tempjs.json",
      ok: !behind,
      detail: versionDetail,
      hint: behind
        ? `Run tempjs update --check and read CHANGELOG.md${existsSync(changelogPath) ? "" : " (after update)"}`
        : undefined,
    });

    if (behind && existsSync(changelogPath)) {
      checks.push({
        name: "CHANGELOG",
        ok: true,
        detail: "CHANGELOG.md present — review before updating",
        optional: true,
      });
    }
  } else if (existsSync(packageJsonPath)) {
    checks.push({
      name: ".tempjs.json",
      ok: false,
      detail: "not found",
      hint: "Project may not have been created with tempjs",
    });
  }

  const healthCheck = await checkHealthEndpoint(projectDir);
  checks.push({
    name: "API health",
    ok: healthCheck.ok,
    detail: healthCheck.detail,
    hint: healthCheck.hint,
    optional: healthCheck.optional,
  });

  console.log("tempjs doctor\n");

  const requiredChecks = checks.filter((c) => !c.optional);
  const failedRequired = requiredChecks.filter((c) => !c.ok);
  const canRun = failedRequired.length === 0;

  console.log(
    canRun
      ? "Can you run this project?  YES"
      : `Can you run this project?  NO (${failedRequired.length} check(s) failed)`
  );
  console.log("");

  printChecks(checks);

  if (!canRun) {
    console.log("\nFix the items above, then run GETTING_STARTED.md steps or:");
    console.log("  pnpm install && cp .env.example .env && docker compose up -d");
    console.log("  pnpm prisma db push && pnpm prisma db seed && pnpm dev");
  } else {
    console.log("\nYou're ready to run: pnpm dev");
    console.log("Admin: http://localhost:3000/admin");
  }

  return canRun ? 0 : 1;
}
