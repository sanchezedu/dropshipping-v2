import { Heart, Eye, ShoppingCart, Star, GitCompare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product, onQuickView, onNavigate }) {
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useStore();
  
  const inWishlist = isInWishlist(product?.id);
  const inCompare = isInCompare(product?.id);
  
  // Handle both Supabase and local data formats
  const price = product?.price || 0;
  const oldPrice = product?.old_price || product?.oldPrice || 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const stockLevel = (product?.reviews || 0) > 1500 ? 'high' : (product?.reviews || 0) > 500 ? 'medium' : 'low';
  const rating = product?.rating || 0;
  const reviews = product?.reviews || 0;
  const tags = product?.tags || [];
  const name = product?.name || '';
  const category = product?.category || '';

  return (
    <div className="product-card group relative bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-2 md:p-3">
        {discount > 0 && <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 md:px-3 py-0.5 md:py-1.5 rounded-lg text-xs md:text-sm font-bold">{discount}%</span>}
        {tags.includes('bestseller') && <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 md:px-3 py-0.5 md:py-1.5 rounded-lg text-xs md:text-sm font-bold">Top</span>}
        {tags.includes('nuevo') && <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 md:px-3 py-0.5 md:py-1.5 rounded-lg text-xs md:text-sm font-bold">Nuevo</span>}
      </div>

      {stockLevel === 'low' && <div className="absolute top-10 md:top-14 left-2 md:left-3 z-10"><span className="bg-orange-500 text-white px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs font-medium">Pocas unidades</span></div>}

      {/* Wishlist & Compare */}
      <div className="absolute top-2 md:top-3 right-2 md:right-3 z-20 flex gap-1 md:gap-2">
        <button onClick={(e) => { e.stopPropagation(); toggleCompare(product); }} className={`p-1.5 md:p-2 bg-white/90 rounded-full shadow ${inCompare ? 'text-indigo-600' : 'text-gray-400'}`}>
          <GitCompare className={`w-3 h-3 md:w-4 md:h-4 ${inCompare ? 'fill-current' : ''}`} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="p-1.5 md:p-2 bg-white/90 rounded-full shadow">
          <Heart className={`w-3 h-3 md:w-4 md:h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Image */}
      <div onClick={() => onNavigate('product', product)} className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100">
        <img src={product?.image || 'https://via.placeholder.com/400'} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        {/* Quick actions - always visible on mobile, hover on desktop */}
        <div className="md:hidden absolute inset-0 bg-black/40 flex items-center justify-center gap-2 p-2">
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-2 bg-white rounded-full hover:bg-indigo-600 hover:text-white touch-manipulation">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="p-2 bg-white rounded-full hover:bg-indigo-600 hover:text-white touch-manipulation">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        {/* Desktop hover overlay */}
        <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-3 bg-white rounded-full hover:bg-indigo-600 hover:text-white"><Eye className="w-5 h-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="p-3 bg-white rounded-full hover:bg-indigo-600 hover:text-white"><ShoppingCart className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Content */}
      <div onClick={() => onNavigate('product', product)} className="p-2 md:p-4 cursor-pointer">
        <p className="text-[10px] md:text-sm text-indigo-600 font-medium mb-0.5 md:mb-1 capitalize">{category}</p>
        <h3 className="font-semibold text-xs md:text-base text-gray-800 dark:text-white mb-1 md:mb-2 line-clamp-2">{name}</h3>
        
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
          <span className="text-[10px] md:text-xs text-green-600">{reviews.toLocaleString()} ventas</span>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-sm md:text-xl font-bold text-indigo-600">${price.toFixed(2)}</span>
          {oldPrice > price && <span className="text-[10px] md:text-sm text-gray-400 line-through">${oldPrice.toFixed(2)}</span>}
        </div>

        {/* Add to cart - always visible on mobile */}
        <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full mt-2 md:mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs md:text-sm py-2 md:py-2.5 rounded-lg font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all touch-manipulation">
          Agregar
        </button>
      </div>
    </div>
  );
}
