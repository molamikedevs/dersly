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

export function formatDueDate(dueDate: string | null) {
  if (!dueDate) return 'Due before the next lesson';

  const date = new Date(dueDate);
  const days = Math.ceil((date.getTime() - Date.now()) / 86_400_000);

  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days < 7)
    return `Due ${date.toLocaleDateString('en-GB', { weekday: 'long' })}`;

  return `Due ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
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
