import { MetadataRoute } from 'next';
import { getAllToolIds, getToolById } from '@/lib/tools';

// High-traffic tools get higher priority so crawlers process them first.
// Based on Google Trends search volume estimates.
const HIGH_PRIORITY_TOOLS = new Set([
  'format-json',       // "json formatter" — ~500K+ monthly searches
  'base64',            // "base64 decode" — ~300K+
  'xml-to-json',       // "xml to json" — ~150K+
  'json-to-csv',       // "json to csv" — ~200K+
  'format-sql',        // "sql formatter" — ~150K+
  'jwt-decoder',       // "jwt decoder" — ~100K+
  'url-encode-decode', // "url encode" — ~200K+
  'yaml-to-json',      // "yaml to json" — ~80K+
  'csv-to-json',       // "csv to json" — ~100K+
  'json-to-typescript', // "json to typescript" — ~50K+
  'hash-generator',    // "sha256 hash" — ~80K+
  'compare',           // "diff checker" — ~100K+
  'number-base-converter', // "hex to decimal" — ~100K+
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devtoolbox.com';
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Tool pages — high-traffic tools get priority 0.9, others 0.8
  const toolPages: MetadataRoute.Sitemap = getAllToolIds().map((id) => ({
    url: `${baseUrl}/${id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: HIGH_PRIORITY_TOOLS.has(id) ? 0.9 : 0.8,
  }));

  return [...staticPages, ...toolPages];
}
