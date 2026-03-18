import { useState, useEffect } from 'react';
import { Search, Menu, X, User, ShoppingBag, Heart, Sun, Moon } from 'lucide-react';
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
  const { wishlist, cartCount } = useStore();

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

  const navLinks = [
    { id: 'home', label: 'Inicio' },
    { id: 'shop', label: 'Productos' },
    { id: 'blog', label: 'Ofertas' },
    { id: 'about', label: 'Sobre Nosotros' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-[#F97316] text-white text-sm py-2 text-center font-medium">
        ENVÍO gratis a todo Ecuador en pedidos mayores a $50 | Pago contra entrega disponible
      </div>

      {/* Main Header */}
      <div className="bg-[#0A192F] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            {/* Logo */}
            <button onClick={() => onNavigate('home')} className="flex flex-col">
              <span className="text-white font-['Space_Grotesk'] font-bold text-2xl">EPICENTRO</span>
              <span className="text-cyan-400 text-sm tracking-widest block">DIGITAL EC</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="text-slate-200 hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <Search className="w-5 h-5 text-white" />
              </button>

              {/* Wishlist */}
              <button 
                onClick={() => onNavigate('wishlist')} 
                className="p-2 hover:bg-white/10 rounded-lg relative"
              >
                <Heart className="w-5 h-5 text-white" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button 
                onClick={() => onNavigate('cart')} 
                className="p-2 hover:bg-white/10 rounded-lg relative"
              >
                <ShoppingBag className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              <button 
                onClick={() => onAuthClick && onAuthClick()} 
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="mt-4">
              <div className="relative max-w-xl mx-auto">
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
                  className="w-full px-4 py-3 border border-white/20 rounded-full bg-white/10 text-white placeholder-white/60 focus:outline-none focus:border-[#F97316]"
                />
                <button 
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl z-50">
                    {suggestions.map(product => (
                      <button 
                        key={product.id} 
                        onClick={() => { 
                          onNavigate('product', product); 
                          setShowSuggestions(false); 
                          setSearchQuery(''); 
                          setSearchOpen(false); 
                        }} 
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                      >
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-sm text-[#F97316] font-bold">${product.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[108px] z-40 bg-[#0A192F] overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navLinks.map(link => (
              <button 
                key={link.id}
                onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }} 
                className={`flex items-center justify-between w-full text-left p-4 rounded-xl font-medium ${
                  currentPage === link.id 
                    ? 'bg-[#F97316] text-white' 
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
