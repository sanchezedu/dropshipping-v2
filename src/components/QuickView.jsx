import { X, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function QuickView({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  
  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const price = product?.price || 0;
  const oldPrice = product?.old_price || product?.oldPrice || 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const features = product?.features || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-auto">
        <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10 touch-manipulation">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative bg-gray-100">
            <img src={product?.image || 'https://via.placeholder.com/600'} alt={product?.name} className="w-full h-48 md:h-full object-cover min-h-[200px] md:min-h-[300px]" />
            {discount > 0 && <span className="absolute top-2 md:top-4 left-2 md:left-4 bg-red-500 text-white px-2 md:px-4 py-1 rounded-full font-bold text-xs md:text-sm">{discount}% OFF</span>}
          </div>

          <div className="p-4 md:p-6 flex flex-col">
            <p className="text-xs md:text-sm text-indigo-600 font-medium capitalize mb-1">{product?.category}</p>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">{product?.name}</h2>

            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(product?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
              <span className="text-xs md:text-base text-gray-500">({product?.reviews || 0})</span>
            </div>

            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <span className="text-2xl md:text-3xl font-bold text-indigo-600">${price.toFixed(2)}</span>
              {oldPrice > price && (
                <>
                  <span className="text-sm md:text-lg text-gray-400 line-through">${oldPrice.toFixed(2)}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium">Ahorra</span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">{product?.description}</p>

            {features.length > 0 && (
              <div className="mb-3 md:mb-4">
                <h4 className="font-semibold mb-2 text-sm">Caracteristicas:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="text-xs md:text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <span className="font-medium text-sm md:text-base">Cantidad:</span>
              <div className="flex items-center border-2 border-indigo-600 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 touch-manipulation"><Minus className="w-4 h-4" /></button>
                <span className="px-3 md:px-4 font-medium text-sm md:text-base">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 touch-manipulation"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex gap-2 md:gap-3 mt-auto">
              <button onClick={() => addToCart({ ...product, quantity })} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base touch-manipulation">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden md:inline">Agregar al Carrito</span><span className="md:hidden">Agregar</span>
              </button>
              <button onClick={() => toggleWishlist(product)} className={`p-2.5 md:p-3 rounded-lg border-2 transition-colors touch-manipulation ${inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 hover:border-red-500 hover:text-red-500'}`}>
                <Heart className={`w-5 h-5 md:w-6 md:h-6 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
