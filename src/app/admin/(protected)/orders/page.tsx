import Link from "next/link";

import { OrderStatusBadge, orderStatusLabels } from "@/components/admin/order-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const statuses = Object.values(OrderStatus);

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = statuses.find((value) => value === status);

  const orders = await db().order.findMany({
    where: filter ? { status: filter } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: { select: { quantity: true, name: true } } },
  });

  const filterLink = (label: string, value?: string) => (
    <Link
      key={label}
      href={value ? `/admin/orders?status=${value}` : "/admin/orders"}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        filter === value || (!filter && !value)
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:bg-muted",
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <div className="flex flex-wrap gap-2">
          {filterLink("All")}
          {statuses.map((value) => filterLink(orderStatusLabels[value], value))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{filter ? `${orderStatusLabels[filter]} orders` : "All orders"}</CardTitle>
          <CardDescription>Newest first. Open an order to change its status.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing here yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                        {order.number}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.name}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                    </TableCell>
                    <TableCell className="text-right">{formatPrice(order.totalCents, order.currency)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
