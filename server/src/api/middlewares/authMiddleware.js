import { verifyToken } from '../../utils/jwt.js';
import { unauthorized, forbidden } from '../../utils/httpError.js';

export const authGuard = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw unauthorized();
  }
  try {
    const token = header.replace('Bearer ', '');
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    throw unauthorized();
  }
};

export const requireMaster = (req, _res, next) => {
  if (req.user?.role !== 'master') {
    throw forbidden('Требуются права главного администратора');
  }
  next();
};

