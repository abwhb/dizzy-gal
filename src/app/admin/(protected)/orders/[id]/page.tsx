import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db().order.findUnique({
    where: { id },
    include: { items: { orderBy: { name: "asc" } } },
  });
  if (!order) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="text-xs text-muted-foreground hover:underline">
            ← Orders
          </Link>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
            Order #{order.number}
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusSelect id={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flavour</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit</TableHead>
                  <TableHead className="text-right">Line</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatPrice(item.unitPriceCents, order.currency)}</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(item.unitPriceCents * item.quantity, order.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <dl className="ml-auto grid max-w-xs grid-cols-2 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-right">{formatPrice(order.subtotalCents, order.currency)}</dd>
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-right">
                {order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents, order.currency)}
              </dd>
              <dt className="font-medium">Total</dt>
              <dd className="text-right font-medium">{formatPrice(order.totalCents, order.currency)}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
            <CardDescription>
              <a href={`mailto:${order.email}`} className="hover:underline">
                {order.email}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <address className="not-italic">
              <div className="font-medium">{order.name}</div>
              <div>{order.addressLine1}</div>
              {order.addressLine2 ? <div>{order.addressLine2}</div> : null}
              <div>
                {order.city}
                {order.region ? `, ${order.region}` : ""} {order.postcode}
              </div>
              <div>{order.country}</div>
            </address>
            {order.notes ? (
              <div>
                <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Notes
                </div>
                <p className="whitespace-pre-wrap">{order.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
