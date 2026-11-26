import { ChevronDown } from 'lucide-react';

import LessonNoteBody from '@/features/students/components/lesson-note-body';
import { formatDate } from '@/lib/utils';

type Props = { notes: StudentHome['lessonNotes'] };

export default function LessonNotes({ notes }: Props) {
  if (notes.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground">
        Lesson notes
      </h2>

      {/* Each note sits in its own card without harsh divider lines. */}
      <ol className="flex flex-col gap-2.5">
        {notes.map(({ id, lessonDate, note }, index) => (
          <li key={id}>
            <details
              name="lesson-notes"
              open={index === 0}
              className="surface-card group overflow-hidden transition-colors open:border-input-border/70"
            >
              <summary className="flex min-h-13 cursor-pointer touch-manipulation list-none items-center justify-between gap-4 px-4 py-3.5 outline-none select-none hover:bg-accent/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&::-webkit-details-marker]:hidden sm:px-5">
                <span className="flex min-w-0 flex-wrap items-center gap-2.5">
                  <time
                    dateTime={lessonDate}
                    className="text-[15px] font-semibold text-foreground"
                  >
                    {formatDate(lessonDate, 'long')}
                  </time>
                  {index === 0 && (
                    <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      Latest
                    </span>
                  )}
                </span>
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180 group-open:text-foreground"
                  aria-hidden
                />
              </summary>
              <div className="min-w-0 border-t border-border-subtle px-4 pt-3.5 pb-5 sm:px-5">
                <LessonNoteBody note={note} />
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
