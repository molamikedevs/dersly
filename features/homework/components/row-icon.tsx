import { BookOpen, ClipboardList, FileText } from 'lucide-react';

export default function RowIcon({ work }: { work: HomeWorkRecord }) {
  if (work.content) {
    return (
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"
      >
        <BookOpen className="size-4" />
      </span>
    );
  }

  if (work.attachmentPath) {
    return (
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-subtle text-warning-subtle-foreground"
      >
        <FileText className="size-4" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
    >
      <ClipboardList className="size-4" />
    </span>
  );
}
