import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import * as jsYaml from 'js-yaml';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { safeJsonParse } from '@/lib/utils';

// ─── XML ↔ JSON ─────────────────────────────────────────────

export function xmlToJson(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    parseTagValue: true,
    trimValues: true,
  });

  const result = parser.parse(input);
  return JSON.stringify(result, null, indent);
}

export function jsonToXml(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    indentBy: ' '.repeat(indent),
    suppressBooleanAttributes: false,
  });

  const xml = builder.build(parsed);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
}

// ─── YAML ↔ JSON ────────────────────────────────────────────

export function yamlToJson(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const result = jsYaml.load(input);
  return JSON.stringify(result, null, indent);
}

export function jsonToYaml(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  return jsYaml.dump(parsed, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  });
}

// ─── JSON → JSON Schema ─────────────────────────────────────

function inferType(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function generateSchemaFromValue(value: unknown): Record<string, unknown> {
  const type = inferType(value);

  switch (type) {
    case 'object': {
      const obj = value as Record<string, unknown>;
      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      for (const [key, val] of Object.entries(obj)) {
        properties[key] = generateSchemaFromValue(val);
        if (val !== null && val !== undefined) {
          required.push(key);
        }
      }

      return {
        type: 'object',
        properties,
        ...(required.length > 0 && { required }),
      };
    }
    case 'array': {
      const arr = value as unknown[];
      if (arr.length === 0) {
        return { type: 'array', items: {} };
      }
      return {
        type: 'array',
        items: generateSchemaFromValue(arr[0]),
      };
    }
    case 'string':
      return { type: 'string' };
    case 'number':
      return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
    case 'boolean':
      return { type: 'boolean' };
    case 'null':
      return { type: 'null' };
    default:
      return {};
  }
}

export function jsonToJsonSchema(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    ...generateSchemaFromValue(parsed),
  };

  return JSON.stringify(schema, null, indent);
}

// ─── Text → JSON ────────────────────────────────────────────

function inferValueType(value: string): string | number | boolean | null {
  if (value === '' || value === 'null' || value === 'NULL') return null;
  if (value === 'true' || value === 'TRUE') return true;
  if (value === 'false' || value === 'FALSE') return false;

  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') return num;

  // ISO date check
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;

  return value;
}

export function textToJson(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const lines = input.split('\n').filter((line) => line.trim());
  const result: Record<string, string | number | boolean | null> = {};

  for (const line of lines) {
    // Support tab-separated, equals-separated, colon-separated, and arrow-separated
    let key: string;
    let value: string;

    if (line.includes('\t')) {
      const parts = line.split('\t');
      key = parts[0].trim();
      value = parts.slice(1).join('\t').trim();
    } else if (line.includes('=>')) {
      const parts = line.split('=>');
      key = parts[0].trim();
      value = parts.slice(1).join('=>').trim();
    } else if (line.includes('=')) {
      const parts = line.split('=');
      key = parts[0].trim();
      value = parts.slice(1).join('=').trim();
    } else if (line.includes(':')) {
      const parts = line.split(':');
      key = parts[0].trim();
      value = parts.slice(1).join(':').trim();
    } else {
      continue;
    }

    if (key) {
      result[key] = inferValueType(value);
    }
  }

  return JSON.stringify(result, null, indent);
}

// ─── Base64 Encode / Decode ─────────────────────────────────

export function base64Encode(input: string): string {
  if (!input) throw new Error('Input is empty');
  if (typeof window !== 'undefined') {
    return btoa(unescape(encodeURIComponent(input)));
  }
  return Buffer.from(input, 'utf-8').toString('base64');
}

export function base64Decode(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');
  try {
    if (typeof window !== 'undefined') {
      return decodeURIComponent(escape(atob(input.trim())));
    }
    return Buffer.from(input.trim(), 'base64').toString('utf-8');
  } catch {
    throw new Error('Invalid Base64 string');
  }
}

// ─── JWT Decoder ────────────────────────────────────────────

function base64UrlDecode(str: string): string {
  // Add padding
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) {
    base64 += '='.repeat(4 - pad);
  }

  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(atob(base64)));
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export function jwtDecode(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const token = input.trim();
  const parts = token.split('.');

  if (parts.length < 2 || parts.length > 3) {
    throw new Error('Invalid JWT token. A JWT should have 2 or 3 parts separated by dots.');
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    // Add human-readable dates for common timestamp fields
    const timestampFields = ['exp', 'iat', 'nbf', 'auth_time'];
    for (const field of timestampFields) {
      if (typeof payload[field] === 'number') {
        payload[`${field}_readable`] = new Date(payload[field] * 1000).toISOString();
      }
    }

    const result = {
      header,
      payload,
      signature: parts[2] || '(none)',
    };

    return JSON.stringify(result, null, indent);
  } catch (e) {
    if (e instanceof Error && e.message.includes('Invalid JWT')) throw e;
    throw new Error('Failed to decode JWT token. The token appears to be malformed.');
  }
}

// ─── JSON → ION (Amazon Ion Text Format) ────────────────────

function jsonValueToIon(value: unknown, indent: number, depth: number): string {
  const pad = ' '.repeat(indent * depth);
  const padInner = ' '.repeat(indent * (depth + 1));

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return `${value}`;
    return `${value}e0`;
  }
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${padInner}${jsonValueToIon(v, indent, depth + 1)}`);
    return `[\n${items.join(',\n')}\n${pad}]`;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}';
    const entries = keys.map(
      (k) => `${padInner}${k}: ${jsonValueToIon(obj[k], indent, depth + 1)}`
    );
    return `{\n${entries.join(',\n')}\n${pad}}`;
  }

  return String(value);
}

export function jsonToIon(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  return jsonValueToIon(parsed, indent, 0);
}

// ─── JSON → CSV ──────────────────────────────────────────────

function flattenObject(
  obj: Record<string, unknown>,
  prefix = '',
  result: Record<string, unknown> = {}
): Record<string, unknown> {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value as Record<string, unknown>, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function jsonToCsv(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  const data = Array.isArray(parsed) ? parsed : [parsed];

  if (data.length === 0) throw new Error('JSON array is empty');
  if (typeof data[0] !== 'object' || data[0] === null) {
    throw new Error('JSON must be an array of objects (or a single object)');
  }

  // Flatten nested objects
  const flattened = data.map((item) => flattenObject(item as Record<string, unknown>));

  // Collect all unique headers
  const headerSet = new Set<string>();
  flattened.forEach((row) => Object.keys(row).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);

  const csvRows = [headers.map(escapeCsvField).join(',')];
  for (const row of flattened) {
    csvRows.push(headers.map((h) => escapeCsvField(row[h])).join(','));
  }

  return csvRows.join('\n');
}

// ─── CSV → JSON ──────────────────────────────────────────────

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

export function csvToJson(input: string, indent = 2): string {
  if (!input.trim()) throw new Error('Input is empty');

  const lines = input.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');

  const headers = parseCsvLine(lines[0]);
  const result = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const obj: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      const val = (values[idx] ?? '').trim();
      obj[header.trim()] = inferValueType(val);
    });
    return obj;
  });

  return JSON.stringify(result, null, indent);
}

// ─── JSON → TypeScript Interfaces ────────────────────────────

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toInterfaceName(key: string): string {
  // Convert snake_case, kebab-case, etc. to PascalCase
  return key
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase());
}

function inferTsType(
  value: unknown,
  key: string,
  interfaces: Map<string, string>
): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
  if (typeof value === 'boolean') return 'boolean';

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]';
    const itemType = inferTsType(value[0], key, interfaces);
    return `${itemType}[]`;
  }

  if (typeof value === 'object') {
    const interfaceName = capitalize(toInterfaceName(key));
    generateInterface(value as Record<string, unknown>, interfaceName, interfaces);
    return interfaceName;
  }

  return 'unknown';
}

function generateInterface(
  obj: Record<string, unknown>,
  name: string,
  interfaces: Map<string, string>
): void {
  const lines: string[] = [];
  lines.push(`export interface ${name} {`);
  for (const [key, value] of Object.entries(obj)) {
    const tsType = inferTsType(value, key, interfaces);
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    lines.push(`  ${safeKey}: ${tsType};`);
  }
  lines.push('}');
  interfaces.set(name, lines.join('\n'));
}

export function jsonToTypescript(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  const interfaces = new Map<string, string>();

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) throw new Error('Cannot infer types from an empty array');
    if (typeof parsed[0] === 'object' && parsed[0] !== null) {
      generateInterface(parsed[0] as Record<string, unknown>, 'Root', interfaces);
    } else {
      return `export type Root = ${inferTsType(parsed[0], 'item', interfaces)}[];`;
    }
  } else if (typeof parsed === 'object' && parsed !== null) {
    generateInterface(parsed as Record<string, unknown>, 'Root', interfaces);
  } else {
    return `export type Root = ${typeof parsed};`;
  }

  // Output: nested interfaces first, then Root
  const entries = Array.from(interfaces.entries());
  const root = entries.find(([k]) => k === 'Root');
  const rest = entries.filter(([k]) => k !== 'Root');

  return [...rest.map(([, v]) => v), '', root?.[1] ?? ''].join('\n\n').trim();
}

// ─── JSON → Go Struct ────────────────────────────────────────

function goTypeName(key: string): string {
  return key
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (c) => c.toUpperCase());
}

function inferGoType(
  value: unknown,
  key: string,
  structs: Map<string, string>
): string {
  if (value === null) return 'interface{}';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float64';
  if (typeof value === 'boolean') return 'bool';

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]interface{}';
    const itemType = inferGoType(value[0], key, structs);
    return `[]${itemType}`;
  }

  if (typeof value === 'object') {
    const structName = goTypeName(key);
    generateGoStruct(value as Record<string, unknown>, structName, structs);
    return structName;
  }

  return 'interface{}';
}

function generateGoStruct(
  obj: Record<string, unknown>,
  name: string,
  structs: Map<string, string>
): void {
  const lines: string[] = [];
  lines.push(`type ${name} struct {`);

  for (const [key, value] of Object.entries(obj)) {
    const goType = inferGoType(value, key, structs);
    const fieldName = goTypeName(key);
    lines.push(`\t${fieldName} ${goType} \`json:"${key}"\``);
  }

  lines.push('}');
  structs.set(name, lines.join('\n'));
}

export function jsonToGo(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  const structs = new Map<string, string>();

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) throw new Error('Cannot infer types from an empty array');
    if (typeof parsed[0] === 'object' && parsed[0] !== null) {
      generateGoStruct(parsed[0] as Record<string, unknown>, 'AutoGenerated', structs);
    } else {
      return `// Root type: []${inferGoType(parsed[0], 'item', structs)}`;
    }
  } else if (typeof parsed === 'object' && parsed !== null) {
    generateGoStruct(parsed as Record<string, unknown>, 'AutoGenerated', structs);
  } else {
    return `// Root type: ${typeof parsed}`;
  }

  const entries = Array.from(structs.entries());
  const root = entries.find(([k]) => k === 'AutoGenerated');
  const rest = entries.filter(([k]) => k !== 'AutoGenerated');

  return [...rest.map(([, v]) => v), '', root?.[1] ?? ''].join('\n\n').trim();
}

// ─── Markdown → HTML ─────────────────────────────────────────

export function markdownToHtml(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  const html = marked.parse(input, { async: false }) as string;
  return html.trim();
}

// ─── HTML → Markdown ─────────────────────────────────────────

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
});

export function htmlToMarkdown(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  return turndownService.turndown(input).trim();
}

// ─── URL Encode / Decode ─────────────────────────────────────

export function urlEncode(input: string): string {
  if (!input) throw new Error('Input is empty');
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');
  try {
    return decodeURIComponent(input.trim());
  } catch {
    throw new Error('Invalid URL-encoded string');
  }
}

// ─── HTML Entity Encode / Decode ─────────────────────────────

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

const REVERSE_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  '&apos;': "'", '&nbsp;': ' ', '&copy;': '\u00A9', '&reg;': '\u00AE',
  '&trade;': '\u2122', '&euro;': '\u20AC', '&pound;': '\u00A3',
  '&yen;': '\u00A5', '&cent;': '\u00A2', '&mdash;': '\u2014',
  '&ndash;': '\u2013', '&hellip;': '\u2026', '&laquo;': '\u00AB',
  '&raquo;': '\u00BB', '&bull;': '\u2022', '&middot;': '\u00B7',
};

export function htmlEntityEncode(input: string): string {
  if (!input) throw new Error('Input is empty');
  return input.replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch] || ch);
}

export function htmlEntityDecode(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');
  // Named entities
  let result = input.replace(
    /&[a-zA-Z]+;/g,
    (entity) => REVERSE_ENTITIES[entity] ?? entity
  );
  // Numeric entities (decimal & hex)
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return result;
}

// ─── Hash Generator (SHA-256, SHA-1, SHA-512) ────────────────

async function computeHash(algorithm: string, data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function generateHash(input: string): Promise<string> {
  if (!input) throw new Error('Input is empty');

  const data = new TextEncoder().encode(input).buffer;

  const [sha256, sha1, sha512] = await Promise.all([
    computeHash('SHA-256', data),
    computeHash('SHA-1', data),
    computeHash('SHA-512', data),
  ]);

  return [
    `SHA-256`,
    sha256,
    '',
    `SHA-1`,
    sha1,
    '',
    `SHA-512`,
    sha512,
  ].join('\n');
}

// ─── JSON → M3U / M3U8 Playlist ─────────────────────────────

interface M3uEntry {
  url: string;
  title?: string;
  name?: string;
  duration?: number;
  group?: string;
  logo?: string;
  tvgId?: string;
  tvgName?: string;
  artist?: string;
}

export function jsonToM3u(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  const parsed = safeJsonParse(input);
  const entries: M3uEntry[] = Array.isArray(parsed) ? parsed : [parsed];

  if (entries.length === 0) throw new Error('JSON array is empty');

  const lines: string[] = ['#EXTM3U'];

  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('Each entry must be a JSON object with at least a "url" field');
    }

    const url = entry.url;
    if (!url || typeof url !== 'string') {
      throw new Error('Each entry must have a "url" string field');
    }

    const title = entry.title ?? entry.name ?? 'Unknown';
    const duration = typeof entry.duration === 'number' ? Math.round(entry.duration) : -1;

    // Build EXTINF attributes for IPTV extended format
    const attrs: string[] = [];
    if (entry.tvgId) attrs.push(`tvg-id="${entry.tvgId}"`);
    if (entry.tvgName ?? entry.name) attrs.push(`tvg-name="${entry.tvgName ?? entry.name}"`);
    if (entry.logo) attrs.push(`tvg-logo="${entry.logo}"`);
    if (entry.group) attrs.push(`group-title="${entry.group}"`);

    const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    lines.push(`#EXTINF:${duration}${attrStr},${title}`);

    // Optional artist line for music playlists
    if (entry.artist) {
      lines.push(`#EXTVLCOPT:meta-artist=${entry.artist}`);
    }

    lines.push(url);
  }

  return lines.join('\n');
}

// ─── Number Base Converter ───────────────────────────────────

export function numberBaseConvert(input: string): string {
  if (!input.trim()) throw new Error('Input is empty');

  const trimmed = input.trim();
  let value: bigint;

  try {
    if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
      value = BigInt(trimmed);
    } else if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) {
      value = BigInt(trimmed);
    } else if (trimmed.startsWith('0o') || trimmed.startsWith('0O')) {
      value = BigInt(trimmed);
    } else {
      value = BigInt(trimmed);
    }
  } catch {
    throw new Error(
      'Invalid number. Use prefixes: 0x (hex), 0b (binary), 0o (octal), or plain decimal.'
    );
  }

  const zero = BigInt(0);
  const isNeg = value < zero;
  const abs = isNeg ? -value : value;
  const sign = isNeg ? '-' : '';

  return [
    `Decimal:     ${sign}${abs.toString(10)}`,
    `Hexadecimal: ${sign}0x${abs.toString(16).toUpperCase()}`,
    `Octal:       ${sign}0o${abs.toString(8)}`,
    `Binary:      ${sign}0b${abs.toString(2)}`,
  ].join('\n');
}
