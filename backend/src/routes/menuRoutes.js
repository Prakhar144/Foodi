import { Router } from 'express';
import { listFood, listRestaurants } from '../controllers/menuController.js';

const router = Router();

router.get('/restaurants', listRestaurants);
router.get('/food', listFood);

export default router;
