import Logo from '@/components/ui/layout/logo';
import SkipLink from '@/components/ui/layout/skip-link';

import authBg from '@/public/auth-bg.jpg';
import Image from 'next/image';

// Phones get the form alone, at the top of a plain page, so it loads fast and
// the keyboard never covers a photo. From lg up the Baku photo fills the
// right side.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SkipLink />

      <div className="grid min-h-svh grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="flex min-h-svh flex-col px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-10 sm:px-10 lg:px-16 lg:pt-10">
          <Logo href="/login" />

          <main
            id="main"
            className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center pt-12 pb-6 lg:py-16"
          >
            {children}
          </main>
        </div>

        <aside
          aria-hidden
          className="relative hidden p-3 lg:sticky lg:top-0 lg:block lg:h-svh"
        >
          <div className="relative h-full overflow-hidden rounded-3xl">
            {/* Not priority: on phones the panel is hidden and the photo is
                never downloaded. */}
            <Image
              src={authBg}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 55vw, 1px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-10 text-white xl:p-14">
              <p className="max-w-lg font-serif text-4xl leading-[1.1] font-medium tracking-tight text-balance xl:text-5xl">
                Your English lessons, all in one place.
              </p>
              <p className="max-w-md text-base leading-relaxed text-white/80">
                Homework, lesson notes and materials from your teacher, ready on
                your phone between lessons.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
