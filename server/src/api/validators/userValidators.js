import { body } from 'express-validator';

export const createUserValidator = [
  body('email').isEmail().withMessage('Укажите корректный email'),
  body('fullName').notEmpty().withMessage('Имя обязательно'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Пароль должен быть не менее 8 символов')
];

