import { after } from "next/server";
import { z } from "zod";

import { json, parseBody, route } from "@/lib/api";
import { db } from "@/lib/db";
import { sendNewsletterWelcome } from "@/lib/email";

export const dynamic = "force-dynamic";

const subscribeSchema = z.object({
  email: z.email("Enter a valid email address.").max(200),
  source: z.string().trim().max(60).optional(),
});

/** POST /api/newsletter — subscribe (or re-subscribe) an email address. */
export const POST = route(async (request) => {
  const body = await parseBody(request, subscribeSchema);
  const email = body.email.toLowerCase();

  const existing = await db().newsletterSubscriber.findUnique({ where: { email } });
  if (existing && !existing.unsubscribedAt) {
    return json({ subscribed: true, alreadySubscribed: true });
  }

  await db().newsletterSubscriber.upsert({
    where: { email },
    create: { email, source: body.source ?? "site" },
    update: { unsubscribedAt: null, source: body.source ?? existing?.source ?? "site" },
  });

  after(() => sendNewsletterWelcome(email));

  return json({ subscribed: true, alreadySubscribed: false }, { status: 201 });
});
