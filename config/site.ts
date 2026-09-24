import type { Metadata, Viewport } from 'next';

export const siteConfig = {
  name: 'Dersly',
  url: 'https://dersly.pro',
  tagline: 'Your English lessons, all in one place',
  description:
    'Dersly is where students access their lessons, assignments and materials. Read your homework, check your level and join your class from any device.',
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: 'Lamin Kevin Foday' }],
  creator: 'Lamin Kevin Foday',
  publisher: siteConfig.name,
  referrer: 'origin-when-cross-origin',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ['/og-image.png'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },

  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fdfdfa' },
    { media: '(prefers-color-scheme: dark)', color: '#12110f' },
  ],
  width: 'device-width',
  initialScale: 1,
};
