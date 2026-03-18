import { useState, useEffect } from 'react';
import { useStore } from './context/StoreContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import QuickView from './components/QuickView';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import ProductDetail from './components/ProductDetail';
import Contact from './components/Contact';
import About from './components/About';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Shipping from './components/Shipping';
import Returns from './components/Returns';
import Checkout from './components/Checkout';
import NotFound from './components/NotFound';
import FAQ from './components/FAQ';
import CompareModal from './components/CompareModal';
import Toast from './components/Toast';
import AdminPanel from './components/AdminPanel';
import WhatsAppChat from './components/WhatsAppChat';
import LiveChat from './components/LiveChat';
import CountdownTimer from './components/CountdownTimer';
import MyOrders from './components/MyOrders';
import Analytics from './components/Analytics';
import CookiePopup from './components/CookiePopup';
import UserAccount from './components/UserAccount';
import Blog from './components/Blog';
import AuthModal from './components/AuthModal';
import MobileNav from './components/MobileNav';
import { products as localProducts } from './data/products';
import { fetchProducts, fetchProduct } from './lib/supabase';
import { X, Mail, Gift, ChevronRight, GitCompare, Info, Loader2, ShieldCheck, Truck, RotateCcw, Headphones, Smartphone, Wrench, Dumbbell, Home } from 'lucide-react';

function NewsletterPopup({ onClose }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      localStorage.setItem('dropshop-newsletter', 'true');
      setTimeout(onClose, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        
        {submitted ? (
          <div className="py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Gift className="w-10 h-10 text-green-600" /></div>
            <h3 className="text-2xl font-bold mb-2">Gracias!</h3>
            <p className="text-gray-600">Codigo: <span className="font-bold text-indigo-600">BIENVENIDO10</span></p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Gift className="w-10 h-10 text-white" /></div>
            <h3 className="text-2xl font-bold mb-2">Recibe 10% de descuento!</h3>
            <p className="text-gray-600 mb-4">Suscribete y obtene un codigo para tu primera compra.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Tu correo electronico" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold">Obtener descuento</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { cart, cartCount, wishlist } = useStore();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL-based routing - check path on mount
  useEffect(() => {
    const path = window.location.pathname.slice(1); // Remove leading slash
    const validPages = ['shop', 'cart', 'wishlist', 'checkout', 'contact', 'about', 'faq', 'admin', 'privacy', 'terms', 'shipping', 'returns', 'account', 'products'];
    if (validPages.includes(path)) {
      setCurrentPage(path);
    } else if (path.startsWith('product/')) {
      const productId = parseInt(path.split('/')[1]);
      if (!isNaN(productId)) {
        setSelectedProduct(productId);
        setCurrentPage('product');
      }
    }
  }, []);

  // Load products from Supabase
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          console.log('No products from Supabase, using local fallback');
          setProducts(localProducts);
        }
      } catch (error) {
        console.log('Supabase error, using local products:', error.message);
        setProducts(localProducts);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Initialize dark mode
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('dropshop-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Load single product when navigating to product page
  useEffect(() => {
    async function loadProduct() {
      if (currentPage === 'product' && selectedProduct && typeof selectedProduct === 'number') {
        try {
          const product = await fetchProduct(selectedProduct);
          if (product) {
            setSelectedProduct(product);
          } else {
            const localProduct = localProducts.find(p => p.id === selectedProduct);
            if (localProduct) {
              setSelectedProduct(localProduct);
            }
          }
        } catch (error) {
          const localProduct = localProducts.find(p => p.id === selectedProduct);
          if (localProduct) {
            setSelectedProduct(localProduct);
          }
        }
      }
    }
    loadProduct();
  }, [currentPage]);

  useEffect(() => {
    const hasSeenNewsletter = localStorage.getItem('dropshop-newsletter');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => setShowNewsletter(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNavigate = (page, product = null) => {
    setCurrentPage(page);
    
    // Update URL without reload
    if (page === 'product' && product) {
      const productId = typeof product === 'number' ? product : product.id;
      window.history.pushState({}, '', `/product/${productId}`);
    } else if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${page}`);
    }
    
    if (product) {
      setSelectedProduct(typeof product === 'number' ? product : product.id);
      const recent = JSON.parse(localStorage.getItem('dropshop-recent') || '[]');
      const productToSave = typeof product === 'number' ? products.find(p => p.id === product) : product;
      if (productToSave) {
        const filtered = recent.filter(p => p.id !== productToSave.id);
        localStorage.setItem('dropshop-recent', JSON.stringify([productToSave, ...filtered].slice(0, 10)));
      }
    }
    window.scrollTo(0, 0);
  };

  const handleQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  let filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-low') filteredProducts = [...filteredProducts].sort((a, b) => (a.price || 0) - (b.price || 0));
  else if (sortBy === 'price-high') filteredProducts = [...filteredProducts].sort((a, b) => (b.price || 0) - (a.price || 0));
  else if (sortBy === 'rating') filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const recentlyViewed = JSON.parse(localStorage.getItem('dropshop-recent') || '[]');

  const categories = [
    { id: 'all', name: 'Todos', icon: Gift, color: 'indigo' },
    { id: 'electronica', name: 'Electrónica', icon: Smartphone, color: 'blue' },
    { id: 'accesorios', name: 'Accesorios', icon: Wrench, color: 'orange' },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'green' },
    { id: 'hogar', name: 'Hogar', icon: Home, color: 'purple' }
  ];

  // Loading state
  if (loading && currentPage === 'home') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Render Home
  const renderHome = () => (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="bg-[#F97316] text-white text-center py-2 px-4">
        <p className="text-xs md:text-sm font-semibold">ENVÍO gratis a todo Ecuador en pedidos mayores a $50 | Pago contra entrega disponible</p>
      </div>

      {/* Hero Section - New Design */}
      <section className="bg-slate-50 min-h-[500px] flex items-center relative overflow-hidden pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text */}
            <div className="order-2 md:order-1">
              <h1 className="text-5xl md:text-6xl font-['Space_Grotesk'] font-extrabold text-slate-900 leading-tight mb-4">
                Lo Último en Tecnología
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Llegó a Ecuador. Explora nuestra selección premium.
              </p>
              <button 
                onClick={() => handleNavigate('shop')} 
                className="bg-[#F97316] hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all w-fit"
              >
                Ver Productos Nuevos
              </button>
            </div>
            
            {/* Right Column - Images */}
            <div className="order-1 md:order-2 flex gap-4 justify-center">
              <img 
                src="https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=500&q=80" 
                alt="Dron" 
                className="rounded-2xl shadow-2xl object-cover w-48 h-64 md:w-56 md:h-72"
              />
              <img 
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80" 
                alt="Auriculares" 
                className="rounded-2xl shadow-2xl object-cover w-48 h-64 md:w-56 md:h-72 mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compare Button - Hide on mobile, use mobile nav instead */}
      <button onClick={() => setShowCompare(true)} className="hidden md:flex fixed top-20 right-0 z-40 bg-indigo-600 text-white px-3 py-2 rounded-l-lg shadow-lg items-center gap-2 hover:bg-indigo-700">
        <GitCompare className="w-4 h-4" /> <span className="text-sm">Comparar</span>
      </button>

      {/* Flash Sale Banner with Countdown - New Design */}
      <section className="bg-[#0A192F] py-3 md:py-6">
        <div className="max-w-7xl mx-auto px-3 md:px-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          <div className="text-white text-center md:text-left">
            <h3 className="text-lg md:text-2xl font-bold text-[#F97316]">🔥 OFERTAS FLASH</h3>
            <p className="text-xs md:text-white/90">20% de descuento en electrónicos hasta:</p>
          </div>
          <CountdownTimer targetDate={new Date().getTime() + 3 * 24 * 60 * 60 * 1000} />
        </div>
      </section>

      <section className="py-6 md:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <h2 className="text-lg md:text-2xl font-bold text-center mb-4 md:mb-8 text-slate-900">Explora por Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {categories.filter(c => c.id !== 'all').map((cat) => {
              const colorClasses = {
                blue: 'from-blue-50 to-blue-100 border-blue-200',
                orange: 'from-orange-50 to-orange-100 border-orange-200',
                green: 'from-green-50 to-green-100 border-green-200',
                purple: 'from-purple-50 to-purple-100 border-purple-200'
              };
              const iconColorClasses = {
                blue: 'text-blue-600',
                orange: 'text-orange-600',
                green: 'text-green-600',
                purple: 'text-purple-600'
              };
              return (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); handleNavigate('shop'); }} className={`group p-3 md:p-6 bg-gradient-to-br rounded-xl hover:shadow-xl transition-all hover:-translate-y-1 border ${colorClasses[cat.color]}`}>
                  <div className={`w-10 h-10 md:w-14 md:h-14 mx-auto mb-2 md:mb-3 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                    <cat.icon className={`w-5 h-5 md:w-7 md:h-7 ${iconColorClasses[cat.color]}`} />
                  </div>
                  <h3 className="font-bold text-sm md:text-base text-gray-800 text-center">{cat.name}</h3>
                  <p className="text-xs md:text-sm text-gray-500 text-center">{products.filter(p => p.category === cat.id).length} productos</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-4 md:py-8 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {[
              { icon: ShieldCheck, title: 'Pago Seguro', desc: '100% Seguro', color: 'green' },
              { icon: Truck, title: 'Envío Gratis', desc: 'Pedidos +$50', color: 'blue' },
              { icon: RotateCcw, title: '30 Días', desc: 'Devolución', color: 'orange' },
              { icon: Headphones, title: 'Soporte 24/7', desc: 'Por WhatsApp', color: 'purple' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                  item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  item.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    item.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    item.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 md:py-16">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="text-lg md:text-3xl font-bold">Productos Destacados</h2>
            <button onClick={() => handleNavigate('shop')} className="flex items-center gap-1 md:gap-2 text-xs md:text-base text-indigo-600 font-medium hover:underline">Ver todos <ChevronRight className="w-3 h-3 md:w-4 md:h-4" /></button>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
              {products.slice(0, 8).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-6 md:py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-lg md:text-3xl font-bold">Nuevos Productos</h2>
              <p className="text-xs md:text-base text-gray-500 mt-1">Los últimos productos agregados a nuestra tienda</p>
            </div>
            <button onClick={() => handleNavigate('shop')} className="flex items-center gap-1 md:gap-2 text-xs md:text-base text-indigo-600 font-medium hover:underline">Ver todos <ChevronRight className="w-3 h-3 md:w-4 md:h-4" /></button>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
              {products.filter(p => p.tags?.includes('nuevo')).slice(0, 4).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500">No hay productos nuevos</p>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-6 md:py-16">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-lg md:text-3xl font-bold">Más Vendidos</h2>
              <p className="text-xs md:text-base text-gray-500 mt-1">Los productos más populares de nuestra tienda</p>
            </div>
            <button onClick={() => handleNavigate('shop')} className="flex items-center gap-1 md:gap-2 text-xs md:text-base text-indigo-600 font-medium hover:underline">Ver todos <ChevronRight className="w-3 h-3 md:w-4 md:h-4" /></button>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
              {products.filter(p => p.tags?.includes('bestseller')).slice(0, 4).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <p className="text-gray-500">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="py-4 md:py-8 bg-white">
          <div className="max-w-7xl mx-auto px-3 md:px-4">
            <div className="flex items-center gap-2 mb-3 md:mb-6"><Info className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /><h2 className="text-base md:text-2xl font-bold">Vistos Recientemente</h2></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {recentlyViewed.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-6 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <h2 className="text-lg md:text-3xl font-bold text-center mb-4 md:mb-8">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            {[
              { name: 'Andrea Paz', location: 'Quito', text: 'Me encanto la rapidez del envio. Llego en 3 dias.', rating: 5 },
              { name: 'Marco Delgado', location: 'Guayaquil', text: 'Segunda vez que compro y siempre todo excelente.', rating: 5 },
              { name: 'Sofia Mendoza', location: 'Cuenca', text: 'Precios muy competitivos.', rating: 4 }
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <span key={j} className={j < t.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}</div>
                <p className="text-gray-700">"{t.text}"</p>
                <p className="font-bold mt-2">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8 md:py-12 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">DropShop</h4>
              <p className="text-gray-400 text-sm">Tu tienda de confianza.</p>
              <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
                <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 text-sm md:text-base">f</a>
                <a href="#" className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 text-sm md:text-base">i</a>
                <a href="https://wa.me/593991234567" className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 text-sm md:text-base">w</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Informacion</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('about')} className="hover:text-white">Nosotros</button></li>
                <li><button onClick={() => handleNavigate('faq')} className="hover:text-white">FAQ</button></li>
                <li><button onClick={() => handleNavigate('contact')} className="hover:text-white">Contacto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Legal</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('terms')} className="hover:text-white">Terminos</button></li>
                <li><button onClick={() => handleNavigate('privacy')} className="hover:text-white">Privacidad</button></li>
                <li><button onClick={() => handleNavigate('returns')} className="hover:text-white">Devoluciones</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Contacto</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
                <li>Guayaquil, Ecuador</li>
                <li>info@dropshop.ec</li>
                <li>+593 99 123 4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-500">© 2026 DropShop Ecuador.</div>
        </div>
      </footer>

    </div>
  );

  const renderShop = () => (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8">Tienda</h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:mb-8">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="flex-1 px-3 md:px-4 py-2 md:py-3 border rounded-lg text-base" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 md:px-4 py-2 md:py-3 border rounded-lg text-base">
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 md:px-4 py-2 md:py-3 border rounded-lg text-base">
            <option value="default">Ordenar</option>
            <option value="price-low">Precio: Menor</option>
            <option value="price-high">Precio: Mayor</option>
            <option value="rating">Mejor Rating</option>
          </select>
        </div>
        <p className="mb-3 md:mb-4 text-sm md:text-base">{filteredProducts.length} productos</p>
        {loading ? (
          <div className="flex items-center justify-center py-8 md:py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Toast />
      <Header onNavigate={handleNavigate} currentPage={currentPage} onAuthClick={() => setShowAuthModal(true)} />
      {currentPage === 'home' && renderHome()}
      {currentPage === 'shop' && renderShop()}
      {currentPage === 'wishlist' && <Wishlist onNavigate={handleNavigate} />}
      {currentPage === 'cart' && <Cart onClose={() => setShowCart(false)} onNavigate={handleNavigate} />}
      {currentPage === 'checkout' && <Checkout onNavigate={handleNavigate} />}
      {currentPage === 'contact' && <Contact onNavigate={handleNavigate} />}
      {currentPage === 'about' && <About onNavigate={handleNavigate} />}
      {currentPage === 'faq' && <FAQ onNavigate={handleNavigate} />}
      {currentPage === 'admin' && <AdminPanel />}
      {currentPage === 'privacy' && <Privacy onNavigate={handleNavigate} />}
      {currentPage === 'terms' && <Terms onNavigate={handleNavigate} />}
      {currentPage === 'shipping' && <Shipping onNavigate={handleNavigate} />}
      {currentPage === 'returns' && <Returns onNavigate={handleNavigate} />}
      {currentPage === 'product' && <ProductDetail product={selectedProduct} onNavigate={handleNavigate} />}
      {currentPage === '404' && <NotFound onNavigate={handleNavigate} />}
      {currentPage === 'account' && <MyOrders onNavigate={handleNavigate} />}
      {currentPage === 'user' && <UserAccount onNavigate={handleNavigate} onClose={() => {}} />}
      {currentPage === 'blog' && <Blog onNavigate={handleNavigate} />}
      <WhatsAppChat />
      <LiveChat />
      <Analytics />
      <CookiePopup />
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} cartCount={cartCount} wishlistCount={wishlist.length} />
      {quickViewProduct && <QuickView product={quickViewProduct} onClose={closeQuickView} />}
      {showNewsletter && <NewsletterPopup onClose={() => setShowNewsletter(false)} />}
      {showCompare && <CompareModal onClose={() => setShowCompare(false)} onNavigate={handleNavigate} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={(user) => console.log('Logged in:', user)} />}
    </div>
  );
}

export default AppContent;
