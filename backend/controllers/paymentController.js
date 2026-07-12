import crypto from 'crypto';
import { savePaidOrder } from '../models/orderModel.js';
import { buildOrderItems } from '../services/orderService.js';
import { deletePendingPayment, getPendingPayment, savePendingPayment } from '../services/paymentStore.js';
import { publicUser } from '../services/authService.js';

export const createPaymentOrder = async (req, res) => {
  const { cart, restaurantId } = req.body;
  const orderDetails = buildOrderItems(cart, restaurantId);

  if (orderDetails.error) {
    return res.status(400).json({ success: false, message: orderDetails.error });
  }

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
      keyId: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
      customer: publicUser(req.authUser),
    });
  } catch (error) {
    return res.status(502).json({ success: false, message: error.message || 'Unable to start payment.' });
  }
};

export const verifyPayment = async (req, res) => {
  const { razorpay_payment_id: paymentId, razorpay_order_id: razorpayOrderId, razorpay_signature: signature } = req.body;
  const pending = getPendingPayment(razorpayOrderId);

  if (!pending || pending.userId !== req.authUser.id || !paymentId || !signature) {
    return res.status(400).json({ success: false, message: 'Invalid payment confirmation.' });
  }

  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${paymentId}`).digest('hex');
  const expectedBuffer = Buffer.from(expectedSignature);
  const signatureBuffer = Buffer.from(signature);
  const validSignature = expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

  if (!validSignature) {
    return res.status(400).json({ success: false, message: 'Payment verification failed. Your order was not placed.' });
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

  try {
    await savePaidOrder(order);
    deletePendingPayment(razorpayOrderId);
    return res.status(201).json({ success: true, message: 'Payment verified and order placed!', orderId: order.orderCode, total: order.total });
  } catch (error) {
    console.error('Order save error:', error);
    return res.status(500).json({ success: false, message: 'Payment was verified but the order could not be saved. Please contact support.' });
  }
};
