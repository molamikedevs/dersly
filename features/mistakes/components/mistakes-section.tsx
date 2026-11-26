import FormDialog from '@/components/common/form-dialog';
import { cn } from '@/lib/utils';
import MistakeForm from './mistake-form';
import MistakeMenu from './mistake-menu';

// The mistakes on a one-to-one class page. The student fixes them on their
// Home page, and this list shows how they are getting on.

type Props = {
  enrollmentId: string;
  mistakes: MistakeRecord[];
};

function summary(mistakes: MistakeRecord[]) {
  const fixed = mistakes.filter((item) => item.fixedAt).length;
  const open = mistakes.length - fixed;
  return `${open} to fix · ${fixed} fixed`;
}

export default function MistakesSection({ enrollmentId, mistakes }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="sr-only">Mistakes</h2>
        <p className="min-w-0 text-sm text-muted-foreground tabular-nums">
          {mistakes.length > 0
            ? summary(mistakes)
            : 'What your student said, and how to say it.'}
        </p>

        <FormDialog triggerLabel="Add mistake" title="Add a mistake">
          <MistakeForm enrollmentId={enrollmentId} />
        </FormDialog>
      </div>

      {mistakes.length === 0 ? (
        <div className="surface-card rounded-2xl border-dashed border-border p-6 sm:p-8">
          <p className="text-base font-semibold text-foreground">
            No mistakes yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add mistakes from a lesson. Your student sees them on their Home
            page and tries to fix each one.
          </p>
        </div>
      ) : (
        <ul className="surface-card flex flex-col overflow-hidden">
          {mistakes.map((item) => {
            const fixed = Boolean(item.fixedAt);

            return (
              <li
                key={item.id}
                className="surface-row flex items-start justify-between gap-4 py-4 pr-3 pl-5 sm:pr-4 sm:pl-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="font-serif text-lg leading-snug font-medium break-words text-foreground sm:text-xl">
                      <span className="text-destructive/90 line-through decoration-destructive/60">
                        {item.wrong}
                      </span>{' '}
                      <span>{item.correct}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                    {item.tip && (
                      <span className="break-words text-muted-foreground">
                        {item.tip}
                      </span>
                    )}

                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                        fixed
                          ? 'border border-success/25 bg-success-subtle text-success-subtle-foreground'
                          : 'border border-destructive/25 bg-destructive-subtle text-destructive-subtle-foreground',
                      )}
                    >
                      {fixed ? 'Fixed' : 'To fix'}
                    </span>
                  </div>

                  {!fixed && item.attempt && (
                    <p className="text-xs break-words text-muted-foreground">
                      <span className="font-medium text-foreground/85">
                        Last try:
                      </span>{' '}
                      {item.attempt}
                    </p>
                  )}
                </div>

                <MistakeMenu data={item} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
