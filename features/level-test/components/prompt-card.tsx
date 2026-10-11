import Link from 'next/link';

export default function PromptCard() {
  return (
    <Link
      href="/level-test"
      className="group flex touch-manipulation flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-colors select-none hover:border-input-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="flex flex-col gap-1.5">
        <span className="font-serif text-2xl leading-tight font-medium tracking-tight text-foreground">
          Find your English level
        </span>
        <span className="text-[15px] text-muted-foreground">
          30 questions, about 10 minutes.
        </span>
      </span>

      <span className="flex h-12 items-center justify-center rounded-xl border border-foreground text-[15px] font-bold text-foreground transition-[scale,background-color] duration-150 ease-out group-hover:bg-muted group-active:scale-[0.97]">
        Start the test
      </span>
    </Link>
  );
}
