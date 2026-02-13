type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function createEntry(
  level: LogLevel,
  message: string,
  context?: string,
  data?: Record<string, unknown>,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && { context }),
    ...(data && { data }),
    ...(error && {
      error: {
        message: error.message,
        stack: error.stack,
      },
    }),
  };
  return entry;
}

function emit(entry: LogEntry): void {
  const output = JSON.stringify(entry);
  switch (entry.level) {
    case 'error':
      console.error(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'debug':
      console.debug(output);
      break;
    default:
      console.log(output);
  }
}

export const logger = {
  debug(message: string, context?: string, data?: Record<string, unknown>) {
    if (shouldLog('debug')) emit(createEntry('debug', message, context, data));
  },

  info(message: string, context?: string, data?: Record<string, unknown>) {
    if (shouldLog('info')) emit(createEntry('info', message, context, data));
  },

  warn(message: string, context?: string, data?: Record<string, unknown>) {
    if (shouldLog('warn')) emit(createEntry('warn', message, context, data));
  },

  error(
    message: string,
    error?: Error,
    context?: string,
    data?: Record<string, unknown>
  ) {
    if (shouldLog('error'))
      emit(createEntry('error', message, context, data, error));
  },
};
