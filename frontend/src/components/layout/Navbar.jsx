import { LogIn, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

const Navbar = ({ onOpenCart, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="sticky top-0 z-40 border-b border-white/8 bg-[#070708]/80 px-4 py-3 backdrop-blur-2xl md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
      <button
        id="nav-logo"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-3 text-xl font-bold tracking-tight text-white sm:text-2xl"
      >
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 text-base font-black text-black shadow-[0_12px_28px_rgba(212,175,55,0.28)]">
          F
        </span>
        <span className="font-['Sora'] tracking-tight">
          Foodie <span className="text-amber-300">Lux</span>
        </span>
      </button>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="hidden rounded-full border border-white/8 bg-white/5 px-3 py-2 text-sm font-medium text-white/65 sm:block">
              Hi, {user.name}
            </span>
            <button
              id="nav-logout"
              onClick={logout}
              title="Log out"
              className="rounded-xl border border-white/8 bg-white/5 p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <button
            id="nav-login"
            onClick={() => onOpenAuth('login')}
            className="premium-button-secondary text-sm font-semibold"
          >
            <LogIn size={17} />
            Log in
          </button>
        )}

        <button
          id="nav-cart"
          onClick={onOpenCart}
          className="premium-button relative px-4 py-2.5 text-sm"
          aria-label={`Open cart, ${itemCount} items`}
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-black text-xs font-bold text-amber-300 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
              {itemCount}
            </span>
          )}
        </button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
