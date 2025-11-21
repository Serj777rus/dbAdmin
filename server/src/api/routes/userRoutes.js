import { Router } from 'express';
import {
  createUserController,
  deleteUserController,
  listUsersController
} from '../controllers/userController.js';
import { authGuard, requireMaster } from '../middlewares/authMiddleware.js';
import { createUserValidator } from '../validators/userValidators.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.use(authGuard, requireMaster);
router.get('/', listUsersController);
router.post('/', createUserValidator, validate, createUserController);
router.delete('/:userId', deleteUserController);

export default router;

