import { z } from "zod";

import { json, parseBody, route } from "@/lib/api";
import { db } from "@/lib/db";
import { sendWholesaleEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || undefined)
    .optional();

const enquirySchema = z.object({
  business: z.string().trim().min(2, "What's the business called?").max(120),
  contact: z.string().trim().min(2, "Who should we ask for?").max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length >= 10, "A phone number we can actually call."),
  email: optional(200).pipe(z.email("That email looks off.").optional()),
  type: optional(80),
  area: optional(120),
  volume: optional(80),
  frequency: optional(80),
  flavours: z.array(z.string().max(60)).max(20).default([]),
  message: optional(2000),
});

/**
 * Wholesale enquiry intake. The enquiry is stored (it shows in /admin), then
 * emailed to the wholesale inbox with an acknowledgement to the enquirer if
 * they left an email. Because the database has it, a mail outage no longer
 * loses the lead: the row is flagged `emailed: false` for chasing.
 */
export const POST = route(async (request) => {
  const enquiry = await parseBody(request, enquirySchema);

  const emailed = await sendWholesaleEmails(enquiry);
  const saved = await db().wholesaleEnquiry.create({
    data: {
      business: enquiry.business,
      contact: enquiry.contact,
      phone: enquiry.phone,
      email: enquiry.email?.toLowerCase() ?? null,
      type: enquiry.type ?? null,
      area: enquiry.area ?? null,
      volume: enquiry.volume ?? null,
      frequency: enquiry.frequency ?? null,
      flavours: enquiry.flavours,
      message: enquiry.message ?? null,
      emailed: emailed.team,
    },
  });

  console.log(
    `[wholesale] enquiry ${saved.id} from ${enquiry.business} (${enquiry.contact}) — team email ${emailed.team ? "sent" : "NOT sent"}`,
  );
  return json({ ok: true, id: saved.id, emailed }, { status: 201 });
});
