import { BookOpen, Check, PenLine, Sparkles, SpellCheck } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// The week at a glance, next to the lesson card: what is waiting and how
// far along it is. Each row jumps to its part of the page.

type Row = {
  href: string;
  icon: ReactNode;
  label: string;
  detail: string;
  done?: boolean;
};

type Props = {
  homeworkLabel: string | null;
  vocabulary?: StudentVocabulary;
  mistakes?: StudentMistakes;
  className?: string;
};

function rowsFor({ homeworkLabel, vocabulary, mistakes }: Props): Row[] {
  const rows: Row[] = [];

  if (homeworkLabel) {
    rows.push({
      href: '#homework',
      icon: <BookOpen className="size-4" aria-hidden />,
      label: homeworkLabel,
      detail: 'Ready to read',
    });
  }

  const study = vocabulary?.study.words ?? [];
  if (study.length > 0) {
    rows.push({
      href: '#words',
      icon: <Sparkles className="size-4" aria-hidden />,
      label: 'New words',
      detail: study.length === 1 ? '1 to learn' : `${study.length} to learn`,
    });
  }

  const check = vocabulary?.check.words ?? [];
  if (check.length > 0) {
    const answered = check.filter((item) => item.result).length;
    rows.push({
      href: '#practice',
      icon: <SpellCheck className="size-4" aria-hidden />,
      label: 'Word check',
      detail: `${answered} of ${check.length} done`,
      done: answered === check.length,
    });
  }

  const open = mistakes?.open.length ?? 0;
  if (open > 0 || (mistakes?.fixedCount ?? 0) > 0) {
    rows.push({
      href: '#practice',
      icon: <PenLine className="size-4" aria-hidden />,
      label: 'Mistakes',
      detail:
        open === 0 ? 'All fixed' : open === 1 ? '1 to fix' : `${open} to fix`,
      done: open === 0,
    });
  }

  return rows;
}

export default function WeekChecklist(props: Props) {
  const rows = rowsFor(props);

  if (rows.length === 0) return null;

  return (
    <nav
      aria-labelledby="week-heading"
      className={cn('flex flex-col gap-2', props.className)}
    >
      <h2
        id="week-heading"
        className="text-xl leading-snug font-bold tracking-tight text-foreground"
      >
        This week
      </h2>

      <ul className="flex flex-col">
        {rows.map((row) => (
          <li key={row.label}>
            <a
              href={row.href}
              className="-mx-3 flex min-h-13 touch-manipulation items-center gap-3 rounded-xl px-3 py-2.5 transition-colors select-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:bg-muted"
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full',
                  row.done
                    ? 'bg-success-subtle text-success-subtle-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                {row.done ? <Check className="size-4" aria-hidden /> : row.icon}
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-semibold text-foreground">
                {row.label}
              </span>
              <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                {row.detail}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
