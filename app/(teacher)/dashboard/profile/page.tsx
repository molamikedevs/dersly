import { Video } from 'lucide-react';

import { requireTeacher } from '@/features/auth/guard';
import { getStudentClasses } from '@/features/classes/queries';
import AvatarUploader from '@/features/profile/components/avatar-uploader';

export const metadata = {
  title: 'Profile details',
};

export default async function Profile() {
  const profile = await requireTeacher();
  const { data } = await getStudentClasses();
  const classes = data ?? [];

  return (
    <div className="max-w-3xl pb-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Profile
      </h1>

      <section className="mt-8 rounded-lg bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <AvatarUploader name={profile.full_name} src={profile.avatarUrl} />

          <div className="min-w-0">
            <p className="text-xl font-semibold tracking-tight text-foreground">
              {profile.full_name}
            </p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {profile.email}
            </p>
          </div>
        </div>

        <dl className="mt-6 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-4 py-1.5">
            <dt className="text-sm text-muted-foreground">Level</dt>
            <dd className="text-sm">
              {profile.level ? (
                <span className="font-medium capitalize text-foreground">
                  {profile.level}
                </span>
              ) : (
                <span className="text-muted-foreground">Not set yet</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {classes.length === 1 ? 'Your class' : 'Your classes'}
        </h2>

        {classes.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You are not in a class yet.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-border">
            {classes.map(({ id, name, schedule, meetingUrl }) => (
              <li
                key={id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{name}</p>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {schedule ?? 'No schedule set'}
                  </p>
                </div>

                {meetingUrl && (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mr-2 inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Video className="size-4" aria-hidden />
                    Join lesson
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
