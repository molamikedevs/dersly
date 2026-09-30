'use client';

import { Check, Loader2 } from 'lucide-react';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { markLesson } from '@/features/classes/actions';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  enrollmentId: string | null;
  lessonsDone: number;
};

export default function LessonTracker({
  name,
  enrollmentId,
  lessonsDone,
}: Props) {
  const [isPending, startTransition] = useTransition();

  if (!enrollmentId) {
    return (
      <span className="text-sm text-muted-foreground">Not joined yet</span>
    );
  }

  const id = enrollmentId;
  const isComplete = lessonsDone >= LESSONS_PER_PACKAGE;

  function handleMark() {
    startTransition(async () => {
      const result = await markLesson({ enrollmentId: id });

      if (!result.success) {
        toast.add({
          title: 'Could not mark lesson',
          description: result.error?.message,
        });
        return;
      }

      toast.add({
        title: `Lesson ${result.data!.lessonsDone} of ${LESSONS_PER_PACKAGE} marked`,
      });
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          'min-w-12 text-center text-sm font-semibold tabular-nums',
          isComplete ? 'text-warning' : 'text-foreground',
        )}
        aria-label={`${lessonsDone} of ${LESSONS_PER_PACKAGE} lessons done`}
      >
        {lessonsDone} / {LESSONS_PER_PACKAGE}
      </span>

      <Button
        type="button"
        variant="outline"
        onClick={handleMark}
        disabled={isComplete || isPending}
        aria-label={`Lesson done for ${name}`}
        className="h-11 gap-2 rounded-xl px-4 text-sm font-semibold"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Check className="size-4" aria-hidden />
        )}
        Lesson done
      </Button>
    </div>
  );
}
