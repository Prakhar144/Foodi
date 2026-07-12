import { useEffect, useMemo, useState } from 'react';
import { ChefHat, Flame, LoaderCircle, Search, Sparkles } from 'lucide-react';
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
    <div className="app-shell text-[#f7f7f5]">
      <Navbar onOpenCart={handleOpenCart} onOpenAuth={handleOpenAuth} />
      <Header />

      <main className="relative mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-32">
        <Alert />

        {/* Restaurants section */}
        <section id="restaurants" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="premium-chip w-fit text-amber-200/90">
                <Flame size={14} className="text-[#f5c542]" />
                Curated delivery partners
              </span>
              <h2 className="font-['Sora'] text-3xl font-bold tracking-tight sm:text-4xl">
                Choose where tonight begins.
              </h2>
            </div>
            <span className="premium-chip text-white/70">{restaurants.length} restaurants nearby</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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
        <section id="menu" className="surface-shell mt-14 scroll-mt-24 rounded-[28px] p-4 sm:p-6 lg:p-8">
          {selectedRestaurant ? (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="premium-chip w-fit text-emerald-200/90">
                    <ChefHat size={14} className="text-[#18c37e]" />
                    {selectedRestaurant.cuisine}
                  </span>
                  <h2 className="font-['Sora'] text-3xl font-bold tracking-tight sm:text-4xl">
                    {selectedRestaurant.name} menu
                  </h2>
                </div>
                <span className="text-sm text-white/60">{displayedItems.length} dishes on the board</span>
              </div>

              <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="relative max-w-md flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={18} />
                  <input
                    id="menu-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search this menu"
                    className="premium-input pl-11"
                  />
                </label>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map((name) => (
                    <button
                      key={name}
                      id={`category-${name.toLowerCase()}`}
                      onClick={() => setCategory(name)}
                      className={`premium-chip whitespace-nowrap transition ${
                        category === name
                          ? 'border-amber-300/30 bg-amber-300/12 text-amber-100'
                          : 'text-white/65 hover:text-white'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/70">
                  <LoaderCircle className="animate-spin text-[#f5c542]" />
                  <p className="text-sm uppercase tracking-[0.24em] text-white/45">Loading the feast</p>
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
            <div className="grid gap-6 rounded-[24px] border border-white/8 bg-white/4 p-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:p-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-300/12 text-amber-200 shadow-[0_0_0_1px_rgba(245,197,66,0.18)]">
                <Sparkles size={26} />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold tracking-tight">Choose a restaurant to reveal the menu.</p>
                <p className="mx-auto max-w-xl text-white/60">
                  Each kitchen has its own premium menu, ready for a fast, polished ordering flow.
                </p>
              </div>
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
