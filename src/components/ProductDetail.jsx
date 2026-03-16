import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { fetchProductVariants } from '../lib/supabase';
import ProductReviews from './ProductReviews';

export default function ProductDetail({ product, onNavigate }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [variants, setVariants] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  
  useEffect(() => {
    loadVariants();
  }, [product?.id]);

  async function loadVariants() {
    if (product?.id) {
      const data = await fetchProductVariants(product.id);
      setVariants(data);
      const defaultSelections = {};
      data.forEach(v => {
        if (!defaultSelections[v.type]) {
          defaultSelections[v.type] = v;
        }
      });
      setSelectedVariants(defaultSelections);
    }
  }

  function handleVariantSelect(type, variant) {
    setSelectedVariants(prev => ({ ...prev, [type]: variant }));
  }

  function calculatePrice() {
    let finalPrice = product?.price || 0;
    Object.values(selectedVariants).forEach(v => {
      finalPrice += (v.price_modifier || 0);
    });
    return finalPrice;
  }

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const price = calculatePrice();
  const oldPrice = product?.old_price || product?.oldPrice || 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const stockLevel = (product?.reviews || 0) > 1500 ? 'high' : (product?.reviews || 0) > 500 ? 'medium' : 'low';
  const rating = product?.rating || 0;
  const reviews = product?.reviews || 0;
  const features = product?.features || [];
  const description = product?.description || '';
  const name = product?.name || '';
  const category = product?.category || '';

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 pb-24 md:pb-8">
      {/* Mobile Back Button */}
      <div className="md:hidden max-w-7xl mx-auto px-3 mb-2">
        <button onClick={() => onNavigate('shop')} className="flex items-center gap-1 text-sm text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {/* Breadcrumb - Hide on mobile */}
        <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <button onClick={() => onNavigate('home')} className="hover:text-indigo-600">Inicio</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => onNavigate('shop')} className="hover:text-indigo-600">Tienda</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 truncate max-w-xs">{name}</span>
        </nav>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {/* Image */}
            <div className="space-y-2 md:space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img src={product?.image || 'https://via.placeholder.com/600'} alt={name} className="w-full h-full object-cover" />
                {discount > 0 && <span className="absolute top-2 md:top-4 left-2 md:left-4 bg-red-500 text-white px-2 md:px-4 py-1 rounded-full font-bold text-xs md:text-sm">{discount}% OFF</span>}
                {stockLevel === 'low' && <span className="absolute top-2 md:top-4 right-2 md:right-4 bg-orange-500 text-white px-2 md:px-4 py-1 rounded-full font-bold text-xs md:text-sm">Pocas</span>}
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="text-xs md:text-sm text-indigo-600 font-medium capitalize mb-1 md:mb-2">{category}</p>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">{name}</h1>

              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 md:w-5 md:h-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                <span className="text-xs md:text-base text-indigo-600 font-medium">{rating}</span>
                <span className="text-gray-400 hidden md:inline">|</span>
                <span className="text-xs md:text-base text-green-600">{reviews.toLocaleString()} ventas</span>
              </div>

              <div className="flex items-baseline gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600">${price.toFixed(2)}</span>
                {oldPrice > price && (
                  <>
                    <span className="text-sm md:text-xl text-gray-400 line-through">${oldPrice.toFixed(2)}</span>
                    <span className="bg-green-100 text-green-700 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium text-xs md:text-sm">Ahorra ${(oldPrice - price).toFixed(2)}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3 md:mb-4">
                {stockLevel === 'low' ? <span className="text-orange-600 font-medium text-sm">Ultimas unidades!</span> : <span className="text-green-600 font-medium text-sm">En stock</span>}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
                <span className="font-medium text-sm md:text-base">Cantidad:</span>
                <div className="flex items-center border-2 border-indigo-600 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 md:p-3 hover:bg-gray-100 touch-manipulation"><Minus className="w-4 h-4 md:w-5 md:h-5" /></button>
                  <span className="px-3 md:px-6 font-bold text-sm md:text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 md:p-3 hover:bg-gray-100 touch-manipulation"><Plus className="w-4 h-4 md:w-5 md:h-5" /></button>
                </div>
              </div>

              {/* Variants */}
              {variants.length > 0 && (
                <div className="mt-3 md:mt-4 space-y-3 md:space-y-4">
                  {Object.entries(variants.reduce((acc, v) => {
                    if (!acc[v.type]) acc[v.type] = [];
                    acc[v.type].push(v);
                    return acc;
                  }, {})).map(([type, typeVariants]) => (
                    <div key={type}>
                      <span className="font-medium capitalize text-gray-700 dark:text-gray-300 mb-1 md:mb-2 block text-sm">
                        {type === 'color' ? 'Color' : type === 'size' ? 'Tamaño' : type === 'storage' ? 'Almacenamiento' : type}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {typeVariants.map(variant => (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(type, variant)}
                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg border-2 transition-all flex items-center gap-1 md:gap-2 text-xs md:text-sm ${
                              selectedVariants[type]?.id === variant.id
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {type === 'color' && (
                              <span 
                                className="w-3 h-3 md:w-4 md:h-4 rounded-full border" 
                                style={{ backgroundColor: variant.name.toLowerCase() }}
                              />
                            )}
                            <span className="font-medium">{variant.name}</span>
                            {variant.price_modifier > 0 && (
                              <span className="text-[10px] md:text-xs text-green-600">+${variant.price_modifier}</span>
                            )}
                            {selectedVariants[type]?.id === variant.id && (
                              <Check className="w-3 h-3 md:w-4 md:h-4 text-indigo-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 md:gap-3 mb-4 md:mb-6">
                <button onClick={() => addToCart({ ...product, quantity, selectedVariants, finalPrice: calculatePrice() })} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base touch-manipulation">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">Agregar al Carrito</span><span className="md:hidden">Agregar</span>
                </button>
                <button onClick={() => toggleWishlist(product)} className={`p-2.5 md:p-3 rounded-lg md:rounded-xl border-2 transition-all touch-manipulation ${inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 hover:border-red-500'}`}>
                  <Heart className={`w-5 h-5 md:w-6 md:h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Payment Methods - Compact on mobile */}
              <div className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 mb-4 md:mb-6">
                <p className="font-medium text-gray-700 mb-2 text-sm">Metodos de pago:</p>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  <span className="bg-white px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold border">Visa</span>
                  <span className="bg-white px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold border">MC</span>
                  <span className="bg-orange-100 px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold text-orange-700">PayPhone</span>
                  <span className="bg-white px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold border">Transfer</span>
                  <span className="bg-green-100 px-2 md:px-3 py-1 rounded text-xs md:text-sm font-bold text-green-700">Contra Entrega</span>
                </div>
              </div>

              {/* Trust Info - Stack on mobile */}
              <div className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600"><Truck className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 flex-shrink-0" /><span className="text-xs md:text-sm">Envio gratis a todo Ecuador (pedidos +$50)</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Shield className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 flex-shrink-0" /><span className="text-xs md:text-sm">Garantia de satisfaccion</span></div>
                <div className="flex items-center gap-2 text-gray-600"><RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 flex-shrink-0" /><span className="text-xs md:text-sm">30 dias para devoluciones</span></div>
              </div>
            </div>
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="border-t pt-3 md:pt-4 mt-4 md:mt-6">
            <div className="flex gap-2 md:gap-4 border-b mb-3 md:mb-4 overflow-x-auto">
              {['description', 'features', 'shipping', 'reviews'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'description' ? 'Descripcion' : tab === 'features' ? 'Caracteristicas' : tab === 'shipping' ? 'Envio' : 'Reseñas'}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="text-sm md:text-base text-gray-600 leading-relaxed">
                {description || 'No hay descripcion disponible.'}
              </div>
            )}

            {activeTab === 'features' && (
              <ul className="space-y-2">
                {(features?.length > 0 ? features : ['Caracteristica 1', 'Caracteristica 2', 'Caracteristica 3']).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'shipping' && (
              <div className="text-sm md:text-base text-gray-600 space-y-2">
                <p>• Envio gratis en pedidos mayores a $50</p>
                <p>• Delivery en 3-5 dias habiles</p>
                <p>• Pago contra entrega disponible</p>
                <p>• Garantia de 30 dias en todos los productos</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <ProductReviews productId={product?.id} />
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-lg md:text-2xl font-bold mb-4">Productos Relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {/* Placeholder related products - would need actual implementation */}
          </div>
        </div>
      </div>
    </div>
  );
}
