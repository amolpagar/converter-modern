import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CodeMash — Free Online Developer Tools',
    short_name: 'CodeMash',
    description:
      'Free, fast, privacy-first developer tools. JSON formatter, XML converter, Base64 decoder, JWT decoder, SQL formatter, and 25+ more tools — all in your browser.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    categories: ['developer', 'utilities', 'productivity'],
  };
}
