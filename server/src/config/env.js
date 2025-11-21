import dotenv from 'dotenv';

dotenv.config();

const required = (value, key) => {
  if (!value) {
    throw new Error(`Переменная окружения ${key} не задана`);
  }
  return value;
};

export const appConfig = {
  env: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};

export const securityConfig = {
  jwtSecret: required(process.env.JWT_SECRET, 'JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  passwordSaltRounds: Number(process.env.PASSWORD_SALT_ROUNDS) || 12,
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100
};

export const dbConfig = {
  database: required(process.env.SERVICE_DB_NAME, 'SERVICE_DB_NAME'),
  username: required(process.env.SERVICE_DB_USER, 'SERVICE_DB_USER'),
  password: process.env.SERVICE_DB_PASSWORD || '',
  host: process.env.SERVICE_DB_HOST || 'localhost',
  port: Number(process.env.SERVICE_DB_PORT) || 3306,
  dialect: 'mysql'
};

export const analyticsConfig = {
  retentionDays: Number(process.env.ANALYTICS_RETENTION_DAYS) || 30
};

export const fileConfig = {
  backupDir: process.env.BACKUP_DIR || 'backups'
};

