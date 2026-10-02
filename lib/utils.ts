import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActive(pathname: string, href: string, exact = false) {
  if (exact || href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function initials(name?: string | null) {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function youTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null;
    if (parsed.hostname.endsWith('youtube.com')) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      if (parsed.pathname.startsWith('/embed/'))
        return parsed.pathname.split('/')[2] ?? null;
      if (parsed.pathname.startsWith('/shorts/'))
        return parsed.pathname.split('/')[2] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function toCamel<T>(input: unknown): T {
  if (Array.isArray(input)) {
    return input.map((item) => toCamel(item)) as T;
  }

  if (input !== null && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase()),
        toCamel(value),
      ]),
    ) as T;
  }

  return input as T;
}

export function generateInviteCode(length = 6) {
  return Array.from(
    { length },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  ).join('');
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export function formatLastSeen(value: string | null) {
  if (!value) return 'Never';

  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return 'Just now';

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (minutes < 60) return rtf.format(-minutes, 'minute');

  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');

  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-days, 'day');

  return rtf.format(-Math.round(days / 30), 'month');
}

const MATERIAL_KINDS = ['link', 'guide', 'article'] as const;
export type MaterialKind = (typeof MATERIAL_KINDS)[number];

export function toMaterialKind(value: unknown): MaterialKind {
  return MATERIAL_KINDS.includes(value as MaterialKind)
    ? (value as MaterialKind)
    : 'link';
}

const APP_TIME_ZONE = 'Asia/Baku';

// Built once when the module loads. Creating a formatter is the slow part,
// so they are reused instead of rebuilt on every call.
const DATE_FORMATS = {
  short: new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: APP_TIME_ZONE,
  }),
  long: new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: APP_TIME_ZONE,
  }),
} as const;

export function formatDate(
  value: string | Date = new Date(),
  style: keyof typeof DATE_FORMATS = 'short',
) {
  return DATE_FORMATS[style].format(new Date(value));
}
