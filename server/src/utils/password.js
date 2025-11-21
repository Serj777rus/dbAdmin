import bcrypt from 'bcryptjs';
import { securityConfig } from '../config/env.js';

export const hashPassword = async (password) => {
  return bcrypt.hash(password, securityConfig.passwordSaltRounds);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

