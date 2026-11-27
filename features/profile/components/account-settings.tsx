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
    <div className="surface-row grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center sm:gap-8 sm:px-7">
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

export default function AccountSettings({
  allowDelete = false,
  embedded = false,
}: {
  allowDelete?: boolean;
  embedded?: boolean;
}) {
  const rows = (
    <>
      <SettingsRow
        title="Password"
        description="The password you sign in with."
      >
        <ChangePasswordDialog />
      </SettingsRow>

      <SettingsRow
        title="Appearance"
        description="Only changes how Dersly looks for you."
      >
        <ThemeSwitch />
      </SettingsRow>

      <div className="surface-row [&>div]:px-5 sm:[&>div]:px-7">
        <SignOutRow />
      </div>
    </>
  );

  return (
    <>
      {embedded ? (
        rows
      ) : (
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

          <div className="surface-card flex flex-col overflow-hidden">
            {rows}
          </div>
        </section>
      )}

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
