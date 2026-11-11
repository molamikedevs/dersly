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
  return `${open} to fix, ${fixed} fixed`;
}

export default function MistakesSection({ enrollmentId, mistakes }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
            Mistakes
          </h2>
          {mistakes.length > 0 && (
            <p className="text-sm text-muted-foreground tabular-nums">
              {summary(mistakes)}
            </p>
          )}
        </div>

        <FormDialog triggerLabel="Add mistake" title="Add a mistake">
          <MistakeForm enrollmentId={enrollmentId} />
        </FormDialog>
      </div>

      {mistakes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-input-border p-5 sm:p-6">
          <p className="text-base font-semibold text-foreground">
            No mistakes yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add mistakes from a lesson. Your student sees them on their Home
            page and tries to fix each one.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {mistakes.map((item) => {
            const fixed = Boolean(item.fixedAt);

            return (
              <li
                key={item.id}
                className="flex items-start gap-4 py-4 pr-2 pl-5 sm:pr-3 sm:pl-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="text-[15px] break-words text-muted-foreground line-through decoration-destructive/60">
                    {item.wrong}
                  </p>
                  <p className="text-[15px] font-medium break-words text-foreground">
                    {item.correct}
                  </p>
                  {item.tip && (
                    <p className="text-sm break-words text-muted-foreground">
                      {item.tip}
                    </p>
                  )}
                  {!fixed && item.attempt && (
                    <p className="text-sm break-words text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Their last try:
                      </span>{' '}
                      {item.attempt}
                    </p>
                  )}
                </div>

                <span
                  className={cn(
                    'mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    fixed
                      ? 'bg-success-subtle text-success-subtle-foreground'
                      : 'bg-muted text-muted-foreground',
                  )}
                >
                  {fixed ? 'Fixed' : 'To fix'}
                </span>

                <MistakeMenu data={item} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
