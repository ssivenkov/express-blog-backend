import { body } from "express-validator";

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 6 символов').isLength({ min: 6 })
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен содержать минимум 6 символов').isLength({ min: 6 }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватар').optional().isURL(),
];
