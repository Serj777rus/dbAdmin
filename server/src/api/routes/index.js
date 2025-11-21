import { Router } from 'express';
import setupRoutes from './setupRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import connectionRoutes from './connectionRoutes.js';
import dbRoutes from './dbRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.use('/setup', setupRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/connections', connectionRoutes);
router.use('/db', dbRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

