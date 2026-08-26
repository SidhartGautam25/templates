/**
 * Shared library — re-export common modules for convenient imports.
 *
 * Prefer direct paths in new code:
 *   @/lib/database/prisma
 *   @/lib/features/leads
 *   @/lib/storage
 *   @/lib/utils
 */
export * from "./database";
export * from "./features/leads";
export * from "./storage";
export * from "./utils";
