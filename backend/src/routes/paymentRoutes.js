import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { validatePaymentOrder, validatePaymentVerify } from '../middleware/validate.js';

const router = Router();

router.post('/payments/order', requireAuth, validatePaymentOrder, createPaymentOrder);
router.post('/payments/verify', requireAuth, validatePaymentVerify, verifyPayment);

export default router;
