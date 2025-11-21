import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { SystemSetting } from '../models/SystemSetting.js';
import { hashPassword } from '../utils/password.js';
import { HttpError, badRequest } from '../utils/httpError.js';

const MASTER_CREATED_KEY = 'master_created';

export const isMasterCreated = async () => {
  const setting = await SystemSetting.findOne({
    where: { key: MASTER_CREATED_KEY }
  });
  if (setting) {
    return true;
  }

  const masterExists = await User.count({
    where: { role: 'master' }
  });
  return masterExists > 0;
};

export const createMasterAdmin = async ({ email, password, fullName }) => {
  const masterExists = await isMasterCreated();
  if (masterExists) {
    throw new HttpError(409, 'Главный администратор уже создан');
  }

  const candidate = await User.findOne({
    where: {
      email: { [Op.eq]: email }
    }
  });
  if (candidate) {
    throw badRequest('Пользователь с таким email уже существует');
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email,
    passwordHash,
    fullName,
    role: 'master'
  });
  await SystemSetting.create({
    key: MASTER_CREATED_KEY,
    value: 'true'
  });
  return user;
};

