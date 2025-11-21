import { validationResult } from 'express-validator';
import { badRequest } from '../../utils/httpError.js';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw badRequest('Ошибки валидации');
  }
  next();
};

