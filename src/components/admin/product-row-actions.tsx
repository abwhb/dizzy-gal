"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteProductAction, setProductActiveAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function ProductRowActions({ id, name, active }: { id: string; name: string; active: boolean }) {
  const [pending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      const result = await setProductActiveAction(id, !active);
      if (result.ok) toast.success(`${name} is now ${active ? "hidden from" : "live in"} the shop.`);
      else toast.error(result.error);
    });

  const remove = () => {
    if (!window.confirm(`Delete ${name}? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (result.ok) toast.success(`${name} deleted.`);
      else toast.error(result.error);
    });
  };

  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="sm" render={<Link href={`/admin/products/${id}`} />}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={toggle} disabled={pending}>
        {active ? "Deactivate" : "Activate"}
      </Button>
      <Button variant="destructive" size="sm" onClick={remove} disabled={pending}>
        Delete
      </Button>
    </div>
  );
}
