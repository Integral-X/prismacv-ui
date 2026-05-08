import pino from 'pino';
import { sanitizeLogPayload } from './sanitize-log-payload';

const redact = {
  paths: [
    'password',
    'currentPassword',
    'newPassword',
    'confirmPassword',
    '*.password',
    '*.token',
    '*.accessToken',
    '*.refreshToken',
    '*.authorization',
    '*.cookie',
    'body.password',
    'body.currentPassword',
    'body.newPassword',
    'body.confirmPassword',
    'body.token',
    'body.accessToken',
    'body.refreshToken',
    'body.secret',
    'headers.authorization',
    'headers.Authorization',
    'headers.cookie',
    'headers.Cookie',
    'headers.set-cookie',
    'headers.Set-Cookie',
    'authorization',
    'cookie',
    'token',
    'refreshToken',
    'accessToken',
    'secret',
  ],
  censor: '[Redacted]',
};

const isDev = process.env.NODE_ENV !== 'production';

export const logger = isDev
  ? pino({
      name: 'api',
      level: process.env.LOG_LEVEL ?? 'debug',
      redact,
      hooks: {
        logMethod(inputArgs, method) {
          const sanitizedArgs = inputArgs.map((arg) => sanitizeLogPayload(arg));
          method.apply(this, sanitizedArgs as Parameters<typeof method>);
        },
      },
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    })
  : pino({
      name: 'api',
      level: process.env.LOG_LEVEL ?? 'info',
      redact,
      hooks: {
        logMethod(inputArgs, method) {
          const sanitizedArgs = inputArgs.map((arg) => sanitizeLogPayload(arg));
          method.apply(this, sanitizedArgs as Parameters<typeof method>);
        },
      },
    });
