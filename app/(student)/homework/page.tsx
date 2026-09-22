import { ClipboardList } from 'lucide-react';

import DataRenderer from '@/components/common/data-renderer';
import { getAllHomework } from '@/features/homework/queries';
import CurrentWorkCard from '@/features/students/components/current-work-card';
import type { RouteParams } from '@/types/global';

export const metadata = {
  title: 'Homework',
};

export default async function Homework({ searchParams }: RouteParams) {
  const { page, pageSize } = await searchParams;

  const { data, success, error } = await getAllHomework({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 20,
  });

  const homework = data?.homework ?? [];
  const [current, ...past] = homework;

  return (
    <div className="flex w-full max-w-4xl min-w-0 flex-col gap-10 pb-16">
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        Homework
      </h1>

      <DataRenderer
        success={success}
        error={error}
        data={homework}
        empty={{
          icon: ClipboardList,
          title: 'No homework yet',
          message: 'Your teacher will post work here before the next lesson.',
        }}
        render={() => (
          <div className="flex flex-col gap-10">
            <CurrentWorkCard
              title={current.title}
              instructions={current.instructions}
              attachmentName={current.attachmentName}
              signedUrl={current.signedUrl}
              downloadUrl={current.downloadUrl}
              asQuestions={current.classes?.type === 'conversation'}
            />

            {past.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
                  Earlier
                </h2>
                <div className="flex flex-col gap-4">
                  {past.map((item) => (
                    <CurrentWorkCard
                      key={item.id}
                      title={item.title}
                      instructions={item.instructions}
                      attachmentName={item.attachmentName}
                      signedUrl={item.signedUrl}
                      downloadUrl={item.downloadUrl}
                      asQuestions={item.classes?.type === 'conversation'}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      />
    </div>
  );
}
