import { notFound } from 'next/navigation';

import BackLink from '@/components/common/back-link';
import { getMaterial } from '@/features/materials/queries';
import { youTubeId } from '@/lib/utils';
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

  return (
    <div className="max-w-3xl pb-16">
      <BackLink href="/materials" label="Back to materials" className="mb-4" />
      {videoId && (
        <div className="mt-5 overflow-hidden rounded-lg bg-muted">
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
          className="mt-5 h-[70svh] w-full rounded-lg bg-muted"
        >
          <p className="p-6 text-sm text-muted-foreground">
            Your browser cannot display this document.
          </p>
        </object>
      )}

      {description && (
        <p className="mt-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
