import { BadRequestError } from '../utils/errors.js';

export const validateSignup = (req, res, next) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!name || name.length < 2) {
    throw new BadRequestError('Enter a name of at least 2 characters.');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new BadRequestError('Please enter a valid email address.');
  }

  if (!password || password.length < 6) {
    throw new BadRequestError('Password must be at least 6 characters long.');
  }

  req.body.name = name;
  req.body.email = email;
  req.body.password = password;
  next();
};

export const validateLogin = (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new BadRequestError('Please enter a valid email address.');
  }

  if (!password) {
    throw new BadRequestError('Password is required.');
  }

  req.body.email = email;
  req.body.password = password;
  next();
};

export const validatePaymentOrder = (req, res, next) => {
  const { cart, restaurantId } = req.body;

  if (!restaurantId || isNaN(Number(restaurantId))) {
    throw new BadRequestError('A valid restaurant ID is required.');
  }

  if (!Array.isArray(cart) || cart.length === 0) {
    throw new BadRequestError('Choose a restaurant and add items to your cart.');
  }

  for (const item of cart) {
    if (!item.id || isNaN(Number(item.id))) {
      throw new BadRequestError('Your cart contains an invalid item.');
    }
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new BadRequestError('Your cart contains an invalid item quantity (must be 1–20).');
    }
  }

  next();
};

export const validatePaymentVerify = (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    throw new BadRequestError('Invalid payment confirmation details.');
  }

  next();
};
