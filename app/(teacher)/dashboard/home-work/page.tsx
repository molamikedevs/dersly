import { ClipboardList } from 'lucide-react';
import Link from 'next/link';

import DataRenderer from '@/components/common/data-renderer';
import { mockClasses } from '@/features/classes/mock';
import HomeWorkCard from '@/features/home-work/components/home-work-card';
import { mockhomeWorks } from '@/features/home-work/mock';

export default async function HomeWork() {
  const result = { success: true, data: mockhomeWorks };

  const sorted = [...result.data].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );

  const byClass = mockClasses
    .map((item) => ({
      class: item,
      items: sorted.filter((work) => work.classId === item.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Homework
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything you have posted, newest first.
      </p>

      <div className="mt-8">
        <DataRenderer
          success={result.success}
          data={result.data}
          empty={{
            icon: ClipboardList,
            title: 'No homework yet',
            message:
              'Open a class and post homework. Everything you post will appear here.',
            button: { text: 'Go to classes', href: '/dashboard/classes' },
          }}
          render={() =>
            byClass.map(({ class: item, items }) => (
              <section key={item.id} className="mb-8">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/classes/${item.id}`}
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {items.length}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {items.map((work) => (
                    <HomeWorkCard
                      key={work.id}
                      data={work}
                      classType={item.type}
                    />
                  ))}
                </div>
              </section>
            ))
          }
        />
      </div>
    </div>
  );
}
