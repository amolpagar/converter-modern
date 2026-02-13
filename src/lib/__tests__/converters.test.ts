import { describe, it, expect } from 'vitest';
import {
  xmlToJson,
  jsonToXml,
  yamlToJson,
  jsonToYaml,
  jsonToJsonSchema,
  jsonToIon,
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
  urlEncode,
  urlDecode,
  htmlEntityEncode,
  htmlEntityDecode,
  generateHash,
  numberBaseConvert,
} from '@/lib/converters';

// ─────────────────────────────────────────────────────────────
// XML ↔ JSON
// ─────────────────────────────────────────────────────────────

describe('xmlToJson', () => {
  it('converts simple XML to JSON', () => {
    const xml = '<root><name>John</name><age>30</age></root>';
    const result = JSON.parse(xmlToJson(xml));
    expect(result.root.name).toBe('John');
    expect(result.root.age).toBe(30);
  });

  it('preserves XML attributes with @_ prefix', () => {
    const xml = '<book category="fiction"><title>Test</title></book>';
    const result = JSON.parse(xmlToJson(xml));
    expect(result.book['@_category']).toBe('fiction');
    expect(result.book.title).toBe('Test');
  });

  it('throws on empty input', () => {
    expect(() => xmlToJson('')).toThrow('Input is empty');
    expect(() => xmlToJson('   ')).toThrow('Input is empty');
  });
});

describe('jsonToXml', () => {
  it('converts JSON to XML with declaration', () => {
    const json = '{"root":{"name":"John"}}';
    const result = jsonToXml(json);
    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain('<name>John</name>');
  });

  it('throws on empty input', () => {
    expect(() => jsonToXml('')).toThrow('Input is empty');
  });

  it('throws on invalid JSON', () => {
    expect(() => jsonToXml('{bad json}')).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────
// YAML ↔ JSON
// ─────────────────────────────────────────────────────────────

describe('yamlToJson', () => {
  it('converts YAML to JSON', () => {
    const yaml = 'name: John\nage: 30\nactive: true';
    const result = JSON.parse(yamlToJson(yaml));
    expect(result).toEqual({ name: 'John', age: 30, active: true });
  });

  it('handles nested YAML', () => {
    const yaml = 'server:\n  host: localhost\n  port: 8080';
    const result = JSON.parse(yamlToJson(yaml));
    expect(result.server.host).toBe('localhost');
    expect(result.server.port).toBe(8080);
  });

  it('handles YAML arrays', () => {
    const yaml = 'items:\n  - one\n  - two\n  - three';
    const result = JSON.parse(yamlToJson(yaml));
    expect(result.items).toEqual(['one', 'two', 'three']);
  });

  it('throws on empty input', () => {
    expect(() => yamlToJson('')).toThrow('Input is empty');
  });
});

describe('jsonToYaml', () => {
  it('converts JSON to YAML', () => {
    const json = '{"name":"John","age":30}';
    const result = jsonToYaml(json);
    expect(result).toContain('name: John');
    expect(result).toContain('age: 30');
  });

  it('converts arrays to YAML sequences', () => {
    const json = '{"items":["a","b","c"]}';
    const result = jsonToYaml(json);
    expect(result).toContain('- a');
    expect(result).toContain('- b');
  });

  it('throws on empty input', () => {
    expect(() => jsonToYaml('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// JSON → JSON Schema
// ─────────────────────────────────────────────────────────────

describe('jsonToJsonSchema', () => {
  it('generates schema for object with mixed types', () => {
    const json = '{"name":"John","age":30,"active":true}';
    const schema = JSON.parse(jsonToJsonSchema(json));
    expect(schema.$schema).toBe('http://json-schema.org/draft-07/schema#');
    expect(schema.type).toBe('object');
    expect(schema.properties.name.type).toBe('string');
    expect(schema.properties.age.type).toBe('integer');
    expect(schema.properties.active.type).toBe('boolean');
  });

  it('handles arrays', () => {
    const json = '{"tags":["a","b"]}';
    const schema = JSON.parse(jsonToJsonSchema(json));
    expect(schema.properties.tags.type).toBe('array');
    expect(schema.properties.tags.items.type).toBe('string');
  });

  it('handles nested objects', () => {
    const json = '{"address":{"city":"NYC","zip":"10001"}}';
    const schema = JSON.parse(jsonToJsonSchema(json));
    expect(schema.properties.address.type).toBe('object');
    expect(schema.properties.address.properties.city.type).toBe('string');
  });

  it('marks non-null fields as required', () => {
    const json = '{"name":"John","value":null}';
    const schema = JSON.parse(jsonToJsonSchema(json));
    expect(schema.required).toContain('name');
    expect(schema.required).not.toContain('value');
  });

  it('throws on empty input', () => {
    expect(() => jsonToJsonSchema('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// JSON → ION
// ─────────────────────────────────────────────────────────────

describe('jsonToIon', () => {
  it('converts primitive types', () => {
    const json = '{"name":"John","age":30,"active":true,"salary":50.5,"dept":null}';
    const result = jsonToIon(json);
    expect(result).toContain('"John"');
    expect(result).toContain('30');
    expect(result).toContain('true');
    expect(result).toContain('50.5e0');
    expect(result).toContain('null');
  });

  it('escapes newlines in strings', () => {
    const json = '{"text":"line1\\nline2"}';
    const result = jsonToIon(json);
    expect(result).toContain('\\n');
    expect(result).not.toContain('\n  line2');
  });

  it('handles arrays and nested objects', () => {
    const json = '{"items":["a","b"],"nested":{"key":"val"}}';
    const result = jsonToIon(json);
    expect(result).toContain('"a"');
    expect(result).toContain('"b"');
    expect(result).toContain('key:');
  });

  it('throws on empty input', () => {
    expect(() => jsonToIon('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// Text → JSON
// ─────────────────────────────────────────────────────────────

describe('textToJson', () => {
  it('parses equals-separated key-value pairs', () => {
    const text = 'name = John\nage = 30\nactive = true';
    const result = JSON.parse(textToJson(text));
    expect(result.name).toBe('John');
    expect(result.age).toBe(30);
    expect(result.active).toBe(true);
  });

  it('parses colon-separated key-value pairs', () => {
    const text = 'name: John\nage: 30';
    const result = JSON.parse(textToJson(text));
    expect(result.name).toBe('John');
    expect(result.age).toBe(30);
  });

  it('parses arrow-separated pairs', () => {
    const text = 'key => value';
    const result = JSON.parse(textToJson(text));
    expect(result.key).toBe('value');
  });

  it('detects null values', () => {
    const text = 'key = null';
    const result = JSON.parse(textToJson(text));
    expect(result.key).toBeNull();
  });

  it('throws on empty input', () => {
    expect(() => textToJson('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// Base64 Encode / Decode
// ─────────────────────────────────────────────────────────────

describe('base64Encode / base64Decode', () => {
  it('encodes and decodes plain text', () => {
    const original = 'Hello, World!';
    const encoded = base64Encode(original);
    expect(encoded).toBe('SGVsbG8sIFdvcmxkIQ==');
    expect(base64Decode(encoded)).toBe(original);
  });

  it('handles UTF-8 characters', () => {
    const original = 'こんにちは';
    const encoded = base64Encode(original);
    expect(base64Decode(encoded)).toBe(original);
  });

  it('encode throws on empty input', () => {
    expect(() => base64Encode('')).toThrow('Input is empty');
  });

  it('decode throws on empty input', () => {
    expect(() => base64Decode('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// JWT Decoder
// ─────────────────────────────────────────────────────────────

describe('jwtDecode', () => {
  // Standard test JWT: {"alg":"HS256","typ":"JWT"}.{"sub":"1234567890","name":"John Doe","iat":1516239022}
  const testJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  it('decodes header and payload', () => {
    const result = JSON.parse(jwtDecode(testJwt));
    expect(result.header.alg).toBe('HS256');
    expect(result.header.typ).toBe('JWT');
    expect(result.payload.sub).toBe('1234567890');
    expect(result.payload.name).toBe('John Doe');
  });

  it('adds human-readable timestamps', () => {
    const result = JSON.parse(jwtDecode(testJwt));
    expect(result.payload.iat_readable).toBeDefined();
    expect(result.payload.iat_readable).toContain('2018');
  });

  it('includes signature', () => {
    const result = JSON.parse(jwtDecode(testJwt));
    expect(result.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  });

  it('throws on invalid JWT format', () => {
    expect(() => jwtDecode('not.a.valid.jwt.token')).toThrow();
    expect(() => jwtDecode('single-segment')).toThrow('Invalid JWT');
  });

  it('throws on empty input', () => {
    expect(() => jwtDecode('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// JSON → CSV
// ─────────────────────────────────────────────────────────────

describe('jsonToCsv', () => {
  it('converts array of objects to CSV', () => {
    const json = '[{"name":"Alice","age":30},{"name":"Bob","age":25}]';
    const csv = jsonToCsv(json);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toBe('Alice,30');
    expect(lines[2]).toBe('Bob,25');
  });

  it('converts single object to CSV', () => {
    const json = '{"name":"Alice","age":30}';
    const csv = jsonToCsv(json);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('name,age');
    expect(lines[1]).toBe('Alice,30');
  });

  it('flattens nested objects with dot notation', () => {
    const json = '[{"name":"Alice","address":{"city":"NYC","zip":"10001"}}]';
    const csv = jsonToCsv(json);
    expect(csv).toContain('address.city');
    expect(csv).toContain('address.zip');
    expect(csv).toContain('NYC');
  });

  it('escapes fields with commas', () => {
    const json = '[{"name":"Doe, John","age":30}]';
    const csv = jsonToCsv(json);
    expect(csv).toContain('"Doe, John"');
  });

  it('escapes fields with double quotes', () => {
    const json = '[{"name":"John \\"The Dev\\"","age":30}]';
    const csv = jsonToCsv(json);
    expect(csv).toContain('""');
  });

  it('handles null values as empty', () => {
    const json = '[{"name":"Alice","email":null}]';
    const csv = jsonToCsv(json);
    const dataLine = csv.split('\n')[1];
    expect(dataLine).toBe('Alice,');
  });

  it('throws on empty input', () => {
    expect(() => jsonToCsv('')).toThrow('Input is empty');
  });

  it('throws on non-object JSON', () => {
    expect(() => jsonToCsv('[1,2,3]')).toThrow('JSON must be an array of objects');
  });
});

// ─────────────────────────────────────────────────────────────
// CSV → JSON
// ─────────────────────────────────────────────────────────────

describe('csvToJson', () => {
  it('converts CSV to JSON array of objects', () => {
    const csv = 'name,age,active\nAlice,30,true\nBob,25,false';
    const result = JSON.parse(csvToJson(csv));
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'Alice', age: 30, active: true });
    expect(result[1]).toEqual({ name: 'Bob', age: 25, active: false });
  });

  it('handles quoted fields with commas', () => {
    const csv = 'name,city\n"Doe, John","New York"';
    const result = JSON.parse(csvToJson(csv));
    expect(result[0].name).toBe('Doe, John');
    expect(result[0].city).toBe('New York');
  });

  it('handles escaped quotes in CSV', () => {
    const csv = 'name,value\n"He said ""hello""",42';
    const result = JSON.parse(csvToJson(csv));
    expect(result[0].name).toBe('He said "hello"');
  });

  it('auto-detects types', () => {
    const csv = 'str,num,bool,nil\nhello,42,true,null';
    const result = JSON.parse(csvToJson(csv));
    expect(result[0].str).toBe('hello');
    expect(result[0].num).toBe(42);
    expect(result[0].bool).toBe(true);
    expect(result[0].nil).toBeNull();
  });

  it('throws on empty input', () => {
    expect(() => csvToJson('')).toThrow('Input is empty');
  });

  it('throws on header-only CSV', () => {
    expect(() => csvToJson('name,age')).toThrow('at least one data row');
  });
});

// ─────────────────────────────────────────────────────────────
// JSON → TypeScript
// ─────────────────────────────────────────────────────────────

describe('jsonToTypescript', () => {
  it('generates interface with string, number, boolean', () => {
    const json = '{"name":"John","age":30,"active":true}';
    const ts = jsonToTypescript(json);
    expect(ts).toContain('export interface Root');
    expect(ts).toContain('name: string;');
    expect(ts).toContain('age: number;');
    expect(ts).toContain('active: boolean;');
  });

  it('generates nested interfaces', () => {
    const json = '{"user":{"name":"John","email":"j@example.com"}}';
    const ts = jsonToTypescript(json);
    expect(ts).toContain('export interface User');
    expect(ts).toContain('export interface Root');
    expect(ts).toContain('user: User;');
  });

  it('handles arrays', () => {
    const json = '{"tags":["a","b"]}';
    const ts = jsonToTypescript(json);
    expect(ts).toContain('tags: string[];');
  });

  it('handles null values', () => {
    const json = '{"value":null}';
    const ts = jsonToTypescript(json);
    expect(ts).toContain('value: null;');
  });

  it('handles array input', () => {
    const json = '[{"id":1,"name":"Alice"}]';
    const ts = jsonToTypescript(json);
    expect(ts).toContain('export interface Root');
    expect(ts).toContain('id: number;');
  });

  it('throws on empty input', () => {
    expect(() => jsonToTypescript('')).toThrow('Input is empty');
  });

  it('throws on empty array', () => {
    expect(() => jsonToTypescript('[]')).toThrow('Cannot infer types from an empty array');
  });
});

// ─────────────────────────────────────────────────────────────
// JSON → Go Struct
// ─────────────────────────────────────────────────────────────

describe('jsonToGo', () => {
  it('generates struct with json tags', () => {
    const json = '{"user_name":"John","age":30,"is_active":true}';
    const go = jsonToGo(json);
    expect(go).toContain('type AutoGenerated struct');
    expect(go).toContain('UserName string `json:"user_name"`');
    expect(go).toContain('Age int `json:"age"`');
    expect(go).toContain('IsActive bool `json:"is_active"`');
  });

  it('handles nested objects', () => {
    const json = '{"profile":{"bio":"Hello","score":9.5}}';
    const go = jsonToGo(json);
    expect(go).toContain('type Profile struct');
    expect(go).toContain('Bio string `json:"bio"`');
    expect(go).toContain('Score float64 `json:"score"`');
  });

  it('handles arrays', () => {
    const json = '{"tags":["a","b"]}';
    const go = jsonToGo(json);
    expect(go).toContain('Tags []string `json:"tags"`');
  });

  it('handles null as interface{}', () => {
    const json = '{"value":null}';
    const go = jsonToGo(json);
    expect(go).toContain('Value interface{} `json:"value"`');
  });

  it('handles array of objects input', () => {
    const json = '[{"id":1}]';
    const go = jsonToGo(json);
    expect(go).toContain('type AutoGenerated struct');
    expect(go).toContain('Id int `json:"id"`');
  });

  it('throws on empty input', () => {
    expect(() => jsonToGo('')).toThrow('Input is empty');
  });

  it('throws on empty array', () => {
    expect(() => jsonToGo('[]')).toThrow('Cannot infer types from an empty array');
  });
});

// ─────────────────────────────────────────────────────────────
// Markdown → HTML
// ─────────────────────────────────────────────────────────────

describe('markdownToHtml', () => {
  it('converts headings', () => {
    expect(markdownToHtml('# Hello')).toContain('<h1>Hello</h1>');
    expect(markdownToHtml('## Sub')).toContain('<h2>Sub</h2>');
  });

  it('converts bold and italic', () => {
    const result = markdownToHtml('**bold** and *italic*');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('converts links', () => {
    const result = markdownToHtml('[Click](https://example.com)');
    expect(result).toContain('<a href="https://example.com">Click</a>');
  });

  it('converts lists', () => {
    const result = markdownToHtml('- one\n- two\n- three');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>one</li>');
  });

  it('converts code blocks', () => {
    const result = markdownToHtml('```js\nconst x = 1;\n```');
    expect(result).toContain('<pre>');
    expect(result).toContain('<code');
    expect(result).toContain('const x = 1;');
  });

  it('throws on empty input', () => {
    expect(() => markdownToHtml('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// HTML → Markdown
// ─────────────────────────────────────────────────────────────

describe('htmlToMarkdown', () => {
  it('converts headings', () => {
    expect(htmlToMarkdown('<h1>Hello</h1>')).toBe('# Hello');
  });

  it('converts bold and italic', () => {
    const result = htmlToMarkdown('<strong>bold</strong> and <em>italic</em>');
    expect(result).toContain('**bold**');
    expect(result).toContain('*italic*');
  });

  it('converts links', () => {
    const result = htmlToMarkdown('<a href="https://example.com">Click</a>');
    expect(result).toContain('[Click](https://example.com)');
  });

  it('converts unordered lists', () => {
    const result = htmlToMarkdown('<ul><li>one</li><li>two</li></ul>');
    expect(result).toContain('*   one');
    expect(result).toContain('*   two');
  });

  it('converts paragraphs', () => {
    const result = htmlToMarkdown('<p>First paragraph</p><p>Second paragraph</p>');
    expect(result).toContain('First paragraph');
    expect(result).toContain('Second paragraph');
  });

  it('throws on empty input', () => {
    expect(() => htmlToMarkdown('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// URL Encode / Decode
// ─────────────────────────────────────────────────────────────

describe('urlEncode / urlDecode', () => {
  it('encodes special characters', () => {
    expect(urlEncode('hello world')).toBe('hello%20world');
    expect(urlEncode('a=1&b=2')).toBe('a%3D1%26b%3D2');
  });

  it('encodes unicode', () => {
    const encoded = urlEncode('café');
    expect(encoded).toContain('%');
    expect(urlDecode(encoded)).toBe('café');
  });

  it('round-trips correctly', () => {
    const original = 'key=value&foo=bar baz';
    expect(urlDecode(urlEncode(original))).toBe(original);
  });

  it('encode throws on empty input', () => {
    expect(() => urlEncode('')).toThrow('Input is empty');
  });

  it('decode throws on empty input', () => {
    expect(() => urlDecode('')).toThrow('Input is empty');
  });

  it('decode throws on invalid encoded string', () => {
    expect(() => urlDecode('%ZZ')).toThrow('Invalid URL-encoded string');
  });
});

// ─────────────────────────────────────────────────────────────
// HTML Entity Encode / Decode
// ─────────────────────────────────────────────────────────────

describe('htmlEntityEncode / htmlEntityDecode', () => {
  it('encodes the five required HTML entities', () => {
    expect(htmlEntityEncode('&')).toBe('&amp;');
    expect(htmlEntityEncode('<')).toBe('&lt;');
    expect(htmlEntityEncode('>')).toBe('&gt;');
    expect(htmlEntityEncode('"')).toBe('&quot;');
    expect(htmlEntityEncode("'")).toBe('&#39;');
  });

  it('encodes a full HTML snippet', () => {
    const result = htmlEntityEncode('<script>alert("xss")</script>');
    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('decodes named entities', () => {
    expect(htmlEntityDecode('&amp;')).toBe('&');
    expect(htmlEntityDecode('&lt;')).toBe('<');
    expect(htmlEntityDecode('&gt;')).toBe('>');
    expect(htmlEntityDecode('&quot;')).toBe('"');
    expect(htmlEntityDecode('&#39;')).toBe("'");
  });

  it('decodes special named entities', () => {
    expect(htmlEntityDecode('&copy;')).toBe('\u00A9');
    expect(htmlEntityDecode('&euro;')).toBe('\u20AC');
    expect(htmlEntityDecode('&trade;')).toBe('\u2122');
  });

  it('decodes numeric decimal entities', () => {
    expect(htmlEntityDecode('&#169;')).toBe('\u00A9'); // ©
    expect(htmlEntityDecode('&#8364;')).toBe('\u20AC'); // €
  });

  it('decodes numeric hex entities', () => {
    expect(htmlEntityDecode('&#xA9;')).toBe('\u00A9');
    expect(htmlEntityDecode('&#x20AC;')).toBe('\u20AC');
  });

  it('round-trips basic text', () => {
    const original = '<div class="test">&amp;</div>';
    const encoded = htmlEntityEncode(original);
    const decoded = htmlEntityDecode(encoded);
    expect(decoded).toBe(original);
  });

  it('encode throws on empty input', () => {
    expect(() => htmlEntityEncode('')).toThrow('Input is empty');
  });

  it('decode throws on empty input', () => {
    expect(() => htmlEntityDecode('')).toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// Hash Generator (async)
// ─────────────────────────────────────────────────────────────

describe('generateHash', () => {
  it('generates SHA-256, SHA-1, and SHA-512 hashes', async () => {
    const result = await generateHash('hello');
    expect(result).toContain('SHA-256');
    expect(result).toContain('SHA-1');
    expect(result).toContain('SHA-512');
    // SHA-256 of "hello" is well-known
    expect(result).toContain('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('produces different hashes for different inputs', async () => {
    const hash1 = await generateHash('hello');
    const hash2 = await generateHash('world');
    expect(hash1).not.toBe(hash2);
  });

  it('produces consistent hashes for same input', async () => {
    const hash1 = await generateHash('test');
    const hash2 = await generateHash('test');
    expect(hash1).toBe(hash2);
  });

  it('throws on empty input', async () => {
    await expect(generateHash('')).rejects.toThrow('Input is empty');
  });
});

// ─────────────────────────────────────────────────────────────
// Number Base Converter
// ─────────────────────────────────────────────────────────────

describe('numberBaseConvert', () => {
  it('converts decimal to all bases', () => {
    const result = numberBaseConvert('255');
    expect(result).toContain('Decimal:     255');
    expect(result).toContain('Hexadecimal: 0xFF');
    expect(result).toContain('Octal:       0o377');
    expect(result).toContain('Binary:      0b11111111');
  });

  it('converts hex input to all bases', () => {
    const result = numberBaseConvert('0xFF');
    expect(result).toContain('Decimal:     255');
  });

  it('converts binary input to all bases', () => {
    const result = numberBaseConvert('0b1010');
    expect(result).toContain('Decimal:     10');
    expect(result).toContain('Hexadecimal: 0xA');
  });

  it('converts octal input to all bases', () => {
    const result = numberBaseConvert('0o17');
    expect(result).toContain('Decimal:     15');
  });

  it('handles zero', () => {
    const result = numberBaseConvert('0');
    expect(result).toContain('Decimal:     0');
    expect(result).toContain('Hexadecimal: 0x0');
    expect(result).toContain('Binary:      0b0');
  });

  it('handles negative numbers', () => {
    const result = numberBaseConvert('-42');
    expect(result).toContain('Decimal:     -42');
  });

  it('throws on empty input', () => {
    expect(() => numberBaseConvert('')).toThrow('Input is empty');
  });

  it('throws on invalid number', () => {
    expect(() => numberBaseConvert('abc')).toThrow('Invalid number');
  });
});

// ─────────────────────────────────────────────────────────────
// Regression: JSON with literal newlines in strings (user bug)
// ─────────────────────────────────────────────────────────────

describe('converters handle JSON with newlines in strings (safeJsonParse)', () => {
  const jsonWithNewlines = `[{"raw_ocr_text":"ADDRESS: 800 W Lake Cook Rd\\nBuffalo Grove, IL 60089","total":"$51.94"}]`;

  it('jsonToXml works with newline-containing JSON', () => {
    expect(() => jsonToXml(jsonWithNewlines)).not.toThrow();
    const result = jsonToXml(jsonWithNewlines);
    expect(result).toContain('<?xml');
  });

  it('jsonToYaml works with newline-containing JSON', () => {
    expect(() => jsonToYaml(jsonWithNewlines)).not.toThrow();
  });

  it('jsonToJsonSchema works with newline-containing JSON', () => {
    const schema = JSON.parse(jsonToJsonSchema(jsonWithNewlines));
    expect(schema.type).toBe('array');
  });

  it('jsonToIon works with newline-containing JSON', () => {
    const result = jsonToIon(jsonWithNewlines);
    expect(result).toContain('\\n');
  });

  it('jsonToCsv works with newline-containing JSON', () => {
    expect(() => jsonToCsv(jsonWithNewlines)).not.toThrow();
  });

  it('jsonToTypescript works with newline-containing JSON', () => {
    expect(() => jsonToTypescript(jsonWithNewlines)).not.toThrow();
    const result = jsonToTypescript(jsonWithNewlines);
    expect(result).toContain('string');
  });

  it('jsonToGo works with newline-containing JSON', () => {
    expect(() => jsonToGo(jsonWithNewlines)).not.toThrow();
    const result = jsonToGo(jsonWithNewlines);
    expect(result).toContain('struct');
  });
});
