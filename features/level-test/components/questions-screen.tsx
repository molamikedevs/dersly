'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { toast } from '@/components/ui/toast';
import { submitAttempt } from '@/features/level-test/actions';
import { cn } from '@/lib/utils';

interface Props {
  quizId: string;
  questions: TestQuestion[];
}

export default function QuestionsScreen({ quizId, questions }: Props) {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const progress = ((index + (selected ? 1 : 0)) / questions.length) * 100;

  function handleSelect(optionId: string) {
    if (selected || pending) return;

    setSelected(optionId);

    const next = [...answers, { questionId: question.id, optionId }];

    setTimeout(() => {
      if (!isLast) {
        setAnswers(next);
        setIndex((current) => current + 1);
        setSelected(null);
        return;
      }

      void finish(next);
    }, 250);
  }

  async function finish(finalAnswers: TestAnswer[]) {
    setPending(true);

    const result = await submitAttempt({ quizId, answers: finalAnswers });

    if (!result.success) {
      setPending(false);
      setSelected(null);
      toast.add({
        title: 'Could not save your result',
        description: result.error?.message,
      });
      return;
    }

    router.push('/level-test/result');
  }

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-lg flex-col pb-16 pt-4">
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label="Progress"
          className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div className="mt-10 flex flex-1 flex-col">
        <p
          key={question.id}
          className="text-xl font-medium leading-snug text-foreground sm:text-2xl"
        >
          {question.prompt}
        </p>

        <ul className="mt-8 flex flex-col gap-3">
          {question.options.map((option) => {
            const isSelected = selected === option.id;

            return (
              <li key={option.id}>
                <button
                  type="button"
                  disabled={Boolean(selected) || pending}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    'flex min-h-14 w-full items-center rounded-lg px-4 text-left text-base transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:cursor-default',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground shadow-sm hover:bg-accent',
                  )}
                >
                  {option.text}
                </button>
              </li>
            );
          })}
        </ul>

        {pending && (
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Working out your level
          </p>
        )}
      </div>
    </div>
  );
}
