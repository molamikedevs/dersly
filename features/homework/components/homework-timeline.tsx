import { differenceInCalendarDays } from 'date-fns';
import {
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react';

import { AppLink } from '@/features/app/app-mode';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import CurrentWorkCard from '@/features/students/components/current-work-card';
import { formatNextLesson } from '@/lib/schedule';
import { inBaku } from '@/lib/time-zone';
import { cn, formatDate } from '@/lib/utils';

const PRIMARY_BUTTON =
  'inline-flex h-11 touch-manipulation items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),0_1px_2px_0_oklch(0_0_0/0.35)] transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]';

function readHref(item: HomeworkItem) {
  return item.content ? `/homework/${item.id}` : undefined;
}

function postedLine(createdAt: string, now: Date) {
  const days = differenceInCalendarDays(now, new Date(createdAt), inBaku);

  if (days === 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';

  return `Posted ${formatDate(createdAt, 'long')}`;
}

function lessonLine(item: HomeworkItem, now: Date) {
  if (item.dueDate) return `Due ${formatDate(item.dueDate, 'long')}`;

  const owner = item.classes;
  const who =
    !owner || owner.type === 'one_to_one' ? 'your lesson' : owner.name;

  if (!item.lessonAt) {
    return owner && owner.type !== 'one_to_one' ? `For ${owner.name}` : null;
  }

  const when = formatNextLesson(new Date(item.lessonAt), now);
  const relative = /^(Today|Tonight|Tomorrow)/.test(when);

  return relative
    ? `For ${who} ${when[0].toLowerCase()}${when.slice(1)}`
    : `For ${who} on ${when}`;
}

function HomeworkError() {
  return (
    <div
      role="alert"
      className="surface-card flex max-w-prose flex-col items-start gap-4 p-6 sm:p-8"
    >
      <p className="text-base leading-relaxed text-foreground">
        Your homework did not load. Check your internet connection and try
        again.
      </p>
      <AppLink href="/homework" className={PRIMARY_BUTTON}>
        Try again
      </AppLink>
    </div>
  );
}

function NoHomework({
  isTopic,
  schedule,
}: {
  isTopic: boolean;
  schedule: string | null;
}) {
  return (
    <div className="surface-card flex max-w-prose flex-col items-start gap-4 p-6 sm:p-8">
      <div>
        <p className="font-serif text-xl font-medium text-foreground">
          {isTopic ? 'No topic posted yet' : 'Nothing to do yet'}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {isTopic
            ? 'Before each club meeting, the topic and its questions appear here.'
            : 'After each lesson, your teacher posts your homework here.'}
          {schedule &&
            ` ${isTopic ? 'Club times' : 'Lesson times'}: ${schedule}, Baku time.`}
        </p>
      </div>
      <AppLink href="/" className={PRIMARY_BUTTON}>
        Back to home
      </AppLink>
    </div>
  );
}

type EnrolmentInfo = {
  type: ClassType;
  schedule: string | null;
  lessonsDone?: number;
  nextLesson?: string | null;
};

function ClassSummaryCard({ enrolment }: { enrolment: EnrolmentInfo }) {
  const isOneToOne = enrolment.type === 'one_to_one';
  const hasProgress = isOneToOne && typeof enrolment.lessonsDone === 'number';
  const done = hasProgress
    ? Math.min(Math.max(enrolment.lessonsDone!, 0), LESSONS_PER_PACKAGE)
    : 0;

  if (!enrolment.schedule && !enrolment.nextLesson && !hasProgress) {
    return null;
  }

  return (
    <aside className="surface-card flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Calendar className="size-3.5 text-primary" aria-hidden />
        <span>
          {enrolment.nextLesson ? 'Your next lesson' : 'Lesson schedule'}
        </span>
      </div>

      <div>
        <p className="font-serif text-2xl leading-tight font-medium tracking-tight text-foreground">
          {enrolment.nextLesson ?? enrolment.schedule}
        </p>
        {enrolment.nextLesson && enrolment.schedule && (
          <p className="mt-1 text-xs text-muted-foreground">
            {enrolment.schedule}, Baku time
          </p>
        )}
        {!enrolment.nextLesson && enrolment.schedule && (
          <p className="mt-1 text-xs text-muted-foreground">Baku time</p>
        )}
      </div>

      {hasProgress && (
        <div className="border-t border-border-subtle pt-4">
          <div aria-hidden className="flex items-center gap-1.5">
            {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'size-2 rounded-full',
                  index < done ? 'bg-primary' : 'bg-border',
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            Lesson {Math.min(done + 1, LESSONS_PER_PACKAGE)} of{' '}
            {LESSONS_PER_PACKAGE} in your package
          </p>
        </div>
      )}
    </aside>
  );
}

type Props = {
  homework: HomeworkItem[];
  enrolment: EnrolmentInfo | null;
  now: Date;
  success?: boolean;
};

export default function HomeworkTimeline({
  homework,
  enrolment,
  now,
  success = true,
}: Props) {
  const [current, ...past] = homework;

  const type = current?.classes?.type ?? enrolment?.type ?? null;
  const isTopic = type === 'conversation';

  const latestFor = current ? lessonLine(current, now) : null;
  const latestPosted = current ? postedLine(current.createdAt, now) : null;
  const latestReadHref = current ? readHref(current) : undefined;
  const isConversation = current?.classes?.type === 'conversation';

  const questions =
    isConversation && current?.instructions
      ? current.instructions
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="flex w-full max-w-6xl min-w-0 flex-col gap-7 pb-16">
      <div>
        <h1 className="font-serif text-3xl leading-[1.1] font-medium tracking-tight text-foreground sm:text-5xl sm:leading-[1.05]">
          {isTopic ? 'Next topic' : 'Homework'}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-[15px]">
          {isTopic
            ? 'Read the topic and questions before your conversation club meeting.'
            : 'Read the guide before your lesson and bring your answers to class.'}
        </p>
      </div>

      {!success ? (
        <HomeworkError />
      ) : !current ? (
        <NoHomework isTopic={isTopic} schedule={enrolment?.schedule ?? null} />
      ) : (
        <div
          className={cn(
            'grid grid-cols-1 gap-8 lg:items-start lg:gap-10',
            enrolment ? 'lg:grid-cols-[minmax(0,1fr)_18.5rem]' : 'max-w-4xl',
          )}
        >
          <div className="flex min-w-0 flex-col gap-9">
            {/* Featured latest assignment card */}
            <article className="surface-card flex flex-col gap-5 p-6 sm:p-8">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-primary">
                  {latestFor ? `Latest · ${latestFor}` : 'Latest assignment'}
                </p>

                <h2 className="font-serif text-2xl leading-snug font-medium tracking-tight wrap-break-word text-foreground sm:text-3xl">
                  {current.title}
                </h2>

                {current.instructions && questions.length <= 1 && (
                  <p className="mt-1 max-w-prose text-sm leading-relaxed wrap-break-word whitespace-pre-line text-muted-foreground sm:text-[15px]">
                    {current.instructions}
                  </p>
                )}
              </div>

              {questions.length > 1 && (
                <ol className="flex flex-col gap-2">
                  {questions.map((line, index) => (
                    <li
                      key={index}
                      className="flex gap-3 rounded-xl border border-border-subtle bg-secondary/45 px-3.5 py-2.5"
                    >
                      <span className="w-5 shrink-0 font-serif text-base leading-snug font-medium text-primary tabular-nums">
                        {index + 1}
                      </span>
                      <span className="min-w-0 text-sm leading-relaxed wrap-break-word text-foreground">
                        {line}
                      </span>
                    </li>
                  ))}
                </ol>
              )}

              <div className="flex flex-wrap items-center gap-4 pt-1">
                {latestReadHref ? (
                  <AppLink href={latestReadHref} className={PRIMARY_BUTTON}>
                    <BookOpen className="size-4" aria-hidden />
                    Read guide
                  </AppLink>
                ) : (
                  (current.signedUrl || current.downloadUrl) && (
                    <div className="flex flex-wrap items-center gap-2.5">
                      {current.signedUrl && (
                        <a
                          href={current.signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={PRIMARY_BUTTON}
                        >
                          <FileText className="size-4" aria-hidden />
                          Open attachment
                          <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      )}
                      {current.downloadUrl && (
                        <a
                          href={current.downloadUrl}
                          download={current.attachmentName ?? undefined}
                          aria-label={`Download ${current.attachmentName ?? 'attachment'}`}
                          className="inline-flex size-11 items-center justify-center rounded-xl border border-input-border/80 bg-secondary/70 text-foreground transition-colors hover:border-primary/45 hover:bg-accent"
                        >
                          <Download className="size-4" aria-hidden />
                        </a>
                      )}
                    </div>
                  )
                )}

                {latestPosted && (
                  <span className="text-xs font-medium text-muted-foreground">
                    {latestPosted}
                  </span>
                )}
              </div>
            </article>

            {/* Earlier assignments */}
            {past.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground sm:text-xl">
                  Earlier
                </h2>

                <ol className="surface-card flex flex-col overflow-hidden">
                  {past.map((item) => {
                    const itemReadHref = readHref(item);
                    const sub =
                      lessonLine(item, now) ?? postedLine(item.createdAt, now);

                    return (
                      <li
                        key={item.id}
                        className="surface-row flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6"
                      >
                        <div className="min-w-0 flex-1 basis-56">
                          <p className="font-serif text-base font-medium tracking-tight wrap-break-word text-foreground sm:text-lg">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                            {sub}
                          </p>
                        </div>

                        <div className="shrink-0">
                          {itemReadHref ? (
                            <AppLink
                              href={itemReadHref}
                              className="inline-flex h-9 touch-manipulation items-center justify-center gap-2 rounded-lg border border-input-border/80 bg-secondary/70 px-3.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-sm"
                            >
                              Read guide
                            </AppLink>
                          ) : (
                            <CurrentWorkCard
                              title={item.title}
                              titleDisplay="hidden"
                              instructions={null}
                              attachmentName={item.attachmentName}
                              signedUrl={item.signedUrl}
                              downloadUrl={item.downloadUrl}
                              readStyle="quiet"
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            )}
          </div>

          {enrolment && (
            <div className="lg:sticky lg:top-24">
              <ClassSummaryCard enrolment={enrolment} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
