'use client';

import { FileDown, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { PAPER, PRINT_CSS, loadImages } from '../constant/index';
import MarkdownContent from './markdown-content';

type Props = {
  data: HomeWorkRecord;
};

export default function HomeworkPdfButton({ data }: Props) {
  const { title, instructions, content, classes } = data;

  // The sheet is added on the first press and then stays, hidden on screen
  const [sheetOpen, setSheetOpen] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);

  async function handlePrint() {
    // Puts the sheet in the page now, so it can be read on the next line
    flushSync(() => {
      setSheetOpen(true);
      setPreparing(true);
    });

    if (sheet.current) await loadImages(sheet.current);

    setPreparing(false);
    window.print();
  }

  if (!content) return null;

  return (
    <>
      <button
        type="button"
        onClick={handlePrint}
        disabled={preparing}
        className="inline-flex h-11 shrink-0 touch-manipulation items-center gap-2 rounded-xl border border-input-border bg-card px-4 text-sm font-semibold text-foreground transition-[scale,background-color] duration-150 ease-out select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.97] disabled:opacity-70"
      >
        {preparing ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <FileDown className="size-4" aria-hidden />
        )}
        Save as PDF
      </button>

      {sheetOpen &&
        createPortal(
          <div
            id="homework-print"
            ref={sheet}
            style={PAPER}
            className="hidden bg-background text-foreground"
          >
            <style>{PRINT_CSS}</style>

            <header className="border-b border-border pb-6">
              {classes?.name && (
                <p className="text-sm font-semibold text-muted-foreground">
                  {classes.name}
                </p>
              )}
              <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight">
                {title}
              </h1>
              {instructions && (
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {instructions}
                </p>
              )}
            </header>

            <div className="mt-6">
              <MarkdownContent content={content} />
            </div>

            <p className="mt-10 border-t border-border pt-3 text-xs text-muted-foreground">
              Sent from Dersly, dersly.pro
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
