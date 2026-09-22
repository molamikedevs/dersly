import { Video } from 'lucide-react';

import InviteCodeDialog from '@/features/classes/components/invite-code-dialog';

export default function ClassHeader({ data }: { data: ClassWithCount }) {
  const { name, level, schedule, meetingUrl, inviteCode, enrollmentOpen } =
    data;

  return (
    <header className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-5">
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            {name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-[15px] text-muted-foreground">
            {level && <span className="capitalize">{level}</span>}
            {level && schedule && <span aria-hidden>&middot;</span>}
            {schedule && <span>{schedule}</span>}
            {!enrollmentOpen && (
              <span className="ml-1 rounded-full border border-input-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                Enrolment closed
              </span>
            )}
          </div>
        </div>

        {meetingUrl && (
          <a
            href={meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <Video className="size-4" aria-hidden />
            Join lesson
          </a>
        )}
      </div>

      {enrollmentOpen && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border pt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Invite code
          </span>
          <InviteCodeDialog code={inviteCode} enrollmentOpen={enrollmentOpen} />
        </div>
      )}
    </header>
  );
}
