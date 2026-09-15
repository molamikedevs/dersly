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
    <section className="mt-10 sm:mt-12">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Homework
        </h2>

        <FormDialog triggerLabel="New homework" title="New homework">
          <AddHomeWorkForm classId={classId} />
        </FormDialog>
      </div>

      {!current ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg bg-muted px-6 py-12 text-center">
          <ClipboardList
            className="size-9 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="mt-4 font-medium text-foreground">No homework yet</p>
          <p className="mt-1 mb-6 max-w-sm text-sm text-muted-foreground">
            Post homework for this class and students will see it here.
          </p>
          <FormDialog triggerLabel="New homework" title="New homework">
            <AddHomeWorkForm classId={classId} />
          </FormDialog>
        </div>
      ) : (
        <div className="mt-4">
          <HomeWorkCard data={current} />

          {past.length > 0 && (
            <details className="group mt-8">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <ChevronRight
                  className="size-3.5 transition-transform group-open:rotate-90"
                  aria-hidden
                />
                Earlier homework ({past.length})
              </summary>

              <ul className="mt-1 divide-y divide-border">
                {past.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-h-11 items-center gap-4 py-2.5"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
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
