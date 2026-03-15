import { useState } from 'react';
import { 
  Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, 
  Minus, Plus, ChevronRight, Facebook, Instagram, Twitter, Mail
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductDetail({ product, onNavigate }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  
  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  // Related products (same category)
  const relatedProducts = product.category 
    ? require('../data/products').products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
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
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full font-bold">
                    -{discount}% OFF
                  </span>
                )}
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

              {/* Rating */}
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
                <span className="text-gray-500">({product.reviews} reseñas)</span>
              </div>

              {/* Price */}
              <div className="border-b pb-4 mb-4">
                <div className="flex items-baseline gap-3">
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
              </div>

              {/* Stock & Shipping */}
              <div className="space-y-3 mb-6">
                {product.stock ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">En stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="font-medium">Agotado</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <span>Envío gratis a todo Ecuador</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <span>Garantía de satisfacción</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <RotateCcw className="w-5 h-5 text-indigo-600" />
                  <span>30 días para devoluciones</span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
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
                  disabled={!product.stock}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    inWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Description */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-3">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="border-t pt-4 mt-4">
                <h3 className="font-bold text-lg mb-3">Características</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {product.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
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
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Términos y Condiciones</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Política de Privacidad</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Política de Envíos</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Política de Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span>📍 Guayaquil, Ecuador</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@dropshop.ec</span>
                </li>
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
