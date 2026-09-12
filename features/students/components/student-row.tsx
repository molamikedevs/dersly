import InitialsAvatar from '@/components/common/initials-avatar';
import Link from 'next/link';

export default function StudentRow({ data }: { data: StudentRecord }) {
  const { fullName, email, level, classes } = data;

  const groups = classes.filter((item) => item.type !== 'one_to_one');
  const isPrivate = classes.some((item) => item.type === 'one_to_one');

  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
      <InitialsAvatar name={fullName} className="size-10" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold text-foreground">{fullName}</p>
          {isPrivate && (
            <span className="rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Private
            </span>
          )}
        </div>
        <p className="truncate text-sm text-muted-foreground">{email}</p>
      </div>

      {groups.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {groups.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/classes/${item.id}`}
              className="rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {level && (
        <span className="text-sm capitalize text-muted-foreground sm:w-24 sm:text-right">
          {level}
        </span>
      )}
    </article>
  );
}
