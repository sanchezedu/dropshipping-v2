import { Home, ShoppingBag, Heart, User, MessageCircle } from 'lucide-react';

export default function MobileNav({ currentPage, onNavigate, cartCount, wishlistCount }) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'shop', icon: ShoppingBag, label: 'Tienda' },
    { id: 'cart', icon: MessageCircle, label: 'WhatsApp', isWhatsApp: true },
    { id: 'wishlist', icon: Heart, label: 'Favoritos', count: wishlistCount },
    { id: 'user', icon: User, label: 'Cuenta' },
  ];

  const handleNavigate = (item) => {
    if (item.isWhatsApp) {
      window.open('https://wa.me/593991234567', '_blank');
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t dark:border-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] md:hidden z-50">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                item.isWhatsApp 
                  ? 'text-green-500' 
                  : isActive 
                    ? 'text-indigo-600' 
                    : 'text-gray-400 dark:text-slate-500'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.count > 0 && !item.isWhatsApp && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              {isActive && !item.isWhatsApp && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
