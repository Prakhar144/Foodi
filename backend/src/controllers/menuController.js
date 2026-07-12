import { getFoodItems, getRestaurants } from '../models/catalogModel.js';
import { catchAsync } from '../utils/catchAsync.js';

export const listRestaurants = catchAsync(async (req, res) => {
  return res.json(getRestaurants());
});

export const listFood = catchAsync(async (req, res) => {
  const { restaurantId, search, category } = req.query;
  const food = getFoodItems({ restaurantId, search, category });
  return res.json(food);
});
