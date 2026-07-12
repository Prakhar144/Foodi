import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, LoaderCircle, LogIn, LogOut, Minus, Plus, Search, ShoppingCart, Star, UserRound, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cravingdash-cart') || '[]'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('cravingdash-user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('cravingdash-token') || '');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => { localStorage.setItem('cravingdash-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { Promise.all([fetch(`${API_URL}/api/restaurants`).then((r) => r.json()), fetch(`${API_URL}/api/food`).then((r) => r.json())]).then(([restaurantData, menuData]) => { setRestaurants(restaurantData); setMenu(menuData); const savedRestaurant = restaurantData.find((restaurant) => restaurant.id === cart[0]?.restaurantId); if (savedRestaurant) setSelectedRestaurant(savedRestaurant); }).catch(() => setNotice({ type: 'error', text: 'We could not load the menu. Start the backend server and try again.' })).finally(() => setIsLoading(false)); }, []);

  const activeMenu = useMemo(() => menu.filter((item) => item.restaurantId === selectedRestaurant?.id), [menu, selectedRestaurant]);
  const categories = useMemo(() => ['All', ...new Set(activeMenu.map((item) => item.category))], [activeMenu]);
  const displayedItems = useMemo(() => activeMenu.filter((item) => (category === 'All' || item.category === category) && `${item.name} ${item.category}`.toLowerCase().includes(search.toLowerCase())), [activeMenu, category, search]);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const chooseRestaurant = (restaurant) => {
    if (cart.length && selectedRestaurant?.id !== restaurant.id) setCart([]);
    setSelectedRestaurant(restaurant); setCategory('All'); setSearch('');
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };
  const addToCart = (item) => setCart((previous) => previous.some((entry) => entry.id === item.id) ? previous.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...previous, { ...item, quantity: 1 }]);
  const updateQuantity = (id, delta) => setCart((previous) => previous.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));

  const submitAuth = async (event) => {
    event.preventDefault(); setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/${authMode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) });
      const data = await response.json(); if (!response.ok) throw new Error(data.message);
      setUser(data.user); setToken(data.token); localStorage.setItem('cravingdash-user', JSON.stringify(data.user)); localStorage.setItem('cravingdash-token', data.token);
      setAuthMode(null); setAuthForm({ name: '', email: '', password: '' }); setNotice({ type: 'success', text: `Welcome${authMode === 'signup' ? '' : ' back'}, ${data.user.name}!` });
    } catch (error) { setNotice({ type: 'error', text: error.message || 'Unable to continue.' }); } finally { setIsSubmitting(false); }
  };
  const logout = async () => { await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {}); setUser(null); setToken(''); localStorage.removeItem('cravingdash-user'); localStorage.removeItem('cravingdash-token'); setNotice({ type: 'success', text: 'You have been logged out.' }); };
  const checkout = async () => {
    if (!user) { setIsCartOpen(false); setAuthMode('login'); return; }
    if (!selectedRestaurant) { setNotice({ type: 'error', text: 'Please choose a restaurant before continuing to payment.' }); return; }
    setIsSubmitting(true);
    try {
      if (!window.Razorpay) throw new Error('Razorpay Checkout could not load. Please check your connection and try again.');
      const response = await fetch(`${API_URL}/api/payments/order`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ cart, restaurantId: selectedRestaurant.id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (!data.order?.id || !data.keyId) throw new Error('Razorpay order details were not received. Please try again.');
      const payment = await new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: data.keyId, amount: data.order.amount, currency: data.order.currency, name: 'Foodie', description: `Order from ${selectedRestaurant.name}`, order_id: data.order.id,
          prefill: { name: data.customer.name, email: data.customer.email }, theme: { color: '#ea580c' },
          handler: resolve, modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
        });
        razorpay.open();
      });
      const verification = await fetch(`${API_URL}/api/payments/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payment) });
      const result = await verification.json();
      if (!verification.ok) throw new Error(result.message);
      setCart([]); setIsCartOpen(false); setNotice({ type: 'success', text: `Payment received. Order ${result.orderId} is confirmed!` });
    } catch (error) { setNotice({ type: 'error', text: error.message || 'Payment could not be completed.' }); } finally { setIsSubmitting(false); }
  };

  return <div className="min-h-screen bg-gray-50 text-gray-900">
    <nav className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:px-8"><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-2xl font-black tracking-tight text-orange-600">Foodie</button><div className="flex items-center gap-3">{user ? <><span className="hidden text-sm font-semibold text-gray-600 sm:block">Hi, {user.name}</span><button onClick={logout} title="Log out" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><LogOut size={20} /></button></> : <button onClick={() => setAuthMode('login')} className="flex items-center gap-2 rounded-xl border border-orange-200 px-3 py-2 text-sm font-bold text-orange-700 hover:bg-orange-50"><LogIn size={17} /> Log in</button>}<button onClick={() => setIsCartOpen(true)} className="relative rounded-xl bg-orange-600 p-2.5 text-white"><ShoppingCart size={21} />{itemCount > 0 && <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-xs font-bold">{itemCount}</span>}</button></div></nav>
    <header className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-16 text-center text-white"><p className="mb-3 font-bold uppercase tracking-[0.2em] text-orange-100">Your local food guide</p><h1 className="text-4xl font-black md:text-6xl">Find your next favourite meal.</h1><p className="mt-4 text-lg text-orange-50">Pick a restaurant, build your order, and checkout in minutes.</p></header>
    <main className="mx-auto max-w-6xl px-4 py-12">
      {notice && <div className={`mb-8 flex items-center gap-3 rounded-xl border p-4 ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}><>{notice.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}</><span>{notice.text}</span><button onClick={() => setNotice(null)} className="ml-auto font-bold">Dismiss</button></div>}
      <section><div className="mb-5 flex items-end justify-between gap-4"><div><p className="font-bold text-orange-600">RESTAURANTS</p><h2 className="text-3xl font-black">Choose where to order</h2></div><span className="text-sm text-gray-500">{restaurants.length} places nearby</span></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{restaurants.map((restaurant) => <button key={restaurant.id} onClick={() => chooseRestaurant(restaurant)} className={`overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-2 transition hover:-translate-y-1 hover:shadow-md ${selectedRestaurant?.id === restaurant.id ? 'ring-orange-500' : 'ring-transparent'}`}><img src={restaurant.image} alt="" className="h-32 w-full object-cover" /><div className="p-4"><h3 className="font-black">{restaurant.name}</h3><p className="mt-1 text-sm text-gray-500">{restaurant.cuisine}</p><p className="mt-3 flex items-center gap-1 text-sm font-bold"><Star size={15} className="fill-amber-400 text-amber-400" /> {restaurant.rating} <span className="ml-2 font-normal text-gray-500">{restaurant.eta}</span></p></div></button>)}</div></section>
      <section id="menu" className="mt-14 scroll-mt-20">{selectedRestaurant ? <><div className="mb-6"><p className="font-bold text-orange-600">{selectedRestaurant.cuisine.toUpperCase()}</p><h2 className="text-3xl font-black">{selectedRestaurant.name} menu</h2></div><div className="mb-7 flex flex-col gap-3 md:flex-row md:justify-between"><label className="relative max-w-md flex-1"><Search className="absolute left-3 top-3.5 text-gray-400" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this menu" className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-orange-500" /></label><div className="flex gap-2 overflow-x-auto">{categories.map((name) => <button key={name} onClick={() => setCategory(name)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${category === name ? 'bg-orange-600 text-white' : 'bg-white ring-1 ring-gray-200'}`}>{name}</button>)}</div></div>{isLoading ? <div className="flex justify-center py-16 text-orange-600"><LoaderCircle className="animate-spin" /></div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{displayedItems.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm"><img src={item.image} alt={item.name} className="h-44 w-full object-cover" /><div className="p-5"><span className="rounded bg-orange-50 px-2 py-1 text-xs font-bold text-orange-600">{item.category}</span><h3 className="mt-3 text-lg font-black">{item.name}</h3><div className="mt-5 flex items-center justify-between"><strong>{currency.format(item.price)}</strong><button onClick={() => addToCart(item)} className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600">Add</button></div></div></article>)}</div>}</> : <div className="rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 py-16 text-center"><p className="text-xl font-bold">Choose a restaurant to see its food list.</p><p className="mt-2 text-gray-600">Every restaurant has its own fake menu ready to order.</p></div>}</section>
    </main>
    {isCartOpen && <div className="fixed inset-0 z-50 flex justify-end bg-black/40"><aside className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b pb-4"><h2 className="text-xl font-black">Your basket</h2><button onClick={() => setIsCartOpen(false)}><X /></button></div><p className="pt-3 text-sm font-semibold text-orange-600">{selectedRestaurant?.name || 'No restaurant selected'}</p><div className="flex-1 space-y-3 overflow-y-auto py-4">{cart.length ? cart.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"><img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-bold">{item.name}</p><p className="text-sm text-orange-600">{currency.format(item.price * item.quantity)}</p></div><div className="flex items-center gap-2 rounded-lg bg-white p-1"><button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus size={15} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus size={15} /></button></div></div>) : <p className="py-12 text-center text-gray-500">Your basket is empty.</p>}</div>{cart.length > 0 && <div className="border-t pt-4"><div className="mb-2 flex justify-between"><span>Order total</span><strong className="text-xl">{currency.format(total)}</strong></div><p className="mb-4 text-xs text-gray-500">You will be taken to Razorpay to complete this secure payment.</p><button onClick={checkout} disabled={isSubmitting} className="w-full rounded-xl bg-orange-600 py-3.5 font-bold text-white disabled:opacity-70">{isSubmitting ? 'Opening Razorpay…' : user ? `Pay ${currency.format(total)} with Razorpay` : 'Log in to pay with Razorpay'}</button></div>}</aside></div>}
    {authMode && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><form onSubmit={submitAuth} className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"><button type="button" onClick={() => setAuthMode(null)} className="absolute right-5 top-5 text-gray-500"><X /></button><UserRound className="mb-4 text-orange-600" size={30} /><h2 className="text-2xl font-black">{authMode === 'signup' ? 'Create your account' : 'Welcome back'}</h2><p className="mt-1 text-sm text-gray-500">{authMode === 'signup' ? 'Sign up to place and pay for demo orders.' : 'Log in to place and pay for your order.'}</p><div className="mt-5 space-y-3">{authMode === 'signup' && <input required minLength="2" value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} placeholder="Your name" className="w-full rounded-xl border p-3" />}<input required type="email" value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} placeholder="Email address" className="w-full rounded-xl border p-3" /><input required minLength="6" type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} placeholder="Password (6+ characters)" className="w-full rounded-xl border p-3" /></div><button disabled={isSubmitting} className="mt-5 w-full rounded-xl bg-orange-600 py-3 font-bold text-white disabled:opacity-70">{isSubmitting ? 'Please wait…' : authMode === 'signup' ? 'Sign up' : 'Log in'}</button><p className="mt-4 text-center text-sm text-gray-600">{authMode === 'signup' ? 'Already have an account?' : 'New to Foodie?'} <button type="button" onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')} className="font-bold text-orange-600">{authMode === 'signup' ? 'Log in' : 'Sign up'}</button></p></form></div>}
  </div>;
}
