import { formatDate } from '@/lib/utils';

type Props = {
  notes: StudentHome['lessonNotes'];
};

export default function LessonNotes({ notes }: Props) {
  if (notes.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
        Lesson notes
      </h2>

      <ol className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {notes.map(({ id, taughtAt, note }) => (
          <li key={id} className="flex flex-col gap-2 px-6 py-5">
            <time
              dateTime={taughtAt}
              className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              {formatDate(taughtAt)}
            </time>
            <p className="max-w-prose whitespace-pre-line text-[15px] leading-relaxed text-foreground">
              {note}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
