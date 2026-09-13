import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { databaseUrl } from "@/lib/env";

// One client per process. In development Next.js re-evaluates modules on hot
// reload, so the instance is parked on `globalThis` to avoid leaking pools.
const globalForPrisma = globalThis as unknown as { __dizzyPrisma?: PrismaClient };

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: databaseUrl(), max: 5 });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/**
 * The Prisma client, created lazily on first use so that importing this module
 * (e.g. while `next build` analyses routes) never needs a database URL.
 */
export function db(): PrismaClient {
  if (!globalForPrisma.__dizzyPrisma) globalForPrisma.__dizzyPrisma = createClient();
  return globalForPrisma.__dizzyPrisma;
}
