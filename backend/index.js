import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;

const databaseUrl = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null;
const dbConfig = databaseUrl ? {
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username || 'root'),
  password: decodeURIComponent(databaseUrl.password || ''),
  database: databaseUrl.pathname.replace(/^\//, '') || 'railway',
} : {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'cravingdash',
};

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
});

const restaurants = [
  { id: 1, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.8, eta: '20–30 min', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&auto=format&fit=crop&q=75' },
  { id: 5, name: 'Wok This Way', cuisine: 'Chinese & Asian', rating: 4.7, eta: '25–35 min', image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=900&auto=format&fit=crop&q=75' },
  { id: 6, name: 'Dosa Darbar', cuisine: 'South Indian', rating: 4.8, eta: '20–30 min', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=900&auto=format&fit=crop&q=75' },
  { id: 7, name: 'The Green Bowl', cuisine: 'Healthy & Salads', rating: 4.5, eta: '15–25 min', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&auto=format&fit=crop&q=75' },
  { id: 8, name: 'Biryani Blues', cuisine: 'Biryani & Kebabs', rating: 4.9, eta: '30–40 min', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&auto=format&fit=crop&q=75' },
  { id: 2, name: 'Burger District', cuisine: 'Burgers & Grill', rating: 4.7, eta: '15–25 min', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&auto=format&fit=crop&q=75' },
  { id: 3, name: 'Spice Route', cuisine: 'Indian', rating: 4.9, eta: '25–35 min', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&auto=format&fit=crop&q=75' },
  { id: 4, name: 'Sweet Street', cuisine: 'Desserts & Café', rating: 4.6, eta: '15–20 min', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&auto=format&fit=crop&q=75' },
];

const foodItems = [
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

const users = [];
const sessions = new Map();
const orders = [];
const paymentOrders = new Map();
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, 64, (error, derivedKey) => error ? reject(error) : resolve(`${salt}:${derivedKey.toString('hex')}`));
});
const verifyPassword = async (password, storedHash) => {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const candidate = await hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(storedHash));
};
const createSession = (user) => {
  const token = `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  sessions.set(token, user.id);
  return token;
};
const authenticatedUser = async (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const userId = sessions.get(token);
  if (!userId) return null;
  const [rows] = await db.execute('SELECT id, name, email FROM users WHERE id = ?', [userId]);
  return rows[0] || null;
};
const publicUser = ({ id, name, email }) => ({ id, name, email });

const buildOrderItems = (cart, restaurantId) => {
  const restaurant = restaurants.find((entry) => entry.id === Number(restaurantId));
  if (!Array.isArray(cart) || !cart.length || !restaurant) return { error: 'Choose a restaurant and add items to your cart.' };
  const items = [];
  for (const cartItem of cart) {
    const food = foodItems.find((entry) => entry.id === Number(cartItem.id) && entry.restaurantId === restaurant.id);
    const quantity = Number(cartItem.quantity);
    if (!food || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) return { error: 'Your cart contains an invalid item or quantity.' };
    items.push({ id: food.id, name: food.name, price: food.price, quantity });
  }
  return { restaurant, items, total: Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)) };
};

app.get('/api/restaurants', (req, res) => res.json(restaurants));

app.get('/api/food', (req, res) => {
  const restaurantId = Number(req.query.restaurantId);
  const search = String(req.query.search || '').trim().toLowerCase();
  const category = String(req.query.category || '').trim().toLowerCase();
  res.json(foodItems.filter((item) =>
    (!restaurantId || item.restaurantId === restaurantId) &&
    (!search || `${item.name} ${item.category}`.toLowerCase().includes(search)) &&
    (!category || item.category.toLowerCase() === category)
  ));
});

app.post('/api/auth/signup', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Enter a name, valid email, and a password of at least 6 characters.' });
  }
  try {
    const passwordHash = await hashPassword(password);
    const [result] = await db.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash]);
    const user = { id: result.insertId, name, email };
    res.status(201).json({ success: true, user, token: createSession(user) });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    console.error('Sign-up error:', error);
    res.status(500).json({ success: false, message: 'Unable to create your account. Check the database connection.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  try {
    const [rows] = await db.execute('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !(await verifyPassword(password, user.password_hash))) return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    res.json({ success: true, user: publicUser(user), token: createSession(user) });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Unable to log in. Check the database connection.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) sessions.delete(token);
  res.json({ success: true });
});

app.post('/api/payments/order', async (req, res) => {
  const user = await authenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Please log in before placing an order.' });
  const { cart, restaurantId } = req.body;
  const orderDetails = buildOrderItems(cart, restaurantId);
  if (orderDetails.error) return res.status(400).json({ success: false, message: orderDetails.error });
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID.includes('your_key')) {
    return res.status(503).json({ success: false, message: 'Razorpay is not configured yet. Add your test keys to the backend environment.' });
  }
  try {
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: Math.round(orderDetails.total * 100), currency: 'INR', receipt: `food_${Date.now()}` }),
    });
    const razorpayOrder = await razorpayResponse.json();
    if (!razorpayResponse.ok) throw new Error(razorpayOrder.error?.description || 'Razorpay could not create a payment order.');
    paymentOrders.set(razorpayOrder.id, { userId: user.id, ...orderDetails, razorpayOrderId: razorpayOrder.id });
    res.status(201).json({ success: true, keyId: process.env.RAZORPAY_KEY_ID, order: razorpayOrder, customer: publicUser(user) });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message || 'Unable to start payment.' });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  const user = await authenticatedUser(req);
  if (!user) return res.status(401).json({ success: false, message: 'Please log in before confirming payment.' });
  const { razorpay_payment_id: paymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: signature } = req.body;
  const pending = paymentOrders.get(razorpayOrderId);
  if (!pending || pending.userId !== user.id || !paymentId || !signature) return res.status(400).json({ success: false, message: 'Invalid payment confirmation.' });
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${paymentId}`).digest('hex');
  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);
  const validSignature = expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  if (!validSignature) return res.status(400).json({ success: false, message: 'Payment verification failed. Your order was not placed.' });
  const order = { id: `ORD-${Date.now().toString().slice(-6)}`, userId: user.id, restaurant: pending.restaurant.name, items: pending.items, total: pending.total, paymentId, razorpayOrderId, status: 'paid', createdAt: new Date().toISOString() };
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [savedOrder] = await connection.execute('INSERT INTO orders (order_code, user_id, restaurant_name, total, payment_id, razorpay_order_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [order.id, order.userId, order.restaurant, order.total, order.paymentId, order.razorpayOrderId, order.status]);
    for (const item of order.items) await connection.execute('INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity) VALUES (?, ?, ?, ?, ?)', [savedOrder.insertId, item.id, item.name, item.price, item.quantity]);
    await connection.commit();
    paymentOrders.delete(razorpayOrderId);
    orders.push(order);
    res.status(201).json({ success: true, message: 'Payment verified and order placed!', orderId: order.id, total: order.total });
  } catch (error) {
    await connection.rollback();
    console.error('Order save error:', error);
    res.status(500).json({ success: false, message: 'Payment was verified but the order could not be saved. Please contact support.' });
  } finally {
    connection.release();
  }
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
db.getConnection()
  .then((connection) => { connection.release(); app.listen(PORT, () => console.log(`Backend server running at http://localhost:${PORT}`)); })
  .catch((error) => { console.error('Unable to connect to MySQL. Check your .env values and run database/schema.sql first.', error.message); process.exit(1); });
