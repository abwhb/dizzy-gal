import { json } from "@/lib/api";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/health — liveness plus a database round-trip. */
export async function GET() {
  const started = Date.now();
  try {
    await db().$queryRaw`SELECT 1`;
    return json({ ok: true, db: "up", latencyMs: Date.now() - started });
  } catch (error) {
    console.error("[api] health check failed", error);
    return json({ ok: false, db: "down" }, { status: 503 });
  }
}
