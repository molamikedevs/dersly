'use client';

import { useDemoData } from '@/features/demo/components/store';
import AccountSettings from '@/features/profile/components/account-settings';
import AvatarUploader from '@/features/profile/components/avatar-uploader';

// The photo picked here stays in this tab. Password and account deletion
// answer that they are not part of the demo.
export default function DemoTeacherProfile() {
  const { teacher } = useDemoData();

  return (
    <div className="flex w-full max-w-2xl min-w-0 flex-col gap-10 pb-16">
      <AvatarUploader name={teacher.fullName} src={teacher.avatarUrl}>
        <h1 className="font-serif text-3xl leading-tight font-medium tracking-tight text-balance wrap-break-word text-foreground sm:text-4xl">
          {teacher.fullName}
        </h1>
        <p className="mt-1 text-[15px] wrap-anywhere text-muted-foreground">
          {teacher.email}
        </p>
      </AvatarUploader>

      <AccountSettings />
    </div>
  );
}
