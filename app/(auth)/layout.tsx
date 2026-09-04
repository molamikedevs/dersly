import Logo from '@/components/ui/layout/logo';
import SkipLink from '@/components/ui/layout/skip-link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />

      <div className="flex min-h-svh flex-col items-center justify-center gap-8 px-4 py-10">
        <Logo />
        <main id="main" className="w-full max-w-md">
          {children}
        </main>
      </div>
    </>
  );
}
