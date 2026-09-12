import { Users } from 'lucide-react';

import InitialsAvatar from '@/components/common/initials-avatar';
import InviteCode from '@/features/classes/components/invite-code';

type Student = {
  id: string;
  fullName: string;
  level: string | null;
  joinedAt: string;
};

type Props = {
  students: Student[];
  inviteCode: string;
};

export default function StudentsSection({ students, inviteCode }: Props) {
  return (
    <section className="mt-14 sm:mt-16">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Students
        </h2>
        {students.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {students.length}
          </span>
        )}
      </div>

      {students.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg bg-muted px-6 py-10 text-center">
          <Users
            className="size-9 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="mt-4 font-medium text-foreground">No students yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Give this code to your students so they can join.
          </p>
          <div className="mt-5">
            <InviteCode code={inviteCode} />
          </div>
        </div>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {students.map(({ id, fullName, level, joinedAt }) => (
            <li key={id} className="flex min-h-11 items-center gap-3 py-2.5">
              <InitialsAvatar name={fullName} className="size-7 shrink-0" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {fullName}
              </span>
              {level && (
                <span className="shrink-0 text-sm text-muted-foreground">
                  {level}
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
