import type { Metadata, Viewport } from 'next';

export const siteConfig = {
  name: 'Dersly',
  url: 'https://dersly.pro',
  tagline: 'Your English lessons, all in one place',
  description:
    'Dersly is where students access their lessons, assignments and materials. Read your homework, check your level and join your class from any device.',
} as const;

/**
 * Hex copies of --background in globals.css.
 * Meta tags and the manifest cannot read CSS variables, so update these
 * (and public/site.webmanifest) whenever the background tokens change.
 */
const themeColor = {
  light: '#f5f2ec', // oklch(0.962 0.009 85)
  dark: '#1d0c17', // oklch(0.185 0.036 342)
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

  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: themeColor.light },
    { media: '(prefers-color-scheme: dark)', color: themeColor.dark },
  ],
};
