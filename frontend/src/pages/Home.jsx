import { useEffect, useMemo, useState } from 'react';
import { LoaderCircle, Search } from 'lucide-react';
import { API_URL } from '../constants/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useNotice } from '../context/NoticeContext.jsx';
import Alert from '../components/ui/Alert.jsx';
import RestaurantCard from '../components/ui/RestaurantCard.jsx';
import MenuItemCard from '../components/ui/MenuItemCard.jsx';
import CartSidebar from '../components/common/CartSidebar.jsx';
import AuthModal from '../components/common/AuthModal.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import Header from '../components/layout/Header.jsx';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);

  const { selectedRestaurant, chooseRestaurant } = useCart();
  const { showNotice } = useNotice();

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/restaurants`).then((r) => r.json()),
      fetch(`${API_URL}/api/food`).then((r) => r.json()),
    ])
      .then(([restaurantData, menuData]) => {
        setRestaurants(restaurantData);
        setMenu(menuData);
      })
      .catch(() => {
        showNotice('error', 'We could not load the menu. Start the backend server and try again.');
      })
      .finally(() => setIsLoading(false));
  }, [showNotice]);

  const activeMenu = useMemo(
    () => menu.filter((item) => item.restaurantId === selectedRestaurant?.id),
    [menu, selectedRestaurant]
  );

  const categories = useMemo(
    () => ['All', ...new Set(activeMenu.map((item) => item.category))],
    [activeMenu]
  );

  const displayedItems = useMemo(
    () =>
      activeMenu.filter(
        (item) =>
          (category === 'All' || item.category === category) &&
          `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())
      ),
    [activeMenu, category, search]
  );

  const handleChooseRestaurant = (restaurant) => {
    chooseRestaurant(restaurant);
    setCategory('All');
    setSearch('');
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);
  const handleOpenAuth = (mode) => setAuthMode(mode);
  const handleCloseAuth = () => setAuthMode(null);
  const handleNeedLogin = () => { setIsCartOpen(false); setAuthMode('login'); };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar onOpenCart={handleOpenCart} onOpenAuth={handleOpenAuth} />
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <Alert />

        {/* Restaurants section */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-bold text-orange-600">RESTAURANTS</p>
              <h2 className="text-3xl font-black">Choose where to order</h2>
            </div>
            <span className="text-sm text-gray-500">{restaurants.length} places nearby</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={() => handleChooseRestaurant(restaurant)}
              />
            ))}
          </div>
        </section>

        {/* Menu section */}
        <section id="menu" className="mt-14 scroll-mt-20">
          {selectedRestaurant ? (
            <>
              <div className="mb-6">
                <p className="font-bold text-orange-600">
                  {selectedRestaurant.cuisine.toUpperCase()}
                </p>
                <h2 className="text-3xl font-black">{selectedRestaurant.name} menu</h2>
              </div>

              <div className="mb-7 flex flex-col gap-3 md:flex-row md:justify-between">
                <label className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    id="menu-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search this menu"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-orange-500"
                  />
                </label>

                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((name) => (
                    <button
                      key={name}
                      id={`category-${name.toLowerCase()}`}
                      onClick={() => setCategory(name)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${
                        category === name
                          ? 'bg-orange-600 text-white'
                          : 'bg-white ring-1 ring-gray-200'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-16 text-orange-600">
                  <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {displayedItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 py-16 text-center">
              <p className="text-xl font-bold">Choose a restaurant to see its food list.</p>
              <p className="mt-2 text-gray-600">
                Every restaurant has its own menu ready to order.
              </p>
            </div>
          )}
        </section>
      </main>

      {isCartOpen && (
        <CartSidebar onClose={handleCloseCart} onNeedLogin={handleNeedLogin} />
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={handleCloseAuth}
          onSwitchMode={(m) => setAuthMode(m)}
        />
      )}
    </div>
  );
};

export default Home;
