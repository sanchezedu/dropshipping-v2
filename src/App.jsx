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
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            DropShop Ecuador
          </h1>
          <p className="text-xl mb-8">
            Los mejores productos con envío gratis a todo Ecuador
          </p>
          <button
            onClick={() => handleNavigate('shop')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100"
          >
            Ver Productos
          </button>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <p className="font-bold text-sm">Pago Seguro</p>
                <p className="text-xs text-gray-500">100% Seguro</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <p className="font-bold text-sm">Envío Gratis</p>
                <p className="text-xs text-gray-500">Pedidos +$50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <div>
                <p className="font-bold text-sm">30 Días</p>
                <p className="text-xs text-gray-500">Devolución</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="font-bold text-sm">Soporte 24/7</p>
                <p className="text-xs text-gray-500">Atención inmediata</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-4 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-2">Métodos de pago aceptados</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="bg-white px-3 py-1 rounded shadow text-sm font-bold">Visa</span>
            <span className="bg-white px-3 py-1 rounded shadow text-sm font-bold">Mastercard</span>
            <span className="bg-white px-3 py-1 rounded shadow text-sm font-bold">American Express</span>
            <span className="bg-white px-3 py-1 rounded shadow text-sm font-bold">PayPal</span>
            <span className="bg-white px-3 py-1 rounded shadow text-sm font-bold">Diners Club</span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
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

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Reseñas de Clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Carlos M.', text: 'Excelente servicio, me llegó muy rápido el pedido. Muy recomendado!', rating: 5 },
              { name: 'María G.', text: 'Productos de excelente calidad. Ya hice mi tercera compra.', rating: 5 },
              { name: 'Juan P.', text: 'El mejor dropshipping en Ecuador. Totalmente satisfecho.', rating: 5 },
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <p className="font-bold">{testimonial.name}</p>
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
