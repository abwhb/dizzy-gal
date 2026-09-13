import { store } from "@/lib/content";

/** `1200` → `Rs 1,200`. */
export function money(amount: number): string {
  return `${store.currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatDate(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "13 Sept 2026, 8:10 pm" in the shop's time zone, for the admin. */
export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString("en-GB", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
