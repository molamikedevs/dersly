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
  studying: { label: 'Studying', className: 'bg-muted text-muted-foreground' },
  passed: {
    label: 'Passed',
    className: 'bg-success-subtle text-success-subtle-foreground',
  },
  missed: {
    label: 'Not passed',
    className: 'bg-destructive-subtle text-destructive-subtle-foreground',
  },
  unchecked: {
    label: 'Not checked',
    className: 'bg-muted text-muted-foreground',
  },
};

function statusOf(item: WordRecord, thisWeek: string): Status {
  if (item.weekStart >= thisWeek) return 'studying';
  if (item.learnedAt) return 'passed';
  return item.attempts > 0 ? 'missed' : 'unchecked';
}

// "3 of 5 passed", once the week is in the check
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
        <h3 className="text-base font-semibold text-foreground">
          {title}
          {note && (
            <span className="font-normal text-muted-foreground"> {note}</span>
          )}
        </h3>
        {words.length > 0 && !studying && (
          <p className="text-sm text-muted-foreground tabular-nums">
            {passedLine(words)}
          </p>
        )}
      </div>

      {words.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-input-border px-5 py-4 text-sm text-muted-foreground sm:px-6">
          No words yet. Add up to {WORDS_PER_WEEK} for your student to study
          this week.
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {words.map((item) => {
            const status = STATUS[statusOf(item, thisWeek)];

            return (
              <li
                key={item.id}
                className="flex items-start gap-4 py-4 pr-2 pl-5 sm:pr-3 sm:pl-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-base font-semibold break-words text-foreground">
                    {item.word}
                  </p>
                  <p className="text-[15px] break-words text-foreground">
                    {item.meaning}
                  </p>
                  {item.example && (
                    <p className="text-sm break-words text-muted-foreground">
                      {item.example}
                    </p>
                  )}
                </div>

                <span
                  className={cn(
                    'mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    status.className,
                  )}
                >
                  {status.label}
                </span>

                <WordMenu data={item} />
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
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-[28px]">
            Vocabulary
          </h2>
          <p className="text-sm text-muted-foreground">
            {WORDS_PER_WEEK} words to study this week, checked next week.
          </p>
        </div>

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
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden">
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
