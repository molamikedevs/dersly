import { Video } from 'lucide-react';
import Link from 'next/link';

import InitialsAvatar from '@/components/common/initials-avatar';
import InviteCode from '@/features/classes/components/invite-code';

type Props<T extends ClassWithCount> = {
  title: string;
  meta: string;
  classes: T[];
  rowAction?: (item: T) => React.ReactNode;
};

export default function ClassSection<T extends ClassWithCount>({
  title,
  meta,
  classes,
  rowAction,
}: Props<T>) {
  if (classes.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h2>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
          {meta}
        </span>
      </div>

      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {classes.map((item) => {
          const { id, name, level, schedule, meetingUrl, enrollmentOpen } =
            item;

          return (
            <li
              key={id}
              className="relative transition-colors hover:bg-muted/60"
            >
              <Link
                href={`/dashboard/classes/${id}`}
                aria-label={`Open ${name}`}
                className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              />

              <div className="pointer-events-none relative flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 sm:flex-nowrap sm:px-6">
                <InitialsAvatar
                  name={name}
                  className="size-10 shrink-0 sm:size-11"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">
                    {name}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    {level && <span className="capitalize">{level}</span>}
                    {level && schedule && <span aria-hidden>&middot;</span>}
                    {schedule && <span>{schedule}</span>}
                    {meetingUrl && (
                      <>
                        <span aria-hidden>&middot;</span>

                        <a
                          href={meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pointer-events-auto inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Video className="size-3.5" aria-hidden />
                          Join lesson
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {enrollmentOpen && (
                  <div className="pointer-events-auto shrink-0">
                    <InviteCode code={item.inviteCode} />
                  </div>
                )}

                {rowAction && (
                  <div className="pointer-events-auto shrink-0">
                    {rowAction(item)}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
