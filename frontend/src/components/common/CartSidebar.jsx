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
      className="fixed inset-0 z-50 flex justify-end bg-black/72 backdrop-blur-md"
      onClick={(e) => e.target.id === 'cart-overlay' && onClose()}
    >
      <aside className="flex h-full w-full max-w-md flex-col border-l border-white/8 bg-[#0b0b0f]/90 p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-200/65">Checkout</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">Your basket</h2>
          </div>
          <button id="cart-close" onClick={onClose} aria-label="Close cart" className="rounded-xl border border-white/8 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white">
            <X />
          </button>
        </div>

        <p className="pt-3 text-sm font-semibold text-amber-200/80">
          {selectedRestaurant?.name || 'No restaurant selected'}
        </p>

        <div className="flex-1 space-y-3 overflow-y-auto py-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-3 backdrop-blur-xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-amber-200/85">{formatCurrency(item.price * item.quantity)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-black/35 p-1 shadow-sm">
                  <button
                    id={`cart-decrease-${item.id}`}
                    onClick={() => updateQuantity(item.id, -1)}
                    className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="min-w-5 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    id={`cart-increase-${item.id}`}
                    onClick={() => updateQuantity(item.id, 1)}
                    className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-12 text-center text-white/45">Your basket is empty.</p>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-white/8 pt-4">
            <div className="mb-2 flex justify-between">
              <span className="text-white/65">Order total</span>
              <strong className="text-2xl text-white">{formatCurrency(total)}</strong>
            </div>
            <p className="mb-4 text-xs leading-5 text-white/45">
              You will be taken to Razorpay to complete this secure payment.
            </p>
            <button
              id="cart-checkout"
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="premium-button w-full py-4 text-base"
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
