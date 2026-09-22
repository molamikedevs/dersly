'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { toast } from '@/components/ui/toast';
import { submitAttempt } from '@/features/level-test/actions';
import { cn } from '@/lib/utils';

interface Props {
  quizId: string;
  questions: TestQuestion[];
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function QuestionsScreen({ quizId, questions }: Props) {
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const progress = ((index + (selected ? 1 : 0)) / questions.length) * 100;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [index]);

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
    <div className="mx-auto flex min-h-[70svh] w-full max-w-lg flex-col pb-16">
      <div className="flex items-center gap-4">
        <div
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label="Progress"
          className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="shrink-0 font-mono text-sm font-semibold text-muted-foreground">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div className="mt-12 flex flex-1 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Question {index + 1}
        </p>

        <h1
          ref={headingRef}
          key={question.id}
          tabIndex={-1}
          className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-foreground outline-none sm:text-4xl"
        >
          {question.prompt}
        </h1>

        <ul className="mt-10 flex flex-col gap-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === option.id;

            return (
              <li key={option.id}>
                <button
                  type="button"
                  disabled={Boolean(selected) || pending}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    'group flex min-h-14 w-full items-center gap-4 rounded-xl border px-4 py-3 text-left text-base transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    'disabled:cursor-default',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-input-border',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
                      isSelected
                        ? 'bg-primary-foreground/15 text-primary-foreground'
                        : 'bg-muted text-muted-foreground group-hover:text-foreground',
                    )}
                  >
                    {LETTERS[optionIndex]}
                  </span>
                  <span className="font-medium">{option.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {pending && (
          <p
            role="status"
            className="mt-10 flex items-center justify-center gap-2 text-[15px] text-muted-foreground"
          >
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Working out your level
          </p>
        )}
      </div>
    </div>
  );
}
