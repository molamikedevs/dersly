import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import { buttonVariants } from '@/components/ui/button';
import { getMaterial } from '@/features/materials/queries';
import { cn, youTubeId } from '@/lib/utils';
import type { RouteParams } from '@/types/global';

export async function generateMetadata({ params }: RouteParams) {
  const { id } = await params;
  const { data } = await getMaterial(id);
  return { title: data?.title ?? 'Material' };
}

export default async function Page({ params }: RouteParams) {
  const { id } = await params;
  const { data, success } = await getMaterial(id);

  if (!success || !data) notFound();

  const { title, description, url, signedUrl } = data;

  const videoId = url ? youTubeId(url) : null;
  const isPlainLink = Boolean(url) && !videoId && !signedUrl;

  return (
    <div className="flex w-full max-w-4xl min-w-0 flex-col gap-6 pb-16">
      <BackLink href="/materials" label="Back to materials" />

      <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>

      {videoId && (
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full border-0"
          />
        </div>
      )}

      {!videoId && signedUrl && (
        <object
          data={`${signedUrl}#view=FitH`}
          type="application/pdf"
          aria-label={title}
          className="h-[70svh] w-full overflow-hidden rounded-2xl border border-border bg-muted"
        >
          <p className="p-6 text-sm text-muted-foreground">
            Your browser cannot display this document.
          </p>
        </object>
      )}

      {description && (
        <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}

      {isPlainLink && (
        <Link
          href={url!}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants(),
            'h-12 gap-2 self-start rounded-xl px-6 text-[15px] font-semibold',
          )}
        >
          Open link
          <ExternalLink className="size-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
