import { requireTeacher } from '@/features/auth/guard';
import AccountSettings from '@/features/profile/components/account-settings';
import AvatarUploader from '@/features/profile/components/avatar-uploader';

export const metadata = {
  title: 'Profile',
};

export default async function Profile() {
  const profile = await requireTeacher();

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

      <AccountSettings />
    </div>
  );
}
