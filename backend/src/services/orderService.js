import { getFoodItemById, getRestaurantById } from '../models/catalogModel.js';

export const buildOrderItems = (cart, restaurantId) => {
  const restaurant = getRestaurantById(restaurantId);
  if (!Array.isArray(cart) || !cart.length || !restaurant) {
    return { error: 'Choose a restaurant and add items to your cart.' };
  }

  const items = [];

  for (const cartItem of cart) {
    const food = getFoodItemById(cartItem.id, restaurant.id);
    const quantity = Number(cartItem.quantity);

    if (!food || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return { error: 'Your cart contains an invalid item or quantity.' };
    }

    items.push({ id: food.id, name: food.name, price: food.price, quantity });
  }

  return {
    restaurant,
    items,
    total: Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)),
  };
};
