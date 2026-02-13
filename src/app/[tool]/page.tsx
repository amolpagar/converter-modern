import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolById, getAllToolIds } from '@/lib/tools';
import { ToolPage } from '@/components/converter/ToolPage';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codemash.pro';

interface PageProps {
  params: { tool: string };
}

export async function generateStaticParams() {
  return getAllToolIds().map((tool) => ({ tool }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolById(params.tool);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.seoDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: `/${tool.id}`,
    },
    openGraph: {
      title: tool.title,
      description: tool.seoDescription,
      url: `/${tool.id}`,
      type: 'website',
      siteName: 'CodeMash',
      locale: 'en_US',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: tool.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.seoDescription,
      images: ['/og-image.png'],
    },
  };
}

export default function Page({ params }: PageProps) {
  const tool = getToolById(params.tool);
  if (!tool) notFound();

  const toolUrl = `${APP_URL}/${tool.id}`;

  // Schema 1: WebApplication — tells Google this is a software tool
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.seoDescription,
    url: toolUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    softwareVersion: '1.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'CodeMash',
      url: APP_URL,
    },
    aggregateRating: undefined as undefined,
  };

  // Schema 2: FAQPage — enables FAQ rich snippets in SERPs
  const faqSchema =
    tool.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tool.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  // Schema 3: BreadcrumbList — improves navigation display in SERPs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: APP_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category.charAt(0).toUpperCase() + tool.category.slice(1) + 's',
        item: `${APP_URL}/#${tool.category}s`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.shortTitle,
        item: toolUrl,
      },
    ],
  };

  // Schema 4: HowTo — for converter/formatter tools, provides step-by-step rich snippet
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.shortTitle}`,
    description: tool.description,
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Paste your input',
        text: `Paste or type your ${tool.inputLanguage} data into the input panel on the left.`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Click Convert',
        text: 'Click the Convert (or Format) button to process your data instantly in your browser.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Copy the result',
        text: 'Copy the result from the output panel. You can also download it or adjust formatting options.',
      },
    ],
    totalTime: 'PT10S',
    tool: {
      '@type': 'HowToTool',
      name: 'CodeMash',
    },
  };

  // Combine all schemas
  const schemas = [webAppSchema, breadcrumbSchema, howToSchema, ...(faqSchema ? [faqSchema] : [])];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ToolPage toolId={params.tool} />
    </>
  );
}
