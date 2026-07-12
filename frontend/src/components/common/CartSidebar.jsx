import { Minus, Plus, X } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../utils/format.js';

const CartSidebar = ({ onClose, onNeedLogin }) => {
  const { cart, selectedRestaurant, total, itemCount, updateQuantity, isSubmitting, checkout } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    onClose();
    checkout(onNeedLogin);
  };

  return (
    <div
      id="cart-overlay"
      className="fixed inset-0 z-50 flex justify-end bg-black/40"
      onClick={(e) => e.target.id === 'cart-overlay' && onClose()}
    >
      <aside className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-black">Your basket</h2>
          <button id="cart-close" onClick={onClose} aria-label="Close cart">
            <X />
          </button>
        </div>

        <p className="pt-3 text-sm font-semibold text-orange-600">
          {selectedRestaurant?.name || 'No restaurant selected'}
        </p>

        <div className="flex-1 space-y-3 overflow-y-auto py-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-lg object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{item.name}</p>
                  <p className="text-sm text-orange-600">{formatCurrency(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white p-1 shadow-sm">
                  <button
                    id={`cart-decrease-${item.id}`}
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    id={`cart-increase-${item.id}`}
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-gray-500">Your basket is empty.</p>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="mb-2 flex justify-between">
              <span>Order total</span>
              <strong className="text-xl">{formatCurrency(total)}</strong>
            </div>
            <p className="mb-4 text-xs text-gray-500">
              You will be taken to Razorpay to complete this secure payment.
            </p>
            <button
              id="cart-checkout"
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-orange-600 py-3.5 font-bold text-white disabled:opacity-70"
            >
              {isSubmitting
                ? 'Opening Razorpay…'
                : user
                ? `Pay ${formatCurrency(total)} with Razorpay`
                : 'Log in to pay with Razorpay'}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartSidebar;
