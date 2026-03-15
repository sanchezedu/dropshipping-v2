import { useState } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (page, product = null) => {
    setCurrentPage(page);
    if (product) {
      setSelectedProduct(product);
    }
    window.scrollTo(0, 0);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Filter and sort products
  let filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  // Render Home Page
  const renderHome = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4">
        <p className="text-sm font-semibold">
          🔥 ENVÍO GRÁTIS a todo Ecuador en pedidos mayores a $50 | 📦 Pago contra entrega disponible
        </p>
      </div>

      {/* Hero with Image */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" 
          alt="Tienda online Ecuador"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Los Mejores Productos
                <span className="block text-orange-400">Al Mejor Precio</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Envío gratis a todo Ecuador. Calidad garantizada.
              </p>
              <button
                onClick={() => handleNavigate('shop')}
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                🛒 Ver Ofertas de Hoy
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Compra por Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); handleNavigate('shop'); }}
                className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">
                    {cat.id === 'electronica' ? '📱' : cat.id === 'accesorios' ? '🎮' : cat.id === 'fitness' ? '💪' : '🏠'}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-center">{cat.name}</h3>
                <p className="text-sm text-gray-500 text-center">{products.filter(p => p.category === cat.id).length} productos</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals - Improved Contrast */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">Pago Seguro</p>
                <p className="text-sm text-gray-600">100% Seguro</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">Envío Gratis</p>
                <p className="text-sm text-gray-600">Pedidos +$50</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">↩️</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">30 Días</p>
                <p className="text-sm text-gray-600">Devolución</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="font-bold text-gray-900">Soporte 24/7</p>
                <p className="text-sm text-gray-600">Por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods - Improved */}
      <section className="py-6 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-2 md:mb-0">Métodos de pago aceptados:</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm font-bold text-white border border-gray-700">Visa</span>
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm font-bold text-white border border-gray-700">Mastercard</span>
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm font-bold text-white border border-gray-700">American Express</span>
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm font-bold text-white border border-gray-700">🍊 PayPhone</span>
              <span className="bg-gray-800 px-4 py-2 rounded-lg text-sm font-bold text-white border border-gray-700">🏦 Transferencia</span>
              <span className="bg-green-600 px-4 py-2 rounded-lg text-sm font-bold text-white">💵 Contra Entrega</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">🔥 Productos Destacados</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={handleQuickView}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Redesigned */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Andrea Paz', 
                location: 'Quito', 
                text: 'Me encantó la rapidez del envío. Llegó en 3 días a Quito. El producto es exactamente como en las fotos. ¡Totalmente recomendado!', 
                rating: 5,
                verified: true,
                date: '2 semanas atrás',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
              },
              { 
                name: 'Marco Delgado', 
                location: 'Guayaquil', 
                text: 'Segunda vez que compro y siempre todo excelente. El servicio al cliente es muy atento, me resolvieron una duda en minutos por WhatsApp.', 
                rating: 5,
                verified: true,
                date: '1 mes atrás',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
              },
              { 
                name: 'Sofia Mendoza', 
                location: 'Cuenca', 
                text: 'Me llegó el pedido muy bien empacado. El teclado gaming funciona perfecto. Precios muy competitivos comparados con otras tiendas.', 
                rating: 4,
                verified: true,
                date: '3 semanas atrás',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl relative">
                {testimonial.verified && (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    ✓ Compra Verificada
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.location} · {testimonial.date}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className={j < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
                  ))}
                </div>
                <p className="text-gray-700">"{testimonial.text}"</p>
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
              <h4 className="text-xl font-bold mb-4">DropShop Ecuador</h4>
              <p className="text-gray-400">Tu tienda de confianza para compras en línea.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavigate('terms')} className="hover:text-white">Términos</button></li>
                <li><button onClick={() => handleNavigate('privacy')} className="hover:text-white">Privacidad</button></li>
                <li><button onClick={() => handleNavigate('shipping')} className="hover:text-white">Envíos</button></li>
                <li><button onClick={() => handleNavigate('returns')} className="hover:text-white">Devoluciones</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavigate('about')} className="hover:text-white">Nosotros</button></li>
                <li><button onClick={() => handleNavigate('contact')} className="hover:text-white">Contacto</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📍 Guayaquil, Ecuador</li>
                <li>📧 info@dropshop.ec</li>
                <li>💬 +593 99 123 4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 DropShop Ecuador. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/593991234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );

  // Render Shop Page
  const renderShop = () => (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Tienda</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="px-4 py-2 border rounded-lg"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="default">Ordenar</option>
            <option value="price-low">Precio: Menor</option>
            <option value="price-high">Precio: Mayor</option>
            <option value="rating">Mejor Rating</option>
          </select>
        </div>

        <p className="mb-4">{filteredProducts.length} productos</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleQuickView}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <StoreProvider>
      <div className="min-h-screen">
        <Header 
          onNavigate={handleNavigate} 
          currentPage={currentPage}
        />
        
        {currentPage === 'home' && renderHome()}
        {currentPage === 'shop' && renderShop()}
        {currentPage === 'wishlist' && <Wishlist onNavigate={handleNavigate} />}
        {currentPage === 'cart' && <Cart onClose={() => setShowCart(false)} />}
        {currentPage === 'checkout' && <Checkout onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <Contact onNavigate={handleNavigate} />}
        {currentPage === 'about' && <About onNavigate={handleNavigate} />}
        {currentPage === 'privacy' && <Privacy onNavigate={handleNavigate} />}
        {currentPage === 'terms' && <Terms onNavigate={handleNavigate} />}
        {currentPage === 'shipping' && <Shipping onNavigate={handleNavigate} />}
        {currentPage === 'returns' && <Returns onNavigate={handleNavigate} />}
        {currentPage === 'product' && (
          <ProductDetail 
            product={selectedProduct} 
            onNavigate={handleNavigate} 
          />
        )}
        {currentPage === '404' && <NotFound onNavigate={handleNavigate} />}

        {quickViewProduct && (
          <QuickView product={quickViewProduct} onClose={closeQuickView} />
        )}
      </div>
    </StoreProvider>
  );
}

export default App;
