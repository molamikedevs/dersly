import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isActive(pathname: string, href: string, exact = false) {
  if (exact || href === '/') {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
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
