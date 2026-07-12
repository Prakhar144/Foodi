import { LogIn, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const Navbar = ({ onOpenCart, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:px-8">
      <button
        id="nav-logo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-2xl font-black tracking-tight text-orange-600"
      >
        Foodie
      </button>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden text-sm font-semibold text-gray-600 sm:block">
              Hi, {user.name}
            </span>
            <button
              id="nav-logout"
              onClick={logout}
              title="Log out"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <button
            id="nav-login"
            onClick={() => onOpenAuth('login')}
            className="flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50"
          >
            <LogIn size={17} />
            Log in
          </button>
        )}

        <button
          id="nav-cart"
          onClick={onOpenCart}
          className="relative rounded-xl bg-orange-600 p-2.5 text-white"
          aria-label={`Open cart, ${itemCount} items`}
        >
          <ShoppingCart size={21} />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs font-bold">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
