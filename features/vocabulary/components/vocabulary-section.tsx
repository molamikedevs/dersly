import { ChevronRight } from 'lucide-react';

import FormDialog from '@/components/common/form-dialog';
import { WORDS_PER_WEEK } from '@/features/vocabulary/constants';
import { weekLabel, weekStart } from '@/features/vocabulary/week';
import { cn } from '@/lib/utils';
import WordForm from './word-form';
import WordMenu from './word-menu';

// The vocabulary on a one-to-one class page. This week's words are being
// studied, last week's are in the check, and older weeks are folded away.

type Props = {
  enrollmentId: string;
  words: WordRecord[];
};

type Status = 'studying' | 'passed' | 'missed' | 'unchecked';

const STATUS: Record<Status, { label: string; className: string }> = {
  studying: {
    label: 'Studying',
    className: 'border border-border-subtle bg-secondary text-muted-foreground',
  },
  passed: {
    label: 'Passed',
    className:
      'border border-success/25 bg-success-subtle text-success-subtle-foreground',
  },
  missed: {
    label: 'Not passed',
    className:
      'border border-destructive/25 bg-destructive-subtle text-destructive-subtle-foreground',
  },
  unchecked: {
    label: 'Not checked',
    className: 'border border-border-subtle bg-secondary text-muted-foreground',
  },
};

function statusOf(item: WordRecord, thisWeek: string): Status {
  if (item.weekStart >= thisWeek) return 'studying';
  if (item.learnedAt) return 'passed';
  return item.attempts > 0 ? 'missed' : 'unchecked';
}

function passedLine(words: WordRecord[]) {
  const passed = words.filter((item) => item.learnedAt).length;
  return `${passed} of ${words.length} passed`;
}

function Week({
  title,
  note,
  words,
  thisWeek,
}: {
  title: string;
  note?: string;
  words: WordRecord[];
  thisWeek: string;
}) {
  const studying = words[0]?.weekStart === thisWeek;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">
          {title}
          {note && (
            <span className="font-normal text-muted-foreground"> · {note}</span>
          )}
        </h3>
        {words.length > 0 && !studying && (
          <p className="text-xs text-muted-foreground tabular-nums">
            {passedLine(words)}
          </p>
        )}
      </div>

      {words.length === 0 ? (
        <p className="surface-card rounded-2xl border-dashed border-border px-5 py-5 text-sm text-muted-foreground sm:px-6">
          No words yet. Add up to {WORDS_PER_WEEK} for your student to study
          this week.
        </p>
      ) : (
        <ul className="surface-card flex flex-col overflow-hidden">
          {words.map((item) => {
            const status = STATUS[statusOf(item, thisWeek)];

            return (
              <li
                key={item.id}
                className="surface-row grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 py-4 pr-3 pl-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-x-6 sm:pr-4 sm:pl-6"
              >
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="font-serif text-lg font-medium tracking-tight break-words text-foreground sm:text-xl">
                    {item.word}
                  </span>
                  {!studying && (
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  )}
                </div>

                <div className="order-last col-span-2 flex min-w-0 flex-col gap-0.5 sm:order-none sm:col-span-1">
                  <p className="text-sm font-medium break-words text-foreground sm:text-[15px]">
                    {item.meaning}
                  </p>
                  {item.example && (
                    <p className="text-xs break-words text-muted-foreground italic sm:text-sm">
                      {item.example}
                    </p>
                  )}
                </div>

                <div className="justify-self-end">
                  <WordMenu data={item} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function VocabularySection({ enrollmentId, words }: Props) {
  const now = new Date();
  const thisWeek = weekStart(now);
  const lastWeek = weekStart(now, -1);

  const current = words.filter((item) => item.weekStart === thisWeek);
  const checking = words.filter((item) => item.weekStart === lastWeek);
  const older = words.filter((item) => item.weekStart < lastWeek);
  const olderWeeks = [...new Set(older.map((item) => item.weekStart))];

  const full = current.length >= WORDS_PER_WEEK;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="sr-only">Vocabulary</h2>

        {!full && (
          <FormDialog triggerLabel="Add word" title="Add a word">
            <WordForm enrollmentId={enrollmentId} />
          </FormDialog>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <Week
          title="This week"
          note={weekLabel(thisWeek)}
          words={current}
          thisWeek={thisWeek}
        />

        {checking.length > 0 && (
          <Week
            title="Last week"
            note="in the check"
            words={checking}
            thisWeek={thisWeek}
          />
        )}

        {olderWeeks.length > 0 && (
          <details className="group">
            <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
              <ChevronRight
                className="size-4 transition-transform group-open:rotate-90"
                aria-hidden
              />
              Earlier weeks ({olderWeeks.length})
            </summary>

            <div className="mt-4 flex flex-col gap-8">
              {olderWeeks.map((start) => (
                <Week
                  key={start}
                  title={weekLabel(start)}
                  words={older.filter((item) => item.weekStart === start)}
                  thisWeek={thisWeek}
                />
              ))}
            </div>
          </details>
        )}
      </div>
    </section>
  );
}
