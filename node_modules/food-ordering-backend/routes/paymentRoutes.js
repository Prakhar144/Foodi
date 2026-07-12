import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/payments/order', requireAuth, createPaymentOrder);
router.post('/payments/verify', requireAuth, verifyPayment);

export default router;
