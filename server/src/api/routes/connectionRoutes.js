import { Router } from 'express';
import {
  createConnectionController,
  deleteConnectionController,
  getConnectionController,
  listConnectionsController,
  updateConnectionController
} from '../controllers/connectionController.js';
import { authGuard } from '../middlewares/authMiddleware.js';
import { connectionValidator } from '../validators/connectionValidators.js';
import { validate } from '../middlewares/validate.js';

const router = Router();
router.use(authGuard);

router.get('/', listConnectionsController);
router.post('/', connectionValidator, validate, createConnectionController);
router.get('/:id', getConnectionController);
router.put('/:id', connectionValidator, validate, updateConnectionController);
router.delete('/:id', deleteConnectionController);

export default router;

