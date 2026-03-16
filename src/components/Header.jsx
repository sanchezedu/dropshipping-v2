import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User, Sun, Moon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { products as localProducts } from '../data/products';
import { getCurrentUser, signOut } from '../lib/supabase';
import AuthPanel from './AuthPanel';
import DarkModeToggle from './DarkModeToggle';
import LanguageToggle from './LanguageToggle';

export default function Header({ onNavigate, currentPage, onAuthClick }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { cart, wishlist, cartCount, showToast } = useStore();

  useEffect(() => {
    checkUser();
    // Check dark mode
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

  async function handleLogout() {
    await signOut();
    setUser(null);
    setShowAuthDropdown(false);
    showToast('Sesión cerrada', 'success');
  }

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  const suggestions = (localProducts || []).filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base md:text-xl">D</span>
            </div>
            <div className="hidden xs:block">
              <span className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white">DropShop</span>
            </div>
          </button>

          {/* Desktop Nav - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'shop', label: 'Tienda' },
              { id: 'blog', label: 'Blog' },
              { id: 'wishlist', label: 'Favoritos' },
            ].map(item => (
              <button key={item.id} onClick={() => onNavigate(item.id)} className={`font-medium text-sm transition-colors ${currentPage === item.id ? 'text-indigo-600' : 'text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                {item.label}
                {item.id === 'wishlist' && wishlist.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{wishlist.length}</span>}
              </button>
            ))}
          </nav>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* Search Toggle */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className="p-2 sm:p-2.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full touch-manipulation"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-slate-300" />
            </button>

            {/* Dark Mode Toggle - Desktop only */}
            <button 
              onClick={toggleDarkMode}
              className="hidden sm:block p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
            >
              {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* Cart - Desktop only, shown in mobile nav */}
            <button 
              onClick={() => onNavigate('cart')} 
              className="hidden lg:block p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-slate-300" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
            </button>

            {/* User/Login */}
            <button 
              onClick={() => onAuthClick && onAuthClick()} 
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium touch-manipulation"
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline text-xs">Cuenta</span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full touch-manipulation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        {searchOpen && (
          <div className="pb-2 sm:pb-3">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Buscar productos..."
                autoFocus
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm sm:text-base bg-gray-50 dark:bg-slate-700 dark:text-white"
              />
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border dark:border-slate-700 z-50 overflow-hidden">
                  {suggestions.map(product => (
                    <button 
                      key={product.id} 
                      onClick={() => { onNavigate('product', product); setShowSuggestions(false); setSearchQuery(''); setSearchOpen(false); }} 
                      className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 text-left"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-3 border-t dark:border-slate-700 space-y-1">
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
                className={`flex items-center justify-between w-full text-left py-2.5 px-4 rounded-lg font-medium text-sm ${currentPage === item.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
              >
                <span>{item.label}</span>
                {item.count > 0 && (
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full">{item.count}</span>
                )}
              </button>
            ))}
            <div className="pt-2 border-t dark:border-slate-700 flex gap-2">
              <button 
                onClick={toggleDarkMode} 
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium text-sm"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
