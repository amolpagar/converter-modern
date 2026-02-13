import type { Metadata } from 'next';
import { Mail, MessageSquare, Github } from 'lucide-react';
import { ContactForm } from '@/components/ui/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — DevToolBox',
  description:
    'Get in touch with the DevToolBox team. Report bugs, request new developer tools, suggest features, or ask questions.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Contact Us
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Have feedback, found a bug, or want to request a feature? We would love
          to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <a
          href="mailto:hello@devtoolbox.com"
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
        >
          <Mail className="w-8 h-8 text-brand-500 mb-3" />
          <span className="font-medium text-gray-900 dark:text-white">Email</span>
          <span className="text-sm text-gray-500 mt-1">hello@devtoolbox.com</span>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
        >
          <Github className="w-8 h-8 text-brand-500 mb-3" />
          <span className="font-medium text-gray-900 dark:text-white">GitHub</span>
          <span className="text-sm text-gray-500 mt-1">Report issues</span>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
        >
          <MessageSquare className="w-8 h-8 text-brand-500 mb-3" />
          <span className="font-medium text-gray-900 dark:text-white">Twitter</span>
          <span className="text-sm text-gray-500 mt-1">@devtoolbox</span>
        </a>
      </div>

      <ContactForm />
    </div>
  );
}
