import Link from "next/link";

import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function AdminDashboardPage() {
  const prisma = db();
  const [orderCount, pendingCount, revenue, subscriberCount, products, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { totalCents: true },
        where: { status: { in: ["PAID", "FULFILLED"] } },
      }),
      prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
      prisma.product.findMany({
        where: { active: true },
        select: { name: true, stock: true, currency: true },
        orderBy: { stock: "asc" },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: { select: { quantity: true } } },
      }),
    ]);

  const currency = products[0]?.currency ?? "AUD";
  const lowStock = products.filter((product) => product.stock <= 10);

  const stats = [
    { label: "Orders", value: String(orderCount), hint: `${pendingCount} awaiting payment` },
    {
      label: "Revenue",
      value: formatPrice(revenue._sum.totalCents ?? 0, currency),
      hint: "paid + fulfilled orders",
    },
    { label: "Subscribers", value: String(subscriberCount), hint: "newsletter" },
    {
      label: "Low stock",
      value: String(lowStock.length),
      hint: lowStock.length ? lowStock.map((p) => `${p.name} (${p.stock})`).join(", ") : "all good",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{stat.hint}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>
            <Link href="/admin/orders" className="hover:underline">
              See all orders
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Jars</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                        {order.number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell className="text-right">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
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
