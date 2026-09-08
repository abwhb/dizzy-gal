"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageBody, pillPrimary } from "@/components/page-shell";
import { useSite } from "@/components/site-provider";
import { checkoutCopy, store } from "@/lib/content";
import { money } from "@/lib/format";
import { linesFor, newOrderId, saveOrder, totalsFor, type Customer, type Order } from "@/lib/orders";

const OTHER_CITY = "Somewhere else";

const field =
  "w-full rounded-xl border-[3px] border-burgundy bg-cream px-4 py-3 text-sm font-medium text-burgundy outline-none placeholder:text-burgundy/40 focus:border-dizzy-orange";
const label = "mb-1.5 block text-[10px] font-semibold tracking-[.2em] uppercase";

type Errors = Partial<Record<keyof Customer, string>>;

function validate(c: Customer): Errors {
  const errors: Errors = {};
  if (c.name.trim().length < 2) errors.name = "We need a name for the box.";
  if (c.phone.replace(/\D/g, "").length < 10) errors.phone = "A phone number we can actually call.";
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) errors.email = "That email looks off.";
  if (c.address.trim().length < 8) errors.address = "A little more detail for the rider.";
  if (!c.city) errors.city = "Pick a city.";
  return errors;
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, hydrated, clearCart } = useSite();
  const lines = linesFor(items);
  const totals = totalsFor(lines);

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: store.deliveryAreas[0] ?? "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof Customer) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setCustomer((c) => ({ ...c, [key]: event.target.value }));

  if (!hydrated) return <PageBody className="min-h-[40vh]" />;

  if (!lines.length) {
    return (
      <PageBody className="py-20 text-center">
        <p className="font-display text-3xl font-extrabold">{checkoutCopy.cartEmpty}</p>
        <Link href="/#shop" className={`${pillPrimary} mt-8`}>
          go on. dig in.
        </Link>
      </PageBody>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const found = validate(customer);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      lines,
      ...totals,
      customer: { ...customer, email: customer.email || undefined, notes: customer.notes || undefined },
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
    } catch (error) {
      console.error("order intake failed; kept locally", error);
    }

    saveOrder(order);
    clearCart();
    router.push(`/order/${order.id}`);
  };

  return (
    <PageBody className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <h2 className="font-display text-2xl font-extrabold">Where&rsquo;s it going?</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={label}>
              Name
            </label>
            <input id="name" className={field} value={customer.name} onChange={update("name")} autoComplete="name" />
            {errors.name && <p className="mt-1 text-[11px] font-semibold text-dizzy-orange">{errors.name}</p>}
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
            {errors.phone && <p className="mt-1 text-[11px] font-semibold text-dizzy-orange">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className={label}>
            Email <span className="text-burgundy/50">(optional)</span>
          </label>
          <input id="email" type="email" className={field} value={customer.email} onChange={update("email")} autoComplete="email" />
          {errors.email && <p className="mt-1 text-[11px] font-semibold text-dizzy-orange">{errors.email}</p>}
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
            placeholder="House, street, area — and anything the rider should know"
          />
          {errors.address && <p className="mt-1 text-[11px] font-semibold text-dizzy-orange">{errors.address}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className={label}>
              City
            </label>
            <select id="city" className={field} value={customer.city} onChange={update("city")}>
              {store.deliveryAreas.map((city) => (
                <option key={city}>{city}</option>
              ))}
              <option>{OTHER_CITY}</option>
            </select>
            {customer.city === OTHER_CITY && (
              <p className="mt-1 text-[11px] font-medium">We&rsquo;ll call to see if we can reach you.</p>
            )}
            {errors.city && <p className="mt-1 text-[11px] font-semibold text-dizzy-orange">{errors.city}</p>}
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

        <button type="submit" disabled={submitting} className={`${pillPrimary} self-start`}>
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
