import { ClipboardList, Pencil } from 'lucide-react';

import FormDialog from '@/components/common/form-dialog';
import { Button } from '@/components/ui/button';
import HomeWorkCard from '@/features/home-work/components/home-work-card';
import AddHomeWorkForm from './add-homework-form';

type Props = {
  homeWork: HomeWorkRecord[];
  classType: ClassType;
};

export default function HomeWorkSection({ homeWork, classType }: Props) {
  const [current, ...past] = homeWork;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Homework
        </h2>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Edit class">
            <Pencil className="size-4" aria-hidden />
          </Button>

          <FormDialog triggerLabel="New homework" title="New homework">
            <AddHomeWorkForm />
          </FormDialog>
        </div>
      </div>

      {!current ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
          <ClipboardList
            className="size-10 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="mt-4 font-medium text-foreground">No homeworks yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground mb-7">
            Post homework for this class and students will see it here.
          </p>
          <FormDialog triggerLabel="New homework" title="New homework">
            <AddHomeWorkForm />
          </FormDialog>
        </div>
      ) : (
        <div className="mt-4">
          <HomeWorkCard data={current} classType={classType} />

          {past.length > 0 && (
            <details className="group mt-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Previous HomeWorks ({past.length})
              </summary>

              <div className="mt-3 flex flex-col gap-3">
                {past.map((item) => (
                  <HomeWorkCard
                    key={item.id}
                    data={item}
                    classType={classType}
                  />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
