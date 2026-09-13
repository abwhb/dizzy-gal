import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/generated/prisma/enums";

const variants: Record<OrderStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  PENDING: "outline",
  PAID: "default",
  FULFILLED: "secondary",
  CANCELLED: "destructive",
};

const labels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  FULFILLED: "Fulfilled",
  CANCELLED: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

export const orderStatusLabels = labels;
