import crypto from 'crypto';
import { savePaidOrder } from '../models/orderModel.js';
import { buildOrderItems } from '../services/orderService.js';
import { deletePendingPayment, getPendingPayment, savePendingPayment } from '../services/paymentStore.js';
import { publicUser } from '../services/authService.js';
import { config } from '../config/config.js';
import { BadRequestError, InternalServerError, AppError } from '../utils/errors.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createPaymentOrder = catchAsync(async (req, res) => {
  const { cart, restaurantId } = req.body;
  const orderDetails = buildOrderItems(cart, restaurantId);

  if (orderDetails.error) {
    throw new BadRequestError(orderDetails.error);
  }

  const { keyId, keySecret } = config.razorpay;
  if (!keyId || !keySecret || keyId.includes('your_key')) {
    throw new AppError('Razorpay is not configured yet. Add your test keys to the backend environment.', 503);
  }

  try {
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(orderDetails.total * 100),
        currency: 'INR',
        receipt: `food_${Date.now()}`,
      }),
    });

    const razorpayOrder = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      throw new Error(razorpayOrder.error?.description || 'Razorpay could not create a payment order.');
    }

    savePendingPayment(razorpayOrder.id, {
      userId: req.authUser.id,
      ...orderDetails,
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      success: true,
      keyId,
      order: razorpayOrder,
      customer: publicUser(req.authUser),
    });
  } catch (error) {
    throw new InternalServerError(error.message || 'Unable to start payment.');
  }
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_payment_id: paymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: signature } = req.body;
  const pending = getPendingPayment(razorpayOrderId);

  if (!pending || pending.userId !== req.authUser.id || !paymentId || !signature) {
    throw new BadRequestError('Invalid payment confirmation.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${razorpayOrderId}|${paymentId}`)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);
  const validSignature = expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

  if (!validSignature) {
    throw new BadRequestError('Payment verification failed. Your order was not placed.');
  }

  const order = {
    orderCode: `ORD-${Date.now().toString().slice(-6)}`,
    userId: req.authUser.id,
    restaurantName: pending.restaurant.name,
    items: pending.items,
    total: pending.total,
    paymentId,
    razorpayOrderId,
    status: 'paid',
  };

  await savePaidOrder(order);
  deletePendingPayment(razorpayOrderId);

  return res.status(201).json({
    success: true,
    message: 'Payment verified and order placed!',
    orderId: order.orderCode,
    total: order.total,
  });
});
