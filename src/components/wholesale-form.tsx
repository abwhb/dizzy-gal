"use client";

import { useState } from "react";

import { error, field, label } from "@/components/form-styles";
import { Illustration } from "@/components/illustrations";
import { pillPrimary } from "@/components/page-shell";
import { products, site, wholesalePage } from "@/lib/content";

export type WholesaleEnquiry = {
  business: string;
  contact: string;
  phone: string;
  email: string;
  type: string;
  area: string;
  volume: string;
  frequency: string;
  flavours: string[];
  message: string;
};

type Errors = Partial<Record<keyof WholesaleEnquiry, string>>;

function validate(e: WholesaleEnquiry): Errors {
  const errors: Errors = {};
  if (e.business.trim().length < 2) errors.business = "What's the business called?";
  if (e.contact.trim().length < 2) errors.contact = "Who should we ask for?";
  if (e.phone.replace(/\D/g, "").length < 10) errors.phone = "A phone number we can actually call.";
  if (e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) errors.email = "That email looks off.";
  return errors;
}

const blank: WholesaleEnquiry = {
  business: "",
  contact: "",
  phone: "",
  email: "",
  type: wholesalePage.businessTypes[0],
  area: "",
  volume: wholesalePage.volumes[0],
  frequency: wholesalePage.frequencies[0],
  flavours: [],
  message: "",
};

export function WholesaleForm() {
  const [enquiry, setEnquiry] = useState<WholesaleEnquiry>(blank);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const update =
    (key: keyof WholesaleEnquiry) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setEnquiry((e) => ({ ...e, [key]: event.target.value }));

  const toggleFlavour = (id: string) =>
    setEnquiry((e) => ({
      ...e,
      flavours: e.flavours.includes(id) ? e.flavours.filter((f) => f !== id) : [...e.flavours, id],
    }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(enquiry);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...enquiry, sentAt: new Date().toISOString() }),
      });
      setStatus(res.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border-[3px] border-burgundy bg-lemon p-8 text-center" role="status">
        <Illustration name="smiley" strokeWidth={2.4} className="mx-auto w-16 text-dizzy-orange" style={{ rotate: "-10deg" }} />
        <p className="mt-4 font-display text-4xl font-extrabold text-burgundy">{wholesalePage.sentTitle}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm font-medium">{wholesalePage.sentBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <h2 className="font-display text-2xl font-extrabold">{wholesalePage.formTitle}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="business" className={label}>
            Business
          </label>
          <input id="business" className={field} value={enquiry.business} onChange={update("business")} autoComplete="organization" />
          {errors.business && <p className={error}>{errors.business}</p>}
        </div>
        <div>
          <label htmlFor="type" className={label}>
            What kind
          </label>
          <select id="type" className={field} value={enquiry.type} onChange={update("type")}>
            {wholesalePage.businessTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact" className={label}>
            Your name
          </label>
          <input id="contact" className={field} value={enquiry.contact} onChange={update("contact")} autoComplete="name" />
          {errors.contact && <p className={error}>{errors.contact}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            className={field}
            value={enquiry.phone}
            onChange={update("phone")}
            autoComplete="tel"
            placeholder="03xx xxxxxxx"
          />
          {errors.phone && <p className={error}>{errors.phone}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>
            Email <span className="text-burgundy/50">(optional)</span>
          </label>
          <input id="email" type="email" className={field} value={enquiry.email} onChange={update("email")} autoComplete="email" />
          {errors.email && <p className={error}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="area" className={label}>
            Where are you <span className="text-burgundy/50">(optional)</span>
          </label>
          <input id="area" className={field} value={enquiry.area} onChange={update("area")} placeholder="DHA Phase 5, Lahore" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="volume" className={label}>
            Roughly how many
          </label>
          <select id="volume" className={field} value={enquiry.volume} onChange={update("volume")}>
            {wholesalePage.volumes.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="frequency" className={label}>
            How often
          </label>
          <select id="frequency" className={field} value={enquiry.frequency} onChange={update("frequency")}>
            {wholesalePage.frequencies.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={label}>Flavours you&rsquo;re eyeing</legend>
        <div className="flex flex-wrap gap-2">
          {products.map((product) => {
            const on = enquiry.flavours.includes(product.id);
            return (
              <label
                key={product.id}
                className={`cursor-pointer rounded-full border-[3px] border-burgundy px-4 py-2 text-[11px] font-semibold tracking-[.14em] uppercase transition-[scale,background-color,color] duration-200 hover:scale-[1.03] ${
                  on ? "bg-burgundy text-cream" : "bg-cream text-burgundy"
                }`}
              >
                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleFlavour(product.id)} />
                {product.name}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className={label}>
          Anything else <span className="text-burgundy/50">(optional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          className={`${field} resize-none`}
          value={enquiry.message}
          onChange={update("message")}
          placeholder="Dates, dietary needs, a wild idea"
        />
      </div>

      {status === "failed" ? (
        <p className={error}>
          {wholesalePage.failedBody}{" "}
          <a href={`mailto:wholesale@${site.email.split("@")[1]}`} className="underline">
            wholesale@{site.email.split("@")[1]}
          </a>
        </p>
      ) : null}

      <button type="submit" disabled={status === "sending"} className={`${pillPrimary} self-start`}>
        {status === "sending" ? "sending…" : wholesalePage.submit}
      </button>
    </form>
  );
}
