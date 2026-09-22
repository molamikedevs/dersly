import { ArrowRight, ChartNoAxesColumn } from 'lucide-react';
import Link from 'next/link';

export default function PromptCard() {
  return (
    <Link
      href="/level-test"
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex items-center gap-3.5">
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-highlight-muted text-highlight"
        >
          <ChartNoAxesColumn className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-bold text-foreground">
            Find your English level
          </span>
          <span className="block text-sm text-muted-foreground">
            30 questions &middot; about 10 min
          </span>
        </span>
      </span>

      <span className="flex h-12 items-center justify-center gap-2 rounded-xl border border-foreground text-[15px] font-bold text-foreground">
        Start the test
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
