import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PromptCard() {
  return (
    <Link
      href="/level-test"
      className="group flex items-center gap-4 rounded-lg bg-accent p-4 transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
    >
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background text-primary"
      >
        <Sparkles className="size-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          What is your English level?
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          Take a short test. Thirty questions, about ten minutes.
        </span>
      </span>

      <ArrowRight
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        aria-hidden
      />
    </Link>
  );
}
