import { describe, it, expect } from 'vitest';
import { safeJsonParse } from '@/lib/utils';

describe('safeJsonParse', () => {
  it('parses valid JSON normally', () => {
    expect(safeJsonParse('{"name":"John"}')).toEqual({ name: 'John' });
    expect(safeJsonParse('[1,2,3]')).toEqual([1, 2, 3]);
    expect(safeJsonParse('"hello"')).toBe('hello');
    expect(safeJsonParse('42')).toBe(42);
    expect(safeJsonParse('true')).toBe(true);
    expect(safeJsonParse('null')).toBeNull();
  });

  it('parses JSON with escaped newlines in strings (valid JSON)', () => {
    const input = '{"text":"line1\\nline2"}';
    const result = safeJsonParse(input) as { text: string };
    expect(result.text).toBe('line1\nline2');
  });

  it('handles JSON with literal newlines inside strings (invalid but recoverable)', () => {
    // Simulate what happens when a user pastes JSON from a terminal
    // where \n has been rendered as actual newlines
    const input = '{"text":"line1\nline2"}';
    const result = safeJsonParse(input) as { text: string };
    expect(result.text).toBe('line1\nline2');
  });

  it('handles JSON with literal tabs inside strings', () => {
    const input = '{"text":"col1\tcol2"}';
    const result = safeJsonParse(input) as { text: string };
    expect(result.text).toBe('col1\tcol2');
  });

  it('handles JSON with literal carriage returns inside strings', () => {
    const input = '{"text":"line1\r\nline2"}';
    const result = safeJsonParse(input) as { text: string };
    expect(result.text).toBe('line1\r\nline2');
  });

  it('does not modify newlines outside of strings', () => {
    const input = '{\n  "name": "John",\n  "age": 30\n}';
    const result = safeJsonParse(input) as { name: string; age: number };
    expect(result.name).toBe('John');
    expect(result.age).toBe(30);
  });

  it('handles complex JSON from the user bug report', () => {
    const input = `[{"user_id":"d30c9246","raw_ocr_text":"ADDRESS: 800 W Lake Cook Rd\\nBuffalo Grove, IL 60089\\nSTREET: 800 W Lake Cook Rd","summary_fields":{"ADDRESS":"800 W Lake Cook Rd\\nBuffalo Grove, IL 60089","TOTAL":"$51.94"},"line_items":[]}]`;
    const result = safeJsonParse(input) as Array<Record<string, unknown>>;
    expect(result).toHaveLength(1);
    expect(result[0].user_id).toBe('d30c9246');
    expect(typeof result[0].raw_ocr_text).toBe('string');
  });

  it('throws meaningful error on truly invalid JSON', () => {
    expect(() => safeJsonParse('not json at all')).toThrow();
    expect(() => safeJsonParse('{key: value}')).toThrow();
    expect(() => safeJsonParse('')).toThrow();
  });

  it('handles nested objects with literal newlines', () => {
    const input = '{"outer":{"inner":"value\nwith\nnewlines"}}';
    const result = safeJsonParse(input) as { outer: { inner: string } };
    expect(result.outer.inner).toBe('value\nwith\nnewlines');
  });

  it('preserves properly escaped sequences', () => {
    const input = '{"path":"C:\\\\Users\\\\file.txt"}';
    const result = safeJsonParse(input) as { path: string };
    expect(result.path).toBe('C:\\Users\\file.txt');
  });
});
