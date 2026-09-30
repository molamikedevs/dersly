import { notFound } from 'next/navigation';

import HomeworkReader from '@/features/homework/components/homework-reader';
import { getHomework } from '@/features/homework/queries';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { data } = await getHomework(id);

  return { title: data?.title ?? 'Homework' };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const { data } = await getHomework(id);

  if (!data) notFound();

  const isTopic = data.classes?.type === 'conversation';

  return (
    <HomeworkReader
      data={data}
      backHref="/homework"
      backLabel={isTopic ? 'Back to topics' : 'Back to homework'}
    />
  );
}
