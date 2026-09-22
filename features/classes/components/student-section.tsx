import { Users } from 'lucide-react';

import InitialsAvatar from '@/components/common/initials-avatar';
import InviteCode from '@/features/classes/components/invite-code';

type Props = {
  students: StudentRecord[];
  inviteCode: string;
};

export default function StudentsSection({ students, inviteCode }: Props) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          Students
        </h2>
        {students.length > 0 && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {students.length}
          </span>
        )}
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-input-border px-6 py-14 text-center">
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          >
            <Users className="size-5" />
          </span>
          <p className="mt-4 text-base font-semibold text-foreground">
            No students yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Give this code to your students so they can join.
          </p>
          <div className="mt-6">
            <InviteCode code={inviteCode} />
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {students.map(({ student, joinedAt }) => (
            <li
              key={student.id}
              className="flex min-h-16 items-center gap-3.5 px-5 py-3 sm:px-6"
            >
              <InitialsAvatar
                name={student.fullName}
                className="size-9 shrink-0"
              />
              <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-foreground">
                {student.fullName}
              </span>
              {student.level && (
                <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold capitalize text-accent-foreground">
                  {student.level}
                </span>
              )}
              <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
                Joined{' '}
                {new Date(joinedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
