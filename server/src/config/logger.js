import winston from 'winston';
import { appConfig } from './env.js';

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts }) => {
  return `[${ts}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: appConfig.isProd ? 'info' : 'debug',
  format: combine(timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat)
    })
  ]
});

