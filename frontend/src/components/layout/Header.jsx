const Header = () => (
  <header className="relative isolate overflow-hidden border-b border-white/8 px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-20">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.22),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(24,195,126,0.16),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.015))]" />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

    <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <span className="premium-chip w-fit text-amber-100/90">
          Premium dark dining
        </span>
        <div className="space-y-4">
          <h1 className="max-w-3xl font-['Sora'] text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Find your next favourite meal.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/70 sm:text-xl">
            Pick a restaurant, build your order, and checkout in minutes inside a sleek, appetite-first interface.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="#restaurants" className="premium-button">
            Explore restaurants
          </a>
          <a href="#menu" className="premium-button-secondary">
            Jump to menu
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {[
          ['24 min', 'Average delivery'],
          ['Gold-tier', 'Featured kitchens'],
          ['High-res', 'Food photography'],
        ].map(([value, label]) => (
          <div key={label} className="premium-card p-5">
            <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
            <p className="mt-1 text-sm text-white/60">{label}</p>
          </div>
        ))}
      </div>
    </div>
  </header>
);

export default Header;
