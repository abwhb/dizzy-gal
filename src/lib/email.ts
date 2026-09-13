import "server-only";

import { Resend } from "resend";

import { site, store } from "@/lib/content";
import { formatDeliveryDay } from "@/lib/delivery";
import { money } from "@/lib/format";
import type { Order } from "@/lib/orders";
import { siteUrl } from "@/lib/seo";

/**
 * Transactional email through Resend, sent from the verified
 * `mail.dizzygals.com` subdomain. Everything that goes out of the site by
 * email lives here so the sender addresses, the look and the copy stay in one
 * place.
 *
 * Config (all optional — without an API key every send is a logged no-op so
 * local dev and previews never email anyone):
 *   RESEND_API_KEY          the Resend key
 *   ORDERS_NOTIFY_EMAIL     where new orders go (default hello@dizzygals.com)
 *   WHOLESALE_NOTIFY_EMAIL  where enquiries go (default wholesale@dizzygals.com)
 */

const SENDING_DOMAIN = "mail.dizzygals.com";
const WHOLESALE_EMAIL = "wholesale@dizzygals.com";

const from = {
  orders: `Dizzy Gals <orders@${SENDING_DOMAIN}>`,
  wholesale: `Dizzy Gals <wholesale@${SENDING_DOMAIN}>`,
  hello: `Dizzy Gals <hello@${SENDING_DOMAIN}>`,
};

const notify = {
  orders: process.env.ORDERS_NOTIFY_EMAIL || site.email,
  wholesale: process.env.WHOLESALE_NOTIFY_EMAIL || WHOLESALE_EMAIL,
};

function apiKey(): string | undefined {
  return process.env.RESEND_API_KEY || process.env.dizzy_gals_RESEND;
}

export function isEmailConfigured(): boolean {
  return Boolean(apiKey());
}

let client: Resend | null = null;
function resend(): Resend | null {
  const key = apiKey();
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

// ---------------------------------------------------------------------------
// Template

const colours = {
  orange: "#ff6a00",
  cream: "#f2efe6",
  lemon: "#ffd34d",
  burgundy: "#57151f",
};

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Multi-line user text → escaped HTML with line breaks. */
function paragraph(value: string): string {
  return escape(value).replace(/\n/g, "<br>");
}

/**
 * The one email frame: cream page, orange headline, burgundy body, a lemon
 * card for the important bit. Inline styles only — email clients.
 */
function layout({ heading, intro, card, outro }: { heading: string; intro: string; card: string; outro?: string }): string {
  const font = "Poppins, 'Helvetica Neue', Arial, sans-serif";
  const display = "'Baloo 2', 'Arial Black', Arial, sans-serif";
  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:${colours.cream};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colours.cream};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:0 0 20px;font-family:${display};font-size:26px;font-weight:800;letter-spacing:-.02em;color:${colours.orange};">DIZZY GALS!</td></tr>
<tr><td style="font-family:${display};font-size:38px;line-height:.95;font-weight:800;text-transform:uppercase;color:${colours.burgundy};padding:0 0 16px;">${heading}</td></tr>
<tr><td style="font-family:${font};font-size:15px;line-height:1.55;color:${colours.burgundy};padding:0 0 24px;">${intro}</td></tr>
<tr><td style="background:${colours.lemon};border:3px solid ${colours.burgundy};border-radius:18px;padding:22px 24px;font-family:${font};font-size:14px;line-height:1.5;color:${colours.burgundy};">${card}</td></tr>
${outro ? `<tr><td style="font-family:${font};font-size:14px;line-height:1.55;color:${colours.burgundy};padding:24px 0 0;">${outro}</td></tr>` : ""}
<tr><td style="font-family:${font};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${colours.burgundy};padding:36px 0 0;opacity:.7;">${escape(site.name)} · <a href="${siteUrl}" style="color:${colours.burgundy};">${escape(siteUrl.replace(/^https?:\/\//, ""))}</a> · <a href="mailto:${site.email}" style="color:${colours.burgundy};">${site.email}</a></td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:4px 12px 4px 0;font-size:10px;letter-spacing:.18em;text-transform:uppercase;font-weight:600;white-space:nowrap;vertical-align:top;">${escape(label)}</td><td style="padding:4px 0;vertical-align:top;">${value}</td></tr>`;
}

function table(rows: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:inherit;font-size:14px;color:inherit;">${rows}</table>`;
}

// ---------------------------------------------------------------------------
// Orders

function orderLinesHtml(order: Order): string {
  const lines = order.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;border-bottom:1px solid rgba(87,21,31,.15);">${escape(l.name)} × ${l.qty}</td><td align="right" style="padding:6px 0;border-bottom:1px solid rgba(87,21,31,.15);white-space:nowrap;">${money(l.qty * l.price)}</td></tr>`,
    )
    .join("");
  const totals = [
    ["Subtotal", money(order.subtotal)],
    ["Delivery", order.delivery ? money(order.delivery) : "Free"],
    ["Total (cash on delivery)", money(order.total)],
  ]
    .map(
      ([k, v], i, all) =>
        `<tr><td style="padding:${i === all.length - 1 ? "10px 0 0" : "4px 0"};${i === all.length - 1 ? "font-weight:700;" : ""}">${k}</td><td align="right" style="padding:${i === all.length - 1 ? "10px 0 0" : "4px 0"};white-space:nowrap;${i === all.length - 1 ? "font-weight:700;" : ""}">${v}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:inherit;font-size:14px;color:inherit;">${lines}${totals}</table>`;
}

function orderLinesText(order: Order): string {
  const lines = order.lines.map((l) => `  ${l.name} × ${l.qty}  ${money(l.qty * l.price)}`);
  return [
    ...lines,
    `  Subtotal  ${money(order.subtotal)}`,
    `  Delivery  ${order.delivery ? money(order.delivery) : "Free"}`,
    `  Total (cash on delivery)  ${money(order.total)}`,
  ].join("\n");
}

function customerBlock(order: Order): string {
  const c = order.customer;
  return table(
    row("Name", escape(c.name)) +
      row("Phone", `<a href="tel:${escape(c.phone)}" style="color:${colours.burgundy};">${escape(c.phone)}</a>`) +
      (c.email ? row("Email", `<a href="mailto:${escape(c.email)}" style="color:${colours.burgundy};">${escape(c.email)}</a>`) : "") +
      row("Address", `${paragraph(c.address)}<br>${escape(c.area)}, ${escape(c.city)}`) +
      (c.notes ? row("Notes", paragraph(c.notes)) : ""),
  );
}

/**
 * Two emails per order: the kitchen gets everything it needs to call and
 * bake; the customer (when they left an email) gets a confirmation that
 * mirrors the confirmation page. Neither failing blocks the order — the
 * browser already holds the record — but failures are logged and reported.
 */
export async function sendOrderEmails(order: Order): Promise<{ kitchen: boolean; customer: boolean | null }> {
  const api = resend();
  if (!api) {
    console.warn(`[email] no RESEND_API_KEY; order ${order.id} not emailed`);
    return { kitchen: false, customer: null };
  }

  const day = formatDeliveryDay(order.deliveryDate);
  const jars = `${order.jars} jar${order.jars === 1 ? "" : "s"}`;

  const kitchen = api.emails.send({
    from: from.orders,
    to: notify.orders,
    replyTo: order.customer.email || undefined,
    subject: `New order ${order.id} · ${jars} for ${day} · ${money(order.total)}`,
    tags: [{ name: "type", value: "order_kitchen" }],
    html: layout({
      heading: "New order",
      intro: `<strong>${escape(order.id)}</strong> for <strong>${escape(day)}</strong>. ${jars}, ${money(order.total)} cash on delivery. Call to confirm.`,
      card: customerBlock(order) + `<div style="height:16px"></div>` + orderLinesHtml(order),
      outro: `Placed ${escape(new Date(order.createdAt).toUTCString())}.`,
    }),
    text: [
      `New order ${order.id} for ${day}`,
      "",
      `Name: ${order.customer.name}`,
      `Phone: ${order.customer.phone}`,
      order.customer.email ? `Email: ${order.customer.email}` : "",
      `Address: ${order.customer.address}, ${order.customer.area}, ${order.customer.city}`,
      order.customer.notes ? `Notes: ${order.customer.notes}` : "",
      "",
      orderLinesText(order),
    ]
      .filter((l) => l !== "")
      .join("\n"),
  });

  const customer = order.customer.email
    ? api.emails.send({
        from: from.orders,
        to: order.customer.email,
        replyTo: site.email,
        subject: `You're in. Order ${order.id} lands ${day}.`,
        tags: [{ name: "type", value: "order_customer" }],
        html: layout({
          heading: "You're in.",
          intro: `Thanks, ${escape(order.customer.name.split(" ")[0])}. We'll call to confirm, then it's straight into the oven. Your jars arrive <strong>${escape(day)}</strong> — pay <strong>${money(order.total)}</strong> in cash at the door.`,
          card:
            `<div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;margin-bottom:10px;">Order ${escape(order.id)}</div>` +
            orderLinesHtml(order) +
            `<div style="height:16px"></div>` +
            table(row("Delivering to", `${paragraph(order.customer.address)}<br>${escape(order.customer.area)}, ${escape(order.customer.city)}`)),
          outro: `Need to change something? Reply to this email or call the number on the site. Deliveries run ${store.deliveryDays.join(" and ")}, DHA ${escape(store.city)} only.`,
        }),
        text: [
          `You're in. Order ${order.id} lands ${day}.`,
          "",
          `We'll call to confirm, then it's straight into the oven. Pay ${money(order.total)} in cash at the door.`,
          "",
          orderLinesText(order),
          "",
          `Delivering to: ${order.customer.address}, ${order.customer.area}, ${order.customer.city}`,
          "",
          `Need to change something? Reply to this email.`,
        ].join("\n"),
      })
    : null;

  const [k, c] = await Promise.all([kitchen, customer]);
  if (k.error) console.error(`[email] kitchen email for ${order.id} failed:`, k.error);
  if (c?.error) console.error(`[email] customer email for ${order.id} failed:`, c.error);
  return { kitchen: !k.error, customer: c ? !c.error : null };
}

// ---------------------------------------------------------------------------
// Wholesale

export type WholesaleEnquiryEmail = {
  business: string;
  contact: string;
  phone: string;
  email?: string;
  type?: string;
  area?: string;
  volume?: string;
  frequency?: string;
  flavours?: string[];
  message?: string;
};

/** The enquiry goes to wholesale@; the enquirer gets a short acknowledgement if they left an email. */
export async function sendWholesaleEmails(enquiry: WholesaleEnquiryEmail): Promise<{ team: boolean; enquirer: boolean | null }> {
  const api = resend();
  if (!api) {
    console.warn(`[email] no RESEND_API_KEY; wholesale enquiry from ${enquiry.business} not emailed`);
    return { team: false, enquirer: null };
  }

  const flavours = enquiry.flavours?.length ? enquiry.flavours.join(", ") : "Not specified";

  const team = api.emails.send({
    from: from.wholesale,
    to: notify.wholesale,
    replyTo: enquiry.email || undefined,
    subject: `Wholesale enquiry · ${enquiry.business} · ${enquiry.volume ?? "volume not set"}`,
    tags: [{ name: "type", value: "wholesale_team" }],
    html: layout({
      heading: "Wholesale enquiry",
      intro: `<strong>${escape(enquiry.contact)}</strong> from <strong>${escape(enquiry.business)}</strong> wants jars by the dozen. Call within the day — that's what the site promised them.`,
      card: table(
        row("Business", escape(enquiry.business)) +
          row("Kind", escape(enquiry.type ?? "—")) +
          row("Contact", escape(enquiry.contact)) +
          row("Phone", `<a href="tel:${escape(enquiry.phone)}" style="color:${colours.burgundy};">${escape(enquiry.phone)}</a>`) +
          (enquiry.email ? row("Email", `<a href="mailto:${escape(enquiry.email)}" style="color:${colours.burgundy};">${escape(enquiry.email)}</a>`) : "") +
          (enquiry.area ? row("Area", escape(enquiry.area)) : "") +
          row("Volume", escape(enquiry.volume ?? "—")) +
          row("How often", escape(enquiry.frequency ?? "—")) +
          row("Flavours", escape(flavours)) +
          (enquiry.message ? row("Message", paragraph(enquiry.message)) : ""),
      ),
    }),
    text: [
      `Wholesale enquiry from ${enquiry.contact} at ${enquiry.business}`,
      "",
      `Kind: ${enquiry.type ?? "—"}`,
      `Phone: ${enquiry.phone}`,
      enquiry.email ? `Email: ${enquiry.email}` : "",
      enquiry.area ? `Area: ${enquiry.area}` : "",
      `Volume: ${enquiry.volume ?? "—"}`,
      `How often: ${enquiry.frequency ?? "—"}`,
      `Flavours: ${flavours}`,
      enquiry.message ? `\n${enquiry.message}` : "",
    ]
      .filter((l) => l !== "")
      .join("\n"),
  });

  const enquirer = enquiry.email
    ? api.emails.send({
        from: from.wholesale,
        to: enquiry.email,
        replyTo: WHOLESALE_EMAIL,
        subject: "Got it. We'll call about the jars.",
        tags: [{ name: "type", value: "wholesale_enquirer" }],
        html: layout({
          heading: "Got it.",
          intro: `Thanks, ${escape(enquiry.contact.split(" ")[0])}. We'll call within a day to talk flavours, numbers and dates. Go put the kettle on.`,
          card: table(
            row("Business", escape(enquiry.business)) +
              row("Volume", escape(enquiry.volume ?? "—")) +
              row("How often", escape(enquiry.frequency ?? "—")) +
              row("Flavours", escape(flavours)),
          ),
          outro: `Anything to add in the meantime? Reply to this email and it lands with the wholesale team.`,
        }),
        text: [
          `Got it, ${enquiry.contact}.`,
          "",
          "We'll call within a day to talk flavours, numbers and dates.",
          "",
          `Business: ${enquiry.business}`,
          `Volume: ${enquiry.volume ?? "—"}`,
          `How often: ${enquiry.frequency ?? "—"}`,
          `Flavours: ${flavours}`,
          "",
          "Anything to add? Reply to this email.",
        ].join("\n"),
      })
    : null;

  const [t, e] = await Promise.all([team, enquirer]);
  if (t.error) console.error(`[email] wholesale team email failed:`, t.error);
  if (e?.error) console.error(`[email] wholesale acknowledgement failed:`, e.error);
  return { team: !t.error, enquirer: e ? !e.error : null };
}

// ---------------------------------------------------------------------------
// Newsletter

/**
 * Adds the address as a Resend contact (so broadcasts can go to it later)
 * and sends the welcome note. A contact that already exists is fine — they
 * just get the welcome again.
 */
export async function subscribeToNewsletter(email: string, source: string): Promise<{ contact: boolean; welcome: boolean }> {
  const api = resend();
  if (!api) {
    console.warn(`[email] no RESEND_API_KEY; newsletter signup not recorded`);
    return { contact: false, welcome: false };
  }

  // `source` is a custom contact property. Resend only accepts properties
  // that have been defined for the account (Contacts → Properties), so if
  // it isn't there yet the contact is still saved, just without it.
  let contact = await api.contacts.create({ email, unsubscribed: false, properties: { source } });
  if (contact.error?.message?.toLowerCase().includes("properties do not exist")) {
    contact = await api.contacts.create({ email, unsubscribed: false });
  }
  const exists = contact.error?.message?.toLowerCase().includes("already exists");
  if (contact.error && !exists) console.error(`[email] newsletter contact failed:`, contact.error);

  const welcome = await api.emails.send({
    from: from.hello,
    to: email,
    replyTo: site.email,
    subject: "You're on the list.",
    tags: [{ name: "type", value: "newsletter_welcome" }],
    html: layout({
      heading: "You're on the list.",
      intro: "Bad day? Cake. Good day? Also cake. Drops, restocks and your first-jar discount will land right here. Zero spam, some chaos.",
      card: `Cake in a jar, baked fresh in small batches and delivered across DHA ${escape(store.city)} on ${store.deliveryDays.join(" and ")}. <a href="${siteUrl}/shop" style="color:${colours.burgundy};font-weight:700;">Go on. Dig in.</a>`,
      outro: `Didn't sign up? Ignore this and you won't hear from us again.`,
    }),
    text: [
      "You're on the list.",
      "",
      "Drops, restocks and your first-jar discount will land right here. Zero spam, some chaos.",
      "",
      `Go on. Dig in: ${siteUrl}/shop`,
      "",
      "Didn't sign up? Ignore this and you won't hear from us again.",
    ].join("\n"),
  });
  if (welcome.error) console.error(`[email] newsletter welcome failed:`, welcome.error);

  return { contact: !contact.error || Boolean(exists), welcome: !welcome.error };
}
