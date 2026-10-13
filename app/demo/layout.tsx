import type { Metadata } from 'next';

import { DemoStoreProvider } from '@/features/demo/components/store';

// Never in search results, like the rest of the app. The proxy also sends
// X-Robots-Tag for every /demo response.
export const metadata: Metadata = {
  title: {
    default: 'Demo',
    template: '%s | Dersly demo',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

// Rendered on every visit, never at build time, so "today" is today
export const dynamic = 'force-dynamic';

// Read once per visit, outside the component, so the server and the browser
// build the same invented data from the same moment
function openedAt() {
  return Date.now();
}

// One store for both sides, so homework posted as the teacher shows up on
// the student side. It lives in memory and resets on reload.
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DemoStoreProvider now={openedAt()}>{children}</DemoStoreProvider>;
}
