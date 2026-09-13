"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { removeSubscriberAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function SubscriberRowActions({ id, email }: { id: string; email: string }) {
  const [pending, startTransition] = useTransition();

  const remove = () => {
    if (!window.confirm(`Remove ${email} from the list?`)) return;
    startTransition(async () => {
      const result = await removeSubscriberAction(id);
      if (result.ok) toast.success(`${email} removed.`);
      else toast.error(result.error);
    });
  };

  return (
    <Button variant="destructive" size="sm" onClick={remove} disabled={pending}>
      Remove
    </Button>
  );
}
