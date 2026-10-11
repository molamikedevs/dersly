import Pagination from '@/components/common/pagination';
import InviteCode from '@/features/classes/components/invite-code';

type Props = {
  students: StudentRecord[];
  total: number;
  isNext: boolean;
  inviteCode: string;
};

const joinedDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Asia/Baku',
});

export default function StudentsSection({
  students,
  total,
  isNext,
  inviteCode,
}: Props) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          Students
        </h2>
        {total > 0 && (
          <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
            {total}
          </p>
        )}
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-input-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
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
        <p className="rounded-2xl border border-dashed border-input-border p-5 text-sm text-muted-foreground sm:p-6">
          No students on this page.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {students.map(({ student, joinedAt }) => (
            <li
              key={student.id}
              className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-6"
            >
              <p className="min-w-0 text-[15px] font-semibold break-words text-foreground">
                {student.fullName}
                {student.level && (
                  <>
                    {' '}
                    <span className="text-sm font-normal text-muted-foreground">
                      {student.level}
                    </span>
                  </>
                )}
              </p>
              <p className="shrink-0 text-sm text-muted-foreground">
                Joined {joinedDate.format(new Date(joinedAt))}
              </p>
            </li>
          ))}
        </ul>
      )}

      {total > 0 && <Pagination isNext={isNext} />}
    </section>
  );
}
