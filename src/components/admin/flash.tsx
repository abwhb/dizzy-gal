"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const messages: Record<string, string> = {
  created: "Product created.",
  updated: "Product saved.",
};

/** Turns a `?flash=…` query param (set by a server action redirect) into a toast. */
export function Flash() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const flash = params.get("flash");

  useEffect(() => {
    if (!flash) return;
    toast.success(messages[flash] ?? flash);
    router.replace(pathname, { scroll: false });
  }, [flash, pathname, router]);

  return null;
}
