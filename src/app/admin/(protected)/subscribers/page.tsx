import { SubscriberRowActions } from "@/components/admin/subscriber-row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatDate } from "@/lib/format";

export default async function AdminSubscribersPage() {
  const subscribers = await db().newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  const activeCount = subscribers.filter((s) => !s.unsubscribedAt).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Subscribers</h1>
        <Button variant="outline" render={<a href="/admin/subscribers/export" />}>
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter list</CardTitle>
          <CardDescription>
            {activeCount} active of {subscribers.length} total. The CSV export contains active
            addresses only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sign-ups yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Signed up</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell className="text-muted-foreground">{subscriber.source ?? "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(subscriber.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscriber.unsubscribedAt ? "outline" : "default"}>
                        {subscriber.unsubscribedAt ? "Unsubscribed" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <SubscriberRowActions id={subscriber.id} email={subscriber.email} />
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
