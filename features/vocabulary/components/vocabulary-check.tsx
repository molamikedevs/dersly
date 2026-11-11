'use client';

import { Check, Loader2, X } from 'lucide-react';
import { useState, useTransition, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDerslyActions } from '@/features/app/actions-context';
import { cn } from '@/lib/utils';
import { WORD_MAX } from '@/lib/validation/vocabulary.schema';

// Last week's words on the student's Home page. They read the meaning and
// type the word, once. Right or wrong, they see the word straight after.

type Props = { words: CheckWord[] };

export default function VocabularyCheck({ words }: Props) {
  if (words.length === 0) return null;

  const answered = words.filter((item) => item.result).length;
  const right = words.filter((item) => item.result?.right).length;
  const done = answered === words.length;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-xl leading-snug font-bold tracking-tight text-foreground">
          Vocabulary check
        </h2>
        <p
          className={cn(
            'text-sm tabular-nums',
            done ? 'font-semibold text-foreground' : 'text-muted-foreground',
          )}
        >
          {done
            ? `${right} of ${words.length} right`
            : `${answered} of ${words.length} answered`}
        </p>
      </div>
      <p className="text-[15px] text-muted-foreground">
        {done
          ? 'Done. Keep the ones you missed in mind.'
          : 'Last week’s words. Read the meaning and type the word. One try each.'}
      </p>

      <ol className="flex flex-col divide-y divide-border border-y border-border">
        {words.map((item) => (
          <CheckItem key={item.id} item={item} />
        ))}
      </ol>
    </section>
  );
}

function CheckItem({ item }: { item: CheckWord }) {
  const { checkWord } = useDerslyActions();
  const [answer, setAnswer] = useState('');
  const [local, setLocal] = useState<WordCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const inputId = `word-check-${item.id}`;
  // Answered on the server, or just now before the page refreshes
  const result = item.result ?? local;

  function handleCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!answer.trim()) {
      setError('Write the word first.');
      return;
    }

    startTransition(async () => {
      const response = await checkWord({ wordId: item.id, answer });

      if (!response.success || !response.data) {
        setError('Could not check your answer. Try again.');
        return;
      }

      setLocal(response.data);
    });
  }

  if (result) {
    return (
      <li className="flex items-start gap-3 py-4">
        <span
          className={cn(
            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
            result.right
              ? 'bg-success-subtle text-success-subtle-foreground'
              : 'bg-destructive-subtle text-destructive-subtle-foreground',
          )}
        >
          {result.right ? (
            <Check className="size-3.5" aria-hidden />
          ) : (
            <X className="size-3.5" aria-hidden />
          )}
          <span className="sr-only">{result.right ? 'Right' : 'Wrong'}</span>
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-base font-semibold break-words text-foreground">
            {result.word}
          </p>
          <p className="text-[15px] break-words text-muted-foreground">
            {item.meaning}
          </p>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-col gap-3 py-5">
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium break-words text-foreground">
          {item.meaning}
        </p>
        {item.example && (
          <p className="text-[15px] break-words text-muted-foreground">
            {item.example}
          </p>
        )}
      </div>

      <form
        onSubmit={handleCheck}
        noValidate
        className="flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor={inputId} className="sr-only">
          The word that means: {item.meaning}
        </label>
        <Input
          id={inputId}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          maxLength={WORD_MAX}
          placeholder="Type the word"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="done"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className="h-12 min-w-0 rounded-xl text-base sm:flex-1 md:text-base"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 shrink-0 touch-manipulation gap-2 rounded-xl px-5 text-[15px] font-semibold select-none active:scale-[0.97]"
        >
          {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Check
        </Button>
      </form>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {error}
        </p>
      )}
    </li>
  );
}
