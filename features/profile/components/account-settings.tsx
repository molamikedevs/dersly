import ThemeSwitch from '@/components/theme/theme-switch';
import SignOutButton from '@/features/auth/components/signout-button';
import ChangePasswordDialog from '@/features/profile/components/change-password-dialog';
import DeleteAccountDialog from '@/features/profile/components/delete-account-dialog';

function SettingsRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function AccountSettings({
  allowDelete = false,
}: {
  allowDelete?: boolean;
}) {
  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          Settings
        </h2>

        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          <SettingsRow
            title="Password"
            description="Change the password you sign in with."
          >
            <ChangePasswordDialog />
          </SettingsRow>

          <SettingsRow
            title="Theme"
            description="Switch between light and dark."
          >
            <ThemeSwitch />
          </SettingsRow>
        </div>

        <SignOutButton className="[&>button]:h-12 [&>button]:w-full [&>button]:justify-center [&>button]:rounded-xl [&>button]:border [&>button]:border-border [&>button]:bg-card [&>button]:text-[15px] [&>button]:font-semibold" />
      </section>

      {allowDelete && (
        <section
          aria-label="Delete account"
          className="rounded-2xl border border-destructive/40 bg-card"
        >
          <SettingsRow
            title="Delete account"
            description="Permanently remove your account and everything linked to it."
          >
            <DeleteAccountDialog />
          </SettingsRow>
        </section>
      )}
    </>
  );
}
