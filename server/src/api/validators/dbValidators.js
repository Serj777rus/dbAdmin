import { body } from 'express-validator';

export const createDatabaseValidator = [
  body('name')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Название базы может содержать только латиницу, цифры и _')
];

export const createTableValidator = [
  body('schemaSql')
    .isString()
    .isLength({ min: 10 })
    .withMessage('SQL схема должна быть указана')
];

export const insertRowValidator = [
  body('data').notEmpty().withMessage('Данные обязательны')
];

export const updateRowValidator = [
  body('keyColumn').notEmpty().withMessage('Ключевое поле обязательно'),
  body('keyValue').notEmpty().withMessage('Значение ключа обязательно'),
  body('data').notEmpty().withMessage('Данные обязательны')
];

export const deleteRowValidator = [
  body('keyColumn').notEmpty().withMessage('Ключевое поле обязательно'),
  body('keyValue').notEmpty().withMessage('Значение ключа обязательно')
];

export const queryValidator = [
  body('sql')
    .isString()
    .isLength({ min: 3 })
    .withMessage('SQL запрос обязателен')
];

