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
    <section className="flex flex-col gap-6 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary-foreground/75">
          <Icon className="size-4" aria-hidden />
          <span className="text-xs font-semibold uppercase tracking-[0.12em]">
            Next lesson
          </span>
        </div>

        <p className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
          {schedule ?? 'Schedule to be confirmed'}
        </p>

        <p className="text-base text-primary-foreground/85 sm:text-lg">
          {className}
          {level && <span className="capitalize"> &middot; {level}</span>}
        </p>
      </div>

      {meetingUrl && (
        <a
          href={meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-background px-6 text-[15px] font-bold text-primary transition-colors hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:self-start"
        >
          <Video className="size-4" aria-hidden />
          Join lesson
        </a>
      )}
    </section>
  );
}
