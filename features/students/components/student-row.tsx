import InitialsAvatar from '@/components/common/initials-avatar';
import { TableCell, TableRow } from '@/components/ui/table';

function ClassLabel({ owner }: { owner: StudentRecord['class'] }) {
  return owner.type === 'one_to_one' ? (
    <span className="text-muted-foreground">Private</span>
  ) : (
    <span className="text-foreground">{owner.name}</span>
  );
}

export default function StudentRow({ data }: { data: StudentRecord }) {
  const { student, class: owner } = data;
  const { fullName, email, level } = student;

  return (
    <TableRow className="border-border">
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={fullName} className="size-8 shrink-0" />
          <p className="min-w-0 truncate font-medium text-foreground">
            {fullName}
          </p>
        </div>
      </TableCell>

      <TableCell className="py-3 text-muted-foreground">
        <span className="block truncate">{email}</span>
      </TableCell>

      <TableCell className="py-3">
        <span className="block truncate">
          <ClassLabel owner={owner} />
        </span>
      </TableCell>

      <TableCell className="py-3">
        {level ? (
          <span className="capitalize text-foreground">{level}</span>
        ) : (
          <span className="text-muted-foreground">Not set</span>
        )}
      </TableCell>

      <TableCell className="hidden py-3 text-muted-foreground lg:table-cell">
        {owner.schedule ?? 'No schedule'}
      </TableCell>
    </TableRow>
  );
}

export function StudentCard({ data }: { data: StudentRecord }) {
  const { student, class: owner } = data;
  const { fullName, email, level } = student;

  return (
    <li className="flex items-start gap-3 p-4">
      <InitialsAvatar name={fullName} className="size-9 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{fullName}</p>
        <p className="truncate text-sm text-muted-foreground">{email}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="truncate">
            <ClassLabel owner={owner} />
          </span>
          {level && (
            <>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span className="capitalize">{level}</span>
            </>
          )}
          {owner.schedule && (
            <>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>{owner.schedule}</span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
