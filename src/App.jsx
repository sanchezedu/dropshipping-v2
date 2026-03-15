import { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import QuickView from './components/QuickView';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import ProductDetail from './components/ProductDetail';
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
            Los mejores productos con envío gratis
          </p>
          <button
            onClick={() => handleNavigate('shop')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100"
          >
            Ver Productos
          </button>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center">
        <p>© 2026 DropShop Ecuador</p>
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
        {currentPage === 'product' && (
          <ProductDetail 
            product={selectedProduct} 
            onNavigate={handleNavigate} 
          />
        )}

        {quickViewProduct && (
          <QuickView product={quickViewProduct} onClose={closeQuickView} />
        )}
      </div>
    </StoreProvider>
  );
}

export default App;
