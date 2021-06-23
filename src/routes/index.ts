import express from 'express';
import authRoutes from './auth.routes';

const router = express.Router();

router.get('/api/health-check', (_, res) => res.send('OK'));
router.get('/api/auth', authRoutes);

export default router;
