import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codemash.pro';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: 'CodeMash — Free Online JSON Formatter, Converter & Developer Tools',
    template: '%s | CodeMash',
  },
  description:
    'Free online developer tools: JSON formatter & validator, XML to JSON converter, YAML converter, CSV converter, SQL formatter, Base64 decoder, JWT decoder, URL encoder, hash generator & 25+ more. Fast, private — runs in your browser.',
  keywords: [
    'json formatter online',
    'json beautifier',
    'json validator',
    'xml to json converter',
    'json to csv converter',
    'yaml to json',
    'sql formatter online',
    'base64 decode',
    'base64 encode',
    'jwt decoder',
    'url encoder decoder',
    'json to typescript',
    'markdown to html',
    'hash generator sha256',
    'code formatter online',
    'developer tools online free',
    'json formatter',
    'csv to json',
    'html formatter',
    'css formatter',
    'javascript beautifier',
  ],
  authors: [{ name: 'CodeMash' }],
  creator: 'CodeMash',
  publisher: 'CodeMash',
  category: 'Developer Tools',
  applicationName: 'CodeMash',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'CodeMash',
    title: 'CodeMash — Free Online JSON Formatter, Converter & Developer Tools',
    description:
      'JSON formatter, XML/YAML/CSV converters, SQL formatter, Base64 & JWT decoder, hash generator and 25+ free developer tools. Privacy-first, runs in your browser.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodeMash — Free Online Developer Tools',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CodeMash — Free Online Developer Tools',
    description:
      'JSON formatter, XML/YAML/CSV converters, SQL formatter, Base64 & JWT decoder and 25+ free tools. Privacy-first.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  verification: {
    google: 'jbU8Blh_H3sQX6zu7PmiFtFmRg8WSd3pS3WUQKUHsWs',
  },

  other: {
    'msapplication-TileColor': '#6366f1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense — uncomment and add your client ID */}
        {/* <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        /> */}

        {/* Google Analytics — uncomment and add your measurement ID */}
        {/* <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        /> */}
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              className:
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
