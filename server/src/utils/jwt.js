import jwt from 'jsonwebtoken';
import { securityConfig } from '../config/env.js';
export const signToken = (user) => {
  const payload = { id: user.id, role: user.role };
  return jwt.sign(payload, securityConfig.jwtSecret, {
    expiresIn: securityConfig.jwtExpiresIn
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, securityConfig.jwtSecret);
};

