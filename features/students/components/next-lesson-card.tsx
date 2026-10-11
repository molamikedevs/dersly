import { Video } from 'lucide-react';

type Props = {
  when: string | null;
  started?: boolean;
  className: string;
  level: string | null;
  schedule: string | null;
  meetingUrl: string | null;
};

export default function NextLessonCard({
  when,
  started = false,
  className,
  level,
  schedule,
  meetingUrl,
}: Props) {
  return (
    <section
      aria-labelledby="next-lesson-heading"
      className="flex flex-col gap-6 rounded-3xl bg-primary p-6 text-primary-foreground sm:p-9"
    >
      <div className="flex min-w-0 flex-col gap-2">
        <h2
          id="next-lesson-heading"
          className="text-sm font-medium text-primary-foreground/85"
        >
          {started ? 'Your lesson has started' : 'Next lesson'}
        </h2>

        <p className="font-serif text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl sm:leading-[1.04]">
          {when ?? 'No lesson time yet'}
        </p>

        <p className="flex flex-wrap items-baseline gap-x-2.5 text-base sm:text-lg">
          <span className="min-w-0 font-semibold break-words">{className}</span>
          {level && (
            <span className="text-primary-foreground/85 capitalize">
              {level}
            </span>
          )}
        </p>

        <p className="text-sm text-primary-foreground/85">
          {schedule
            ? `${schedule}, Baku time`
            : 'Your teacher will add your lesson days here.'}
        </p>
      </div>

      {meetingUrl && (
        <a
          href={meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 touch-manipulation items-center justify-center gap-2 rounded-xl bg-background px-6 text-[15px] font-bold text-primary transition-[scale,background-color] duration-150 ease-out select-none hover:bg-background/90 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:outline-none active:scale-[0.97] sm:self-start"
        >
          <Video className="size-4" aria-hidden />
          Join lesson
        </a>
      )}
    </section>
  );
}
