import { AppLink } from '@/features/app/app-mode';

export default function PromptCard() {
  return (
    <AppLink
      href="/level-test"
      className="surface-hero group flex touch-manipulation flex-wrap items-center gap-x-4 gap-y-3 p-5 select-none transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.99]"
    >
      <span className="min-w-0 flex-1 basis-44">
        <span className="block font-serif text-xl leading-tight font-medium tracking-tight text-foreground">
          Find your English level
        </span>
        <span className="mt-1 block text-xs text-hero-foreground/85">
          30 questions, about 10 minutes.
        </span>
      </span>

      <span className="flex h-10 shrink-0 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-xs transition-colors duration-150 ease-out group-hover:bg-primary/90">
        Start the test
      </span>
    </AppLink>
  );
}
