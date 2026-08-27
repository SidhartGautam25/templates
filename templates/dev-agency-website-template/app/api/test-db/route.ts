import { NextResponse } from "next/server";
import mariadb from "mariadb";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, any> = {};

  const databaseUrl = process.env.DATABASE_URL;
  results.hasDatabaseUrl = !!databaseUrl;

  if (!databaseUrl) {
    return NextResponse.json({ success: false, error: "DATABASE_URL environment variable is not defined", results });
  }

  try {
    const url = new URL(databaseUrl);
    results.parsedUrl = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      username: url.username,
      database: url.pathname.substring(1),
    };

    // Test with localhost
    try {
      results.testLocalhost = { started: true };
      const conn = await mariadb.createConnection({
        host: "localhost",
        port: url.port ? parseInt(url.port) : 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.substring(1),
        connectTimeout: 5000,
      });
      const rows = await conn.query("SELECT 1 + 1 AS val");
      results.testLocalhost.success = true;
      results.testLocalhost.rows = rows;
      await conn.end();
    } catch (e: any) {
      results.testLocalhost.success = false;
      results.testLocalhost.error = e.message || String(e);
      results.testLocalhost.code = e.code;
      results.testLocalhost.errno = e.errno;
      results.testLocalhost.stack = e.stack;
    }

    // Test with 127.0.0.1
    try {
      results.testLoopback = { started: true };
      const conn = await mariadb.createConnection({
        host: "127.0.0.1",
        port: url.port ? parseInt(url.port) : 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: url.pathname.substring(1),
        connectTimeout: 5000,
      });
      const rows = await conn.query("SELECT 1 + 1 AS val");
      results.testLoopback.success = true;
      results.testLoopback.rows = rows;
      await conn.end();
    } catch (e: any) {
      results.testLoopback.success = false;
      results.testLoopback.error = e.message || String(e);
      results.testLoopback.code = e.code;
      results.testLoopback.errno = e.errno;
      results.testLoopback.stack = e.stack;
    }

  } catch (e: any) {
    results.parsingError = e.message || String(e);
  }

  return NextResponse.json({ success: results.testLocalhost?.success || results.testLoopback?.success, results });
}
