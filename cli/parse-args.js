/**
 * @typedef {ReturnType<typeof createDefaultFlags>} CliFlags
 */

export function createDefaultFlags() {
  return {
    force: false,
    remote: false,
    initGit: false,
    help: false,
    config: false,
    yes: false,
    theme: undefined,
    font: undefined,
    name: undefined,
    shortName: undefined,
    baseUrl: undefined,
    phone: undefined,
    phoneDisplay: undefined,
    countryCode: undefined,
    email: undefined,
    address: undefined,
    dbHost: undefined,
    dbPort: undefined,
    dbUser: undefined,
    dbPassword: undefined,
    dbName: undefined,
    adminUser: undefined,
    adminPassword: undefined,
    skipDbPush: false,
    dbPush: false,
    updateCheck: false,
    updateMerge: false,
  };
}

const FLAG_MAP = {
  "--force": { key: "force", type: "boolean" },
  "-f": { key: "force", type: "boolean" },
  "--remote": { key: "remote", type: "boolean" },
  "--init-git": { key: "initGit", type: "boolean" },
  "--help": { key: "help", type: "boolean" },
  "-h": { key: "help", type: "boolean" },
  "--config": { key: "config", type: "boolean" },
  "--yes": { key: "yes", type: "boolean" },
  "-y": { key: "yes", type: "boolean" },
  "--no-prompt": { key: "yes", type: "boolean" },
  "--skip-db-push": { key: "skipDbPush", type: "boolean" },
  "--db-push": { key: "dbPush", type: "boolean" },
  "--check": { key: "updateCheck", type: "boolean" },
  "--merge": { key: "updateMerge", type: "boolean" },
  "--theme": { key: "theme", type: "string" },
  "--font": { key: "font", type: "string" },
  "--name": { key: "name", type: "string" },
  "--short-name": { key: "shortName", type: "string" },
  "--base-url": { key: "baseUrl", type: "string" },
  "--phone": { key: "phone", type: "string" },
  "--phone-display": { key: "phoneDisplay", type: "string" },
  "--country-code": { key: "countryCode", type: "string" },
  "--email": { key: "email", type: "string" },
  "--address": { key: "address", type: "string" },
  "--db-host": { key: "dbHost", type: "string" },
  "--db-port": { key: "dbPort", type: "string" },
  "--db-user": { key: "dbUser", type: "string" },
  "--db-password": { key: "dbPassword", type: "string" },
  "--db-name": { key: "dbName", type: "string" },
  "--admin-user": { key: "adminUser", type: "string" },
  "--admin-password": { key: "adminPassword", type: "string" },
};

/**
 * @param {string[]} argv
 */
export function parseArgs(argv) {
  const flags = createDefaultFlags();
  const positionals = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg.includes("=") && arg.startsWith("--")) {
      const eqIndex = arg.indexOf("=");
      const flagName = arg.slice(0, eqIndex);
      const value = arg.slice(eqIndex + 1);
      applyFlag(flags, flagName, value);
      continue;
    }

    const spec = FLAG_MAP[arg];
    if (spec) {
      if (spec.type === "boolean") {
        flags[spec.key] = true;
      } else {
        const value = argv[++i];
        if (!value || value.startsWith("-")) {
          throw new Error(`Option ${arg} requires a value`);
        }
        flags[spec.key] = value;
      }
      continue;
    }

    if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positionals.push(arg);
  }

  return { flags, positionals };
}

/**
 * @param {CliFlags} flags
 * @param {string} flagName
 * @param {string} value
 */
function applyFlag(flags, flagName, value) {
  const spec = FLAG_MAP[flagName];
  if (!spec) {
    throw new Error(`Unknown option: ${flagName}`);
  }
  if (spec.type === "boolean") {
    flags[spec.key] = value === "true" || value === "1";
  } else {
    flags[spec.key] = value;
  }
}

/**
 * @param {CliFlags} flags
 */
export function toCliOptions(flags) {
  return {
    yes: flags.yes,
    theme: flags.theme,
    font: flags.font,
    name: flags.name,
    shortName: flags.shortName,
    baseUrl: flags.baseUrl,
    phone: flags.phone,
    phoneDisplay: flags.phoneDisplay,
    countryCode: flags.countryCode,
    email: flags.email,
    address: flags.address,
    dbHost: flags.dbHost,
    dbPort: flags.dbPort,
    dbUser: flags.dbUser,
    dbPassword: flags.dbPassword,
    dbName: flags.dbName,
    adminUser: flags.adminUser,
    adminPassword: flags.adminPassword,
    skipDbPush: flags.skipDbPush,
    dbPush: flags.dbPush,
  };
}
