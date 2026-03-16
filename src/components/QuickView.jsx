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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-4xl max-h-[90vh] overflow-auto">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-gray-100 dark:bg-slate-700 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 z-10 touch-manipulation">
          <X className="w-5 h-5 dark:text-white" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-gray-100 dark:bg-slate-700">
            <img src={product?.image || 'https://via.placeholder.com/600'} alt={product?.name} className="w-full h-48 md:h-full object-cover min-h-[180px] md:min-h-[300px]" />
            {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs">{discount}% OFF</span>}
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 flex flex-col">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">{product?.category}</p>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2">{product?.name}</h2>

            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex gap-px">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(product?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
              <span className="text-xs text-gray-500">({product?.reviews || 0})</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-indigo-600">${price.toFixed(2)}</span>
              {oldPrice > price && (
                <>
                  <span className="text-sm text-gray-400 line-through">${oldPrice.toFixed(2)}</span>
                  <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full text-xs font-medium">Ahorra ${(oldPrice - price).toFixed(2)}</span>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{product?.description}</p>

            {features.length > 0 && (
              <div className="mb-3">
                <h4 className="font-semibold mb-1.5 text-sm dark:text-white">Características:</h4>
                <ul className="grid grid-cols-1 gap-1">
                  {features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add */}
            <div className="mt-auto pt-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cantidad:</span>
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 touch-manipulation">
                    <Minus className="w-4 h-4 dark:text-white" />
                  </button>
                  <span className="px-3 font-medium dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 touch-manipulation">
                    <Plus className="w-4 h-4 dark:text-white" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => addToCart(product, quantity)} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold touch-manipulation active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Agregar
                </button>
                <button onClick={() => toggleWishlist(product)} className={`p-2.5 rounded-lg border-2 touch-manipulation ${inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 dark:border-slate-600 text-gray-400'}`}>
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
