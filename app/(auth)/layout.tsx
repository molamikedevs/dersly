import Logo from '@/components/ui/layout/logo';
import SkipLink from '@/components/ui/layout/skip-link';

import authBg from '@/public/auth-bg.jpg';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />

      <div aria-hidden className="fixed inset-0 z-0">
        <Image
          src={authBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/80 sm:bg-background/70" />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-5 px-4 pb-12 pt-6 sm:gap-6 sm:py-8">
        <Logo />

        <main id="main" className="w-full max-w-md">
          {children}
        </main>
      </div>
    </>
  );
}
