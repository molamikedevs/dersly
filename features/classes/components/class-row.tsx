import { MoreVertical, Video } from 'lucide-react';
import Link from 'next/link';

import InitialsAvatar from '@/components/common/initials-avatar';
import ClassBadge from '@/features/classes/components/class-badge';
import InviteCode from '@/features/classes/components/invite-code';

type Props = {
  data: ClassRecordParams;
  menu?: React.ReactNode;
};

export default function ClassRow({ data, menu }: Props) {
  const {
    id,
    name,
    type,
    level,
    schedule,
    meetingUrl,
    inviteCode,
    enrollmentOpen,
    studentCount,
  } = data;

  const details = [level, schedule].filter(Boolean) as string[];

  return (
    <article className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
      <InitialsAvatar name={name} shape="square" className="size-10" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dashboard/classes/${id}`}
            className="truncate font-semibold text-foreground hover:underline"
          >
            {name}
          </Link>
          <ClassBadge type={type} />
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {details.map((detail, index) => (
            <span key={detail} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden className="text-border">
                  ·
                </span>
              )}
              {detail}
            </span>
          ))}

          {meetingUrl && (
            <span className="flex items-center gap-2">
              {details.length > 0 && (
                <span aria-hidden className="text-border">
                  ·
                </span>
              )}

              <a
                href={meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline"
              >
                <Video className="size-3.5" aria-hidden />
                Join lesson
              </a>
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="text-sm sm:text-right">
          <p className="flex items-center gap-1.5 font-medium text-foreground">
            <span
              aria-hidden
              className={
                enrollmentOpen
                  ? 'size-1.5 rounded-full bg-success'
                  : 'size-1.5 rounded-full bg-muted-foreground'
              }
            />
            {enrollmentOpen ? 'Enrolment open' : 'Enrolment closed'}
          </p>
          <p className="text-muted-foreground">
            {studentCount === 1 ? '1 student' : `${studentCount} students`}
          </p>
        </div>

        <InviteCode code={inviteCode} />

        {menu ?? (
          <span className="p-2 text-muted-foreground" aria-hidden>
            <MoreVertical className="size-4" />
          </span>
        )}
      </div>
    </article>
  );
}
