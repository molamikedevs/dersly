import InviteCodeDialog from '@/features/classes/components/invite-code-dialog';
import { studentCountLabel } from '@/features/classes/constants/index';
import { classSlots, formatSchedule } from '@/lib/schedule';

type Props = {
  data: ClassWithCount;
  hasJoined?: boolean;
  children?: React.ReactNode;
};

function formatLevel(level: string | null) {
  if (!level) return null;
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export default function ClassHeader({
  data,
  hasJoined = false,
  children,
}: Props) {
  const { name, type, level, inviteCode, enrollmentOpen, studentCount } = data;

  const isOneToOne = type === 'one_to_one';
  const schedule = formatSchedule(classSlots(data));
  const typeLabel = isOneToOne
    ? 'One to one'
    : type === 'conversation'
      ? 'Conversation club'
      : 'Group class';

  const subtitle = [
    typeLabel,
    schedule,
    formatLevel(level),
    !isOneToOne ? studentCountLabel(studentCount).toLowerCase() : null,
    !enrollmentOpen ? 'enrolment closed' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  // Group classes show the invite code inside StudentsSection when empty;
  // one-to-one classes only need it until the student joins.
  const showInvite = isOneToOne && !hasJoined && enrollmentOpen;

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h1 className="font-serif text-3xl leading-[1.1] font-medium tracking-tight text-balance break-words text-foreground sm:text-5xl sm:leading-[1.05]">
          {name}
        </h1>

        {subtitle && (
          <p className="mt-2 text-sm text-muted-foreground sm:text-[15px]">
            {subtitle}
          </p>
        )}
      </div>

      {(showInvite || children) && (
        <div className="flex flex-wrap items-center gap-4 self-start sm:self-end">
          {children}

          {showInvite && (
            <div className="flex shrink-0 items-center gap-2.5">
              <span className="text-xs font-medium text-muted-foreground">
                Invite code
              </span>
              <InviteCodeDialog
                code={inviteCode}
                enrollmentOpen={enrollmentOpen}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
