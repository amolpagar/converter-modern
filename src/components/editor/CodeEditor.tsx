'use client';

import { useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-gray-100 dark:bg-gray-900 animate-pulse rounded-lg" />
  ),
});

// Language imports — loaded dynamically with the editor
import { json } from '@codemirror/lang-json';
import { xml } from '@codemirror/lang-xml';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { yaml } from '@codemirror/lang-yaml';

const LANGUAGE_MAP: Record<string, () => ReturnType<typeof json>> = {
  json: () => json(),
  xml: () => xml(),
  html: () => html(),
  css: () => css(),
  javascript: () => javascript(),
  yaml: () => yaml(),
  text: () => json(), // fallback
};

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder = '',
  height = '100%',
  className = '',
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  const extensions = useMemo(() => {
    const langFn = LANGUAGE_MAP[language] || LANGUAGE_MAP.text;
    return [langFn()];
  }, [language]);

  const handleChange = useCallback(
    (val: string) => {
      if (onChange) onChange(val);
    },
    [onChange]
  );

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <CodeMirror
        value={value}
        onChange={handleChange}
        extensions={extensions}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        readOnly={readOnly}
        placeholder={placeholder}
        height={height}
        minHeight="300px"
        maxHeight="70vh"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: !readOnly,
          foldGutter: true,
          bracketMatching: true,
          autocompletion: false,
          indentOnInput: true,
        }}
        style={{
          fontSize: '14px',
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
        }}
      />
    </div>
  );
}
