import Link from "next/link";
import { Suspense } from "react";

import { logoutAction } from "@/app/admin/actions";
import { Flash } from "@/components/admin/flash";
import { AdminNav } from "@/components/admin/nav";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-8">
      <aside className="flex shrink-0 flex-col gap-4 md:w-56">
        <div className="flex items-center justify-between md:flex-col md:items-start md:gap-1">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Dizzy Gals
          </Link>
          <Link href="/" className="text-xs text-muted-foreground hover:underline">
            View site ↗
          </Link>
        </div>
        <AdminNav />
        <form action={logoutAction} className="md:mt-auto">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            Sign out
          </Button>
        </form>
      </aside>
      <main className="min-w-0 flex-1">
        <Suspense fallback={null}>
          <Flash />
        </Suspense>
        {children}
      </main>
    </div>
  );
}
