import { Router } from 'express';
import {
  getSetupStatus,
  registerMaster
} from '../controllers/setupController.js';
import { masterRegisterValidator } from '../validators/authValidators.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/status', getSetupStatus);
router.post('/master', masterRegisterValidator, validate, registerMaster);

export default router;

