"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { PageBody, pillPrimary } from "@/components/page-shell";
import { useSite } from "@/components/site-provider";
import { checkoutCopy, store } from "@/lib/content";
import { upcomingDeliveryDates } from "@/lib/delivery";
import { money } from "@/lib/format";
import { linesFor, newOrderId, saveOrder, totalsFor, type Customer, type Order } from "@/lib/orders";

const field =
  "w-full rounded-xl border-[3px] border-burgundy bg-cream px-4 py-3 text-sm font-medium text-burgundy outline-none placeholder:text-burgundy/40 focus:border-dizzy-orange";
const label = "mb-1.5 block text-[10px] font-semibold tracking-[.2em] uppercase";
const error = "mt-1 text-[11px] font-semibold text-dizzy-orange";

type Errors = Partial<Record<keyof Customer | "deliveryDate", string>>;

function validate(c: Customer, deliveryDate: string): Errors {
  const errors: Errors = {};
  if (c.name.trim().length < 2) errors.name = "We need a name for the box.";
  if (c.phone.replace(/\D/g, "").length < 10) errors.phone = "A phone number we can actually call.";
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) errors.email = "That email looks off.";
  if (c.address.trim().length < 8) errors.address = "A little more detail for the rider.";
  if (!c.area) errors.area = "Which phase?";
  if (!deliveryDate) errors.deliveryDate = "Pick a day.";
  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, hydrated, clearCart } = useSite();
  const lines = linesFor(items);
  const totals = totalsFor(lines);

  // Computed on the client only — the form doesn't render until the cart has
  // hydrated, so the server never paints these dates.
  const slots = useMemo(() => (hydrated ? upcomingDeliveryDates() : []), [hydrated]);

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: store.areas[0] ?? "",
    city: store.city,
    notes: "",
  });
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const chosenDate = deliveryDate || slots[0]?.iso || "";

  const update =
    (key: keyof Customer) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setCustomer((c) => ({ ...c, [key]: event.target.value }));

  if (!hydrated) return <PageBody className="min-h-[40vh]" />;

  if (!lines.length) {
    return (
      <PageBody className="py-20 text-center">
        <p className="font-display text-3xl font-extrabold">{checkoutCopy.cartEmpty}</p>
        <Link href="/shop" className={`${pillPrimary} mt-8`}>
          go on. dig in.
        </Link>
      </PageBody>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(customer, chosenDate);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      deliveryDate: chosenDate,
      lines,
      ...totals,
      customer: {
        ...customer,
        email: customer.email || undefined,
        notes: customer.notes || undefined,
      },
      payment: "cod",
      status: "placed",
    };

    // Tell the server; the browser keeps its own copy either way.
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch (err) {
      console.error("order intake failed; kept locally", err);
    }

    saveOrder(order);
    clearCart();
    router.push(`/order/${order.id}`);
  };

  return (
    <PageBody className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        {/* Delivery day */}
        <fieldset className="rounded-2xl border-[3px] border-burgundy bg-lemon p-5">
          <legend className="px-2 text-[10px] font-semibold tracking-[.2em] uppercase">
            Delivery day
          </legend>
          <p className="font-display text-xl font-extrabold">{checkoutCopy.dayTitle}</p>
          <p className="mt-1 text-sm font-medium">{checkoutCopy.dayBody}</p>
          {slots.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {slots.map((slot) => {
                const selected = slot.iso === chosenDate;
                return (
                  <label
                    key={slot.iso}
                    className={`flex cursor-pointer flex-col items-center rounded-xl border-[3px] border-burgundy px-3 py-3 text-center transition-[scale,background-color,color] duration-200 hover:scale-[1.03] ${
                      selected ? "bg-burgundy text-cream" : "bg-cream text-burgundy"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryDate"
                      value={slot.iso}
                      checked={selected}
                      onChange={() => setDeliveryDate(slot.iso)}
                      className="sr-only"
                    />
                    <span className="font-display text-lg leading-none font-extrabold">
                      {slot.weekday}
                    </span>
                    <span className="mt-1 text-[11px] font-semibold tracking-[.12em] uppercase">
                      {slot.label.replace(`${slot.weekday} `, "")}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className={error}>No delivery days open right now — try again shortly.</p>
          )}
          {errors.deliveryDate && <p className={error}>{errors.deliveryDate}</p>}
        </fieldset>

        <h2 className="font-display text-2xl font-extrabold">Where&rsquo;s it going?</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={label}>
              Name
            </label>
            <input id="name" className={field} value={customer.name} onChange={update("name")} autoComplete="name" />
            {errors.name && <p className={error}>{errors.name}</p>}
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
              value={customer.phone}
              onChange={update("phone")}
              autoComplete="tel"
              placeholder="03xx xxxxxxx"
            />
            {errors.phone && <p className={error}>{errors.phone}</p>}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="area" className={label}>
              Area
            </label>
            <select id="area" className={field} value={customer.area} onChange={update("area")}>
              {store.areas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
            {errors.area && <p className={error}>{errors.area}</p>}
          </div>
          <div>
            <label htmlFor="city" className={label}>
              City
            </label>
            <input id="city" className={`${field} bg-burgundy/5`} value={customer.city} readOnly />
            <p className="mt-1 text-[11px] font-medium">{checkoutCopy.areaNote}</p>
          </div>
        </div>

        <div>
          <label htmlFor="address" className={label}>
            Address
          </label>
          <textarea
            id="address"
            rows={3}
            className={`${field} resize-none`}
            value={customer.address}
            onChange={update("address")}
            autoComplete="street-address"
            placeholder="House, street, block — and anything the rider should know"
          />
          {errors.address && <p className={error}>{errors.address}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={label}>
              Email <span className="text-burgundy/50">(optional)</span>
            </label>
            <input id="email" type="email" className={field} value={customer.email} onChange={update("email")} autoComplete="email" />
            {errors.email && <p className={error}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="notes" className={label}>
              Notes <span className="text-burgundy/50">(optional)</span>
            </label>
            <input id="notes" className={field} value={customer.notes} onChange={update("notes")} placeholder="Gift? Gate code? Say hi?" />
          </div>
        </div>

        <fieldset className="rounded-2xl border-[3px] border-burgundy bg-strawberry p-5">
          <legend className="px-2 text-[10px] font-semibold tracking-[.2em] uppercase">Payment</legend>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="radio" name="payment" value="cod" checked readOnly className="mt-1 size-4 accent-burgundy" />
            <span>
              <span className="block font-display text-xl font-extrabold">{checkoutCopy.paymentTitle}</span>
              <span className="mt-1 block text-sm font-medium">{checkoutCopy.paymentBody}</span>
            </span>
          </label>
        </fieldset>

        <button type="submit" disabled={submitting || !slots.length} className={`${pillPrimary} self-start`}>
          {submitting ? "placing…" : checkoutCopy.placeOrder}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border-[3px] border-burgundy bg-lemon p-6">
        <h2 className="font-display text-2xl font-extrabold">Your order</h2>
        <ul className="m-0 mt-4 list-none space-y-2 p-0 text-sm font-medium">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-4">
              <span>
                {line.qty} × {line.name}
              </span>
              <span>{money(line.qty * line.price)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t-[3px] border-burgundy pt-3 text-sm font-medium">
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{totals.delivery === 0 ? "Free" : money(totals.delivery)}</dd>
          </div>
          {chosenDate ? (
            <div className="flex justify-between">
              <dt>Arriving</dt>
              <dd>{slots.find((s) => s.iso === chosenDate)?.label}</dd>
            </div>
          ) : null}
          <div className="flex justify-between font-display text-xl font-extrabold">
            <dt>To pay the rider</dt>
            <dd>{money(totals.total)}</dd>
          </div>
        </dl>
        <Link href="/cart" className="mt-4 inline-block text-[10px] font-semibold tracking-[.18em] uppercase hover:text-dizzy-orange">
          Edit cart
        </Link>
      </aside>
    </PageBody>
  );
}
