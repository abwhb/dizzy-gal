import { store } from "@/lib/content";

/** `1200` → `Rs 1,200`. */
export function money(amount: number): string {
  return `${store.currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
