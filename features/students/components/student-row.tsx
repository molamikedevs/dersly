import InitialsAvatar from '@/components/common/initials-avatar';
import { TableCell, TableRow } from '@/components/ui/table';

function ClassLabel({ owner }: { owner: StudentRecord['class'] }) {
  return owner.type === 'one_to_one' ? (
    <span className="inline-flex rounded-full border border-input-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
      Private
    </span>
  ) : (
    <span className="font-medium text-foreground">{owner.name}</span>
  );
}

function LevelLabel({ level }: { level: string | null }) {
  return level ? (
    <span className="inline-flex rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold capitalize text-accent-foreground">
      {level}
    </span>
  ) : (
    <span className="text-sm text-muted-foreground">Not set</span>
  );
}

export default function StudentRow({ data }: { data: StudentRecord }) {
  const { student, class: owner } = data;
  const { fullName, email, level } = student;

  return (
    <TableRow className="border-border hover:bg-muted/60">
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={fullName} className="size-9 shrink-0" />
          <p className="min-w-0 truncate font-semibold text-foreground">
            {fullName}
          </p>
        </div>
      </TableCell>

      <TableCell className="py-4 text-muted-foreground">
        <span className="block truncate">{email}</span>
      </TableCell>

      <TableCell className="py-4">
        <span className="block truncate">
          <ClassLabel owner={owner} />
        </span>
      </TableCell>

      <TableCell className="py-4">
        <LevelLabel level={level} />
      </TableCell>

      <TableCell className="hidden py-4 text-muted-foreground lg:table-cell">
        {owner.schedule ?? 'No schedule'}
      </TableCell>
    </TableRow>
  );
}

export function StudentCard({ data }: { data: StudentRecord }) {
  const { student, class: owner } = data;
  const { fullName, email, level } = student;

  return (
    <li className="flex items-start gap-3.5 px-5 py-4">
      <InitialsAvatar name={fullName} className="size-10 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{fullName}</p>
        <p className="truncate text-sm text-muted-foreground">{email}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm">
          <ClassLabel owner={owner} />
          <LevelLabel level={level} />
        </div>

        {owner.schedule && (
          <p className="mt-2 text-sm text-muted-foreground">{owner.schedule}</p>
        )}
      </div>
    </li>
  );
}
