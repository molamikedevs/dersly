'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { markLesson } from '@/features/classes/actions';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { cn } from '@/lib/utils';

const NOTE_LIMIT = 1000;

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
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!enrollmentId) {
    return (
      <span className="text-sm text-muted-foreground">Not joined yet</span>
    );
  }

  const id = enrollmentId;
  const isComplete = lessonsDone >= LESSONS_PER_PACKAGE;
  const noteId = `lesson-note-${id}`;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setNote('');
      setError(null);
    }
  }

  function handleMark() {
    setError(null);

    startTransition(async () => {
      const result = await markLesson({
        enrollmentId: id,
        note: note.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error?.message ?? 'Could not mark the lesson.');
        return;
      }

      toast.add({
        title: `Lesson ${result.data!.lessonsDone} of ${LESSONS_PER_PACKAGE} marked`,
      });
      handleOpenChange(false);
    });
  }

  return (
    <>
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
          onClick={() => setOpen(true)}
          disabled={isComplete}
          aria-label={`Lesson done for ${name}`}
          className="h-11 gap-2 rounded-xl px-4 text-sm font-semibold"
        >
          <Check className="size-4" aria-hidden />
          Lesson done
        </Button>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader className="gap-1.5 text-left">
            <DialogTitle className="font-serif text-2xl font-medium tracking-tight">
              Lesson done
            </DialogTitle>
            <DialogDescription className="text-[15px] text-muted-foreground">
              {name}, lesson {lessonsDone + 1} of {LESSONS_PER_PACKAGE}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={noteId}
              className="text-sm font-medium text-foreground"
            >
              Note for the student{' '}
              <span className="font-normal text-muted-foreground">
                optional
              </span>
            </label>
            <Textarea
              id={noteId}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              maxLength={NOTE_LIMIT}
              className="text-[15px]"
              placeholder="Mistakes to fix, new words, what to practise before next time."
              aria-describedby={`${noteId}-hint`}
            />
            <p
              id={`${noteId}-hint`}
              className="text-[13px] text-muted-foreground"
            >
              The student sees this on their Home page.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="h-11 rounded-xl px-5 text-[15px] font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleMark}
              disabled={isPending}
              className="h-11 gap-2 rounded-xl px-5 text-[15px] font-semibold"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Check className="size-4" aria-hidden />
              )}
              {isPending ? 'Saving' : 'Mark lesson done'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
