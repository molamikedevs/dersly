'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { formUrlQuery } from '@/lib/url';

export default function Pagination({ isNext }: { isNext: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  if (page === 1 && !isNext) return null;

  function goTo(next: number) {
    const url = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: String(next),
    });

    router.push(url, { scroll: false });
  }

  const buttonClass =
    'inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-end">
      <div className="flex items-center gap-1">
        <span className="pr-1 text-sm text-muted-foreground">Page: {page}</span>

        <button
          type="button"
          disabled={page === 1}
          onClick={() => goTo(page - 1)}
          className={buttonClass}
        >
          <ChevronLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Previous</span>
          <span className="sr-only sm:hidden">Previous page</span>
        </button>

        <button
          type="button"
          disabled={!isNext}
          onClick={() => goTo(page + 1)}
          className={buttonClass}
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sr-only sm:hidden">Next page</span>
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </nav>
  );
}
