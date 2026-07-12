import { pool } from '../config/db.js';

export const savePaidOrder = async (order) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [savedOrder] = await connection.execute(
      'INSERT INTO orders (order_code, user_id, restaurant_name, total, payment_id, razorpay_order_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [order.orderCode, order.userId, order.restaurantName, order.total, order.paymentId, order.razorpayOrderId, order.status],
    );

    for (const item of order.items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, food_id, food_name, unit_price, quantity) VALUES (?, ?, ?, ?, ?)',
        [savedOrder.insertId, item.id, item.name, item.price, item.quantity],
      );
    }

    await connection.commit();
    return savedOrder.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
