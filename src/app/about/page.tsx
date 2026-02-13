import type { Metadata } from 'next';
import { Shield, Zap, Globe, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About DevToolBox — Free Online Developer Tools',
  description:
    'Learn about DevToolBox — the free, fast, and privacy-first developer tools suite with 25+ tools including JSON formatter, XML converter, Base64 decoder, and more. Built by developers, for developers.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          About DevToolBox
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We build free, fast, and private developer tools that help
          you work smarter. No sign-ups, no tracking, no data storage.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <ValueCard
          icon={<Shield className="w-6 h-6" />}
          title="Privacy First"
          description="Most tools run entirely in your browser. Your data never touches our servers. For server-side tools, data is processed and immediately discarded."
        />
        <ValueCard
          icon={<Zap className="w-6 h-6" />}
          title="Performance"
          description="Client-side processing means instant results. No waiting for server responses. Our tools are optimized for speed, even with large inputs."
        />
        <ValueCard
          icon={<Globe className="w-6 h-6" />}
          title="Accessible"
          description="No installation, no sign-up, no paywall for essential features. Works on any device with a modern browser."
        />
        <ValueCard
          icon={<Heart className="w-6 h-6" />}
          title="Developer-First"
          description="Built by developers who use these tools daily. Keyboard shortcuts, clean UI, and thoughtful UX for maximum productivity."
        />
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Our Story</h2>
        <p>
          DevToolBox started as a simple collection of data conversion tools
          built to solve everyday developer problems. What began as an internal
          tool quickly grew into a comprehensive suite used by thousands of
          developers worldwide.
        </p>
        <p>
          We believe that essential developer tools should be free, fast, and
          respect your privacy. That is why we built DevToolBox to process
          everything client-side whenever possible, ensuring your data never
          leaves your browser.
        </p>

        <h2>Technology</h2>
        <p>
          DevToolBox is built with modern web technologies for the best possible
          experience:
        </p>
        <ul>
          <li><strong>Next.js</strong> — React framework for production-grade performance</li>
          <li><strong>TypeScript</strong> — Type-safe code for reliability</li>
          <li><strong>Tailwind CSS</strong> — Responsive, accessible design</li>
          <li><strong>CodeMirror 6</strong> — Professional code editor with syntax highlighting</li>
          <li><strong>Vercel</strong> — Global edge deployment for low latency</li>
        </ul>

        <h2>Open Source Libraries</h2>
        <p>
          We proudly use and contribute to open source. Our conversion tools are
          powered by well-tested libraries including fast-xml-parser, js-yaml,
          js-beautify, Pug, and more.
        </p>
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
      <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
