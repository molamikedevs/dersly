import Link from 'next/link';

import InitialsAvatar from '@/components/common/initials-avatar';

export default function StudentRow({ data }: { data: StudentRecord }) {
  const { fullName, email, level, classes } = data;

  const groups = classes.filter((item) => item.type !== 'one_to_one');
  const isPrivate = classes.some((item) => item.type === 'one_to_one');

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 sm:flex-nowrap sm:py-2.5">
      <InitialsAvatar name={fullName} className="size-9 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{fullName}</p>
        <p className="truncate text-sm text-muted-foreground">{email}</p>
      </div>

      {level && (
        <span className="shrink-0 text-sm capitalize text-muted-foreground sm:order-last sm:w-28 sm:text-right">
          {level}
        </span>
      )}

      <div className="order-last flex w-full basis-full flex-wrap items-center gap-2 pl-13 sm:order-none sm:w-auto sm:basis-auto sm:justify-end sm:pl-0">
        {groups.length > 0
          ? groups.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/classes/${item.id}`}
                className="inline-flex h-11 items-center rounded-md bg-muted px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-7"
              >
                {item.name}
              </Link>
            ))
          : isPrivate && (
              <span className="text-sm text-muted-foreground">
                Private lessons
              </span>
            )}
      </div>
    </li>
  );
}
