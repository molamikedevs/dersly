import Link from 'next/link';

import { requireStudent } from '@/features/auth/guard';
import { getStudentClasses } from '@/features/classes/queries';
import { isLevel, LEVELS } from '@/features/level-test/levels';
import AccountSettings from '@/features/profile/components/account-settings';
import AvatarUploader from '@/features/profile/components/avatar-uploader';

export const metadata = {
  title: 'Profile',
};

const OUTLINE_LINK =
  'inline-flex h-11 shrink-0 touch-manipulation items-center justify-center rounded-xl border border-input-border px-4 text-[15px] font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97]';

export default async function Profile() {
  const profile = await requireStudent();
  const { data } = await getStudentClasses();
  const classes = data ?? [];
  const level = isLevel(profile.level) ? LEVELS[profile.level] : null;

  return (
    <div className="flex w-full max-w-2xl min-w-0 flex-col gap-10 pb-16">
      {/* The person is the heading of their own profile */}
      <AvatarUploader name={profile.full_name} src={profile.avatarUrl}>
        <h1 className="font-serif text-3xl leading-tight font-medium tracking-tight text-balance wrap-break-word text-foreground sm:text-4xl">
          {profile.full_name}
        </h1>
        <p className="mt-1 text-[15px] wrap-anywhere text-muted-foreground">
          {profile.email}
        </p>
      </AvatarUploader>

      <section
        aria-labelledby="level-heading"
        className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-y border-border py-5"
      >
        <div className="min-w-0">
          <h2 id="level-heading" className="text-sm text-muted-foreground">
            Your level
          </h2>
          {level ? (
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-foreground">
              <span className="font-serif text-3xl leading-tight font-medium tracking-tight">
                {level.name}
              </span>
              <span className="text-[15px] text-muted-foreground">
                roughly {level.cefr}
              </span>
            </p>
          ) : (
            <p className="mt-1 text-base leading-snug text-foreground">
              Not set yet. The test takes about ten minutes.
            </p>
          )}
        </div>

        <Link href="/level-test" className={OUTLINE_LINK}>
          {level ? 'Take the test again' : 'Find my level'}
        </Link>
      </section>

      <section
        aria-labelledby="classes-heading"
        className="flex flex-col gap-3"
      >
        <h2
          id="classes-heading"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          {classes.length === 1 ? 'Your class' : 'Your classes'}
        </h2>

        {classes.length === 0 ? (
          <p className="text-base text-muted-foreground">
            You are not in a class yet.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {classes.map(({ id, name, schedule, meetingUrl }) => (
              <li
                key={id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4"
              >
                <div className="min-w-0 flex-1 basis-48">
                  <p className="text-base font-semibold wrap-break-word text-foreground">
                    {name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {schedule ?? 'No lesson times yet'}
                  </p>
                </div>

                {meetingUrl && (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={OUTLINE_LINK}
                  >
                    Lesson link
                    <span className="sr-only">
                      {' '}
                      for {name} (opens in a new tab)
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <AccountSettings allowDelete />
    </div>
  );
}
