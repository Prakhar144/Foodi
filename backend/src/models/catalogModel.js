export const restaurants = [
  { id: 1, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.8, eta: '20–30 min', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=75' },
  { id: 5, name: 'Wok This Way', cuisine: 'Chinese & Asian', rating: 4.7, eta: '25–35 min', image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&auto=format&fit=crop&q=75' },
  { id: 6, name: 'Dosa Darbar', cuisine: 'South Indian', rating: 4.8, eta: '20–30 min', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=900&auto=format&fit=crop&q=75' },
  { id: 7, name: 'The Green Bowl', cuisine: 'Healthy & Salads', rating: 4.5, eta: '15–25 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=75' },
  { id: 8, name: 'Biryani Blues', cuisine: 'Biryani & Kebabs', rating: 4.9, eta: '30–40 min', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&auto=format&fit=crop&q=75' },
  { id: 2, name: 'Burger District', cuisine: 'Burgers & Grill', rating: 4.7, eta: '15–25 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=75' },
  { id: 3, name: 'Spice Route', cuisine: 'Indian', rating: 4.9, eta: '25–35 min', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&auto=format&fit=crop&q=75' },
  { id: 4, name: 'Sweet Street', cuisine: 'Desserts & Café', rating: 4.6, eta: '15–20 min', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&auto=format&fit=crop&q=75' },
];

export const foodItems = [
  { id: 1, restaurantId: 1, name: 'Double Cheese Margherita', price: 349, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=60' },
  { id: 2, restaurantId: 1, name: 'Fettuccine Alfredo', price: 399, category: 'Pasta', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=60' },
  { id: 3, restaurantId: 1, name: 'Garlic Bread', price: 149, category: 'Sides', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&auto=format&fit=crop&q=60' },
  { id: 4, restaurantId: 2, name: 'Crispy Chicken Burger', price: 289, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
  { id: 5, restaurantId: 2, name: 'Smoky Veggie Burger', price: 249, category: 'Burgers', image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&auto=format&fit=crop&q=60' },
  { id: 6, restaurantId: 2, name: 'Loaded Nachos', price: 199, category: 'Sides', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&auto=format&fit=crop&q=60' },
  { id: 7, restaurantId: 3, name: 'Butter Chicken Bowl', price: 379, category: 'Indian', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60' },
  { id: 8, restaurantId: 3, name: 'Paneer Tikka Masala', price: 329, category: 'Indian', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=500&auto=format&fit=crop&q=60' },
  { id: 9, restaurantId: 3, name: 'Saffron Rice', price: 119, category: 'Sides', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60' },
  { id: 10, restaurantId: 4, name: 'Chocolate Lava Cake', price: 179, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60' },
  { id: 11, restaurantId: 4, name: 'Berry Cheesecake', price: 199, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60' },
  { id: 12, restaurantId: 4, name: 'Cold Brew Coffee', price: 129, category: 'Drinks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60' },
  { id: 13, restaurantId: 5, name: 'Veg Hakka Noodles', price: 249, category: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60' },
  { id: 14, restaurantId: 5, name: 'Chilli Chicken', price: 319, category: 'Chinese', image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&auto=format&fit=crop&q=60' },
  { id: 15, restaurantId: 5, name: 'Veg Spring Rolls', price: 189, category: 'Starters', image: 'https://images.unsplash.com/photo-1548507200-6c4e6f6b5a8d?w=500&auto=format&fit=crop&q=60' },
  { id: 16, restaurantId: 6, name: 'Masala Dosa', price: 139, category: 'Dosa', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&auto=format&fit=crop&q=60' },
  { id: 17, restaurantId: 6, name: 'Idli Vada Combo', price: 119, category: 'Breakfast', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60' },
  { id: 18, restaurantId: 6, name: 'Filter Coffee', price: 69, category: 'Drinks', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60' },
  { id: 19, restaurantId: 7, name: 'Mediterranean Bowl', price: 299, category: 'Bowls', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60' },
  { id: 20, restaurantId: 7, name: 'Avocado Salad', price: 279, category: 'Salads', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60' },
  { id: 21, restaurantId: 7, name: 'Mango Smoothie', price: 159, category: 'Drinks', image: 'https://images.unsplash.com/photo-1553530666-ba11a90a0868?w=500&auto=format&fit=crop&q=60' },
  { id: 22, restaurantId: 8, name: 'Hyderabadi Chicken Biryani', price: 369, category: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60' },
  { id: 23, restaurantId: 8, name: 'Veg Dum Biryani', price: 299, category: 'Biryani', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&auto=format&fit=crop&q=60' },
  { id: 24, restaurantId: 8, name: 'Chicken Seekh Kebab', price: 269, category: 'Kebabs', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60' },
];

export const getRestaurants = () => restaurants;

export const getFoodItems = (filters = {}) => {
  const restaurantId = Number(filters.restaurantId || 0);
  const search = String(filters.search || '').trim().toLowerCase();
  const category = String(filters.category || '').trim().toLowerCase();

  return foodItems.filter((item) => (
    (!restaurantId || item.restaurantId === restaurantId) &&
    (!search || `${item.name} ${item.category}`.toLowerCase().includes(search)) &&
    (!category || item.category.toLowerCase() === category)
  ));
};

export const getRestaurantById = (restaurantId) => restaurants.find((restaurant) => restaurant.id === Number(restaurantId));

export const getFoodItemById = (foodId, restaurantId) => foodItems.find((item) => item.id === Number(foodId) && (!restaurantId || item.restaurantId === Number(restaurantId)));
