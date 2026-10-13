import Link from 'next/link';

import type { DemoSide } from '@/features/app/app-mode';

const LINK =
  'shrink-0 rounded-sm font-semibold text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

// Calm and always there, so nobody mistakes the demo for the real app
export default function DemoBanner({ side }: { side: DemoSide }) {
  const other = side === 'teacher' ? 'student' : 'teacher';

  return (
    <div
      role="region"
      aria-label="Demo mode"
      className="border-b border-border bg-muted pt-[env(safe-area-inset-top)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 text-sm sm:px-6">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">Demo mode.</span>{' '}
          Nothing is saved.
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href={`/demo/${other}`} className={LINK}>
            See the {other} side
          </Link>
          <Link href="/login" className={LINK}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
