import { useCart } from '../../context/CartContext.jsx';
import { formatCurrency } from '../../utils/format.js';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <article id={`menu-item-${item.id}`} className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <img
        src={item.image}
        alt={item.name}
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="p-5">
        <span className="rounded bg-orange-50 px-2 py-1 text-xs font-bold text-orange-600">
          {item.category}
        </span>
        <h3 className="mt-3 text-lg font-black">{item.name}</h3>
        <div className="mt-5 flex items-center justify-between">
          <strong>{formatCurrency(item.price)}</strong>
          <button
            id={`add-to-cart-${item.id}`}
            onClick={() => addToCart(item)}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
};

export default MenuItemCard;
