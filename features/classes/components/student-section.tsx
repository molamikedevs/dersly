import { format } from 'date-fns';

import Pagination from '@/components/common/pagination';
import InviteCode from '@/features/classes/components/invite-code';
import { inBaku } from '@/lib/time-zone';

type Props = {
  students: StudentRecord[];
  total: number;
  isNext: boolean;
  inviteCode: string;
};

export default function StudentsSection({
  students,
  total,
  isNext,
  inviteCode,
}: Props) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground sm:text-xl">
          Students
        </h2>
        {total > 0 && (
          <p className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums sm:text-sm">
            {total}
          </p>
        )}
      </div>

      {total === 0 ? (
        <div className="surface-card flex flex-col items-start gap-4 rounded-2xl border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">
              No students yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Give this code to your students so they can join.
            </p>
          </div>
          <InviteCode code={inviteCode} />
        </div>
      ) : students.length === 0 ? (
        <p className="surface-card rounded-2xl border-dashed border-border p-5 text-sm text-muted-foreground sm:p-6">
          No students on this page.
        </p>
      ) : (
        <ul className="surface-card flex flex-col overflow-hidden">
          {students.map(({ student, joinedAt }) => (
            <li
              key={student.id}
              className="surface-row flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-sm font-semibold break-words text-foreground sm:text-[15px]">
                  {student.fullName}
                </span>
                {student.level && (
                  <span className="inline-flex items-center rounded-full border border-border-subtle bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
                    {student.level}
                  </span>
                )}
              </div>
              <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
                Joined {format(new Date(joinedAt), 'd MMM', inBaku)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {total > 0 && <Pagination isNext={isNext} />}
    </section>
  );
}
