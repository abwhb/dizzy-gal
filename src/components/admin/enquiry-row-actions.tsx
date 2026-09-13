"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { setEnquiryHandledAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function EnquiryRowActions({ id, handled }: { id: string; handled: boolean }) {
  const [pending, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      const result = await setEnquiryHandledAction(id, !handled);
      if (result.ok) toast.success(handled ? "Back on the call list." : "Marked handled.");
      else toast.error(result.error);
    });

  return (
    <Button variant={handled ? "ghost" : "outline"} size="sm" onClick={toggle} disabled={pending}>
      {handled ? "Reopen" : "Mark handled"}
    </Button>
  );
}
