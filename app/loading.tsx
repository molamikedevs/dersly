export default function Loading() {
  return (
    <div
      aria-busy
      className="flex min-h-svh flex-col items-center justify-center gap-4"
    >
      <svg viewBox="0 0 64 64" className="size-12 animate-pulse" aria-hidden>
        <rect width="64" height="64" rx="16" fill="var(--primary)" />
        <path
          d="M17 15 H30 A17 17 0 0 1 30 49 H17 Z M25 23 H30 A9 9 0 0 1 30 41 H25 Z"
          fillRule="evenodd"
          fill="var(--primary-foreground)"
        />
      </svg>

      <span role="status" className="text-sm font-medium text-muted-foreground">
        Loading
      </span>
    </div>
  );
}
