import Link from 'next/link';
import { Suspense } from 'react';

import HomeSkeleton from '@/components/common/home-skeleton';
import StudentHomeView from '@/features/students/components/student-home';
import { getStudentHome } from '@/features/students/queries';

export const metadata = {
  title: 'Home',
};

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

// Shown when the home data cannot be read, so a failed query is never a
// blank page.
function HomeError() {
  return (
    <div role="alert" className="flex max-w-prose flex-col gap-4 pb-10">
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
        Your home page did not load
      </h1>
      <p className="text-base leading-relaxed text-muted-foreground">
        Check your internet connection and try again. If it keeps happening,
        tell your teacher.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 touch-manipulation items-center justify-center self-start rounded-xl bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
      >
        Try again
      </Link>
    </div>
  );
}

async function HomeContent() {
  const { data } = await getStudentHome();

  if (!data) return <HomeError />;

  return <StudentHomeView data={data} now={new Date()} />;
}
