import { body } from 'express-validator';

export const connectionValidator = [
  body('name').notEmpty().withMessage('Название обязательно'),
  body('host').notEmpty().withMessage('Хост обязателен'),
  body('port').isInt({ min: 1 }).withMessage('Порт должен быть числом'),
  body('username').notEmpty().withMessage('Имя пользователя обязательно'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
  body('ssl').optional().isBoolean()
];

