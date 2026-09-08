import Link from "next/link";

import { Illustration } from "@/components/illustrations";
import { PageBody, PageShell, pillPrimary } from "@/components/page-shell";

export default function NotFound() {
  return (
    <PageShell title="You look lost." kicker="404" doodle="smiley">
      <PageBody className="flex flex-col items-center py-20 text-center">
        <Illustration name="zzz" strokeWidth={2.4} className="w-20 text-dizzy-orange" style={{ rotate: "-10deg" }} />
        <p className="mt-6 font-display text-3xl font-extrabold">Probably need cake.</p>
        <p className="mt-1 text-sm font-medium">That page isn&rsquo;t here. The jars are.</p>
        <Link href="/shop" className={`${pillPrimary} mt-8`}>
          go on. dig in.
        </Link>
      </PageBody>
    </PageShell>
  );
}
