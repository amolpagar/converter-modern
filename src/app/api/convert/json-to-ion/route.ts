import { NextRequest, NextResponse } from 'next/server';
import { jsonToIon } from '@/lib/converters';
import { logger } from '@/lib/logger';
import { getClientIp, rateLimitResponse } from '@/lib/rate-limit';

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

    logger.info('JSON to ION conversion requested', 'api', {
      inputLength: input.length,
      ip,
    });

    const result = jsonToIon(input, indent);

    return NextResponse.json({ output: result });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Conversion failed';
    logger.error('JSON to ION conversion failed', err as Error, 'api', { ip });

    return NextResponse.json(
      { error: `Conversion error: ${message}` },
      { status: 422 }
    );
  }
}
