import Link from 'next/link';
import {
  ArrowRight,
  Zap,
  Shield,
  Infinity,
  MonitorSmartphone,
  FileJson,
  FileCode,
  FileText,
  Code,
  FileCode2,
  Braces,
  Atom,
  TextCursorInput,
  Globe,
  Paintbrush,
  Terminal,
  Lock,
  KeyRound,
  GitCompare,
  FileSpreadsheet,
  FileType,
  Heading,
  Database,
  Link as LinkIcon,
  Fingerprint,
  Binary,
} from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';
import { getToolsByCategory, type ToolConfig } from '@/lib/tools';

// Lucide icon map
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileJson,
  FileCode,
  FileText,
  Code,
  FileCode2,
  Braces,
  Atom,
  TextCursorInput,
  Globe,
  Paintbrush,
  Terminal,
  Lock,
  KeyRound,
  GitCompare,
  FileSpreadsheet,
  FileType,
  Heading,
  Database,
  Link: LinkIcon,
  Fingerprint,
  Binary,
};

function ToolCard({ tool }: { tool: ToolConfig }) {
  const Icon = ICON_MAP[tool.icon] || FileJson;

  return (
    <Link
      href={`/${tool.id}`}
      className="tool-card group block p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all"
    >
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${tool.gradient} mb-3`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {tool.shortTitle}
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
        {tool.description}
      </p>
      <div className="mt-3 flex items-center text-xs font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Use tool <ArrowRight className="w-3 h-3 ml-1" />
      </div>
    </Link>
  );
}

function ToolSection({
  title,
  tools,
}: {
  title: string;
  tools: ToolConfig[];
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const converters = getToolsByCategory('converter');
  const formatters = getToolsByCategory('formatter');
  const decoders = getToolsByCategory('decoder');
  const utilities = getToolsByCategory('utility');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devtoolbox.com';

  // Schema 1: Organization — establishes brand entity
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DevToolBox',
    url: appUrl,
    logo: `${appUrl}/icon-512.png`,
    description:
      'Free online developer tools — JSON formatter, XML converter, Base64 decoder, JWT decoder, SQL formatter, and 25+ more tools.',
    sameAs: [] as string[],
  };

  // Schema 2: WebSite — enables sitelinks search box in SERPs
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevToolBox',
    url: appUrl,
    description:
      'Free, fast, privacy-first developer tools. JSON formatter, XML to JSON converter, Base64 decoder, JWT decoder, SQL formatter, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${appUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Schema 3: ItemList — shows all tools for potential carousel snippet
  const allTools = [...converters, ...formatters, ...decoders, ...utilities];
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Developer Tools',
    description: 'Complete list of free online developer tools',
    numberOfItems: allTools.length,
    itemListElement: allTools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.shortTitle,
      url: `${appUrl}/${tool.id}`,
    })),
  };

  // Schema 4: BreadcrumbList for homepage
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: appUrl,
      },
    ],
  };

  const schemas = [organizationSchema, websiteSchema, itemListSchema, breadcrumbSchema];

  return (
    <>
      {/* Structured Data */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-950 dark:to-brand-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.1),transparent_60%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/30 rounded-full border border-brand-200 dark:border-brand-800">
              <Zap className="w-3 h-3" />
              Lightning fast &bull; 100% private &bull; Free forever
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight text-balance">
              Free Online
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600 animate-gradient">
                Developer Tools
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto text-balance">
              JSON formatter, XML/YAML/CSV converters, Base64 &amp; JWT decoder,
              SQL formatter, and 25+ more. Lightning-fast, privacy-first — everything
              runs in your browser.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/xml-to-json"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700 rounded-xl hover:from-brand-600 hover:to-brand-800 transition-all shadow-lg hover:shadow-xl"
              >
                Start Converting <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <AdBanner format="horizontal" />
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToolSection title="Converters" tools={converters} />
        <ToolSection title="Formatters" tools={formatters} />
        <ToolSection title="Decoders & Encoders" tools={decoders} />
        <ToolSection title="Utilities" tools={utilities} />
      </div>

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <AdBanner format="horizontal" />
      </div>

      {/* Features / Why section */}
      <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Developers Love DevToolBox
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Built by developers, for developers. Every tool is designed to
              save you time while keeping your data safe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Privacy First"
              description="Your data never leaves your browser. No tracking, no storage, no cookies."
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Fast"
              description="Client-side processing means instant results. No server round-trips needed."
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={<Infinity className="w-6 h-6" />}
              title="Free Forever"
              description="All tools are completely free with no usage limits. No sign-up required."
              gradient="from-blue-500 to-indigo-500"
            />
            <FeatureCard
              icon={<MonitorSmartphone className="w-6 h-6" />}
              title="Works Everywhere"
              description="Responsive design works on desktop, tablet, and mobile. No app required."
              gradient="from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* SEO content — keyword-rich copy targeting high-volume search queries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose dark:prose-invert max-w-3xl mx-auto">
          <h2>Free Online Developer Tools — JSON Formatter, Converters & More</h2>
          <p>
            DevToolBox is your all-in-one suite of <strong>free online developer tools</strong>.
            Whether you need a <Link href="/format-json">JSON formatter</Link> to beautify minified JSON,
            an <Link href="/xml-to-json">XML to JSON converter</Link> to transform data, or a{' '}
            <Link href="/jwt-decoder">JWT decoder</Link> to inspect token claims — our 25+ tools handle it
            all instantly in your browser with zero setup, no sign-up, and complete privacy.
          </p>

          <h3>Convert Between Data Formats</h3>
          <p>
            Seamlessly convert between popular data formats:{' '}
            <Link href="/xml-to-json">XML to JSON</Link>,{' '}
            <Link href="/json-to-xml">JSON to XML</Link>,{' '}
            <Link href="/yaml-to-json">YAML to JSON</Link>,{' '}
            <Link href="/json-to-yaml">JSON to YAML</Link>,{' '}
            <Link href="/json-to-csv">JSON to CSV</Link>,{' '}
            <Link href="/csv-to-json">CSV to JSON</Link>, and more. Generate{' '}
            <Link href="/json-to-typescript">TypeScript interfaces from JSON</Link>,{' '}
            <Link href="/json-to-go">Go structs from JSON</Link>, or{' '}
            <Link href="/json-to-schema">JSON Schema from sample data</Link> to validate
            your APIs. Convert between <Link href="/markdown-to-html">Markdown and HTML</Link>{' '}
            for documentation, and <Link href="/html-to-pug">HTML to Pug (Jade)</Link> for
            Node.js template engines.
          </p>

          <h3>Format & Beautify Code Online</h3>
          <p>
            Clean up minified or messy code with our formatting tools:{' '}
            <Link href="/format-json">JSON formatter & validator</Link>,{' '}
            <Link href="/format-xml">XML formatter</Link>,{' '}
            <Link href="/format-html">HTML beautifier</Link>,{' '}
            <Link href="/format-css">CSS formatter</Link>,{' '}
            <Link href="/format-javascript">JavaScript beautifier</Link>, and{' '}
            <Link href="/format-sql">SQL formatter</Link>. Customize indentation (2 or 4 spaces),
            toggle between pretty-print and minified output, and get perfectly formatted code every time.
            Our SQL formatter supports MySQL, PostgreSQL, and standard SQL with automatic keyword uppercasing.
          </p>

          <h3>Encode, Decode & Hash</h3>
          <p>
            <Link href="/base64">Base64 encode and decode</Link> strings with full Unicode support.{' '}
            <Link href="/jwt-decoder">Decode JWT tokens</Link> to inspect headers, payloads, and
            claims — a privacy-first alternative to jwt.io.{' '}
            <Link href="/url-encode-decode">URL encode and decode</Link> text for safe query parameters.{' '}
            <Link href="/html-entity-encode-decode">Encode and decode HTML entities</Link> to prevent XSS.{' '}
            Generate <Link href="/hash-generator">SHA-256, SHA-1, and SHA-512 hashes</Link> using the
            Web Crypto API. Convert between{' '}
            <Link href="/number-base-converter">hex, decimal, binary, and octal</Link> number systems.
          </p>

          <h3>Compare Text & Code</h3>
          <p>
            Use our <Link href="/compare">diff checker</Link> to compare two text files or code
            snippets side by side with highlighted additions, deletions, and changes. Perfect for
            code reviews, debugging, and tracking configuration changes.
          </p>

          <h3>100% Private — Your Data Never Leaves Your Browser</h3>
          <p>
            Every tool on DevToolBox runs entirely in your browser using client-side JavaScript.
            Your data is never sent to any server, never logged, and never stored. This makes
            DevToolBox the safest choice for handling sensitive data like API keys, JWT tokens,
            configuration files, and proprietary code. No cookies, no tracking, no accounts —
            just fast, private developer tools that work.
          </p>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} mb-4`}
      >
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
