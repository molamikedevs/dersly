import type { Metadata } from 'next';

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

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
