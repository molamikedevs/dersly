'use client';

import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import BackLink from '@/components/common/back-link';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveQuiz } from '@/features/quizzes/actions';
import {
  QUIZ_MAX_QUESTIONS,
  QUIZ_MAX_SCORE,
  type QuizQuestionInput,
} from '@/lib/validation/quiz.schema';

type DraftQuestion = QuizQuestionInput & { key: string };

type Props = {
  classId: string;
  initialQuiz?: QuizWithQuestions;
  words?: WordRecord[];
  mistakes?: MistakeRecord[];
};

function blankWord(example: string | null, word: string) {
  if (!example) return null;
  const escaped = word.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const replaced = example.replace(
    new RegExp(`\\b${escaped}\\w*`, 'gi'),
    '___',
  );
  return replaced.includes('___') ? replaced : null;
}

function emptyMcq(): DraftQuestion {
  return {
    key: crypto.randomUUID(),
    kind: 'mcq',
    prompt: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  };
}

function emptyWordBank(): DraftQuestion {
  return {
    key: crypto.randomUUID(),
    kind: 'word_bank',
    prompt: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  };
}

export default function QuizBuilder({
  classId,
  initialQuiz,
  words = [],
  mistakes = [],
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialQuiz?.title ?? '');
  const [questions, setQuestions] = useState<DraftQuestion[]>(() => {
    if (initialQuiz?.questions.length) {
      return initialQuiz.questions.map((q) => ({
        key: q.id,
        kind: q.kind,
        prompt: q.prompt,
        options:
          q.options.length >= 4
            ? q.options
            : [...q.options, ...Array(4 - q.options.length).fill('')],
        correctAnswer: q.correctAnswer,
      }));
    }
    return [emptyMcq()];
  });

  const remainingSlots = QUIZ_MAX_QUESTIONS - questions.length;

  function updateQuestion(key: string, patch: Partial<DraftQuestion>) {
    setQuestions((prev) =>
      prev.map((q) => (q.key === key ? { ...q, ...patch } : q)),
    );
  }

  function handleKindChange(key: string, kind: QuizQuestionKind) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.key === key
          ? {
              ...q,
              kind,
              options: q.options.length >= 4 ? q.options : ['', '', '', ''],
            }
          : q,
      ),
    );
  }

  function handleOptionChange(key: string, index: number, value: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.key !== key) return q;
        const wasCorrect = q.correctAnswer === q.options[index];
        const nextOptions = [...q.options];
        nextOptions[index] = value;
        return {
          ...q,
          options: nextOptions,
          correctAnswer: wasCorrect || index === 0 ? value : q.correctAnswer,
        };
      }),
    );
  }

  function importFromVocabulary() {
    if (remainingSlots <= 0 || words.length === 0) return;

    const pool = words.map((w) => w.word);
    const added: DraftQuestion[] = [];

    for (const w of words) {
      if (added.length >= remainingSlots) break;
      const sentence = blankWord(w.example, w.word);
      if (!sentence) continue;

      const distractors = pool.filter((item) => item !== w.word).slice(0, 3);
      while (distractors.length < 3) distractors.push('');

      added.push({
        key: crypto.randomUUID(),
        kind: 'word_bank',
        prompt: sentence,
        options: [w.word, ...distractors],
        correctAnswer: w.word,
      });
    }

    if (added.length === 0) {
      toast.error('No vocabulary examples available to import.');
      return;
    }

    setQuestions((prev) => [...prev, ...added]);
    toast.success(`Added ${added.length} word bank questions`);
  }

  function importFromMistakes() {
    if (remainingSlots <= 0 || mistakes.length === 0) return;

    const added: DraftQuestion[] = [];

    for (const m of mistakes) {
      if (added.length >= remainingSlots) break;
      const record = m as MistakeRecord & { right?: string; correct?: string };
      const right = record.right ?? record.correct;
      if (!right || !record.wrong) continue;

      added.push({
        key: crypto.randomUUID(),
        kind: 'mcq',
        prompt: 'Which sentence is correct?',
        options: [right, record.wrong, '', ''],
        correctAnswer: right,
      });
    }

    if (added.length === 0) {
      toast.error('No logged mistakes with corrections found.');
      return;
    }

    setQuestions((prev) => [...prev, ...added]);
    toast.success(`Added ${added.length} questions from mistakes`);
  }

  function handleSubmit(publish: boolean) {
    const cleanedQuestions = questions.map((q) => {
      const filteredOptions = q.options
        .map((opt) => opt.trim())
        .filter(Boolean);
      const correct =
        q.kind === 'word_bank'
          ? (filteredOptions[0] ?? q.correctAnswer.trim())
          : q.correctAnswer.trim();

      return {
        kind: q.kind,
        prompt: q.prompt.trim(),
        options: filteredOptions,
        correctAnswer: correct,
      };
    });

    startTransition(async () => {
      const res = await saveQuiz({
        quizId: initialQuiz?.id,
        classId,
        title,
        isPublished: publish,
        questions: cleanedQuestions,
      });

      if (!res.success) {
        toast.error(res.error?.message ?? 'Check all fields and try again.');
        return;
      }

      toast.success(publish ? 'Quiz published' : 'Draft saved');
      router.push(`/dashboard/classes/${classId}`);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-7 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <BackLink
          href={`/dashboard/classes/${classId}`}
          label="Back to class"
        />

        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
          {questions.length} / {QUIZ_MAX_QUESTIONS} questions · {QUIZ_MAX_SCORE}{' '}
          pts
        </span>
      </div>

      <div className="surface-card flex flex-col gap-4 p-5 sm:p-6">
        <label
          htmlFor="quiz-title"
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          Quiz title
        </label>
        <input
          id="quiz-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Month 1 Check-up"
          className="h-11 w-full rounded-xl border border-input-border/80 bg-background/60 px-3.5 font-serif text-lg font-medium text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />

        {(words.length > 0 || mistakes.length > 0) && remainingSlots > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              Quick fill:
            </span>

            {words.length > 0 && (
              <button
                type="button"
                onClick={importFromVocabulary}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/25 bg-primary/10 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                + From vocabulary
              </button>
            )}

            {mistakes.length > 0 && (
              <button
                type="button"
                onClick={importFromMistakes}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-input-border/80 bg-secondary/75 px-3 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent"
              >
                + From mistakes
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, index) => (
          <section
            key={q.key}
            className="surface-card flex flex-col gap-4 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-primary tabular-nums">
                Question {index + 1}
              </span>

              <div className="flex items-center gap-2">
                <Select
                  value={q.kind}
                  onValueChange={(val) =>
                    handleKindChange(q.key, val as QuizQuestionKind)
                  }
                >
                  <SelectTrigger className="h-9 w-44 rounded-lg border-input-border/80 bg-secondary/75 text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple choice</SelectItem>
                    <SelectItem value="word_bank">Word bank</SelectItem>
                  </SelectContent>
                </Select>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setQuestions((prev) =>
                        prev.filter((item) => item.key !== q.key),
                      )
                    }
                    aria-label={`Remove question ${index + 1}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border-subtle bg-secondary/50 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              value={q.prompt}
              onChange={(e) =>
                updateQuestion(q.key, { prompt: e.target.value })
              }
              placeholder={
                q.kind === 'word_bank'
                  ? 'I usually ___ by walking along the Boulevard.'
                  : '___ you ever been to Gabala?'
              }
              className="h-11 w-full rounded-xl border border-input-border/80 bg-background/60 px-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />

            {q.kind === 'mcq' ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {(['A', 'B', 'C', 'D'] as const).map((letter, optIndex) => {
                  const val = q.options[optIndex] ?? '';
                  const isCorrect =
                    val.trim().length > 0 && q.correctAnswer === val;

                  return (
                    <div
                      key={letter}
                      className="flex items-center gap-2 rounded-xl border border-border-subtle bg-secondary/50 px-3 py-1.5"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestion(q.key, { correctAnswer: val })
                        }
                        aria-label={`Mark option ${letter} correct`}
                        className={`flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                          isCorrect
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background/80 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        value={val}
                        onChange={(e) =>
                          handleOptionChange(q.key, optIndex, e.target.value)
                        }
                        placeholder={`Option ${letter}`}
                        className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/55 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {q.options.slice(0, 4).map((val, optIndex) => (
                  <div
                    key={optIndex}
                    className="flex items-center gap-2 rounded-xl border border-border-subtle bg-secondary/50 px-3 py-1.5"
                  >
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        optIndex === 0
                          ? 'bg-primary/15 text-primary'
                          : 'bg-background/80 text-muted-foreground'
                      }`}
                    >
                      {optIndex === 0 ? 'Answer' : 'Word'}
                    </span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) =>
                        handleOptionChange(q.key, optIndex, e.target.value)
                      }
                      placeholder={
                        optIndex === 0 ? 'Correct word' : 'Extra word'
                      }
                      className="h-8 min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/55 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {remainingSlots > 0 && (
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setQuestions((prev) => [...prev, emptyMcq()])}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-input-border/80 bg-secondary/75 px-4 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent"
          >
            <Plus className="size-3.5 text-primary" aria-hidden />
            Multiple choice
          </button>

          <button
            type="button"
            onClick={() => setQuestions((prev) => [...prev, emptyWordBank()])}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-input-border/80 bg-secondary/75 px-4 text-xs font-semibold text-foreground transition-colors hover:border-primary/45 hover:bg-accent"
          >
            <Plus className="size-3.5 text-primary" aria-hidden />
            Word bank
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border-subtle pt-5">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => handleSubmit(false)}
          className="h-11 rounded-xl border-input-border/80 bg-secondary/75 px-5 text-sm font-semibold"
        >
          Save draft
        </Button>

        <Button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit(true)}
          className="h-11 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.22),0_1px_2px_0_oklch(0_0_0/0.35)] hover:bg-primary/90"
        >
          {isPending ? 'Saving…' : 'Publish quiz'}
        </Button>
      </div>
    </div>
  );
}
