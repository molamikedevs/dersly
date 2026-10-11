import { Video } from 'lucide-react';

import InviteCodeDialog from '@/features/classes/components/invite-code-dialog';
import { studentCountLabel } from '@/features/classes/constants/index';
import { classSlots, formatSchedule } from '@/lib/schedule';

type Props = {
  data: ClassWithCount;
  children?: React.ReactNode;
};

export default function ClassHeader({ data, children }: Props) {
  const {
    name,
    type,
    level,
    meetingUrl,
    inviteCode,
    enrollmentOpen,
    studentCount,
  } = data;

  const schedule = formatSchedule(classSlots(data));

  // One plain sentence. It wraps like text, so no separator can be orphaned.
  const facts = [
    level,
    type === 'one_to_one'
      ? null
      : studentCountLabel(studentCount).toLowerCase(),
    enrollmentOpen ? null : 'enrolment closed',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <header className="flex flex-col gap-6 border-b border-border pb-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h1 className="font-serif text-3xl leading-[1.1] font-medium tracking-tight text-balance break-words text-foreground sm:text-5xl sm:leading-[1.05]">
            {name}
          </h1>

          {schedule && (
            <p className="mt-3 text-base break-words text-foreground">
              {schedule}
            </p>
          )}

          {facts && (
            <p className="mt-1 text-[15px] text-muted-foreground first-letter:uppercase">
              {facts}
            </p>
          )}
        </div>

        {meetingUrl && (
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 touch-manipulation items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.97]"
          >
            <Video className="size-4" aria-hidden />
            Join lesson
          </a>
        )}
      </div>

      {children}

      {enrollmentOpen && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-sm font-medium text-foreground">
            Invite code
          </span>
          <InviteCodeDialog code={inviteCode} enrollmentOpen={enrollmentOpen} />
        </div>
      )}
    </header>
  );
}
