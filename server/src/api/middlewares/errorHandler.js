import { HttpError } from '../../utils/httpError.js';
import { logger } from '../../config/logger.js';

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res
      .status(err.status)
      .json({ message: err.message, details: err.details ?? null });
    return;
  }
  logger.error(err?.stack || err?.message || String(err));
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
};

