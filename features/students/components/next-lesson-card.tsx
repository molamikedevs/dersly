import { CalendarDays, Video } from 'lucide-react';

type Props = {
  className: string;
  level: string | null;
  schedule: string | null;
  meetingUrl: string | null;
};

export default function NextLessonCard({
  className,
  level,
  schedule,
  meetingUrl,
}: Props) {
  const Icon = meetingUrl ? Video : CalendarDays;

  return (
    <section className="rounded-lg bg-accent p-5">
      <div className="flex items-center gap-1.5 text-primary">
        <Icon className="size-3.5" aria-hidden />
        <span className="text-[11px] font-medium uppercase tracking-wider">
          Next lesson
        </span>
      </div>

      <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">
        {schedule ?? 'Schedule to be confirmed'}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {className}
        {level && <span className="capitalize"> &middot; {level}</span>}
      </p>

      {meetingUrl && (
        <a
          href={meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex h-12 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Video className="size-4" aria-hidden />
          Join lesson
        </a>
      )}
    </section>
  );
}
