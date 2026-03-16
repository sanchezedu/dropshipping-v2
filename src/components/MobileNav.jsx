import { Home, ShoppingBag, Heart, User } from 'lucide-react';

export default function MobileNav({ currentPage, onNavigate, cartCount, wishlistCount }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'shop', icon: ShoppingBag, label: 'Tienda' },
    { id: 'wishlist', icon: Heart, label: 'Favoritos', count: wishlistCount },
    { id: 'user', icon: User, label: 'Cuenta' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t dark:border-slate-700 shadow-lg md:hidden z-50 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full relative ${
                isActive ? 'text-indigo-600' : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
