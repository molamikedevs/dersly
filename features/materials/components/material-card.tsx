import { MaterialRecord } from '@/types/materials';

import { hostname, youTubeId } from '@/lib/utils';
import { Download, ExternalLink, FileText, Link2 } from 'lucide-react';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'avif'];

export default function MaterialCard({ data }: { data: MaterialRecord }) {
  const {
    title,
    description,
    kind,
    filePath,
    url,
    level,
    signedUrl,
    downloadUrl,
  } = data;

  const isLink = kind === 'link';
  const href = isLink ? url : downloadUrl;

  const videoId = isLink && url ? youTubeId(url) : null;
  const fileName = filePath?.split('/').pop() ?? '';
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

  const isPdf = !isLink && extension === 'pdf';
  const isImage = !isLink && IMAGE_EXTENSIONS.includes(extension);
  const isAudio = !isLink && ['mp3', 'm4a', 'wav', 'ogg'].includes(extension);
  const site = isLink && url ? hostname(url) : null;

  const hasMedia = Boolean(videoId || isPdf || isImage);

  return (
    <article className="flex flex-col rounded-lg bg-card p-4 shadow-sm">
      {videoId && (
        <div className="mb-4 overflow-hidden rounded-md bg-muted">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full border-0"
          />
        </div>
      )}

      {isPdf && signedUrl && (
        <div className="mb-4 overflow-hidden rounded-md bg-muted">
          <object
            data={`${signedUrl}#toolbar=0&navpanes=0&view=FitH`}
            type="application/pdf"
            aria-label={title}
            className="h-44 w-full"
          >
            <div className="flex h-44 items-center justify-center">
              <FileText className="size-6 text-muted-foreground" aria-hidden />
            </div>
          </object>
        </div>
      )}

      {isImage && signedUrl && (
        <div className="mb-4 overflow-hidden rounded-md bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={signedUrl}
            alt={title}
            loading="lazy"
            className="h-44 w-full object-cover"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 items-start gap-3">
        {!hasMedia && (
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
          >
            {isLink ? (
              <Link2 className="size-4" />
            ) : (
              <FileText className="size-4" />
            )}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-foreground">{title}</h3>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
            {level && <span className="capitalize">{level}</span>}
            {level && site && (
              <span aria-hidden className="text-border">
                ·
              </span>
            )}
            {site && <span className="truncate">{site}</span>}
          </div>

          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}

          {isAudio && signedUrl && (
            <audio
              controls
              preload="none"
              src={signedUrl}
              className="mt-3 w-full"
            >
              Your browser does not support audio playback.
            </audio>
          )}
        </div>
      </div>

      {href && !videoId && (
        <div className="mt-3 flex">
          <a
            href={href}
            {...(isLink
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : { download: fileName })}
            className="-ml-2 inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isLink ? (
              <>
                Open
                <ExternalLink className="size-3.5" aria-hidden />
              </>
            ) : (
              <>
                <Download className="size-4" aria-hidden />
                Download
              </>
            )}
          </a>
        </div>
      )}
    </article>
  );
}
