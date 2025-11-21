import { Router } from 'express';
import { authGuard } from '../middlewares/authMiddleware.js';
import { getAnalyticsController } from '../controllers/analyticsController.js';

const router = Router();

router.use(authGuard);
router.get('/summary', getAnalyticsController);

export default router;

