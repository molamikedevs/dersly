import { ChevronRight } from 'lucide-react';

import InitialsAvatar from '@/components/common/initials-avatar';
import { AppLink } from '@/features/app/app-mode';
import { isLevel, LEVEL_ORDER, LEVELS } from '@/features/level-test/levels';
import { cn, formatLastSeen } from '@/lib/utils';

// Seen within this long counts as active, and gets a dot
const ACTIVE_HOURS = 24;

// Same columns for the header and every row, from md up
const COLUMNS =
  'md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_8.5rem_1rem] md:items-center md:gap-x-6';

function className(owner: StudentRecord['class']) {
  return owner.type === 'one_to_one' ? 'One to one' : owner.name;
}

// Four short bars, filled up to the level, so levels compare at a glance
function LevelMeter({ level }: { level: string | null }) {
  if (!isLevel(level)) {
    return <span className="text-muted-foreground">No level yet</span>;
  }

  const position = LEVEL_ORDER.indexOf(level);

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span aria-hidden className="flex shrink-0 gap-0.5">
        {LEVEL_ORDER.map((name, index) => (
          <span
            key={name}
            className={cn(
              'h-2.5 w-1 rounded-full',
              index <= position ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </span>
      <span className="truncate text-foreground">{LEVELS[level].name}</span>
    </span>
  );
}

function seenRecently(value: string | null) {
  if (!value) return false;
  return Date.now() - new Date(value).getTime() < ACTIVE_HOURS * 60 * 60 * 1000;
}

function LastSeen({ value }: { value: string | null }) {
  const active = seenRecently(value);

  return (
    <span className="inline-flex items-center gap-1.5">
      {active && (
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-primary"
        />
      )}
      {value ? <time dateTime={value}>{formatLastSeen(value)}</time> : 'Never'}
    </span>
  );
}

// One list for every screen size. Each row opens the student's class.
export default function StudentList({
  students,
}: {
  students: StudentRecord[];
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
      <div
        aria-hidden
        className={cn(
          'hidden border-b border-border px-5 py-3 text-sm text-muted-foreground',
          COLUMNS,
        )}
      >
        <span>Student</span>
        <span>Class</span>
        <span>Level</span>
        <span>Last seen</span>
        <span />
      </div>

      <ul className="divide-y divide-border">
        {students.map(({ student, class: owner }) => (
          <li key={`${student.id}-${owner.id}`}>
            <AppLink
              href={`/dashboard/classes/${owner.id}`}
              className={cn(
                'group flex touch-manipulation items-start gap-3.5 px-4 py-3.5 transition-colors select-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset active:bg-muted sm:px-5',
                COLUMNS,
              )}
            >
              <span className="flex min-w-0 flex-1 items-start gap-3.5 md:items-center">
                <InitialsAvatar
                  name={student.fullName}
                  className="size-10 shrink-0 text-sm"
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="max-w-full min-w-0 truncate text-base font-semibold text-foreground">
                      {student.fullName}
                    </span>
                    {/* On phones last seen sits beside the name */}
                    <span className="min-w-0 text-sm text-muted-foreground md:hidden">
                      <LastSeen value={student.lastSeenAt} />
                    </span>
                  </span>

                  <span
                    className="block truncate text-sm text-muted-foreground"
                    title={student.email}
                  >
                    {student.email}
                  </span>

                  {/* On phones the class and level share one line */}
                  <span className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm md:hidden">
                    <span className="min-w-0 truncate font-medium text-foreground">
                      {className(owner)}
                    </span>
                    <LevelMeter level={student.level} />
                  </span>
                </span>
              </span>

              <span className="hidden min-w-0 truncate text-[15px] text-foreground md:block">
                {className(owner)}
              </span>

              <span className="hidden min-w-0 text-[15px] md:block">
                <LevelMeter level={student.level} />
              </span>

              <span className="hidden text-sm text-muted-foreground md:block">
                <LastSeen value={student.lastSeenAt} />
              </span>

              <ChevronRight
                aria-hidden
                className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 md:block"
              />
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
