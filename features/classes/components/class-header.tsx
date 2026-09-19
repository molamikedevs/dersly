import { Video } from 'lucide-react';

import InviteCodeDialog from '@/features/classes/components/invite-code-dialog';

export default function ClassHeader({ data }: { data: ClassWithCount }) {
  const { name, level, schedule, meetingUrl, inviteCode, enrollmentOpen } =
    data;

  return (
    <header className="rounded-lg bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {name}
          </h1>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {level && <span className="capitalize">{level}</span>}
            {level && schedule && (
              <span aria-hidden className="text-border">
                ·
              </span>
            )}
            {schedule && <span>{schedule}</span>}
            {!enrollmentOpen && (
              <>
                <span aria-hidden className="text-border">
                  ·
                </span>
                <span>Enrolment closed</span>
              </>
            )}
          </div>
        </div>

        {meetingUrl && (
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Video className="size-4" aria-hidden />
            Join lesson
          </a>
        )}
      </div>

      {enrollmentOpen && (
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Invite code
          </span>
          <InviteCodeDialog code={inviteCode} enrollmentOpen={enrollmentOpen} />
        </div>
      )}
    </header>
  );
}
