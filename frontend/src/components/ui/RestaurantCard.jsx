import { Star } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';

const RestaurantCard = ({ restaurant, onSelect }) => {
  const { selectedRestaurant } = useCart();
  const isSelected = selectedRestaurant?.id === restaurant.id;

  return (
    <button
      id={`restaurant-${restaurant.id}`}
      onClick={onSelect}
      className={`overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-2 transition hover:-translate-y-1 hover:shadow-md ${
        isSelected ? 'ring-orange-500' : 'ring-transparent'
      }`}
    >
      <img
        src={restaurant.image}
        alt={restaurant.name}
        className="h-32 w-full object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="font-black">{restaurant.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{restaurant.cuisine}</p>
        <p className="mt-3 flex items-center gap-1 text-sm font-bold">
          <Star size={15} className="fill-amber-400 text-amber-400" />
          {restaurant.rating}
          <span className="ml-2 font-normal text-gray-500">{restaurant.eta}</span>
        </p>
      </div>
    </button>
  );
};

export default RestaurantCard;
