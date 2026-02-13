import { NextRequest, NextResponse } from 'next/server';
import pug from 'pug';
import { logger } from '@/lib/logger';
import { getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate limit check
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

    logger.info('Pug to HTML conversion requested', 'api', {
      inputLength: input.length,
      ip,
    });

    const html = pug.render(input, { pretty: ' '.repeat(indent) });

    return NextResponse.json({ output: html });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Pug compilation failed';
    logger.error('Pug to HTML conversion failed', err as Error, 'api', { ip });

    return NextResponse.json(
      { error: `Pug compilation error: ${message}` },
      { status: 422 }
    );
  }
}
