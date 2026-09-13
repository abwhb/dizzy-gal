import { after } from "next/server";
import { z } from "zod";

import { json, parseBody, route } from "@/lib/api";
import { db } from "@/lib/db";
import { subscribeToNewsletter } from "@/lib/email";

export const dynamic = "force-dynamic";

const subscribeSchema = z.object({
  email: z.email("That email looks off.").max(200),
  source: z.string().trim().max(60).optional(),
});

/**
 * Newsletter signup. The address is stored first (that's the list), then
 * mirrored to Resend as a contact and sent the welcome note after the
 * response. `source` says which form it came from (modal or footer).
 */
export const POST = route(async (request) => {
  const body = await parseBody(request, subscribeSchema);
  const email = body.email.toLowerCase();
  const source = body.source === "modal" || body.source === "footer" ? body.source : "site";

  const existing = await db().newsletterSubscriber.findUnique({ where: { email } });
  if (existing && !existing.unsubscribedAt) {
    return json({ ok: true, alreadySubscribed: true });
  }

  await db().newsletterSubscriber.upsert({
    where: { email },
    create: { email, source },
    update: { unsubscribedAt: null, source },
  });

  after(async () => {
    const result = await subscribeToNewsletter(email, source);
    console.log(
      `[newsletter] ${source} signup — contact ${result.contact ? "saved" : "NOT saved"}, welcome ${result.welcome ? "sent" : "NOT sent"}`,
    );
  });

  return json({ ok: true, alreadySubscribed: false }, { status: 201 });
});
