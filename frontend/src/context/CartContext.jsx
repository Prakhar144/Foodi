import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../constants/api.js';
import { STORAGE_KEYS } from '../constants/storage.js';
import { useAuth } from './AuthContext.jsx';
import { useNotice } from './NoticeContext.jsx';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const { showNotice } = useNotice();

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    } catch {
      return [];
    }
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const chooseRestaurant = useCallback((restaurant) => {
    setSelectedRestaurant((prev) => {
      if (prev?.id !== restaurant.id) setCart([]);
      return restaurant;
    });
  }, []);

  const addToCart = useCallback((item) => {
    setCart((prev) =>
      prev.some((entry) => entry.id === item.id)
        ? prev.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...prev, { ...item, quantity: 1 }]
    );
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback(async (onNeedLogin) => {
    if (!user) {
      onNeedLogin();
      return;
    }

    if (!selectedRestaurant) {
      showNotice('error', 'Please choose a restaurant before continuing to payment.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay Checkout could not load. Please check your connection and try again.');
      }

      const response = await fetch(`${API_URL}/api/payments/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart, restaurantId: selectedRestaurant.id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (!data.order?.id || !data.keyId) {
        throw new Error('Razorpay order details were not received. Please try again.');
      }

      const payment = await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: data.keyId,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'Foodie',
          description: `Order from ${selectedRestaurant.name}`,
          order_id: data.order.id,
          prefill: { name: data.customer.name, email: data.customer.email },
          theme: { color: '#ea580c' },
          handler: resolve,
          modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
        });
        razorpay.open();
      });

      const verification = await fetch(`${API_URL}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payment),
      });

      const result = await verification.json();
      if (!verification.ok) throw new Error(result.message);

      clearCart();
      showNotice('success', `Payment received. Order ${result.orderId} is confirmed!`);
    } catch (error) {
      showNotice('error', error.message || 'Payment could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, token, cart, selectedRestaurant, clearCart, showNotice]);

  return (
    <CartContext.Provider value={{
      cart,
      selectedRestaurant,
      total,
      itemCount,
      isSubmitting,
      chooseRestaurant,
      addToCart,
      updateQuantity,
      clearCart,
      checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
