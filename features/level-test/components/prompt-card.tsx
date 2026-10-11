import Link from 'next/link';

export default function PromptCard() {
  return (
    <Link
      href="/level-test"
      className="group flex touch-manipulation flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-input-border p-5 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="min-w-0 flex-1 basis-44">
        <span className="block font-serif text-xl leading-tight font-medium tracking-tight text-foreground">
          Find your English level
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">
          30 questions, about 10 minutes.
        </span>
      </span>

      <span className="flex h-11 shrink-0 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition-[scale,background-color] duration-150 ease-out group-hover:bg-primary/90 group-active:scale-[0.97]">
        Start the test
      </span>
    </Link>
  );
}
