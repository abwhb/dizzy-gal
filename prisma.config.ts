import "dotenv/config";

import { defineConfig } from "prisma/config";

import { findDatabaseUrl } from "./src/lib/env";

// Prisma 7 no longer reads `.env` on its own, hence the dotenv import above.
// The URL is optional here so that `prisma generate` (run on `npm install`)
// works on a checkout with no database configured; migrate/seed/studio need it.
const url = findDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: url ? { url } : undefined,
});
