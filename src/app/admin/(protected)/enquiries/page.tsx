import Link from "next/link";

import { EnquiryRowActions } from "@/components/admin/enquiry-row-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const { show } = await searchParams;
  const showAll = show === "all";

  const enquiries = await db().wholesaleEnquiry.findMany({
    where: showAll ? undefined : { handled: false },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const filterLink = (label: string, all: boolean) => (
    <Link
      key={label}
      href={all ? "/admin/enquiries?show=all" : "/admin/enquiries"}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        showAll === all
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
        <h1 className="text-2xl font-semibold tracking-tight">Wholesale enquiries</h1>
        <div className="flex gap-2">
          {filterLink("To call", false)}
          {filterLink("All", true)}
        </div>
      </div>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            {showAll ? "No enquiries yet." : "Nothing to call back. Nice."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id}>
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center gap-2">
                  {enquiry.business}
                  <Badge variant={enquiry.handled ? "secondary" : "outline"}>
                    {enquiry.handled ? "Handled" : "To call"}
                  </Badge>
                  {!enquiry.emailed ? <Badge variant="destructive">Email not sent</Badge> : null}
                </CardTitle>
                <CardDescription>
                  {enquiry.type ?? "Business"} · {formatDateTime(enquiry.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd>
                    {enquiry.contact} ·{" "}
                    <a href={`tel:${enquiry.phone}`} className="hover:underline">
                      {enquiry.phone}
                    </a>
                    {enquiry.email ? (
                      <>
                        {" · "}
                        <a href={`mailto:${enquiry.email}`} className="hover:underline">
                          {enquiry.email}
                        </a>
                      </>
                    ) : null}
                  </dd>
                  {enquiry.area ? (
                    <>
                      <dt className="text-muted-foreground">Where</dt>
                      <dd>{enquiry.area}</dd>
                    </>
                  ) : null}
                  <dt className="text-muted-foreground">Volume</dt>
                  <dd>
                    {enquiry.volume ?? "—"} · {enquiry.frequency ?? "—"}
                  </dd>
                  <dt className="text-muted-foreground">Flavours</dt>
                  <dd>{enquiry.flavours.length ? enquiry.flavours.join(", ") : "Not specified"}</dd>
                </dl>
                {enquiry.message ? (
                  <p className="rounded-md bg-muted p-3 whitespace-pre-wrap">{enquiry.message}</p>
                ) : null}
                <div className="flex justify-end">
                  <EnquiryRowActions id={enquiry.id} handled={enquiry.handled} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
