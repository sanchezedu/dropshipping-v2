import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { products as localProducts } from '../data/products';
import { getCurrentUser, signOut } from '../lib/supabase';
import AuthPanel from './AuthPanel';

export default function Header({ onNavigate, currentPage, showToast }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const { cart, wishlist, cartCount } = useStore();

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
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-800">DropShop</span>
              <span className="hidden md:block text-xs text-gray-500">Tienda Online Ecuador</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'shop', label: 'Tienda' },
              { id: 'wishlist', label: 'Favoritos' },
            ].map(item => (
              <button key={item.id} onClick={() => onNavigate(item.id)} className={`font-medium transition-colors ${currentPage === item.id ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>
                {item.label}
                {item.id === 'wishlist' && wishlist.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{wishlist.length}</span>}
              </button>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <div className="flex items-center">
                <input
                  type={searchOpen ? 'search' : 'hidden'}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(e.target.value.length > 0); }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Buscar productos..."
                  className="w-40 md:w-64 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
                <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 rounded-full">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
                  {suggestions.map(product => (
                    <button key={product.id} onClick={() => { onNavigate('product', product); setShowSuggestions(false); setSearchQuery(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-sm text-indigo-600 font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => onNavigate('wishlist')} className="p-2 hover:bg-gray-100 rounded-full relative">
              <Heart className="w-5 h-5 text-gray-600" />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{wishlist.length}</span>}
            </button>

            <button onClick={() => onNavigate('cart')} className="p-2 hover:bg-gray-100 rounded-full relative">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
            </button>

            {/* Auth Button / User Menu */}
            <div className="relative">
              {user ? (
                <button onClick={() => setShowAuthDropdown(!showAuthDropdown)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                </button>
              ) : (
                <button onClick={() => setShowAuthDropdown(!showAuthDropdown)} className="p-2 hover:bg-gray-100 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {/* Auth Dropdown */}
              {showAuthDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50">
                  <AuthPanel 
                    onNavigate={(page) => { onNavigate(page); setShowAuthDropdown(false); }} 
                    onClose={() => setShowAuthDropdown(false)}
                    showToast={showToast}
                  />
                </div>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-full">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t space-y-2">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'shop', label: 'Tienda' },
              { id: 'wishlist', label: 'Favoritos' },
              { id: 'cart', label: 'Carrito' },
            ].map(item => (
              <button key={item.id} onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }} className={`block w-full text-left py-2 px-4 rounded-lg ${currentPage === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
