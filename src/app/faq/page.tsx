import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions About CodeMash',
  description:
    'Frequently asked questions about CodeMash free online developer tools. Learn about privacy, supported formats (JSON, XML, YAML, CSV, SQL), features, and more.',
  alternates: {
    canonical: '/faq',
  },
};

const faqs = [
  {
    category: 'General',
    items: [
      {
        q: 'What is CodeMash?',
        a: 'CodeMash is a free suite of 25+ online developer tools including a JSON formatter, XML to JSON converter, Base64 encoder/decoder, JWT decoder, SQL formatter, CSV converter, hash generator, diff checker, and more. All tools run in your browser for maximum speed and privacy.',
      },
      {
        q: 'Do I need to create an account?',
        a: 'No. All tools work without sign-up, registration, or login. Just open any tool and start using it right away — completely free.',
      },
      {
        q: 'Is CodeMash really free?',
        a: 'Yes! All 25+ tools are completely free with no usage limits, no premium tiers, and no hidden fees. We sustain the site through non-intrusive advertising.',
      },
      {
        q: 'How is CodeMash different from other online tools?',
        a: 'CodeMash processes everything in your browser (client-side JavaScript). Unlike most alternatives, your data is never sent to any server. This means faster results, complete privacy, and no file size restrictions imposed by server upload limits.',
      },
    ],
  },
  {
    category: 'Privacy & Security',
    items: [
      {
        q: 'Is my data safe?',
        a: 'Absolutely. All tools (except Pug compilation) run entirely in your browser — your data never leaves your device. For Pug tools that require server-side processing, data is processed in memory and immediately discarded. We never store, log, or share your data.',
      },
      {
        q: 'Do you use cookies or tracking?',
        a: 'We use minimal analytics (Google Analytics) to understand which tools are popular. We do not use tracking cookies for advertising purposes. You can opt out at any time.',
      },
      {
        q: 'Is it safe to paste JWT tokens, API keys, or sensitive data?',
        a: 'Yes. JWT decoding, Base64 encoding, hashing, and all other processing happens entirely in your browser. Nothing is sent to our servers. That said, we always recommend caution with production secrets.',
      },
    ],
  },
  {
    category: 'Converters',
    items: [
      {
        q: 'What data formats can I convert between?',
        a: 'We support XML ↔ JSON, YAML ↔ JSON, JSON ↔ CSV, HTML ↔ Pug (Jade), HTML ↔ Markdown, JSON → ION, JSON → JSON Schema, JSON → TypeScript interfaces, JSON → Go structs, and Text → JSON. We are constantly adding new converters.',
      },
      {
        q: 'How do I convert JSON to CSV?',
        a: 'Open the JSON to CSV converter, paste your JSON array of objects, and click Convert. The tool automatically detects column headers from object keys and generates properly formatted CSV output that works in Excel and Google Sheets.',
      },
      {
        q: 'How do I generate TypeScript interfaces from JSON?',
        a: 'Use our JSON to TypeScript converter. Paste a sample JSON response (e.g., from an API) and the tool generates TypeScript interfaces with proper types, including nested objects and arrays.',
      },
      {
        q: 'Can I convert Kubernetes YAML to JSON?',
        a: 'Yes. Our YAML to JSON converter supports all YAML 1.2 features including anchors, aliases, and multi-document files. It handles complex Kubernetes, Docker Compose, and CI/CD configuration files.',
      },
    ],
  },
  {
    category: 'Formatters',
    items: [
      {
        q: 'What code languages can I format?',
        a: 'We support formatting for JSON, XML, HTML, CSS, JavaScript, and SQL. Each formatter offers customizable indentation (2 or 4 spaces) and both beautify and minify modes.',
      },
      {
        q: 'Does the JSON formatter also validate JSON?',
        a: 'Yes. Our JSON formatter simultaneously validates your JSON syntax. If your JSON is invalid, it provides clear error messages to help you fix issues. It works as both a JSON beautifier and JSON validator.',
      },
      {
        q: 'Which SQL dialects does the SQL formatter support?',
        a: 'Our SQL formatter supports standard SQL, MySQL, PostgreSQL, SQL Server, Oracle, MariaDB, and SQLite. It automatically uppercases keywords (SELECT, FROM, WHERE) for readability.',
      },
    ],
  },
  {
    category: 'Encoders, Decoders & Utilities',
    items: [
      {
        q: 'How do I decode Base64 online?',
        a: 'Open the Base64 tool, paste your Base64-encoded string, and click Decode. The tool instantly converts it to readable text. Encoding works the same way in reverse. Full UTF-8 and Unicode support.',
      },
      {
        q: 'What hash algorithms are supported?',
        a: 'Our hash generator computes SHA-256, SHA-1, and SHA-512 hashes simultaneously from any text input. It uses the Web Crypto API built into your browser for maximum security.',
      },
      {
        q: 'Can I convert hex to decimal or binary?',
        a: 'Yes. Our number base converter handles decimal, hexadecimal (hex), binary, and octal. Use prefixes: 0x for hex, 0b for binary, 0o for octal. Supports arbitrarily large numbers.',
      },
      {
        q: 'What is the maximum input size?',
        a: 'There is no hard limit since processing happens in your browser. Performance depends on your device, but most tools handle inputs of 1MB+ without issues.',
      },
      {
        q: 'Do you have keyboard shortcuts?',
        a: 'Yes! Press Ctrl+Enter (Cmd+Enter on Mac) to convert/format. The code editors support standard editing shortcuts like Ctrl+A, Ctrl+Z, Ctrl+C/V, and more.',
      },
    ],
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'Can I use these tools offline?',
        a: 'Client-side tools work after the initial page load, even with a spotty connection. Full offline support via PWA is on our roadmap.',
      },
      {
        q: 'Do you offer an API?',
        a: 'We are working on public API access. Contact us if you are interested in integrating CodeMash tools into your workflow.',
      },
      {
        q: 'Can I embed these tools in my website?',
        a: 'We are working on embeddable widgets. Contact us if you are interested in early access.',
      },
    ],
  },
];

export default function FaqPage() {
  // JSON-LD structured data for FAQ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap((cat) =>
      cat.items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }))
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Everything you need to know about CodeMash.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, idx) => (
                  <details
                    key={idx}
                    className="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                      {item.q}
                      <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
                    </summary>
                    <p className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Still have questions?
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We are here to help. Reach out and we will get back to you as soon
            as possible.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center mt-4 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700 rounded-lg hover:from-brand-600 hover:to-brand-800 transition-all shadow-md"
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  );
}
