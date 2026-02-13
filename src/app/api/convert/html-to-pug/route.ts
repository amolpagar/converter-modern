import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getClientIp, rateLimitResponse } from '@/lib/rate-limit';

/**
 * Lightweight HTML to Pug converter.
 *
 * We implement a basic converter here instead of relying on the heavy
 * html2pug/html2jade packages, which have large dependency trees and
 * can cause issues on serverless platforms (Vercel).
 *
 * For more complex HTML, consider installing a dedicated package:
 *   npm install html2pug
 */

function htmlToPug(html: string, indent = 2): string {
  const indentStr = ' '.repeat(indent);
  const lines: string[] = [];
  let depth = 0;

  // Remove doctype and process it separately
  const doctypeMatch = html.match(/<!DOCTYPE\s+html[^>]*>/i);
  if (doctypeMatch) {
    lines.push('doctype html');
    html = html.replace(doctypeMatch[0], '');
  }

  // Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Normalize whitespace between tags
  html = html.replace(/>\s+</g, '><').trim();

  // Tokenize: split into tags and text
  const tokens = html.match(/<[^>]+>|[^<]+/g) || [];

  for (const token of tokens) {
    if (token.startsWith('</')) {
      // Closing tag
      depth = Math.max(0, depth - 1);
      continue;
    }

    if (token.startsWith('<')) {
      // Opening tag
      const selfClosing = token.endsWith('/>') || /^<(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)\b/i.test(token);
      const tagMatch = token.match(/^<(\w+)([\s\S]*?)\/?>$/);

      if (!tagMatch) continue;

      const tagName = tagMatch[1].toLowerCase();
      let attrs = tagMatch[2].trim();

      let pugLine = indentStr.repeat(depth) + tagName;

      // Parse id and class from attributes
      const idMatch = attrs.match(/id\s*=\s*["']([^"']+)["']/);
      const classMatch = attrs.match(/class\s*=\s*["']([^"']+)["']/);

      if (idMatch) {
        pugLine += `#${idMatch[1]}`;
        attrs = attrs.replace(idMatch[0], '').trim();
      }

      if (classMatch) {
        const classes = classMatch[1].split(/\s+/).filter(Boolean);
        pugLine += classes.map((c) => `.${c}`).join('');
        attrs = attrs.replace(classMatch[0], '').trim();
      }

      // Remaining attributes
      const remainingAttrs: string[] = [];
      const attrRegex = /(\w[\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attrs)) !== null) {
        const name = attrMatch[1];
        const value = attrMatch[2] ?? attrMatch[3];
        if (name === 'id' || name === 'class') continue;
        if (value !== undefined) {
          remainingAttrs.push(`${name}="${value}"`);
        } else {
          remainingAttrs.push(name);
        }
      }

      if (remainingAttrs.length > 0) {
        pugLine += `(${remainingAttrs.join(', ')})`;
      }

      // For div with id/class, shorten by removing "div"
      if (tagName === 'div' && (idMatch || classMatch)) {
        pugLine = pugLine.replace(
          indentStr.repeat(depth) + 'div',
          indentStr.repeat(depth)
        );
      }

      lines.push(pugLine);

      if (!selfClosing) {
        depth++;
      }
    } else {
      // Text content
      const text = token.trim();
      if (text) {
        // Append to previous line if short, otherwise add as indented block
        if (lines.length > 0 && text.length < 60) {
          lines[lines.length - 1] += ` ${text}`;
        } else {
          lines.push(indentStr.repeat(depth) + `| ${text}`);
        }
      }
    }
  }

  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const limited = rateLimitResponse(ip);
  if (limited) return limited;

  try {
    const body = await request.json();
    const { input, indent = 2 } = body;

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input is required and must be a string.' },
        { status: 400 }
      );
    }

    if (input.length > 1_000_000) {
      return NextResponse.json(
        { error: 'Input exceeds maximum size of 1MB.' },
        { status: 413 }
      );
    }

    logger.info('HTML to Pug conversion requested', 'api', {
      inputLength: input.length,
      ip,
    });

    const result = htmlToPug(input, indent);

    return NextResponse.json({ output: result });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Conversion failed';
    logger.error('HTML to Pug conversion failed', err as Error, 'api', { ip });

    return NextResponse.json(
      { error: `Conversion error: ${message}` },
      { status: 422 }
    );
  }
}
