import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, resolve } from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

export async function promptAndSetupDb(targetDir) {
  const envPath = join(targetDir, ".env");
  const envExamplePath = join(targetDir, ".env.example");

  // Load existing env values as defaults if .env exists
  let existingEnv = "";
  if (existsSync(envPath)) {
    try {
      existingEnv = await readFile(envPath, "utf8");
    } catch {
      // Ignore
    }
  }

  // Helper to extract env var
  const getEnvVal = (key, fallback) => {
    const match = existingEnv.match(new RegExp(`^${key}\\s*=\\s*["']?([^"'\r\n]+)["']?`, "m"));
    return match ? match[1] : fallback;
  };

  // Parse existing DB URL if any
  const currentDbUrl = getEnvVal("DATABASE_URL", "");
  let defaultHost = "localhost";
  let defaultPort = "3306";
  let defaultUser = "root";
  let defaultPass = "";
  let defaultDbName = basename(resolve(targetDir)).toLowerCase().replace(/[^a-z0-9_]/g, "_") + "_db";

  if (currentDbUrl) {
    const urlMatch = currentDbUrl.match(/mysql:\/\/([^:@]+)(?::([^@]+))?@([^:/]+)(?::(\d+))?\/([^?]+)/);
    if (urlMatch) {
      defaultUser = urlMatch[1];
      defaultPass = urlMatch[2] || "";
      defaultHost = urlMatch[3];
      defaultPort = urlMatch[4] || "3306";
      defaultDbName = urlMatch[5];
    }
  }

  const defaultAdminUser = getEnvVal("ADMIN_USER", "admin");
  const defaultAdminPass = getEnvVal("ADMIN_PASSWORD", crypto.randomBytes(4).toString("hex"));

  const rl = createInterface({ input, output });
  try {
    console.log("\n--- Configure Database & Environment Variables ---");

    const host = (await rl.question(`MySQL Database Host [${defaultHost}]: `)).trim() || defaultHost;
    const port = (await rl.question(`MySQL Database Port [${defaultPort}]: `)).trim() || defaultPort;
    const user = (await rl.question(`MySQL Database Username [${defaultUser}]: `)).trim() || defaultUser;
    const pass = (await rl.question(`MySQL Database Password [${defaultPass ? "*****" : "(empty)"}]: `)).trim() || defaultPass;
    const dbName = (await rl.question(`MySQL Database Name [${defaultDbName}]: `)).trim() || defaultDbName;

    const adminUser = (await rl.question(`Admin Portal Username [${defaultAdminUser}]: `)).trim() || defaultAdminUser;
    const adminPass = (await rl.question(`Admin Portal Password [${defaultAdminPass}]: `)).trim() || defaultAdminPass;

    // Construct MySQL Connection URL
    const dbUrl = `mysql://${user}${pass ? `:${encodeURIComponent(pass)}` : ""}@${host}:${port}/${dbName}`;

    // Read template or write fresh environment file
    let envContent = "";
    if (existsSync(envExamplePath)) {
      envContent = await readFile(envExamplePath, "utf8");
    }

    // Generate fresh secret
    const randomSecret = crypto.randomBytes(32).toString("base64");

    // Replace or construct env keys
    const updateEnvKey = (content, key, value) => {
      const regex = new RegExp(`^#?\\s*${key}\\s*=.*$`, "m");
      if (regex.test(content)) {
        return content.replace(regex, `${key}="${value}"`);
      }
      return `${content.trim()}\n${key}="${value}"\n`;
    };

    if (envContent) {
      envContent = updateEnvKey(envContent, "DATABASE_URL", dbUrl);
      envContent = updateEnvKey(envContent, "AUTH_SECRET", randomSecret);
      envContent = updateEnvKey(envContent, "ADMIN_USER", adminUser);
      envContent = updateEnvKey(envContent, "ADMIN_PASSWORD", adminPass);
    } else {
      envContent = `DATABASE_URL="${dbUrl}"
AUTH_SECRET="${randomSecret}"
ADMIN_USER="${adminUser}"
ADMIN_PASSWORD="${adminPass}"
AUTH_TRUST_HOST="true"
`;
    }

    await writeFile(envPath, envContent, "utf8");
    console.log("Successfully created/updated .env configuration file.");

    // Prompt to run prisma database push
    const runMigrate = await rl.question("\nDo you want to initialize the database tables now using Prisma? (y/n) [y]: ");
    const choice = runMigrate.trim().toLowerCase();
    if (choice === "" || choice === "y" || choice === "yes") {
      console.log("\nRunning Prisma Database Push (npx prisma db push)...");
      try {
        execSync("npx prisma db push", { cwd: targetDir, stdio: "inherit" });
        console.log("\nSuccessfully synchronized database schemas.");
      } catch (err) {
        console.error("\nWarning: Database synchronization failed. Make sure your MySQL server is running and the database details are correct.");
        console.error("You can run this manually later inside the project folder via: npx prisma db push");
      }
    } else {
      console.log("\nSkipped database table synchronization. Remember to run 'npx prisma db push' before running the app.");
    }
  } finally {
    rl.close();
  }
}
