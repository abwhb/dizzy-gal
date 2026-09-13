"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { updateOrderStatusAction } from "@/app/admin/actions";
import { orderStatusLabels } from "@/components/admin/order-status-badge";
import { Label } from "@/components/ui/label";
import { OrderStatus } from "@/generated/prisma/enums";

export function OrderStatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="order-status" className="text-muted-foreground">
        Status
      </Label>
      <select
        id="order-status"
        value={status}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(async () => {
            const result = await updateOrderStatusAction(id, next);
            if (result.ok) toast.success(`Order marked ${orderStatusLabels[next as OrderStatus].toLowerCase()}.`);
            else toast.error(result.error);
          });
        }}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm disabled:opacity-50"
      >
        {Object.values(OrderStatus).map((value) => (
          <option key={value} value={value}>
            {orderStatusLabels[value]}
          </option>
        ))}
      </select>
    </div>
  );
}
