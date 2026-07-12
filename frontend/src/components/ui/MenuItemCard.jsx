import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/format.js';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <article id={`menu-item-${item.id}`} className="premium-card group flex h-full flex-col">
      <div className="relative h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.18)_46%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute left-4 top-4">
          <span className="premium-chip border-emerald-300/15 bg-black/35 text-emerald-100">
            {item.category}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-semibold tracking-tight text-white">{item.name}</h3>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Premium plated, photo-forward, and ready for instant checkout.
        </p>
        <div className="mt-6 flex items-center justify-between gap-3 pt-4">
          <strong className="text-lg text-white">{formatCurrency(item.price)}</strong>
          <button
            id={`add-to-cart-${item.id}`}
            onClick={() => addToCart(item)}
            className="premium-button px-4 py-3 text-sm"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default MenuItemCard;
