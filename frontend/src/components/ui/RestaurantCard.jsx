import { Star } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

const RestaurantCard = ({ restaurant, onSelect }) => {
  const { selectedRestaurant } = useCart();
  const isSelected = selectedRestaurant?.id === restaurant.id;

  return (
    <button
      id={`restaurant-${restaurant.id}`}
      onClick={onSelect}
      className={`premium-card group text-left ${isSelected ? 'ring-1 ring-amber-300/40 shadow-[0_24px_70px_rgba(212,175,55,0.12)]' : ''}`}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute left-4 top-4">
          <span className="premium-chip border-amber-300/20 bg-black/35 text-amber-200">
            <Star size={13} className="fill-amber-300 text-amber-300" />
            {restaurant.rating}
          </span>
        </div>
        {isSelected && (
          <div className="absolute right-4 top-4 rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-100 ring-1 ring-amber-300/25">
            Selected
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white">{restaurant.name}</h3>
          <p className="mt-1 text-sm text-white/60">{restaurant.cuisine}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>{restaurant.eta}</span>
          <span className="text-amber-300">Tap to explore</span>
        </div>
      </div>
    </button>
  );
};

export default RestaurantCard;
