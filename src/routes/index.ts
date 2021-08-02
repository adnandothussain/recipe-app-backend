import express from 'express';
import authRoutes from './auth.route';

const router = express.Router();

router.get('/health-check', (_, res) => res.send('OK'));
router.use('/auth', authRoutes);

export default router;
