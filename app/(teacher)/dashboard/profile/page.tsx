import PageHeader from '@/components/common/page-header';
import { requireTeacher } from '@/features/auth/guard';
import AccountSettings from '@/features/profile/components/account-settings';
import AvatarUploader from '@/features/profile/components/avatar-uploader';

export const metadata = {
  title: 'Settings',
};

export default async function Profile() {
  const profile = await requireTeacher();

  return (
    <div className="flex w-full max-w-4xl min-w-0 flex-col gap-7 pb-16">
      <PageHeader title="Settings" />

      <div className="surface-card flex flex-col overflow-hidden">
        {/* Profile section */}
        <section
          aria-labelledby="profile-heading"
          className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-start sm:gap-8 sm:px-7 sm:py-7"
        >
          <div className="min-w-0">
            <h2
              id="profile-heading"
              className="text-base font-semibold text-foreground"
            >
              Profile
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Students see your name and photo on their home page.
            </p>
          </div>

          <div className="flex min-w-0 max-w-md flex-col gap-5">
            <AvatarUploader name={profile.full_name} src={profile.avatarUrl} />

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="profile-name"
                className="text-sm font-medium text-foreground"
              >
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                readOnly
                disabled
                value={profile.full_name}
                className="h-11 w-full rounded-xl border border-input-border/80 bg-background/60 px-3.5 text-sm font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="profile-email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                readOnly
                disabled
                value={profile.email}
                className="h-11 w-full cursor-not-allowed rounded-xl border border-border-subtle bg-secondary/75 px-3.5 text-sm text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                You sign in with this email.
              </p>
            </div>
          </div>
        </section>

        <AccountSettings embedded />
      </div>
    </div>
  );
}
