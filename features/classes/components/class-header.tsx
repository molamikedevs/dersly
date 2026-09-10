import { Pencil, Plus, Video } from 'lucide-react';
import { Fragment } from 'react';

import { Button } from '@/components/ui/button';
import InviteCodeDialog from '@/features/classes/components/invite-code-dialog';

export default function ClassHeader({ data }: { data: ClassRecordParams }) {
  const { name, level, schedule, meetingUrl, inviteCode, enrollmentOpen } =
    data;

  const meta = [
    schedule && <span key="schedule">{schedule}</span>,
    meetingUrl && (
      <a
        key="meeting"
        href={meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-primary hover:underline"
      >
        <Video className="size-3.5" aria-hidden />
        Join lesson
      </a>
    ),
    <InviteCodeDialog
      key="code"
      code={inviteCode}
      enrollmentOpen={enrollmentOpen}
    />,
    <span
      key="enrolment"
      className={enrollmentOpen ? undefined : 'text-destructive'}
    >
      {enrollmentOpen ? 'Enrolment open' : 'Enrolment closed'}
    </span>,
  ].filter(Boolean);

  return (
    <header className="border-b pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {name}
          </h1>
          {level && (
            <span className="rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {level}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Edit class">
            <Pencil className="size-4" aria-hidden />
          </Button>
          <Button className="h-11">
            <Plus className="size-4" aria-hidden />
            New assignment
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {meta.map((item, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span aria-hidden className="text-border">
                ·
              </span>
            )}
            {item}
          </Fragment>
        ))}
      </div>
    </header>
  );
}
