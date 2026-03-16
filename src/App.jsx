import { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
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
import CountdownTimer from './components/CountdownTimer';
import MyOrders from './components/MyOrders';
import { products as localProducts } from './data/products';
import { fetchProduct as fetchProductSupabase } from './lib/supabase';
import { X, Mail, Gift, ChevronRight, GitCompare, Info, Loader2 } from 'lucide-react';

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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
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

  // Load products - try Supabase first, fallback to local
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchProductsSupabase();
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(localProducts);
        }
      } catch (error) {
        console.log('Using local products:', error.message);
        setProducts(localProducts);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Initialize dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('dropshop-dark-mode') === 'true' || 
      (localStorage.getItem('dropshop-dark-mode') === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Load single product when navigating to product page
  useEffect(() => {
    async function loadProduct() {
      if (currentPage === 'product' && selectedProduct && typeof selectedProduct === 'number') {
        try {
          const product = await fetchProductSupabase(selectedProduct);
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
    { id: 'all', name: 'Todos' },
    { id: 'electronica', name: 'Electronica' },
    { id: 'accesorios', name: 'Accesorios' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'hogar', name: 'Hogar' }
  ];

  // Loading state
  if (loading && currentPage === 'home') {
    return (
      <StoreProvider>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </StoreProvider>
    );
  }

  // Render Home
  const renderHome = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4">
        <p className="text-sm font-semibold">ENVIO GRÁTIS a todo Ecuador en pedidos mayores a $50 | Pago contra entrega disponible</p>
      </div>

      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" alt="Tienda" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">Los Mejores Productos<span className="block text-orange-400">Al Mejor Precio</span></h1>
              <p className="text-xl text-white/90 mb-8">Envio gratis a todo Ecuador. Calidad garantizada.</p>
              <button onClick={() => handleNavigate('shop')} className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-4 rounded-full font-bold">Ver Ofertas de Hoy</button>
            </div>
          </div>
        </div>
      </section>

      <button onClick={() => setShowCompare(true)} className="fixed top-20 right-0 z-40 bg-indigo-600 text-white px-3 py-2 rounded-l-lg shadow-lg flex items-center gap-2 hover:bg-indigo-700">
        <GitCompare className="w-4 h-4" /> <span className="text-sm">Comparar</span>
      </button>

      {/* Flash Sale Banner with Countdown */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white text-center md:text-left">
            <h3 className="text-2xl font-bold">🔥 OFERTA FLASH</h3>
            <p className="text-white/90">20% de descuento en electrónicos hasta:</p>
          </div>
          <CountdownTimer targetDate={new Date().getTime() + 3 * 24 * 60 * 60 * 1000} />
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Explora por Categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(c => c.id !== 'all').map((cat) => (
              <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); handleNavigate('shop'); }} className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200">
                <h3 className="font-bold text-gray-800 text-center">{cat.name}</h3>
                <p className="text-sm text-gray-500 text-center">{products.filter(p => p.category === cat.id).length} productos</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Pago Seguro', desc: '100% Seguro' },
              { title: 'Envio Gratis', desc: 'Pedidos +$50' },
              { title: '30 Dias', desc: 'Devolucion' },
              { title: 'Soporte 24/7', desc: 'Por WhatsApp' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-xl">✓</span></div>
                <div><p className="font-bold text-gray-900">{item.title}</p><p className="text-sm text-gray-600">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <button onClick={() => handleNavigate('shop')} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline">Ver todos <ChevronRight className="w-4 h-4" /></button>
          </div>
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Nuevos Productos</h2>
              <p className="text-gray-500 mt-1">Los últimos productos agregados a nuestra tienda</p>
            </div>
            <button onClick={() => handleNavigate('shop')} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline">Ver todos <ChevronRight className="w-4 h-4" /></button>
          </div>
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.tags?.includes('nuevo')).slice(0, 4).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos nuevos</p>
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Más Vendidos</h2>
              <p className="text-gray-500 mt-1">Los productos más populares de nuestra tienda</p>
            </div>
            <button onClick={() => handleNavigate('shop')} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline">Ver todos <ChevronRight className="w-4 h-4" /></button>
          </div>
          {products.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.tags?.includes('bestseller')).slice(0, 4).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay productos disponibles</p>
            </div>
          )}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6"><Info className="w-5 h-5 text-gray-400" /><h2 className="text-2xl font-bold">Vistos Recientemente</h2></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyViewed.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
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

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">DropShop</h4>
              <p className="text-gray-400 text-sm">Tu tienda de confianza.</p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600">f</a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600">i</a>
                <a href="https://wa.me/593991234567" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600">w</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Informacion</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('about')} className="hover:text-white">Nosotros</button></li>
                <li><button onClick={() => handleNavigate('faq')} className="hover:text-white">FAQ</button></li>
                <li><button onClick={() => handleNavigate('contact')} className="hover:text-white">Contacto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('terms')} className="hover:text-white">Terminos</button></li>
                <li><button onClick={() => handleNavigate('privacy')} className="hover:text-white">Privacidad</button></li>
                <li><button onClick={() => handleNavigate('returns')} className="hover:text-white">Devoluciones</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Guayaquil, Ecuador</li>
                <li>info@dropshop.ec</li>
                <li>+593 99 123 4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">© 2026 DropShop Ecuador.</div>
        </div>
      </footer>

      <a href="https://wa.me/593991234567" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  );

  const renderShop = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Tienda</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar..." className="px-4 py-2 border rounded-lg" />
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border rounded-lg">
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="default">Ordenar</option>
            <option value="price-low">Precio: Menor</option>
            <option value="price-high">Precio: Mayor</option>
            <option value="rating">Mejor Rating</option>
          </select>
        </div>
        <p className="mb-4">{filteredProducts.length} productos</p>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <StoreProvider>
      <div className="min-h-screen">
        <Toast />
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
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
        <WhatsAppChat />
        {quickViewProduct && <QuickView product={quickViewProduct} onClose={closeQuickView} />}
        {showNewsletter && <NewsletterPopup onClose={() => setShowNewsletter(false)} />}
        {showCompare && <CompareModal onClose={() => setShowCompare(false)} onNavigate={handleNavigate} />}
      </div>
    </StoreProvider>
  );
}

export default App;
