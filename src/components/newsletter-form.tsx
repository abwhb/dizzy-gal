"use client";

import { useState } from "react";

import { analytics } from "@/lib/analytics";
import { newsletter } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "failed";

/** The pill email form, shared by the modal and the footer. */
export function NewsletterForm({
  source,
  className = "",
}: {
  /** Where the form lives; sent with the signup and reported with the analytics event. */
  source: "modal" | "footer";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || status === "sending" || status === "sent") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error(`newsletter signup ${res.status}`);
      setStatus("sent");
      analytics.newsletterSubscribed(source);
    } catch {
      setStatus("failed");
    }
  };

  const labels: Record<Status, string> = {
    idle: newsletter.send,
    sending: newsletter.sending,
    sent: newsletter.sent,
    failed: newsletter.failed,
  };

  return (
    <form
      onSubmit={submit}
      className={`flex overflow-hidden rounded-full border-[3px] border-burgundy ${className}`}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (status === "failed") setStatus("idle");
        }}
        placeholder={newsletter.placeholder}
        aria-label="Email address"
        disabled={status === "sent"}
        className="min-w-0 flex-1 bg-cream px-[18px] py-3 text-sm text-burgundy outline-none placeholder:text-burgundy/45 disabled:opacity-70"
      />
      <button
        type="submit"
        disabled={status === "sending" || status === "sent"}
        aria-live="polite"
        className="cursor-pointer bg-dizzy-orange px-[22px] py-3 text-xs font-semibold tracking-[.18em] text-cream uppercase transition-colors hover:bg-burgundy disabled:cursor-default disabled:hover:bg-dizzy-orange"
      >
        {labels[status]}
      </button>
    </form>
  );
}
