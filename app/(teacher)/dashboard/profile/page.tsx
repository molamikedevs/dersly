import { requireTeacher } from '@/features/auth/guard';
import AccountSettings from '@/features/profile/components/account-settings';
import AvatarUploader from '@/features/profile/components/avatar-uploader';

export const metadata = {
  title: 'Profile',
};

export default async function Profile() {
  const profile = await requireTeacher();

  return (
    <div className="flex w-full max-w-3xl min-w-0 flex-col gap-10 pb-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        Profile
      </h1>

      <section
        aria-label="Your details"
        className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
          <AvatarUploader name={profile.full_name} src={profile.avatarUrl} />

          <div className="min-w-0">
            <p className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              {profile.full_name}
            </p>
            <p className="mt-1 truncate text-[15px] text-muted-foreground">
              {profile.email}
            </p>
            <span className="mt-3 inline-flex rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              Teacher
            </span>
          </div>
        </div>
      </section>

      <AccountSettings />
    </div>
  );
}
