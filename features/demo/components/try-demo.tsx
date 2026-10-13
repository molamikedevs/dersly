import Link from 'next/link';

import { AUTH_LINK_SECONDARY } from '@/features/auth/styles';
import { cn } from '@/lib/utils';

// Grows instead of clipping when the text is set very large
const BUTTON = cn(AUTH_LINK_SECONDARY, 'h-auto min-h-12 py-2 text-center');

// For anyone who wants to look around before they have an account. Each
// button opens the demo, which runs on invented data and saves nothing.
export default function TryDemo() {
  return (
    <section aria-labelledby="try-demo" className="mt-8 flex flex-col gap-4">
      <div>
        <h2 id="try-demo" className="text-base font-semibold text-foreground">
          Just looking around?
        </h2>
        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
          Try Dersly with invented classes and students. No account needed, and
          nothing is saved.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(9.5rem,100%),1fr))] gap-2">
        <Link href="/demo/teacher" className={BUTTON}>
          Try as teacher
        </Link>
        <Link href="/demo/student" className={BUTTON}>
          Try as student
        </Link>
      </div>
    </section>
  );
}
