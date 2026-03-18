import { useState, useEffect } from 'react';
import { Search, Menu, X, User, Sun, Moon, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { products as localProducts } from '../data/products';
import { getCurrentUser } from '../lib/supabase';

export default function Header({ onNavigate, currentPage, onAuthClick }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { wishlist, cartCount, showToast } = useStore();

  useEffect(() => {
    checkUser();
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const suggestions = (localProducts || []).filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-3">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-12">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg touch-manipulation"
          >
            <Menu className="w-6 h-6 dark:text-white" />
          </button>

          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">Epicentro Digital Ec</span>
          </button>

          {/* Right Side - Always visible icons */}
          <div className="flex items-center gap-1">
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg touch-manipulation"
            >
              <Search className="w-5 h-5 dark:text-white" />
            </button>

            {/* User Button */}
            <button 
              onClick={() => onAuthClick && onAuthClick()} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg touch-manipulation"
            >
              <User className="w-5 h-5 dark:text-white" />
            </button>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        {searchOpen && (
          <div className="pb-3">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => { 
                  setSearchQuery(e.target.value); 
                  setShowSuggestions(e.target.value.length > 0); 
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Buscar productos..."
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-base bg-gray-50 dark:bg-slate-800 dark:text-white"
              />
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 z-50">
                  {suggestions.map(product => (
                    <button 
                      key={product.id} 
                      onClick={() => { 
                        onNavigate('product', product); 
                        setShowSuggestions(false); 
                        setSearchQuery(''); 
                        setSearchOpen(false); 
                      }} 
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 text-left"
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{product.name}</p>
                        <p className="text-sm text-indigo-600 font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-12 z-40 bg-white dark:bg-slate-900 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl mb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-white">
                  {user ? user.email : 'Invitado'}
                </p>
                <button 
                  onClick={() => { onAuthClick && onAuthClick(); setMobileMenuOpen(false); }}
                  className="text-sm text-indigo-600 font-medium"
                >
                  {user ? 'Mi Cuenta' : 'Iniciar Sesión'}
                </button>
              </div>
            </div>

            {/* Menu Items - Icons only, no duplicate text */}
            {[
              { id: 'home', label: '🏠 Inicio' },
              { id: 'shop', label: '🛍️ Tienda' },
              { id: 'blog', label: '📰 Blog' },
              { id: 'wishlist', label: '❤️ Favoritos', count: wishlist.length },
              { id: 'cart', label: '🛒 Carrito', count: cartCount },
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }} 
                className={`flex items-center justify-between w-full text-left p-4 rounded-xl font-medium ${
                  currentPage === item.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' 
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {item.count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="flex items-center justify-between w-full text-left p-4 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <span>{darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
