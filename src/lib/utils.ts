import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  } finally {
    textArea.remove();
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

// ─── Safe JSON Parse ─────────────────────────────────────────
// Handles JSON that contains literal newlines/tabs/carriage-returns
// inside string values (common when pasting from terminals, APIs, logs).

/**
 * Walk through a JSON string and escape literal control characters
 * (newlines, carriage-returns, tabs) that appear inside quoted strings.
 */
function sanitizeJsonStrings(input: string): string {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }

    if (char === '\\' && inString) {
      result += char;
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }

    if (inString) {
      // Replace literal control characters with their escape sequences
      if (char === '\n') { result += '\\n'; continue; }
      if (char === '\r') { result += '\\r'; continue; }
      if (char === '\t') { result += '\\t'; continue; }
    }

    result += char;
  }

  return result;
}

/**
 * Try JSON.parse first; if it fails, sanitize literal newlines inside
 * string values and retry.  Throws the *original* error when both fail.
 */
export function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (originalError) {
    try {
      const sanitized = sanitizeJsonStrings(input);
      return JSON.parse(sanitized);
    } catch {
      // Throw the original error so the message stays meaningful
      throw originalError;
    }
  }
}
