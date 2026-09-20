'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
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

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <Button
        variant="outline"
        className="h-11"
        disabled={page === 1}
        onClick={() => goTo(page - 1)}
      >
        <ChevronLeft className="size-4" aria-hidden />
        Previous
      </Button>

      <span className="px-3 text-sm text-muted-foreground">Page {page}</span>

      <Button
        variant="outline"
        className="h-11"
        disabled={!isNext}
        onClick={() => goTo(page + 1)}
      >
        Next
        <ChevronRight className="size-4" aria-hidden />
      </Button>
    </nav>
  );
}
