import { getFoodItems, getRestaurants } from '../models/catalogModel.js';

export const listRestaurants = (req, res) => res.json(getRestaurants());

export const listFood = (req, res) => {
  res.json(getFoodItems({
    restaurantId: req.query.restaurantId,
    search: req.query.search,
    category: req.query.category,
  }));
};
