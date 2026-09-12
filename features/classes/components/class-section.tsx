import { Video } from 'lucide-react';
import Link from 'next/link';

import InitialsAvatar from '@/components/common/initials-avatar';
import InviteCode from '@/features/classes/components/invite-code';

type Props = {
  title: string;
  meta: string;
  classes: ClassWithCount[];
  rowAction?: (item: ClassWithCount) => React.ReactNode;
};

export default function ClassSection({
  title,
  meta,
  classes,
  rowAction,
}: Props) {
  if (classes.length === 0) return null;

  return (
    <section className="mt-10 sm:mt-12">
      <div className="flex items-baseline gap-2.5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <span className="text-sm text-muted-foreground">{meta}</span>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {classes.map((item) => {
          const { id, name, level, schedule, meetingUrl, enrollmentOpen } =
            item;

          return (
            <li
              key={id}
              className="group relative -mx-2 transition-colors hover:bg-muted"
            >
              <Link
                href={`/dashboard/classes/${id}`}
                aria-label={`Open ${name}`}
                className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />

              <div className="pointer-events-none relative flex min-h-11 flex-wrap items-center gap-x-4 gap-y-3 px-2 py-4 sm:flex-nowrap">
                <InitialsAvatar
                  name={name}
                  className="size-9 shrink-0 sm:size-10"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{name}</p>

                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                    {level && <span>{level}</span>}
                    {level && schedule && (
                      <span aria-hidden className="text-border">
                        ·
                      </span>
                    )}
                    {schedule && <span>{schedule}</span>}
                    {meetingUrl && (
                      <>
                        <span aria-hidden className="text-border">
                          ·
                        </span>

                        <a
                          href={meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pointer-events-auto inline-flex items-center gap-1.5 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
