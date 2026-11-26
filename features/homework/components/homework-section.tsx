import { BookOpen, ChevronRight, ExternalLink } from 'lucide-react';

import FormDialog from '@/components/common/form-dialog';
import { AppLink } from '@/features/app/app-mode';
import HomeWorkCard from '@/features/homework/components/homework-card';
import AddHomeWorkForm from './add-homework-form';
import HomeworkMenu from './homework-menu';

export const HOMEWORK_DIALOG_WIDTH = 'sm:max-w-3xl lg:max-w-4xl';

type Props = {
  classId: string;
  homeWork: HomeWorkRecord[];
  showTitle?: boolean;
};

export default function HomeWorkSection({
  classId,
  homeWork,
  showTitle = true,
}: Props) {
  const [current, ...past] = homeWork;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {showTitle ? (
          <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground sm:text-xl">
            Homework
          </h2>
        ) : (
          <>
            <h2 className="sr-only">Homework</h2>
            <p className="min-w-0 text-sm text-muted-foreground">
              {current
                ? 'Latest assignment posted for this student.'
                : 'Post homework or a lesson guide for this student.'}
            </p>
          </>
        )}

        <FormDialog
          triggerLabel="New homework"
          title="New homework"
          contentClassName={HOMEWORK_DIALOG_WIDTH}
        >
          <AddHomeWorkForm classId={classId} />
        </FormDialog>
      </div>

      {!current ? (
        <div className="surface-card rounded-2xl border-dashed border-border p-6 sm:p-8">
          <p className="text-base font-semibold text-foreground">
            No homework yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Post homework for this class and students will see it here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <HomeWorkCard
            data={current}
            readHref={`/dashboard/homework/${current.id}`}
          />

          {past.length > 0 && (
            <details className="group">
              <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                <ChevronRight
                  className="size-4 transition-transform group-open:rotate-90"
                  aria-hidden
                />
                Earlier homework ({past.length})
              </summary>

              <ul className="surface-card mt-3 flex flex-col overflow-hidden">
                {past.map((item) => {
                  const hasGuide = Boolean(item.content);
                  const fileUrl = item.signedUrl ?? item.downloadUrl;

                  return (
                    <li
                      key={item.id}
                      className="surface-row group/row flex min-h-14 items-center gap-3 py-2.5 pr-3 pl-5 sm:pr-4 sm:pl-6"
                    >
                      {hasGuide ? (
                        <AppLink
                          href={`/dashboard/homework/${item.id}`}
                          className="flex min-w-0 flex-1 items-center justify-between gap-4 py-1 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          <span className="min-w-0 truncate text-sm font-semibold text-foreground transition-colors group-hover/row:text-primary sm:text-[15px]">
                            {item.title}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover/row:text-primary">
                            <BookOpen className="size-3.5" aria-hidden />
                            Preview
                          </span>
                        </AppLink>
                      ) : fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex min-w-0 flex-1 items-center justify-between gap-4 py-1 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          <span className="min-w-0 truncate text-sm font-semibold text-foreground transition-colors group-hover/row:text-primary sm:text-[15px]">
                            {item.title}
                          </span>
                          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors group-hover/row:text-primary">
                            <ExternalLink className="size-3.5" aria-hidden />
                            Open file
                          </span>
                        </a>
                      ) : (
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground sm:text-[15px]">
                          {item.title}
                        </span>
                      )}

                      <HomeworkMenu data={item} />
                    </li>
                  );
                })}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
