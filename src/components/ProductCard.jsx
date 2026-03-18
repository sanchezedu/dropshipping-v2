import { Heart, Eye, ShoppingCart, Star, GitCompare, Zap, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { redirectToShopifyCheckout, initVariantCache } from '../lib/shopify';

// Helper to create handle from product name
function createHandle(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Initialize Shopify variant cache on first load
initVariantCache().catch(console.error);

export default function ProductCard({ product, onQuickView, onNavigate }) {
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useStore();
  
  const inWishlist = isInWishlist(product?.id);
  const inCompare = isInCompare(product?.id);
  
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
    <div className="product-card group relative bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Badges */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start p-2 md:p-3">
        {discount > 0 && <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-lg text-xs font-bold">{discount}%</span>}
        {tags.includes('bestseller') && <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold">Top</span>}
        {tags.includes('nuevo') && <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-0.5 rounded-lg text-xs font-bold">Nuevo</span>}
      </div>

      {stockLevel === 'low' && <div className="absolute top-8 left-2 z-10"><span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[9px] font-medium">Poco stock</span></div>}

      {/* Wishlist & Compare */}
      <div className="absolute top-2 right-2 z-20 flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); toggleCompare(product); }} className={`p-1.5 bg-white/90 rounded-full shadow ${inCompare ? 'text-indigo-600' : 'text-gray-400'}`}>
          <GitCompare className={`w-3 h-3 ${inCompare ? 'fill-current' : ''}`} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }} className="p-1.5 bg-white/90 rounded-full shadow">
          <Heart className={`w-3 h-3 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Image */}
      <div onClick={() => onNavigate('product', product)} className="relative aspect-square overflow-hidden cursor-pointer bg-gray-100">
        <img src={product?.image || 'https://via.placeholder.com/400'} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
      </div>

      {/* Content */}
      <div onClick={() => onNavigate('product', product)} className="p-2.5 cursor-pointer flex-1 flex flex-col">
        <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wide mb-0.5">{category}</p>
        <h3 className="font-semibold text-xs text-gray-800 dark:text-white mb-1 line-clamp-2 leading-tight">{name}</h3>
        
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-px">{[...Array(5)].map((_, i) => <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
          <span className="text-[9px] text-green-600 font-medium">{reviews >= 1000 ? (reviews/1000).toFixed(1)+'k' : reviews}</span>
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-base font-bold text-indigo-600">${price.toFixed(2)}</span>
          {oldPrice > price && <span className="text-[10px] text-gray-400 line-through">${oldPrice.toFixed(2)}</span>}
        </div>

        {/* Buy buttons */}
        <div className="flex gap-1 mt-auto">
          <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold py-2 rounded-lg touch-manipulation active:scale-95 transition-transform">
            Agregar
          </button>
          {/* Direct checkout - goes to Shopify cart with product */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              redirectToShopifyCheckout(product, 1);
            }} 
            className="flex-1 bg-[#96bf48] text-white text-xs font-semibold py-2 rounded-lg touch-manipulation active:scale-95 transition-transform flex items-center justify-center gap-1"
          >
            <Zap className="w-3 h-3" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
