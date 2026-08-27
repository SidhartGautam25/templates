import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";

/**
 * Health check for local dev, deployment probes, and tempjs doctor.
 * GET /api/health
 */
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL?.trim()),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET?.trim()),
    ADMIN_USER: Boolean(process.env.ADMIN_USER?.trim()),
    ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD?.trim()),
  };

  const optional = {
    FTP_HOST: Boolean(process.env.FTP_HOST?.trim()),
  };

  const requiredEnvOk =
    env.DATABASE_URL && env.AUTH_SECRET && env.ADMIN_USER && env.ADMIN_PASSWORD;

  let databaseOk = false;
  let databaseError: string | null = null;

  if (env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseOk = true;
    } catch (error) {
      databaseError = error instanceof Error ? error.message : String(error);
    }
  } else {
    databaseError = "DATABASE_URL is not set";
  }

  const ok = requiredEnvOk && databaseOk;

  return NextResponse.json(
    {
      status: ok ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      checks: {
        env: { ok: requiredEnvOk, ...env },
        optional,
        database: { ok: databaseOk, error: databaseError },
      },
    },
    { status: ok ? 200 : 503 }
  );
}
