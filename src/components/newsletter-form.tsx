"use client";

import { useState } from "react";

import { analytics } from "@/lib/analytics";
import { newsletter } from "@/lib/content";

/** The pill email form, shared by the modal and the footer. */
export function NewsletterForm({
  source,
  className = "",
}: {
  /** Where the form lives; reported with the subscribe event. */
  source: "modal" | "footer";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!email || subscribed) return;
        setSubscribed(true);
        analytics.newsletterSubscribed(source);
      }}
      className={`flex overflow-hidden rounded-full border-[3px] border-burgundy ${className}`}
    >
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={newsletter.placeholder}
        aria-label="Email address"
        className="min-w-0 flex-1 bg-cream px-[18px] py-3 text-sm text-burgundy outline-none placeholder:text-burgundy/45"
      />
      <button
        type="submit"
        className="cursor-pointer bg-dizzy-orange px-[22px] py-3 text-xs font-semibold tracking-[.18em] text-cream uppercase transition-colors hover:bg-burgundy"
      >
        {subscribed ? newsletter.sent : newsletter.send}
      </button>
    </form>
  );
}
