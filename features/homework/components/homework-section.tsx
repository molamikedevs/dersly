import { ChevronRight, ClipboardList } from 'lucide-react';

import FormDialog from '@/components/common/form-dialog';
import HomeWorkCard from '@/features/homework/components/homework-card';
import AddHomeWorkForm from './add-homework-form';
import HomeworkMenu from './homework-menu';

type Props = {
  classId: string;
  homeWork: HomeWorkRecord[];
};

export default function HomeWorkSection({ classId, homeWork }: Props) {
  const [current, ...past] = homeWork;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
          Homework
        </h2>

        <FormDialog triggerLabel="New homework" title="New homework">
          <AddHomeWorkForm classId={classId} />
        </FormDialog>
      </div>

      {!current ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-input-border px-6 py-14 text-center">
          <span
            aria-hidden
            className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
          >
            <ClipboardList className="size-5" />
          </span>
          <p className="mt-4 text-base font-semibold text-foreground">
            No homework yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Post homework for this class and students will see it here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <HomeWorkCard data={current} />

          {past.length > 0 && (
            <details className="group">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                <ChevronRight
                  className="size-4 transition-transform group-open:rotate-90"
                  aria-hidden
                />
                Earlier homework ({past.length})
              </summary>

              <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {past.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-h-14 items-center gap-4 px-5 py-2 sm:px-6"
                  >
                    <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-foreground">
                      {item.title}
                    </span>
                    <HomeworkMenu data={item} />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
