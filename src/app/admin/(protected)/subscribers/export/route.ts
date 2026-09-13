import { isAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** GET /admin/subscribers/export — active newsletter addresses as CSV. */
export async function GET() {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const subscribers = await db().newsletterSubscriber.findMany({
    where: { unsubscribedAt: null },
    orderBy: { createdAt: "asc" },
  });

  const lines = [
    "email,source,subscribed_at",
    ...subscribers.map((s) =>
      [s.email, s.source ?? "", s.createdAt.toISOString()].map(csvCell).join(","),
    ),
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dizzy-gals-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
