import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw, Minus, Plus, ChevronRight, Check } from 'lucide-react';
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
      // Auto-select first variant of each type
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

  // Dynamic Product Schema JSON-LD for SEO
  useEffect(() => {
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": name,
      "description": description,
      "image": product?.image || 'https://dropshipping-v2.vercel.app/favicon.svg',
      "sku": `PROD-${product?.id || '001'}`,
      "brand": {
        "@type": "Brand",
        "name": "DropShop Ecuador"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://dropshipping-v2.vercel.app/product/${product?.id || '1'}`,
        "priceCurrency": "USD",
        "price": price.toFixed(2),
        "priceValidUntil": "2026-12-31",
        "availability": stockLevel === 'low' ? "https://schema.org/LowStock" : "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "DropShop Ecuador"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.toString(),
        "reviewCount": reviews.toString()
      }
    };

    // Remove existing product schema if any
    const existingScript = document.getElementById('schema-product');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new product schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-product';
    script.textContent = JSON.stringify(productSchema);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById('schema-product');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [product, name, description, price, rating, reviews, stockLevel]);

  // Get related products from localStorage
  const recentlyViewed = JSON.parse(localStorage.getItem('dropshop-recent') || '[]');
  const relatedProducts = recentlyViewed.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <button onClick={() => onNavigate('home')} className="hover:text-indigo-600">Inicio</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => onNavigate('shop')} className="hover:text-indigo-600">Tienda</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-800 truncate max-w-xs">{name}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img src={product?.image || 'https://via.placeholder.com/600'} alt={name} className="w-full h-full object-cover" />
                {discount > 0 && <span className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full font-bold">{discount}% OFF</span>}
                {stockLevel === 'low' && <span className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full font-bold text-sm">Pocas unidades</span>}
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="text-indigo-600 font-medium capitalize mb-2">{category}</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />)}</div>
                <span className="text-indigo-600 font-medium">{rating}</span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-medium">{reviews.toLocaleString()} ventas</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-indigo-600">${price.toFixed(2)}</span>
                {oldPrice > price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">${oldPrice.toFixed(2)}</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Ahorra ${(oldPrice - price).toFixed(2)}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                {stockLevel === 'low' ? <span className="text-orange-600 font-medium">Ultimas unidades!</span> : <span className="text-green-600 font-medium">En stock</span>}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center border-2 border-indigo-600 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100"><Minus className="w-5 h-5" /></button>
                  <span className="px-6 font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100"><Plus className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Variants Selection */}
              {variants.length > 0 && (
                <div className="mt-4 space-y-4">
                  {Object.entries(variants.reduce((acc, v) => {
                    if (!acc[v.type]) acc[v.type] = [];
                    acc[v.type].push(v);
                    return acc;
                  }, {})).map(([type, typeVariants]) => (
                    <div key={type}>
                      <span className="font-medium capitalize text-gray-700 dark:text-gray-300 mb-2 block">
                        {type === 'color' ? 'Color' : type === 'size' ? 'Tamaño' : type === 'storage' ? 'Almacenamiento' : type}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {typeVariants.map(variant => (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(type, variant)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                              selectedVariants[type]?.id === variant.id
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {type === 'color' && (
                              <span 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: variant.name.toLowerCase() }}
                              />
                            )}
                            <span className="text-sm font-medium">{variant.name}</span>
                            {variant.price_modifier > 0 && (
                              <span className="text-xs text-green-600">+${variant.price_modifier}</span>
                            )}
                            {selectedVariants[type]?.id === variant.id && (
                              <Check className="w-4 h-4 text-indigo-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <button onClick={() => addToCart({ ...product, quantity, selectedVariants, finalPrice: calculatePrice() })} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Agregar al Carrito
                </button>
                <button onClick={() => toggleWishlist(product)} className={`p-3 rounded-xl border-2 transition-all ${inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 hover:border-red-500'}`}>
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-medium text-gray-700 mb-3">Metodos de pago:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white px-3 py-2 rounded-lg text-sm font-bold border">Visa</span>
                  <span className="bg-white px-3 py-2 rounded-lg text-sm font-bold border">Mastercard</span>
                  <span className="bg-orange-100 px-3 py-2 rounded-lg text-sm font-bold text-orange-700">PayPhone</span>
                  <span className="bg-white px-3 py-2 rounded-lg text-sm font-bold border">Transferencia</span>
                  <span className="bg-green-100 px-3 py-2 rounded-lg text-sm font-bold text-green-700">Contra Entrega</span>
                </div>
              </div>

              {/* Trust Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600"><Truck className="w-5 h-5 text-indigo-600" /><span className="text-sm">Envio gratis a todo Ecuador (pedidos +$50)</span></div>
                <div className="flex items-center gap-2 text-gray-600"><Shield className="w-5 h-5 text-indigo-600" /><span className="text-sm">Garantia de satisfaccion</span></div>
                <div className="flex items-center gap-2 text-gray-600"><RotateCcw className="w-5 h-5 text-indigo-600" /><span className="text-sm">30 dias para devoluciones</span></div>
              </div>

              {/* Tabs */}
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-4 border-b mb-4">
                  {['description', 'features', 'shipping', 'reviews'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 px-1 font-medium ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
                      {tab === 'description' ? 'Descripcion' : tab === 'features' ? 'Caracteristicas' : tab === 'shipping' ? 'Envio' : 'Reseñas'}
                    </button>
                  ))}
                </div>
                {activeTab === 'description' && <p className="text-gray-600">{description}</p>}
                {activeTab === 'features' && <ul className="grid sm:grid-cols-2 gap-2">{features?.map((f, i) => <li key={i} className="flex items-center gap-2 text-gray-600"><span className="w-2 h-2 bg-indigo-600 rounded-full" />{f}</li>)}</ul>}
                {activeTab === 'shipping' && <div className="text-gray-600"><p>Procesamiento: 1-2 dias habiles</p><p>Entrega: 3-7 dias habiles</p></div>}
                {activeTab === 'reviews' && <ProductReviews productId={product?.id} productName={name} />}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Otros productos</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <div key={p.id} onClick={() => onNavigate('product', p)} className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg">
                  <img src={p.image || 'https://via.placeholder.com/400'} alt={p.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-800 line-clamp-2 mb-2">{p.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-600">${(p.price || 0).toFixed(2)}</span>
                      <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><span className="text-sm text-gray-500">{p.rating || 0}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
