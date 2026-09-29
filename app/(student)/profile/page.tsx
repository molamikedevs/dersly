import { Video } from 'lucide-react';
import Link from 'next/link';

import ThemeSwitch from '@/components/theme/theme-switch';
import SignOutButton from '@/features/auth/components/signout-button';
import { requireStudent } from '@/features/auth/guard';
import { getStudentClasses } from '@/features/classes/queries';
import AvatarUploader from '@/features/profile/components/avatar-uploader';

export const metadata = {
  title: 'Profile details',
};

export default async function Profile() {
  const profile = await requireStudent();
  const { data } = await getStudentClasses();
  const classes = data ?? [];

  return (
    <div className="flex w-full max-w-3xl min-w-0 flex-col gap-10 pb-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        Profile
      </h1>

      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <AvatarUploader name={profile.full_name} src={profile.avatarUrl} />

          <div className="min-w-0">
            <p className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {profile.full_name}
            </p>
            <p className="mt-1 truncate text-[15px] text-muted-foreground">
              {profile.email}
            </p>
          </div>
        </div>

        <dl className="mt-8 border-t border-border pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Level
            </dt>
            <dd className="flex items-center gap-3">
              {profile.level ? (
                <span className="rounded-full bg-accent px-3 py-1 text-sm font-semibold capitalize text-accent-foreground">
                  {profile.level}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Not set yet
                </span>
              )}

              <Link
                href="/level-test"
                className="inline-flex h-11 items-center rounded-xl border border-input-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {profile.level ? 'Retake test' : 'Take the test'}
              </Link>
            </dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          {classes.length === 1 ? 'Your class' : 'Your classes'}
        </h2>

        {classes.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            You are not in a class yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
            {classes.map(({ id, name, schedule, meetingUrl }) => (
              <li
                key={id}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 px-6 py-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-foreground">
                    {name}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {schedule ?? 'No schedule set'}
                  </p>
                </div>

                {meetingUrl && (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          Settings
        </h2>

        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground">Theme</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Switch between light and dark.
              </p>
            </div>
            <ThemeSwitch />
          </div>

          <div className="px-3 py-3">
            <SignOutButton className="[&>button]:h-12 [&>button]:w-full [&>button]:justify-start [&>button]:rounded-xl [&>button]:px-3 [&>button]:text-[15px]" />
          </div>
        </div>
      </section>
    </div>
  );
}
