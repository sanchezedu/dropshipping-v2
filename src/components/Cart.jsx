import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Home, Store, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Cart({ onClose, onNavigate }) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const total = cartTotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => onNavigate('home')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Tu Carrito</h1>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">{cart.length}</span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tu carrito esta vacio</h2>
            <p className="text-gray-500 mb-6">Agrega productos para continuar con tu compra</p>
            <button onClick={() => onNavigate('shop')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700">
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 line-clamp-2 mb-1">{item.name}</h4>
                    <p className="text-indigo-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                        <span className="px-4 font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Continue Shopping */}
              <button onClick={() => onNavigate('shop')} className="flex items-center gap-2 text-indigo-600 font-medium hover:underline">
                <ArrowLeft className="w-4 h-4" /> Continuar Comprando
              </button>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
              <div className="space-y-3 border-b pb-4 mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Envio</span><span className="text-green-600">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span></div>
                {shipping > 0 && <p className="text-xs text-green-600">Agrega ${(50 - cartTotal).toFixed(2)} para envio gratis</p>}
              </div>
              <div className="flex justify-between text-xl font-bold mb-6"><span>Total</span><span className="text-indigo-600">${total.toFixed(2)}</span></div>
              <button onClick={() => onNavigate('checkout')} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                Finalizar Compra <ArrowRight className="w-5 h-5" />
              </button>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500"><Home className="w-4 h-4" /> Inicio</div>
                <div className="flex items-center gap-2 text-sm text-gray-500"><Store className="w-4 h-4" /> Tienda</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
