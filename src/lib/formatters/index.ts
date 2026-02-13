import { js_beautify, html_beautify, css_beautify } from 'js-beautify';
import { format as sqlFormat } from 'sql-formatter';
import { safeJsonParse } from '@/lib/utils';

export interface FormatOptions {
  indent: number;
  minify?: boolean;
}

// ─── JSON Formatter ─────────────────────────────────────────

export function formatJson(input: string, options: FormatOptions): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);

  if (options.minify) {
    return JSON.stringify(parsed);
  }

  return JSON.stringify(parsed, null, options.indent);
}

// ─── XML Formatter ──────────────────────────────────────────

export function formatXml(input: string, options: FormatOptions): string {
  if (!input.trim()) throw new Error('Input is empty');

  if (options.minify) {
    return input
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .replace(/>\s+/g, '>')
      .replace(/\s+</g, '<')
      .trim();
  }

  const indentStr = ' '.repeat(options.indent);
  let formatted = '';
  let indentLevel = 0;

  // Remove existing whitespace between tags
  const xml = input.replace(/(>)\s*(<)/g, '$1\n$2').trim();
  const lines = xml.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Closing tag
    if (line.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    formatted += indentStr.repeat(indentLevel) + line + '\n';

    // Opening tag (not self-closing, not closing, not declaration, not comment)
    if (
      line.startsWith('<') &&
      !line.startsWith('</') &&
      !line.startsWith('<?') &&
      !line.startsWith('<!') &&
      !line.endsWith('/>') &&
      !line.includes('</') // inline close like <tag>value</tag>
    ) {
      indentLevel++;
    }
  }

  return formatted.trimEnd();
}

// ─── HTML Formatter ─────────────────────────────────────────

export function formatHtml(input: string, options: FormatOptions): string {
  if (!input.trim()) throw new Error('Input is empty');

  if (options.minify) {
    return input
      .replace(/\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  return html_beautify(input, {
    indent_size: options.indent,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    indent_inner_html: true,
    wrap_line_length: 120,
    end_with_newline: true,
  });
}

// ─── CSS Formatter ──────────────────────────────────────────

export function formatCss(input: string, options: FormatOptions): string {
  if (!input.trim()) throw new Error('Input is empty');

  if (options.minify) {
    return input
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*,\s*/g, ',')
      .trim();
  }

  return css_beautify(input, {
    indent_size: options.indent,
    indent_char: ' ',
    end_with_newline: true,
    newline_between_rules: true,
  });
}

// ─── JavaScript Formatter ───────────────────────────────────

export function formatJavascript(input: string, options: FormatOptions): string {
  if (!input.trim()) throw new Error('Input is empty');

  if (options.minify) {
    // Basic minification — removes comments and extra whitespace.
    // For production minification use terser instead.
    return input
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  return js_beautify(input, {
    indent_size: options.indent,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    space_after_anon_function: true,
    brace_style: 'collapse',
    end_with_newline: true,
    wrap_line_length: 120,
  });
}

// ─── SQL Formatter ──────────────────────────────────────────

export function formatSql(input: string, options: FormatOptions): string {
  if (!input.trim()) throw new Error('Input is empty');

  if (options.minify) {
    // Basic SQL minification: collapse whitespace, remove comments
    return input
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return sqlFormat(input, {
    tabWidth: options.indent,
    useTabs: false,
    keywordCase: 'upper',
    linesBetweenQueries: 2,
  });
}
