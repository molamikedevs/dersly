import { AppLink } from '@/features/app/app-mode';
import {
  LESSONS_PER_PACKAGE,
  PAYMENT_SOON,
} from '@/features/classes/constants';
import { cn } from '@/lib/utils';

const HEADING =
  'text-lg leading-snug font-semibold tracking-tight text-foreground';

const ROW_LINK =
  'group flex min-h-13 touch-manipulation items-center justify-between gap-4 px-4 py-3 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset';

function StudentPackageRow({ student }: { student: PrivateClass }) {
  const { id, name, lessonsDone } = student;
  const done = Math.min(lessonsDone, LESSONS_PER_PACKAGE);
  const complete = done >= LESSONS_PER_PACKAGE;

  return (
    <li className="surface-row">
      <AppLink href={`/dashboard/classes/${id}`} className={ROW_LINK}>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {name}
        </span>

        <div className="flex shrink-0 items-center gap-3">
          <span aria-hidden className="flex items-center gap-1">
            {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'size-2 rounded-full transition-colors',
                  index >= done
                    ? 'bg-border'
                    : complete
                      ? 'bg-warning'
                      : 'bg-primary',
                )}
              />
            ))}
          </span>

          <span
            className={cn(
              'shrink-0 whitespace-nowrap text-right font-mono text-xs tabular-nums',
              complete ? 'font-semibold text-warning' : 'text-muted-foreground',
            )}
          >
            {done} of {LESSONS_PER_PACKAGE}
          </span>
        </div>
      </AppLink>
    </li>
  );
}

export default function PaymentDue({ students }: { students: PrivateClass[] }) {
  const dueNow = students.filter(
    (s) => Math.min(s.lessonsDone, LESSONS_PER_PACKAGE) >= LESSONS_PER_PACKAGE,
  );
  const oneLeft = students.filter(
    (s) => Math.min(s.lessonsDone, LESSONS_PER_PACKAGE) < LESSONS_PER_PACKAGE,
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className={HEADING}>Lesson packages</h2>
      </div>

      {students.length === 0 ? (
        <div className="surface-card p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            No one is on lesson {PAYMENT_SOON} or {LESSONS_PER_PACKAGE}.
          </p>
        </div>
      ) : (
        <div className="surface-card flex flex-col overflow-hidden">
          {dueNow.length > 0 && (
            <div>
              <div className="border-b border-border-subtle bg-warning-subtle/40 px-4 py-2">
                <span className="text-xs font-semibold text-warning-subtle-foreground">
                  Payment due
                </span>
              </div>
              <ul className="flex flex-col">
                {dueNow.map((student) => (
                  <StudentPackageRow key={student.id} student={student} />
                ))}
              </ul>
            </div>
          )}

          {oneLeft.length > 0 && (
            <div className={cn(dueNow.length > 0 && 'border-t border-border')}>
              <div className="border-b border-border-subtle bg-secondary/45 px-4 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  One lesson left
                </span>
              </div>
              <ul className="flex flex-col">
                {oneLeft.map((student) => (
                  <StudentPackageRow key={student.id} student={student} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
