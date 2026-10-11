import { ChevronDown } from 'lucide-react';

import LessonNoteBody from '@/features/students/components/lesson-note-body';
import { formatDate } from '@/lib/utils';

type Props = { notes: StudentHome['lessonNotes'] };

export default function LessonNotes({ notes }: Props) {
  if (notes.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
        Lesson notes
      </h2>
      <ol className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {notes.map(({ id, taughtAt, note }, index) => (
          <li key={id}>
            <details name="lesson-notes" open={index === 0} className="group">
              <summary className="flex min-h-14 cursor-pointer touch-manipulation list-none items-center justify-between gap-4 px-5 py-4 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:bg-muted sm:px-6 [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <time
                    dateTime={taughtAt}
                    className="text-[15px] font-semibold text-foreground"
                  >
                    {formatDate(taughtAt, 'long')}
                  </time>
                  {index === 0 && (
                    <span className="text-sm text-muted-foreground">
                      Latest
                    </span>
                  )}
                </span>
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="min-w-0 px-5 pb-5 break-words sm:px-6">
                <LessonNoteBody note={note} />
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
