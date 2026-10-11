import Link from 'next/link';

const BUTTON =
  'inline-flex h-12 touch-manipulation items-center justify-center self-start rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]';

export default function OverviewError() {
  return (
    <div role="alert" className="flex max-w-prose flex-col gap-4 pb-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Today did not load
      </h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        Check your internet connection and try again.
      </p>

      <Link href="/dashboard" className={BUTTON}>
        Try again
      </Link>
    </div>
  );
}
