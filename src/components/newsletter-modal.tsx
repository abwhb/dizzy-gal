"use client";

import { useEffect, useState } from "react";

import { useSite } from "@/components/site-provider";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; again: boolean } | { kind: "error"; message: string };

export function NewsletterModal() {
  const { newsletterOpen, closeNewsletter } = useSite();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (!newsletterOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNewsletter();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [newsletterOpen, closeNewsletter]);

  if (!newsletterOpen) return null;

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || status.kind === "sending") return;
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "site-modal" }),
      });
      const body = (await response.json()) as {
        alreadySubscribed?: boolean;
        error?: { message?: string };
      };
      if (!response.ok) {
        setStatus({ kind: "error", message: body.error?.message ?? "That didn't work. Try again?" });
        return;
      }
      setStatus({ kind: "sent", again: Boolean(body.alreadySubscribed) });
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach us. Try again in a moment." });
    }
  };

  const buttonLabel =
    status.kind === "sending" ? "Sending…" : status.kind === "sent" ? "Sent" : "Send";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-burgundy/60 p-5"
      onClick={closeNewsletter}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-heading"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[440px] flex-col gap-4 rounded-[18px] border-[3px] border-burgundy bg-lemon px-6 py-7"
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="newsletter-heading"
            className="font-display text-[32px] leading-none font-extrabold uppercase"
          >
            Newsletter
          </h2>
          <button
            type="button"
            onClick={closeNewsletter}
            className="cursor-pointer text-[10px] font-semibold tracking-[.18em] text-burgundy uppercase hover:text-dizzy-orange"
          >
            Close
          </button>
        </div>

        <p className="text-sm leading-[1.5] font-medium">
          {status.kind === "sent"
            ? status.again
              ? "You're already on the list. Cake is coming."
              : "You're in. Keep an eye on your inbox for drops and restocks."
            : "Bad day? Cake. Good day? Also cake. Sign up for drops, restocks, and 15% off your first jar."}
        </p>

        <form onSubmit={subscribe} className="flex overflow-hidden rounded-full border-[3px] border-burgundy">
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status.kind !== "idle") setStatus({ kind: "idle" });
            }}
            placeholder="you@somewhere.com"
            aria-label="Email address"
            required
            className="min-w-0 flex-1 bg-cream px-[18px] py-3 text-sm text-burgundy outline-none"
          />
          <button
            type="submit"
            disabled={status.kind === "sending"}
            className="cursor-pointer bg-dizzy-orange px-[22px] py-3 text-xs font-semibold tracking-[.18em] text-cream uppercase disabled:opacity-70"
          >
            {buttonLabel}
          </button>
        </form>
        {status.kind === "error" ? (
          <p role="alert" className="text-xs font-semibold tracking-[.08em] text-dizzy-orange uppercase">
            {status.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
