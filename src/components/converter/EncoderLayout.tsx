'use client';

import { useState, useCallback } from 'react';
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  Check,
  ArrowRightLeft,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { AdBanner } from '@/components/ads/AdBanner';
import { copyToClipboard } from '@/lib/utils';
import {
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEntityEncode,
  htmlEntityDecode,
} from '@/lib/converters';
import type { ToolConfig } from '@/lib/tools';

type EncoderPair = {
  encode: (input: string) => string;
  decode: (input: string) => string;
  encodeLabel?: string;
  decodeLabel?: string;
  encodedName?: string;
  decodedName?: string;
};

const ENCODERS: Record<string, EncoderPair> = {
  base64: {
    encode: base64Encode,
    decode: base64Decode,
    encodedName: 'Base64 Output',
    decodedName: 'Decoded Text',
  },
  'url-encode-decode': {
    encode: urlEncode,
    decode: urlDecode,
    encodeLabel: 'Encode',
    decodeLabel: 'Decode',
    encodedName: 'URL-Encoded Output',
    decodedName: 'Decoded Text',
  },
  'html-entity-encode-decode': {
    encode: htmlEntityEncode,
    decode: htmlEntityDecode,
    encodeLabel: 'Encode',
    decodeLabel: 'Decode',
    encodedName: 'Encoded Entities',
    decodedName: 'Decoded Text',
  },
};

interface EncoderLayoutProps {
  tool: ToolConfig;
}

export function EncoderLayout({ tool }: EncoderLayoutProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const encoder = ENCODERS[tool.id] || ENCODERS.base64;

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      toast.warning('Please enter some input first.');
      return;
    }
    setErrorMsg('');

    try {
      const result =
        mode === 'encode' ? encoder.encode(input) : encoder.decode(input);
      setOutput(result);
      toast.success(mode === 'encode' ? 'Encoded!' : 'Decoded!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      setErrorMsg(message);
      setOutput('');
      toast.error(message);
    }
  }, [input, mode, encoder]);

  const handleCopy = useCallback(async () => {
    if (!output) {
      toast.warning('Nothing to copy.');
      return;
    }
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 2000);
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
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setErrorMsg('');
  }, [output, mode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {tool.title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {tool.description}
        </p>
      </div>

      {/* Mode toggle + controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Mode toggle */}
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === 'encode'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Lock className="w-4 h-4 inline mr-1.5" />
            Encode
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              mode === 'decode'
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Unlock className="w-4 h-4 inline mr-1.5" />
            Decode
          </button>
        </div>

        <button
          onClick={handleConvert}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700 rounded-lg hover:from-brand-600 hover:to-brand-800 transition-all shadow-md"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>

        <button
          onClick={handleSwap}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Swap
        </button>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 animate-fade-in">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'encode' ? 'Plain Text' : (encoder.encodedName || 'Encoded String')}
          </label>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="text"
            placeholder={
              mode === 'encode'
                ? tool.inputPlaceholder || 'Enter text to encode...'
                : tool.outputPlaceholder || 'Paste encoded string to decode...'
            }
            height="400px"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'encode' ? (encoder.encodedName || 'Encoded Output') : (encoder.decodedName || 'Decoded Text')}
          </label>
          <CodeEditor
            value={output}
            language="text"
            readOnly
            placeholder="Result will appear here..."
            height="400px"
          />
        </div>
      </div>

      {/* Ad Banner */}
      <div className="my-8">
        <AdBanner format="horizontal" />
      </div>

      {/* FAQs */}
      {tool.faqs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                  {faq.question}
                </summary>
                <p className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Privacy */}
      <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-sm text-green-700 dark:text-green-400">
          <strong>Privacy First:</strong> All encoding/decoding happens in your browser.
          Your data never leaves your device.
        </p>
      </div>
    </div>
  );
}
