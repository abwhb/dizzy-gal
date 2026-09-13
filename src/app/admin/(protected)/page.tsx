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
import { formatDeliveryDay } from "@/lib/delivery";
import { formatDateTime, money } from "@/lib/format";

function todayInLahore(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function AdminDashboardPage() {
  const prisma = db();
  const today = todayInLahore();
  const [placedCount, upcoming, revenue, subscriberCount, openEnquiries, products, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { status: "PLACED" } }),
      prisma.order.findMany({
        where: { status: { in: ["PLACED", "CONFIRMED"] }, deliveryDate: { gte: today } },
        select: { deliveryDate: true, jars: true },
      }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "DELIVERED" } }),
      prisma.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
      prisma.wholesaleEnquiry.count({ where: { handled: false } }),
      prisma.product.findMany({
        where: { active: true },
        select: { name: true, stock: true },
        orderBy: { stock: "asc" },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  // Jars to bake per upcoming delivery day.
  const byDay = new Map<string, { orders: number; jars: number }>();
  for (const order of upcoming) {
    const day = byDay.get(order.deliveryDate) ?? { orders: 0, jars: 0 };
    day.orders += 1;
    day.jars += order.jars;
    byDay.set(order.deliveryDate, day);
  }
  const bakeList = [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(0, 4);
  const lowStock = products.filter((product) => product.stock <= 10);

  const stats = [
    {
      label: "To call",
      value: String(placedCount),
      hint: placedCount === 1 ? "order placed, not yet confirmed" : "orders placed, not yet confirmed",
    },
    {
      label: "Next bakes",
      value: bakeList.length
        ? bakeList
            .map(([day, { jars }]) => {
              const [weekday, date] = formatDeliveryDay(day).split(" ");
              return `${weekday.slice(0, 3)} ${date}: ${jars}`;
            })
            .join(" · ")
        : "—",
      hint: bakeList.length ? "jars per upcoming delivery day" : "nothing on the calendar",
    },
    { label: "Delivered", value: money(revenue._sum.total ?? 0), hint: "cash collected at the door" },
    {
      label: "Wholesale",
      value: String(openEnquiries),
      hint: openEnquiries === 1 ? "enquiry to call back" : "enquiries to call back",
    },
    { label: "Subscribers", value: String(subscriberCount), hint: "on the newsletter" },
    {
      label: "Low stock",
      value: String(lowStock.length),
      hint: lowStock.length ? lowStock.map((p) => `${p.name} (${p.stock})`).join(", ") : "all good",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
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
                  <TableHead>Order</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead>Delivery</TableHead>
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
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-medium hover:underline">
                        {order.code}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDeliveryDay(order.deliveryDate)}</TableCell>
                    <TableCell>
                      {order.name}
                      <span className="block text-xs text-muted-foreground">{order.area}</span>
                    </TableCell>
                    <TableCell className="text-right">{order.jars}</TableCell>
                    <TableCell className="text-right">{money(order.total)}</TableCell>
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
