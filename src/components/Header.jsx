import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut } from 'lucide-react';
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
  const { cart, wishlist, cartCount, showToast } = useStore();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('User not logged in');
      setUser(null);
    }
  }

  async function handleLogout() {
    await signOut();
    setUser(null);
    setShowAuthDropdown(false);
    showToast('Sesión cerrada', 'success');
  }

  // Use local products as fallback for search
  const suggestions = (localProducts || []).filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900/50">
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-xl">D</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">DropShop</span>
              <span className="hidden md:block text-xs text-gray-500 dark:text-slate-400">Tienda Online Ecuador</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'shop', label: 'Tienda' },
              { id: 'blog', label: 'Blog' },
              { id: 'wishlist', label: 'Favoritos' },
            ].map(item => (
              <button key={item.id} onClick={() => onNavigate(item.id)} className={`font-medium transition-colors ${currentPage === item.id ? 'text-indigo-600' : 'text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                {item.label}
                {item.id === 'wishlist' && wishlist.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{wishlist.length}</span>}
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Search */}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type={searchOpen ? 'search' : 'hidden'}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Buscar..."
                  className="w-32 md:w-64 px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm md:text-base"
                />
                <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full touch-manipulation">
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-1 md:mt-2 w-64 md:w-80 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                  {suggestions.map(product => (
                    <button key={product.id} onClick={() => { onNavigate('product', product); setShowSuggestions(false); setSearchQuery(''); }} className="w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 hover:bg-gray-50 text-left">
                      <img src={product.image} alt={product.name} className="w-8 h-8 md:w-10 md:h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs md:text-sm text-indigo-600 font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist - Hide on mobile, use bottom nav */}
            <button onClick={() => onNavigate('wishlist')} className="hidden md:block p-1.5 md:p-2 hover:bg-gray-100 rounded-full relative touch-manipulation">
              <Heart className="w-5 h-5 text-gray-600" />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>}
            </button>

            {/* Cart - Hide on mobile, use bottom nav */}
            <button onClick={() => onNavigate('cart')} className="hidden md:block p-1.5 md:p-2 hover:bg-gray-100 rounded-full relative touch-manipulation">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}
            </button>

            <DarkModeToggle />

            {/* Login Button - Text hidden on mobile */}
            <button onClick={() => onAuthClick && onAuthClick()} className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-xs md:text-sm font-medium touch-manipulation">
              <User className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-full touch-manipulation">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t space-y-1">
            {[
              { id: 'home', label: '🏠 Inicio' },
              { id: 'shop', label: '🛍️ Tienda' },
              { id: 'blog', label: '📰 Blog' },
              { id: 'wishlist', label: '❤️ Favoritos' },
              { id: 'cart', label: '🛒 Carrito' },
            ].map(item => (
              <button key={item.id} onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }} className={`block w-full text-left py-2.5 px-4 rounded-lg font-medium text-sm ${currentPage === item.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t">
              <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); onAuthClick && onAuthClick(); }} className="block w-full text-left py-2.5 px-4 rounded-lg text-indigo-600 font-medium text-sm">
                👤 Mi Cuenta
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
