import pino from "pino";

const redact = {
  paths: [
    "body.password",
    "body.currentPassword",
    "body.newPassword",
    "body.token",
    "body.refreshToken",
    "headers.authorization",
    "headers.Authorization",
  ],
  censor: "[Redacted]",
};

const isDev = process.env.NODE_ENV !== "production";

export const logger = isDev
  ? pino({
      name: "api",
      level: process.env.LOG_LEVEL ?? "debug",
      redact,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    })
  : pino({
      name: "api",
      level: process.env.LOG_LEVEL ?? "info",
      redact,
    });
