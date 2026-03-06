'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Trash2,
  Play,
  Minimize2,
  ChevronDown,
  Loader2,
  Check,
  AlertCircle,
  Keyboard,
} from 'lucide-react';
import { toast } from 'sonner';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { AdBanner } from '@/components/ads/AdBanner';
import { cn, copyToClipboard } from '@/lib/utils';
import type { ToolConfig } from '@/lib/tools';

// ─── Client-side converters ────────────────────────────────
import {
  xmlToJson,
  jsonToXml,
  yamlToJson,
  jsonToYaml,
  jsonToJsonSchema,
  jsonToIon,
  jsonToM3u,
  textToJson,
  base64Encode,
  base64Decode,
  jwtDecode,
  jsonToCsv,
  csvToJson,
  jsonToTypescript,
  jsonToGo,
  markdownToHtml,
  htmlToMarkdown,
  generateHash,
  numberBaseConvert,
} from '@/lib/converters';
import {
  formatJson,
  formatXml,
  formatHtml,
  formatCss,
  formatJavascript,
  formatSql,
} from '@/lib/formatters';

type ConverterFunction = (input: string, indent?: number) => string | Promise<string>;

const CLIENT_CONVERTERS: Record<string, ConverterFunction> = {
  'xml-to-json': xmlToJson,
  'json-to-xml': jsonToXml,
  'yaml-to-json': yamlToJson,
  'json-to-yaml': jsonToYaml,
  'json-to-schema': jsonToJsonSchema,
  'json-to-ion': jsonToIon,
  'json-to-m3u': jsonToM3u,
  'text-to-json': textToJson,
  'jwt-decoder': jwtDecode,
  'json-to-csv': jsonToCsv,
  'csv-to-json': csvToJson,
  'json-to-typescript': jsonToTypescript,
  'json-to-go': jsonToGo,
  'markdown-to-html': markdownToHtml,
  'html-to-markdown': htmlToMarkdown,
  'hash-generator': generateHash,
  'number-base-converter': numberBaseConvert,
};

const CLIENT_FORMATTERS: Record<
  string,
  (input: string, opts: { indent: number; minify?: boolean }) => string
> = {
  'format-json': formatJson,
  'format-xml': formatXml,
  'format-html': formatHtml,
  'format-css': formatCss,
  'format-javascript': formatJavascript,
  'format-sql': formatSql,
};

interface ConverterLayoutProps {
  tool: ToolConfig;
}

export function ConverterLayout({ tool }: ConverterLayoutProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showIndentMenu, setShowIndentMenu] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd + Enter to convert
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleConvert();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, indent]);

  const handleConvert = useCallback(async () => {
    if (!input.trim()) {
      toast.warning('Please enter some input first.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      let result: string;

      if (tool.layout === 'formatter') {
        // Formatter mode
        const fn = CLIENT_FORMATTERS[tool.id];
        if (fn) {
          result = fn(input, { indent });
        } else {
          throw new Error('Formatter not found');
        }
      } else if (tool.serverSide && tool.apiEndpoint) {
        // Server-side conversion via API
        const response = await fetch(tool.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, indent }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: 'Conversion failed' }));
          throw new Error(err.error || `Server error (${response.status})`);
        }

        const data = await response.json();
        result = data.output;
      } else {
        // Client-side conversion
        const fn = CLIENT_CONVERTERS[tool.id];
        if (fn) {
          result = await fn(input, indent);
        } else {
          throw new Error('Converter not found');
        }
      }

      setOutput(result);
      toast.success('Converted successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Conversion failed';
      setErrorMsg(message);
      setOutput('');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [input, indent, tool]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) {
      toast.warning('Please enter some input first.');
      return;
    }
    setErrorMsg('');

    try {
      const fn = CLIENT_FORMATTERS[tool.id];
      if (fn) {
        const result = fn(input, { indent: 0, minify: true });
        setOutput(result);
        toast.success('Minified successfully!');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Minification failed';
      setErrorMsg(message);
      toast.error(message);
    }
  }, [input, tool.id]);

  const handleCopy = useCallback(async () => {
    if (!output) {
      toast.warning('Nothing to copy.');
      return;
    }
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy.');
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setErrorMsg('');
  }, []);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput('');
    setErrorMsg('');
  }, [output]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Tool Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {tool.title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {tool.description}
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Convert button */}
        <button
          onClick={handleConvert}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700 rounded-lg hover:from-brand-600 hover:to-brand-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {tool.layout === 'formatter' ? 'Format' : 'Convert'}
        </button>

        {/* Minify button */}
        {tool.showMinify && (
          <button
            onClick={handleMinify}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
            Minify
          </button>
        )}

        {/* Swap button for bidirectional tools */}
        {tool.bidirectional && (
          <button
            onClick={handleSwap}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Swap
          </button>
        )}

        {/* Indent selector */}
        {tool.showIndent !== false && (
          <div className="relative">
            <button
              onClick={() => setShowIndentMenu(!showIndentMenu)}
              className="inline-flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Indent: {indent}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showIndentMenu && (
              <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 animate-fade-in">
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setIndent(n);
                      setShowIndentMenu(false);
                    }}
                    className={cn(
                      'block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                      indent === n
                        ? 'text-brand-600 dark:text-brand-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                  >
                    {n} spaces
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Clear button */}
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>

        {/* Keyboard shortcut hint */}
        <div className="hidden sm:flex items-center gap-1 ml-auto text-xs text-gray-400">
          <Keyboard className="w-3 h-3" />
          <span>Ctrl+Enter to convert</span>
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 animate-fade-in">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Input
              {tool.inputLanguage !== 'text' && (
                <span className="ml-2 text-xs font-normal text-gray-400 uppercase">
                  {tool.inputLanguage}
                </span>
              )}
            </label>
            <span className="text-xs text-gray-400">
              {input.length > 0 && `${input.length.toLocaleString()} chars`}
            </span>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language={tool.inputLanguage}
            placeholder={tool.inputPlaceholder}
            height="400px"
          />
        </div>

        {/* Output Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output
              {tool.outputLanguage !== 'text' && (
                <span className="ml-2 text-xs font-normal text-gray-400 uppercase">
                  {tool.outputLanguage}
                </span>
              )}
            </label>
            <span className="text-xs text-gray-400">
              {output.length > 0 && `${output.length.toLocaleString()} chars`}
            </span>
          </div>
          <CodeEditor
            value={output}
            language={tool.outputLanguage}
            readOnly
            placeholder={tool.outputPlaceholder}
            height="400px"
          />
        </div>
      </div>

      {/* Ad Banner */}
      <div className="my-8">
        <AdBanner format="horizontal" />
      </div>

      {/* SEO Content / FAQs */}
      {tool.faqs.length > 0 && (
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  {faq.question}
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-sm text-green-700 dark:text-green-400">
          <strong>Privacy First:</strong>{' '}
          {tool.serverSide
            ? 'Your data is processed securely on our servers and is never stored or logged.'
            : 'All processing happens directly in your browser. Your data never leaves your device.'}
        </p>
      </div>
    </div>
  );
}
