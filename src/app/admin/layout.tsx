import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dizzy Gals admin",
  robots: { index: false, follow: false },
};

/**
 * Everything under /admin uses the neutral shadcn/ui theme rather than the
 * brand styling of the storefront.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // The storefront's base styles colour every <a> burgundy; neutralise that here.
    <div className="min-h-screen bg-background font-sans text-foreground antialiased [&_a]:text-inherit [&_a:hover]:text-inherit">
      {children}
      <Toaster position="top-right" richColors />
    </div>
  );
}
