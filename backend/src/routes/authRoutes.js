import { Router } from 'express';
import { login, logout, signup } from '../controllers/authController.js';
import { validateLogin, validateSignup } from '../middleware/validate.js';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

export default router;
