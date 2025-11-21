import { Router } from 'express';
import { loginController, meController } from '../controllers/authController.js';
import { loginValidator } from '../validators/authValidators.js';
import { validate } from '../middlewares/validate.js';
import { authGuard } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', loginValidator, validate, loginController);
router.get('/me', authGuard, meController);

export default router;

