import { store } from "@/lib/content";

/** A day the customer can choose at checkout. `iso` is a local YYYY-MM-DD. */
export type DeliverySlot = { iso: string; weekday: string; label: string };

function localIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "Friday 11 Sept" */
export function formatDeliveryDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${date.toLocaleDateString("en-GB", { weekday: "long" })} ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

/**
 * The next delivery days still open for orders. A day closes at
 * `store.cutoffHour` the day before, so the kitchen has the morning.
 */
export function upcomingDeliveryDates(from: Date = new Date(), count = 4): DeliverySlot[] {
  const slots: DeliverySlot[] = [];
  for (let ahead = 1; ahead <= 28 && slots.length < count; ahead++) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + ahead);
    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
    if (!store.deliveryDays.includes(weekday)) continue;
    const cutoff = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, store.cutoffHour);
    if (from > cutoff) continue;
    const iso = localIso(date);
    slots.push({ iso, weekday, label: formatDeliveryDay(iso) });
  }
  return slots;
}
