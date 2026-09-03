import { SkipLink } from '@/components/ui/layout/skip-link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />

      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  );
}
