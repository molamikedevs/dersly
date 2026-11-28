import { Suspense } from 'react';

import HomeSkeleton from '@/components/common/home-skeleton';
import { getMyMistakes } from '@/features/mistakes/queries';
import { getMyActiveQuiz } from '@/features/quizzes/queries';
import HomeError from '@/features/students/components/home-error';
import StudentHomeView from '@/features/students/components/student-home';
import { getStudentHome } from '@/features/students/queries';
import { getMyVocabulary } from '@/features/vocabulary/queries';

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

async function HomeContent() {
  const [{ data }, mistakes, vocabulary, quiz] = await Promise.all([
    getStudentHome(),
    getMyMistakes(),
    getMyVocabulary(),
    getMyActiveQuiz(),
  ]);

  if (!data) return <HomeError />;

  return (
    <StudentHomeView
      data={data}
      now={new Date()}
      mistakes={mistakes.data}
      vocabulary={vocabulary.data}
      quiz={quiz.data}
    />
  );
}
