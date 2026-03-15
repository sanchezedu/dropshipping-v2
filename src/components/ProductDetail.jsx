import { useState } from 'react';
import { 
  Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, 
  Minus, Plus, ChevronRight, Facebook, Instagram, Twitter, Mail,
  Check, AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductDetail({ product, onNavigate }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  
  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const stockLevel = product.reviews > 1500 ? 'high' : product.reviews > 500 ? 'medium' : 'low';

  // Generate gallery images from main image
  const galleryImages = [
    product.image,
    product.image.replace('w=600', 'w=800'),
    product.image.replace('w=600', 'w=700'),
    product.image.replace('w=600', 'w=500')
  ];

  // Related products
  const relatedProducts = product.category 
    ? require('../data/products').products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <button onClick={() => onNavigate('home')} className="hover:text-indigo-600">
            Inicio
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => onNavigate('shop')} className="hover:text-indigo-600">
            Tienda
          </button>
          <ChevronRight className="w-4 h-4" />
          <button 
            onClick={() => onNavigate('shop', { category: product.category })} 
            className="hover:text-indigo-600 capitalize"
          >
            {product.category}
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gallery Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={galleryImages[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full font-bold">
                    -{discount}% OFF
                  </span>
                )}
                {stockLevel === 'low' && (
                  <span className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full font-bold text-sm">
                    ⚠️ Pocas unidades
                  </span>
                )}
              </div>
              {/* Thumbnail Gallery */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => galleryImages[0] = img}
                    className="w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-600 transition-colors flex-shrink-0"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="text-indigo-600 font-medium capitalize mb-2">
                {product.category}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating & Sales */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-indigo-600 font-medium">{product.rating}</span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-medium">✓ {product.reviews.toLocaleString()} ventas</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-indigo-600">
                  ${product.price.toFixed(2)}
                </span>
                {product.oldPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Ahorra ${(product.oldPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-4">
                {stockLevel === 'low' ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-600 font-medium">¡Últimas unidades disponibles!</span>
                  </>
                ) : stockLevel === 'medium' ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">En stock</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">Disponible</span>
                  </>
                )}
              </div>

              {/* Trust Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">Envío gratis a todo Ecuador (pedidos +$50)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">Garantía de satisfacción</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <RotateCcw className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">30 días para devoluciones</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center border-2 border-indigo-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => addToCart({ ...product, quantity })}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    inWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-t pt-4">
                <div className="flex gap-4 border-b mb-4">
                  {['description', 'features', 'shipping'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 px-1 font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500 hover:text-indigo-600'
                      }`}
                    >
                      {tab === 'description' ? 'Descripción' : tab === 'features' ? 'Características' : 'Envío'}
                    </button>
                  ))}
                </div>

                {activeTab === 'description' && (
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {activeTab === 'features' && (
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'shipping' && (
                  <div className="text-gray-600 space-y-2">
                    <p>📦 Tiempo de procesamiento: 1-2 días hábiles</p>
                    <p>🚚 Tiempo de entrega: 3-7 días hábiles</p>
                    <p>📍 Envíos a todo Ecuador</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Otros también compraron</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => onNavigate('product', p)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-800 line-clamp-2 mb-2">
                      {p.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600">
                        ${p.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-500">{p.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">DropShop Ecuador</h4>
              <p className="text-gray-600 mb-4">
                Tu tienda de confianza para compras en línea con los mejores productos y precios.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-indigo-600"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-gray-400 hover:text-indigo-600"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('terms')} className="text-gray-600 hover:text-indigo-600">Términos y Condiciones</button></li>
                <li><button onClick={() => onNavigate('privacy')} className="text-gray-600 hover:text-indigo-600">Política de Privacidad</button></li>
                <li><button onClick={() => onNavigate('shipping')} className="text-gray-600 hover:text-indigo-600">Política de Envíos</button></li>
                <li><button onClick={() => onNavigate('returns')} className="text-gray-600 hover:text-indigo-600">Política de Devoluciones</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@dropshop.ec</li>
                <li>📍 Guayaquil, Ecuador</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-500">
            © 2026 DropShop Ecuador. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
