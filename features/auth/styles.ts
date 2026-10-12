// Shared by the four auth forms so they look and behave the same.

// 16px on every screen. Below 16px an iPhone zooms the page when the field is
// tapped, and the shared Input drops to 14px from md up.
export const AUTH_INPUT = 'h-12 rounded-xl text-base md:text-base';

const PRESS =
  'touch-manipulation select-none transition-[scale,background-color] duration-150 ease-out active:scale-[0.97]';

export const AUTH_SUBMIT = `mt-1 h-12 w-full rounded-xl text-base font-semibold ${PRESS}`;

// A link that looks like the main button, for "Send a new link" and similar.
// A link inside a button is invalid HTML and unreliable on phones.
export const AUTH_LINK_PRIMARY = `inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none ${PRESS}`;

export const AUTH_LINK_SECONDARY = `inline-flex h-12 w-full items-center justify-center rounded-xl border border-input-border px-6 text-base font-semibold text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${PRESS}`;

export const AUTH_TEXT_LINK =
  'font-semibold text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-sm';
