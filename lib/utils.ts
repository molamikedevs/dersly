import { clsx, type ClassValue } from 'clsx';
import {
  differenceInSeconds,
  format,
  formatDistanceToNowStrict,
} from 'date-fns';
import { twMerge } from 'tailwind-merge';

import { inBaku } from '@/lib/time-zone';

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

// "Just now", "5 minutes ago", "3 hours ago", "2 days ago", "4 months ago"
export function formatLastSeen(value: string | null) {
  if (!value) return 'Never';

  const seen = new Date(value);
  if (differenceInSeconds(new Date(), seen) < 60) return 'Just now';

  return formatDistanceToNowStrict(seen, { addSuffix: true });
}

const MATERIAL_KINDS = ['link', 'guide', 'article'] as const;
export type MaterialKind = (typeof MATERIAL_KINDS)[number];

export function toMaterialKind(value: unknown): MaterialKind {
  return MATERIAL_KINDS.includes(value as MaterialKind)
    ? (value as MaterialKind)
    : 'link';
}

// short: "Wed 25 Nov"
// long:  "Wednesday 25 November"
const DATE_FORMATS = {
  short: 'EEE d MMM',
  long: 'EEEE d MMMM',
} as const;

// A date on the Baku calendar, whatever time zone the code runs in
export function formatDate(
  value: string | Date = new Date(),
  style: keyof typeof DATE_FORMATS = 'short',
) {
  return format(new Date(value), DATE_FORMATS[style], inBaku);
}
