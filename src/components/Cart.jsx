import { useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Home, Store, ArrowLeft, Tag, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Cart({ onClose, onNavigate }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  
  // Coupon system
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const coupons = {
    'BIENVENIDO10': { discount: 10, type: 'percent', description: '10% de descuento' },
    'BIENVENIDO20': { discount: 20, type: 'percent', description: '20% de descuento' },
    'DROP15': { discount: 15, type: 'percent', description: '15% de descuento' },
    'VIP25': { discount: 25, type: 'percent', description: '25% de descuento' },
    'NOEL10': { discount: 10, type: 'fixed', description: '$10 de descuento' },
  };

  const applyCoupon = () => {
    const code = couponCode.toUpperCase().trim();
    if (coupons[code]) {
      setAppliedCoupon({ code, ...coupons[code] });
      setCouponError('');
      setCouponSuccess(`¡Cupón aplicado! ${coupons[code].description}`);
    } else {
      setCouponError('Cupón inválido');
      setAppliedCoupon(null);
      setCouponSuccess('');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    setCouponSuccess('');
  };

  // Calculate totals
  const shipping = cartTotal > 50 ? 0 : 5.99;
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = cartTotal * (appliedCoupon.discount / 100);
    } else {
      discount = appliedCoupon.discount;
    }
  }
  const subtotalAfterDiscount = cartTotal - discount;
  const total = subtotalAfterDiscount + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 pb-32 md:pb-8">
      <div className="max-w-4xl mx-auto px-3 md:px-4">
        {/* Header */}
        <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
          <button onClick={() => onNavigate('home')} className="p-2 hover:bg-gray-100 rounded-lg touch-manipulation">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-3xl font-bold">Tu Carrito</h1>
          <span className="bg-indigo-100 text-indigo-600 px-2 md:px-3 py-0.5 rounded-full text-xs md:text-sm">{cart.length}</span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold mb-2">Tu carrito esta vacio</h2>
            <p className="text-gray-500 mb-6">Agrega productos para continuar</p>
            <button onClick={() => onNavigate('shop')} className="bg-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-indigo-700 w-full md:w-auto touch-manipulation">
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-3 md:space-y-4 order-2 md:order-1">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl shadow-sm">
                  <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2 mb-1">{item.name}</h4>
                    <p className="text-indigo-600 font-bold text-base md:text-lg">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-2 md:mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 md:p-2 hover:bg-gray-100 touch-manipulation"><Minus className="w-3 h-3 md:w-4 md:h-4" /></button>
                        <span className="px-2 md:px-4 font-medium text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 md:p-2 hover:bg-gray-100 touch-manipulation"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 md:p-2 text-red-500 hover:bg-red-50 rounded-lg touch-manipulation"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Continue Shopping */}
              <button onClick={() => onNavigate('shop')} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline text-sm md:text-base py-2">
                <ArrowLeft className="w-4 h-4" /> Continuar Comprando
              </button>
            </div>

            {/* Summary - Fixed bottom on mobile */}
            <div className="md:col-span-1 order-1 md:order-2">
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 md:sticky md:top-24 fixed bottom-16 md:bottom-auto left-0 right-0 md:relative z-30">
                <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Resumen del Pedido</h2>
                
                {/* Coupon Input */}
                <div className="mb-3 md:mb-4">
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">¿Tienes un cupón?</label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Código"
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <button onClick={applyCoupon} className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 touch-manipulation">
                        Aplicar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2">
                      <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="flex-1 text-xs md:text-sm text-green-700">{appliedCoupon.code}</span>
                      <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 touch-manipulation p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  {couponSuccess && <p className="text-green-600 text-xs mt-1">{couponSuccess}</p>}
                </div>

                <div className="space-y-2 md:space-y-3 border-b pb-3 md:pb-4 mb-3 md:mb-4">
                  <div className="flex justify-between text-sm md:text-base"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm md:text-base"><span>Descuento</span><span>-${discount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-sm md:text-base"><span>Envio</span><span className="text-green-600">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span></div>
                  {shipping > 0 && <p className="text-xs text-green-600">Agrega ${(50 - cartTotal).toFixed(2)} para envio gratis</p>}
                </div>
                <div className="flex justify-between text-lg md:text-xl font-bold mb-4 md:mb-6"><span>Total</span><span className="text-indigo-600">${total.toFixed(2)}</span></div>
                <button onClick={() => onNavigate('checkout')} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg md:rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation">
                  Finalizar Compra <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <div className="mt-3 md:mt-4 space-y-1 md:space-y-2 hidden md:block">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500"><Home className="w-4 h-4" /> Inicio</div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500"><Store className="w-4 h-4" /> Tienda</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
