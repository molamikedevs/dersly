import * as z from 'zod';

export const MATERIAL_TITLE_MAX = 120;
export const MATERIAL_GUIDE_MAX = 50000;
export const DESCRIPTION_MAX = 300;
const URL_MAX = 2000;

const YOUTUBE_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com'];

function singleLine(value: string) {
  return value.normalize('NFC').replace(/\s+/g, ' ').trim();
}

// "youtu.be/abc" works as well as "https://youtu.be/abc": phones often
// paste without the start
function withScheme(value: string) {
  if (!value || /^[a-z][a-z\d+.-]*:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function toWebAddress(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!url.hostname.includes('.')) return null;
    return url;
  } catch {
    return null;
  }
}

// The same link shapes the student player understands (watch, youtu.be,
// embed, shorts), but strict about the host, so "notyoutube.com" fails
export function youTubeVideoId(value: string): string | null {
  const url = toWebAddress(withScheme(value.trim()));
  if (!url) return null;

  let id: string | null = null;

  if (url.hostname === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null;
  } else if (YOUTUBE_HOSTS.includes(url.hostname)) {
    const [, section, rest] = url.pathname.split('/');
    if (section === 'watch') id = url.searchParams.get('v');
    else if (section === 'embed' || section === 'shorts') id = rest ?? null;
  }

  return id && YOUTUBE_ID.test(id) ? id : null;
}

const NOT_AN_ADDRESS =
  'This is not a web address. Copy it from the address bar or the Share button.';

export const MaterialSchema = z
  .object({
    kind: z.enum(['guide', 'link', 'article']),
    title: z
      .string()
      .transform(singleLine)
      .pipe(
        z
          .string()
          .min(2, { message: 'Give this a title.' })
          .max(MATERIAL_TITLE_MAX, {
            message: `Keep the title under ${MATERIAL_TITLE_MAX} characters.`,
          }),
      ),
    description: z
      .string()
      .transform(singleLine)
      .pipe(
        z.string().max(DESCRIPTION_MAX, {
          message: `Keep the description under ${DESCRIPTION_MAX} characters.`,
        }),
      )
      .optional(),
    level: z
      .enum(['beginner', 'elementary', 'intermediate', 'advanced'])
      .optional(),
    url: z
      .string()
      .trim()
      .max(URL_MAX, { message: 'This link is too long.' })
      .transform(withScheme)
      .optional(),
    content: z
      .string()
      .trim()
      .max(MATERIAL_GUIDE_MAX, {
        message: `The guide is too long. Keep it under ${MATERIAL_GUIDE_MAX.toLocaleString('en')} characters.`,
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === 'guide') {
      if (!data.content) {
        ctx.addIssue({
          code: 'custom',
          message: 'Write the guide.',
          path: ['content'],
        });
      }
      return;
    }

    const issue = (message: string) =>
      ctx.addIssue({ code: 'custom', message, path: ['url'] });

    if (!data.url) {
      issue(
        data.kind === 'link'
          ? 'Paste the YouTube link.'
          : 'Paste the link to the page.',
      );
      return;
    }

    if (!toWebAddress(data.url)) {
      issue(NOT_AN_ADDRESS);
      return;
    }

    if (data.kind === 'link' && !youTubeVideoId(data.url)) {
      issue(
        'Video takes YouTube links only. For any other site, choose Reading.',
      );
    }
  });

export type MaterialValues = z.infer<typeof MaterialSchema>;
