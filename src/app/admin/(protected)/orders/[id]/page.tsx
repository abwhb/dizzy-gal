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
import { formatDeliveryDay } from "@/lib/delivery";
import { formatDateTime, money } from "@/lib/format";

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
          <h1 className="flex items-center gap-3 font-mono text-2xl font-semibold tracking-tight">
            {order.code}
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDateTime(order.createdAt)} · arriving{" "}
            <strong className="text-foreground">{formatDeliveryDay(order.deliveryDate)}</strong>
          </p>
        </div>
        <OrderStatusSelect id={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Jars</CardTitle>
            <CardDescription>
              {order.jars} {order.jars === 1 ? "jar" : "jars"}, cash on delivery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flavour</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Each</TableHead>
                  <TableHead className="text-right">Line</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                    <TableCell className="text-right">{money(item.price)}</TableCell>
                    <TableCell className="text-right">{money(item.price * item.qty)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <dl className="ml-auto grid max-w-xs grid-cols-2 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-right">{money(order.subtotal)}</dd>
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-right">{order.delivery === 0 ? "Free" : money(order.delivery)}</dd>
              <dt className="font-medium">To collect</dt>
              <dd className="text-right font-medium">{money(order.total)}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{order.name}</CardTitle>
            <CardDescription className="flex flex-col gap-0.5">
              <a href={`tel:${order.phone}`} className="hover:underline">
                {order.phone}
              </a>
              {order.email ? (
                <a href={`mailto:${order.email}`} className="hover:underline">
                  {order.email}
                </a>
              ) : (
                <span>No email left</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div>
              <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Deliver to</div>
              <address className="mt-1 whitespace-pre-line not-italic">{order.address}</address>
              <div>
                {order.area}, {order.city}
              </div>
            </div>
            {order.notes ? (
              <div>
                <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Notes</div>
                <p className="mt-1 whitespace-pre-wrap">{order.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
