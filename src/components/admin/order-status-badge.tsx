import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/generated/prisma/enums";

const variants: Record<OrderStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  PLACED: "outline",
  CONFIRMED: "default",
  DELIVERED: "secondary",
  CANCELLED: "destructive",
};

const labels: Record<OrderStatus, string> = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}

export const orderStatusLabels = labels;
