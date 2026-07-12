const paymentOrders = new Map();

export const savePendingPayment = (razorpayOrderId, payload) => {
  paymentOrders.set(razorpayOrderId, payload);
};

export const getPendingPayment = (razorpayOrderId) => paymentOrders.get(razorpayOrderId);

export const deletePendingPayment = (razorpayOrderId) => {
  paymentOrders.delete(razorpayOrderId);
};
