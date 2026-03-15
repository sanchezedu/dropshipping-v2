import { Heart, Eye, ShoppingCart, Star, GitCompare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product, onQuickView, onNavigate }) {
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useStore();
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const stockLevel = product.reviews > 1500 ? 'high' : product.reviews > 500 ? 'medium' : 'low';

  return (
    <div className="product-card group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-3">
        {discount > 0 && <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">{discount}%</span>}
        {product.tags?.includes('bestseller') && <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">Top</span>}
        {product.tags?.includes('nuevo') && <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold">Nuevo</span>}
      </div>

      {stockLevel === 'low' && <div className="absolute top-14 left-3 z-10"><span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">Pocas unidades</span></div>}

      {/* Wishlist & Compare */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); toggleCompare(product); }} className={`p-2 bg-white/90 rounded-full shadow ${inCompare ? 'text-indigo-600' : 'text-gray-400'}`}>
          <GitCompare className={`w-4 h-4 ${inCompare ? 'fill-current' : ''}`} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="p-2 bg-white/90 rounded-full shadow">
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Image */}
      <div onClick={() => onNavigate('product', product)} className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-3 bg-white rounded-full hover:bg-indigo-600 hover:text-white"><Eye className="w-5 h-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="p-3 bg-white rounded-full hover:bg-indigo-600 hover:text-white"><ShoppingCart className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Content */}
      <div onClick={() => onNavigate('product', product)} className="p-4 cursor-pointer">
        <p className="text-sm text-indigo-600 font-medium mb-1 capitalize">{product.category}</p>
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>
          <span className="text-xs text-green-600">{product.reviews.toLocaleString()} ventas</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          {product.oldPrice > product.price && <span className="text-sm text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>}
        </div>

        <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
