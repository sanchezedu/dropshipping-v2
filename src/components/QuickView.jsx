import { X, Heart, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function QuickView({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product?.id);

  if (!product) return null;

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover min-h-[300px]"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full font-bold">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col">
            <p className="text-indigo-600 font-medium capitalize mb-1">
              {product.category}
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
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
              <span className="text-gray-500">({product.reviews} reseñas)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-indigo-600">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                    Ahorra ${(product.oldPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Características:</h4>
              <ul className="grid grid-cols-2 gap-2">
                {product.features?.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-4">
              <span className="font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-4">
              {product.stock ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 font-medium">En stock</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-red-600 font-medium">Agotado</span>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={() => addToCart({ ...product, quantity })}
                disabled={!product.stock}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  inWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
