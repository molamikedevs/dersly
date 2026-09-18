import InitialsAvatar from '@/components/common/initials-avatar';
import { TableCell, TableRow } from '@/components/ui/table';

export default function StudentRow({ data }: { data: StudentRecord }) {
  const { student, class: owner } = data;
  const { fullName, email, level } = student;

  return (
    <TableRow className="border-border">
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={fullName} className="size-8 shrink-0" />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{fullName}</p>
            <p className="truncate text-sm text-muted-foreground sm:hidden">
              {email}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden py-3 text-muted-foreground sm:table-cell">
        <span className="block truncate">{email}</span>
      </TableCell>

      <TableCell className="py-3">
        {owner.type === 'one_to_one' ? (
          <span className="text-muted-foreground">Private</span>
        ) : (
          <span className="truncate text-foreground">{owner.name}</span>
        )}
      </TableCell>

      <TableCell className="py-3">
        {level ? (
          <span className="capitalize text-foreground">{level}</span>
        ) : (
          <span className="text-muted-foreground">Not set</span>
        )}
      </TableCell>

      <TableCell className="hidden py-3 text-muted-foreground md:table-cell">
        {owner.schedule ?? 'No schedule'}
      </TableCell>
    </TableRow>
  );
}
