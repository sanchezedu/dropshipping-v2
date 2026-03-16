import { Heart, Trash2, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Wishlist({ onNavigate }) {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-24 md:pb-0">
        <div className="text-center px-4">
          <Heart className="w-16 h-16 md:w-24 md:h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Tu lista de favoritos está vacía
          </h2>
          <p className="text-gray-500 mb-6 text-sm md:text-base">
            ¡Guarda tus productos favoritos para más tarde!
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-indigo-700 inline-flex items-center gap-2 touch-manipulation"
          >
            Ver Productos
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 pb-24 md:pb-8">
      {/* Mobile Back */}
      <div className="md:hidden max-w-7xl mx-auto px-3 mb-2">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-1 text-sm text-indigo-600">
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
          <Heart className="w-6 h-6 md:w-8 md:h-8 text-red-500 fill-current" />
          <h1 className="text-xl md:text-3xl font-bold">Mis Favoritos</h1>
          <span className="bg-red-100 text-red-600 px-2 md:px-3 py-0.5 rounded-full text-xs md:text-sm">
            {wishlist.length}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="bg-white rounded-xl md:rounded-2xl shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 md:h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 p-1.5 md:p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors touch-manipulation"
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                </button>
              </div>
              <div className="p-2 md:p-4">
                <p className="text-[10px] md:text-sm text-indigo-600 font-medium capitalize mb-0.5 md:mb-1">
                  {product.category}
                </p>
                <h3 className="font-semibold text-xs md:text-base text-gray-800 mb-1 md:mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div>
                    <span className="text-sm md:text-xl font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice > product.price && (
                      <span className="ml-1 md:ml-2 text-[10px] md:text-sm text-gray-400 line-through">
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 md:py-2.5 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm touch-manipulation"
                >
                  <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
