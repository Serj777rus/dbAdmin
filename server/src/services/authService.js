import { User } from '../models/User.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { badRequest, unauthorized } from '../utils/httpError.js';
import { signToken } from '../utils/jwt.js';

export const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw unauthorized('Неверный email или пароль');
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw unauthorized('Неверный email или пароль');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken(user);
  return { token, user };
};

export const createUser = async ({ email, password, fullName, role }) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    throw badRequest('Пользователь с таким email уже существует');
  }

  const passwordHash = await hashPassword(password);
  return User.create({
    email,
    fullName,
    passwordHash,
    role
  });
};

export const listUsers = () => {
  return User.findAll({
    attributes: ['id', 'email', 'fullName', 'role', 'lastLoginAt', 'createdAt']
  });
};

export const removeUser = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw badRequest('Пользователь не найден');
  }
  if (user.role === 'master') {
    throw badRequest('Нельзя удалить главного администратора');
  }
  await user.destroy();
};

export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'email', 'fullName', 'role', 'lastLoginAt']
  });
  if (!user) {
    throw unauthorized();
  }
  return user;
};

