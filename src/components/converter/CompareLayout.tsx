'use client';

import { useState, useCallback, useMemo } from 'react';
import { GitCompare, Trash2, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import * as Diff from 'diff';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { AdBanner } from '@/components/ads/AdBanner';
import { cn } from '@/lib/utils';
import type { ToolConfig } from '@/lib/tools';

interface CompareLayoutProps {
  tool: ToolConfig;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  lineNum: number;
}

export function CompareLayout({ tool }: CompareLayoutProps) {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const diffResult = useMemo(() => {
    if (!showDiff || (!left.trim() && !right.trim())) return null;

    const changes = Diff.diffLines(left, right);
    const lines: DiffLine[] = [];
    let lineNum = 1;

    for (const change of changes) {
      const valueLines = change.value.split('\n');
      // Remove trailing empty string from split
      if (valueLines[valueLines.length - 1] === '') valueLines.pop();

      for (const line of valueLines) {
        lines.push({
          type: change.added ? 'added' : change.removed ? 'removed' : 'unchanged',
          value: line,
          lineNum: lineNum++,
        });
      }
    }

    return lines;
  }, [left, right, showDiff]);

  const stats = useMemo(() => {
    if (!diffResult) return null;
    const added = diffResult.filter((l) => l.type === 'added').length;
    const removed = diffResult.filter((l) => l.type === 'removed').length;
    const unchanged = diffResult.filter((l) => l.type === 'unchanged').length;
    return { added, removed, unchanged };
  }, [diffResult]);

  const handleCompare = useCallback(() => {
    if (!left.trim() && !right.trim()) {
      toast.warning('Please enter text in both panels.');
      return;
    }
    setShowDiff(true);
    toast.success('Comparison complete!');
  }, [left, right]);

  const handleClear = useCallback(() => {
    setLeft('');
    setRight('');
    setShowDiff(false);
  }, []);

  const handleSwap = useCallback(() => {
    const temp = left;
    setLeft(right);
    setRight(temp);
    setShowDiff(false);
  }, [left, right]);

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

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={handleCompare}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-700 rounded-lg hover:from-brand-600 hover:to-brand-800 transition-all shadow-md"
        >
          <GitCompare className="w-4 h-4" />
          Compare
        </button>

        <button
          onClick={handleSwap}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Swap
        </button>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>

        {stats && (
          <div className="ml-auto flex items-center gap-3 text-xs font-medium">
            <span className="text-green-600 dark:text-green-400">
              +{stats.added} added
            </span>
            <span className="text-red-600 dark:text-red-400">
              -{stats.removed} removed
            </span>
            <span className="text-gray-500">{stats.unchanged} unchanged</span>
          </div>
        )}
      </div>

      {/* Editors side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Original
          </label>
          <CodeEditor
            value={left}
            onChange={(val) => { setLeft(val); setShowDiff(false); }}
            language="text"
            placeholder={tool.inputPlaceholder}
            height="350px"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Modified
          </label>
          <CodeEditor
            value={right}
            onChange={(val) => { setRight(val); setShowDiff(false); }}
            language="text"
            placeholder={tool.outputPlaceholder}
            height="350px"
          />
        </div>
      </div>

      {/* Diff result */}
      {diffResult && diffResult.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Differences
          </h2>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <pre className="text-sm font-mono">
                {diffResult.map((line, i) => (
                  <div
                    key={i}
                    className={cn(
                      'px-4 py-0.5 border-l-4',
                      line.type === 'added' &&
                        'bg-green-50 dark:bg-green-950/30 border-green-500 text-green-800 dark:text-green-300',
                      line.type === 'removed' &&
                        'bg-red-50 dark:bg-red-950/30 border-red-500 text-red-800 dark:text-red-300',
                      line.type === 'unchanged' &&
                        'bg-white dark:bg-gray-900 border-transparent text-gray-600 dark:text-gray-400'
                    )}
                  >
                    <span className="inline-block w-8 text-right mr-3 text-gray-400 select-none text-xs">
                      {line.lineNum}
                    </span>
                    <span className="inline-block w-4 mr-1 text-center font-bold select-none">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    {line.value || ' '}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Ad */}
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
                <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg">
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
    </div>
  );
}
