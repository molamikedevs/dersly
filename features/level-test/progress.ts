'use client';

import { useSyncExternalStore } from 'react';

// Answers are saved on the phone after every tap, so a refresh, a back
// swipe or a closed tab never loses them. They are cleared once the result is
// saved, and ignored after a week.

const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export type SavedProgress = {
  quizId: string;
  // question id to option id
  answers: Record<string, string>;
  savedAt: number;
};

// Used when the browser refuses storage (some private windows). The test
// still works, it just does not survive a refresh there.
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

// The time is stamped here, outside any component, so render stays pure
export function saveProgress(
  key: string,
  progress: Omit<SavedProgress, 'savedAt'> | null,
) {
  const value = progress
    ? JSON.stringify({ ...progress, savedAt: Date.now() })
    : null;

  try {
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    if (value) memory.set(key, value);
    else memory.delete(key);
  }

  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab of the same app changed it
  window.addEventListener('storage', listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function parse(raw: string | null): SavedProgress | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as SavedProgress;
    if (!value?.quizId || typeof value.answers !== 'object') return null;
    if (Date.now() - value.savedAt > MAX_AGE) return null;
    return value;
  } catch {
    return null;
  }
}

const cache = new Map<
  string,
  { raw: string | null; value: SavedProgress | null }
>();

// undefined while the page is still being hydrated, because the server cannot
// see the phone's storage. null when nothing is saved.
export function useSavedProgress(
  key: string,
): SavedProgress | null | undefined {
  const raw = useSyncExternalStore<string | null | undefined>(
    subscribe,
    () => read(key),
    () => undefined,
  );

  if (raw === undefined) return undefined;

  // Parse once per stored value, so every render gets the same object
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;

  const value = parse(raw);
  cache.set(key, { raw, value });
  return value;
}
