import ThemeSwitch from '@/components/theme/theme-switch';
import ChangePasswordDialog from '@/features/profile/components/change-password-dialog';
import DeleteAccountDialog from '@/features/profile/components/delete-account-dialog';
import SignOutRow from '@/features/profile/components/sign-out-row';

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
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 px-5 py-4">
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
          {description}
        </p>
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
      <section
        aria-labelledby="settings-heading"
        className="flex flex-col gap-3"
      >
        <h2
          id="settings-heading"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Settings
        </h2>

        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          <SettingsRow
            title="Password"
            description="The password you log in with."
          >
            <ChangePasswordDialog />
          </SettingsRow>

          <SettingsRow title="Theme" description="Light or dark.">
            <ThemeSwitch />
          </SettingsRow>

          <SignOutRow />
        </div>
      </section>

      {allowDelete && (
        <section
          aria-labelledby="delete-heading"
          className="flex flex-col items-start gap-3"
        >
          <div>
            <h2
              id="delete-heading"
              className="text-base font-semibold text-foreground"
            >
              Delete account
            </h2>
            <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
              Removes your account, your photo and your results for good.
            </p>
          </div>
          <DeleteAccountDialog />
        </section>
      )}
    </>
  );
}
