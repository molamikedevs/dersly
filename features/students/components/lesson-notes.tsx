import { ChevronDown } from 'lucide-react';

import LessonNoteBody from '@/features/students/components/lesson-note-body';
import { formatDate } from '@/lib/utils';

type Props = { notes: StudentHome['lessonNotes'] };

export default function LessonNotes({ notes }: Props) {
  if (notes.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
        Lesson notes
      </h2>

      {/* A plain list with a line between notes. The newest is open, and
          opening another closes it, because they share a name. */}
      <ol className="flex flex-col divide-y divide-border border-y border-border">
        {notes.map(({ id, lessonDate, note }, index) => (
          <li key={id}>
            <details name="lesson-notes" open={index === 0} className="group">
              <summary className="-mx-2 flex min-h-13 cursor-pointer touch-manipulation list-none items-center justify-between gap-4 rounded-lg px-2 py-3 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:bg-accent [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <time
                    dateTime={lessonDate}
                    className="text-base font-semibold text-foreground"
                  >
                    {formatDate(lessonDate, 'long')}
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
              <div className="min-w-0 pt-1 pb-5">
                <LessonNoteBody note={note} />
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
