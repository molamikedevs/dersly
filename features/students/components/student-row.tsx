import InitialsAvatar from '@/components/common/initials-avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatLastSeen } from '@/lib/utils';

function ClassLabel({ owner }: { owner: StudentRecord['class'] }) {
  return owner.type === 'one_to_one' ? (
    <span className="inline-flex shrink-0 rounded-full border border-input-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
      Private
    </span>
  ) : (
    <span className="block truncate font-medium text-foreground">
      {owner.name}
    </span>
  );
}

function LevelLabel({ level }: { level: string | null }) {
  return level ? (
    <span className="inline-flex shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold capitalize text-accent-foreground">
      {level}
    </span>
  ) : (
    <span className="text-sm text-muted-foreground">Not set</span>
  );
}

export default function StudentRow({ data }: { data: StudentRecord }) {
  const { student, class: owner } = data;
  const { fullName, email, level, lastSeenAt } = student;

  return (
    <TableRow className="border-border hover:bg-muted/60">
      <TableCell className="py-4">
        <div className="flex min-w-0 items-center gap-3">
          <InitialsAvatar name={fullName} className="size-9 shrink-0" />
          <p className="min-w-0 flex-1 truncate font-semibold text-foreground">
            {fullName}
          </p>
        </div>
      </TableCell>

      <TableCell className="py-4 text-muted-foreground">
        <span className="block truncate" title={email}>
          {email}
        </span>
      </TableCell>

      <TableCell className="min-w-0 py-4">
        <ClassLabel owner={owner} />
      </TableCell>

      <TableCell className="py-4">
        <LevelLabel level={level} />
      </TableCell>

      <TableCell className="hidden py-4 text-muted-foreground lg:table-cell">
        {lastSeenAt ? (
          <time dateTime={lastSeenAt} className="block truncate">
            {formatLastSeen(lastSeenAt)}
          </time>
        ) : (
          'Never'
        )}
      </TableCell>

      <TableCell className="hidden py-4 text-muted-foreground xl:table-cell">
        <span className="block truncate">
          {owner.schedule ?? 'No schedule'}
        </span>
      </TableCell>
    </TableRow>
  );
}

export function StudentCard({ data }: { data: StudentRecord }) {
  const { student, class: owner } = data;
  const { fullName, email, level, lastSeenAt } = student;

  return (
    <li className="flex items-start gap-3.5 px-5 py-4">
      <InitialsAvatar name={fullName} className="size-10 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{fullName}</p>
        <p className="truncate text-sm text-muted-foreground">{email}</p>

        <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-2 text-sm">
          <ClassLabel owner={owner} />
          <LevelLabel level={level} />
        </div>

        {owner.schedule && (
          <p className="mt-2 truncate text-sm text-muted-foreground">
            {owner.schedule}
          </p>
        )}

        <p className="mt-1 text-sm text-muted-foreground">
          Last seen{' '}
          {lastSeenAt ? (
            <time dateTime={lastSeenAt}>
              {formatLastSeen(lastSeenAt).toLowerCase()}
            </time>
          ) : (
            'never'
          )}
        </p>
      </div>
    </li>
  );
}
