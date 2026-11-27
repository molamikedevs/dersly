'use client';

import { FileDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

type Props = {
  data: HomeWorkRecord;
};

export default function HomeworkPdfButton({ data }: Props) {
  function handleSavePdf() {
    const previousTitle = document.title;
    if (data.title) {
      document.title = data.title;
    }

    window.print();

    window.setTimeout(() => {
      document.title = previousTitle;
    }, 300);
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleSavePdf}
      className="h-9 shrink-0 touch-manipulation gap-2 rounded-xl border-input-border/80 bg-secondary/75 px-3.5 text-xs font-semibold text-foreground shadow-[inset_0_1px_0_0_oklch(1_0_0/0.04)] transition-colors hover:border-primary/45 hover:bg-accent active:scale-[0.97] sm:text-sm print:hidden"
    >
      <FileDown className="size-4 text-primary" aria-hidden />
      Save PDF
    </Button>
  );
}
