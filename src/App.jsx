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
import { products, categories } from './data/products';
import { X, Mail, Gift, ChevronRight } from 'lucide-react';

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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-bounce-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5" />
        </button>
        
        {submitted ? (
          <div className="py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Gracias!</h3>
            <p className="text-gray-600">Codigo: <span className="font-bold text-indigo-600">BIENVENIDO10</span></p>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Recibe 10% de descuento!</h3>
            <p className="text-gray-600 mb-4">Suscribete y obtene un codigo para tu primera compra.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electronico"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
              <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all">
                Obtener descuento
              </button>
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const hasSeenNewsletter = localStorage.getItem('dropshop-newsletter');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => setShowNewsletter(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNavigate = (page, product = null) => {
    setCurrentPage(page);
    if (product) setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  const handleQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  let filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-low') filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);

  // Render Home
  const renderHome = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4">
        <p className="text-sm font-semibold">ENVIO GRÁTIS a todo Ecuador en pedidos mayores a $50 | Pago contra entrega disponible</p>
      </div>

      {/* Hero */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" alt="Tienda" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Los Mejores Productos
                <span className="block text-orange-400">Al Mejor Precio</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">Envio gratis a todo Ecuador. Calidad garantizada.</p>
              <button onClick={() => handleNavigate('shop')} className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg">
                Ver Ofertas de Hoy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Professional Icons */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Explora por Categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'electronica', name: 'Electronica', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { id: 'accesorios', name: 'Accesorios', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
              { id: 'fitness', name: 'Fitness', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
              { id: 'hogar', name: 'Hogar', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' }
            ].map((cat) => (
              <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); handleNavigate('shop'); }} className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={cat.icon} /></svg>
                </div>
                <h3 className="font-bold text-gray-800 text-center">{cat.name}</h3>
                <p className="text-sm text-gray-500 text-center">{products.filter(p => p.category === cat.id).length} productos</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Pago Seguro', desc: '100% Seguro', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { title: 'Envio Gratis', desc: 'Pedidos +$50', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
              { title: '30 Dias', desc: 'Devolucion', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
              { title: 'Soporte 24/7', desc: 'Por WhatsApp', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <button onClick={() => handleNavigate('shop')} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline">
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Andrea Paz', location: 'Quito', text: 'Me encanto la rapidez del envio. Llego en 3 dias a Quito. El producto es exactamente como en las fotos.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
              { name: 'Marco Delgado', location: 'Guayaquil', text: 'Segunda vez que compro y siempre todo excelente. El servicio al cliente es muy atento.', rating: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
              { name: 'Sofia Mendoza', location: 'Cuenca', text: 'Me llego el pedido muy bien empacado. El teclado gaming funciona perfecto. Precios muy competitivos.', rating: 4, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <span key={j} className={j < t.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}
                </div>
                <p className="text-gray-700">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">DropShop</h4>
              <p className="text-gray-400 text-sm">Tu tienda de confianza para compras en linea con los mejores productos y precios de Ecuador.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Informacion</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('about')} className="hover:text-white">Nosotros</button></li>
                <li><button onClick={() => handleNavigate('contact')} className="hover:text-white">Contacto</button></li>
                <li><button onClick={() => handleNavigate('shipping')} className="hover:text-white">Envios</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('terms')} className="hover:text-white">Terminos y Condiciones</button></li>
                <li><button onClick={() => handleNavigate('privacy')} className="hover:text-white">Politica de Privacidad</button></li>
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © 2026 DropShop Ecuador. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* WhatsApp */}
      <a href="https://wa.me/593991234567" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  );

  // Render Shop
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} onQuickView={handleQuickView} onNavigate={handleNavigate} />)}
        </div>
      </div>
    </div>
  );

  return (
    <StoreProvider>
      <div className="min-h-screen">
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
        {currentPage === 'home' && renderHome()}
        {currentPage === 'shop' && renderShop()}
        {currentPage === 'wishlist' && <Wishlist onNavigate={handleNavigate} />}
        {currentPage === 'cart' && <Cart onClose={() => setShowCart(false)} onNavigate={handleNavigate} />}
        {currentPage === 'checkout' && <Checkout onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <Contact onNavigate={handleNavigate} />}
        {currentPage === 'about' && <About onNavigate={handleNavigate} />}
        {currentPage === 'privacy' && <Privacy onNavigate={handleNavigate} />}
        {currentPage === 'terms' && <Terms onNavigate={handleNavigate} />}
        {currentPage === 'shipping' && <Shipping onNavigate={handleNavigate} />}
        {currentPage === 'returns' && <Returns onNavigate={handleNavigate} />}
        {currentPage === 'product' && <ProductDetail product={selectedProduct} onNavigate={handleNavigate} />}
        {currentPage === '404' && <NotFound onNavigate={handleNavigate} />}
        {quickViewProduct && <QuickView product={quickViewProduct} onClose={closeQuickView} />}
        {showNewsletter && <NewsletterPopup onClose={() => setShowNewsletter(false)} />}
      </div>
    </StoreProvider>
  );
}

export default App;
