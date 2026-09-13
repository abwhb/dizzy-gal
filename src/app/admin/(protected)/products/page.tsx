import Link from "next/link";

import { ProductRowActions } from "@/components/admin/product-row-actions";
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
import { money } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await db().product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Flavours</h1>
        <Button render={<Link href="/admin/products/new" />}>New flavour</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cakes in a jar</CardTitle>
          <CardDescription>
            Inactive flavours are hidden from the shop but keep their order history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No flavours yet. Run <code>npm run db:seed</code> or add one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Id</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="inline-block size-3 rounded-full border"
                          style={{ backgroundColor: product.panel }}
                        />
                        <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                          {product.name}
                        </Link>
                        {product.tag ? (
                          <span className="text-xs text-muted-foreground">{product.tag}</span>
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{product.slug}</TableCell>
                    <TableCell className="text-right">{money(product.price)}</TableCell>
                    <TableCell className="text-right">
                      <span className={product.stock === 0 ? "text-destructive" : undefined}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.active ? "default" : "outline"}>
                        {product.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ProductRowActions id={product.id} name={product.name} active={product.active} />
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
