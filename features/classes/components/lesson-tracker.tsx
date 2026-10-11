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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { markLesson } from '@/features/classes/actions';
import InviteCode from '@/features/classes/components/invite-code';
import { LESSONS_PER_PACKAGE } from '@/features/classes/constants';
import { defaultLessonDate, lessonDateOptions } from '@/lib/lesson-date';
import { cn } from '@/lib/utils';

// Same limit as MarkLessonSchema and the database
const NOTE_LIMIT = 2000;

type DateOption = { value: string; label: string };

type Props = {
  name: string;
  enrollmentId: string | null;
  lessonsDone: number;
  // Shown while the student has not joined, so the code is one tap away
  inviteCode?: string | null;
};

export default function LessonTracker({
  name,
  enrollmentId,
  lessonsDone,
  inviteCode,
}: Props) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  // Built when the dialog opens, so "today" is the day it is opened on
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [lessonDate, setLessonDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!enrollmentId) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:w-72">
        <p className="text-sm text-muted-foreground">Not joined yet</p>
        {inviteCode && <InviteCode code={inviteCode} />}
      </div>
    );
  }

  const id = enrollmentId;
  const done = Math.min(Math.max(lessonsDone, 0), LESSONS_PER_PACKAGE);
  const isComplete = done >= LESSONS_PER_PACKAGE;
  const noteId = `lesson-note-${id}`;
  const dateId = `lesson-date-${id}`;

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (next) {
      const now = new Date();
      setDateOptions(lessonDateOptions(now));
      setLessonDate(defaultLessonDate(now));
      return;
    }

    setNote('');
    setError(null);
  }

  function handleMark() {
    setError(null);

    startTransition(async () => {
      const result = await markLesson({
        enrollmentId: id,
        note: note.trim() || undefined,
        lessonDate: lessonDate || undefined,
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
      {/* The strip keeps a 5rem floor. Below that the button wraps under it,
          which is what happens at 200% text size on a small phone. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:w-72">
        <div className="min-w-20 flex-1">
          <div aria-hidden className="flex max-w-31 gap-1">
            {Array.from({ length: LESSONS_PER_PACKAGE }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors duration-300 ease-out',
                  index >= done
                    ? 'bg-border'
                    : isComplete
                      ? 'bg-warning'
                      : 'bg-primary',
                )}
              />
            ))}
          </div>

          <p
            className={cn(
              'mt-1.5 text-sm tabular-nums',
              isComplete
                ? 'font-semibold text-warning-subtle-foreground'
                : 'text-muted-foreground',
            )}
          >
            <span className="sr-only">Lessons done: </span>
            {done} of {LESSONS_PER_PACKAGE}
            {isComplete && ', payment due'}
          </p>
        </div>

        {!isComplete && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(true)}
            aria-label={`Lesson done for ${name}`}
            className="h-11 shrink-0 touch-manipulation gap-2 rounded-xl px-4 text-sm font-semibold active:scale-[0.97]"
          >
            <Check className="size-4" aria-hidden />
            Lesson done
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-2xl sm:max-w-lg">
          <DialogHeader className="gap-1.5 text-left">
            <DialogTitle className="font-serif text-2xl font-medium tracking-tight">
              Lesson done
            </DialogTitle>
            <DialogDescription className="text-[15px] wrap-break-word text-muted-foreground">
              {name}, lesson {done + 1} of {LESSONS_PER_PACKAGE}
            </DialogDescription>
          </DialogHeader>

          {/* A list of days, not a date box. A date box follows the computer's
              own format, where 10/07 can mean 7 October or 10 July. */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor={dateId}
              className="text-sm font-medium text-foreground"
            >
              Lesson date
            </label>
            <Select
              items={dateOptions}
              value={lessonDate}
              onValueChange={(value) => {
                if (typeof value === 'string') setLessonDate(value);
              }}
            >
              <SelectTrigger
                id={dateId}
                className="h-11 w-full rounded-xl text-base md:text-[15px]"
              >
                <SelectValue placeholder="Choose the day" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              className="text-base md:text-[15px]"
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
              className="rounded-xl bg-destructive-subtle px-4 py-3 text-sm font-medium text-destructive-subtle-foreground"
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
