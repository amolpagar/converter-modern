import { describe, it, expect } from 'vitest';
import {
  formatJson,
  formatXml,
  formatHtml,
  formatCss,
  formatJavascript,
  formatSql,
} from '@/lib/formatters';

// ─────────────────────────────────────────────────────────────
// JSON Formatter
// ─────────────────────────────────────────────────────────────

describe('formatJson', () => {
  it('formats minified JSON with indentation', () => {
    const input = '{"name":"John","age":30}';
    const result = formatJson(input, { indent: 2 });
    expect(result).toBe('{\n  "name": "John",\n  "age": 30\n}');
  });

  it('respects custom indent size', () => {
    const input = '{"a":1}';
    const result = formatJson(input, { indent: 4 });
    expect(result).toContain('    "a"');
  });

  it('minifies JSON', () => {
    const input = '{\n  "name": "John",\n  "age": 30\n}';
    const result = formatJson(input, { indent: 2, minify: true });
    expect(result).toBe('{"name":"John","age":30}');
  });

  it('handles arrays', () => {
    const input = '[1,2,3]';
    const result = formatJson(input, { indent: 2 });
    expect(result).toContain('[\n');
    expect(result).toContain('  1');
  });

  it('handles nested objects', () => {
    const input = '{"a":{"b":{"c":1}}}';
    const result = formatJson(input, { indent: 2 });
    const parsed = JSON.parse(result);
    expect(parsed.a.b.c).toBe(1);
  });

  it('handles JSON with escaped newlines in strings (safeJsonParse)', () => {
    const input = '{"text":"line1\\nline2"}';
    const result = formatJson(input, { indent: 2 });
    const parsed = JSON.parse(result);
    expect(parsed.text).toBe('line1\nline2');
  });

  it('throws on empty input', () => {
    expect(() => formatJson('', { indent: 2 })).toThrow('Input is empty');
  });

  it('throws on invalid JSON', () => {
    expect(() => formatJson('{bad}', { indent: 2 })).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────
// XML Formatter
// ─────────────────────────────────────────────────────────────

describe('formatXml', () => {
  it('formats minified XML with indentation', () => {
    const input = '<root><child>value</child></root>';
    const result = formatXml(input, { indent: 2 });
    expect(result).toContain('  <child>value</child>');
  });

  it('minifies XML', () => {
    const input = '<root>\n  <child>value</child>\n</root>';
    const result = formatXml(input, { indent: 2, minify: true });
    expect(result).not.toContain('\n');
  });

  it('handles self-closing tags', () => {
    const input = '<root><br/><hr/></root>';
    const result = formatXml(input, { indent: 2 });
    expect(result).toContain('<br/>');
  });

  it('throws on empty input', () => {
    expect(() => formatXml('', { indent: 2 })).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// HTML Formatter
// ─────────────────────────────────────────────────────────────

describe('formatHtml', () => {
  it('formats minified HTML', () => {
    const input = '<html><head><title>Test</title></head><body><p>Hello</p></body></html>';
    const result = formatHtml(input, { indent: 2 });
    expect(result).toContain('\n');
    expect(result).toContain('<title>Test</title>');
  });

  it('minifies HTML', () => {
    const input = '<div>\n  <p>Hello</p>\n</div>';
    const result = formatHtml(input, { indent: 2, minify: true });
    expect(result).not.toContain('\n');
  });

  it('throws on empty input', () => {
    expect(() => formatHtml('', { indent: 2 })).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// CSS Formatter
// ─────────────────────────────────────────────────────────────

describe('formatCss', () => {
  it('formats minified CSS', () => {
    const input = 'body{margin:0;padding:0}.container{max-width:1200px}';
    const result = formatCss(input, { indent: 2 });
    expect(result).toContain('\n');
    expect(result).toContain('margin: 0');
  });

  it('minifies CSS', () => {
    const input = 'body {\n  margin: 0;\n  padding: 0;\n}';
    const result = formatCss(input, { indent: 2, minify: true });
    expect(result).not.toContain('\n');
    expect(result).toContain('margin');
  });

  it('throws on empty input', () => {
    expect(() => formatCss('', { indent: 2 })).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// JavaScript Formatter
// ─────────────────────────────────────────────────────────────

describe('formatJavascript', () => {
  it('formats minified JavaScript', () => {
    const input = 'function hello(){console.log("hi")}';
    const result = formatJavascript(input, { indent: 2 });
    expect(result).toContain('\n');
    expect(result).toContain('console.log');
  });

  it('minifies JavaScript', () => {
    const input = 'function hello() {\n  console.log("hi");\n}';
    const result = formatJavascript(input, { indent: 2, minify: true });
    expect(result).not.toContain('\n');
  });

  it('throws on empty input', () => {
    expect(() => formatJavascript('', { indent: 2 })).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// SQL Formatter
// ─────────────────────────────────────────────────────────────

describe('formatSql', () => {
  it('formats a simple SELECT query', () => {
    const input = 'select id, name from users where active = true order by name';
    const result = formatSql(input, { indent: 2 });
    expect(result).toContain('SELECT');
    expect(result).toContain('FROM');
    expect(result).toContain('WHERE');
    expect(result).toContain('ORDER BY');
  });

  it('uppercases SQL keywords', () => {
    const input = 'select * from users inner join orders on users.id = orders.user_id';
    const result = formatSql(input, { indent: 2 });
    expect(result).toContain('SELECT');
    expect(result).toContain('INNER JOIN');
  });

  it('formats complex queries with subqueries', () => {
    const input = 'select * from (select id from users where active = true) as t where t.id > 10';
    const result = formatSql(input, { indent: 2 });
    expect(result).toContain('SELECT');
    expect(result).toContain('\n');
  });

  it('minifies SQL', () => {
    const input = 'SELECT\n  id,\n  name\nFROM\n  users';
    const result = formatSql(input, { indent: 2, minify: true });
    expect(result).not.toContain('\n');
    expect(result).toContain('SELECT');
  });

  it('strips comments when minifying', () => {
    const input = '-- get users\nSELECT * FROM users /* active only */ WHERE active = true';
    const result = formatSql(input, { indent: 2, minify: true });
    expect(result).not.toContain('--');
    expect(result).not.toContain('/*');
    expect(result).toContain('SELECT');
  });

  it('throws on empty input', () => {
    expect(() => formatSql('', { indent: 2 })).toThrow('Input is empty');
  });
});
