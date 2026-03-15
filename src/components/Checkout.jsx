import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CreditCard, Lock, Check, Truck, Shield } from 'lucide-react';

export default function Checkout({ onNavigate }) {
  const { cart, cartTotal } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    codigoPostal: '',
    pais: 'Ecuador',
    metodoPago: 'transferencia'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const shipping = cartTotal > 50 ? 0 : 5.99;
  const total = cartTotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderNum = 'DS-' + Date.now().toString().slice(-8);
    setOrderNumber(orderNum);
    setOrderPlaced(true);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Añade productos para continuar con la compra</p>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
            <p className="text-gray-600 mb-2">Gracias por tu compra</p>
            <p className="text-2xl font-bold text-indigo-600 mb-6">
              Número de Pedido: {orderNumber}
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Te hemos enviado un email de confirmación a {formData.email}
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-bold mb-4">Resumen del Pedido</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span>Envío</span>
                <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-1 ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
              {step === 1 && (
                <>
                  <h2 className="text-xl font-bold mb-6">Información Personal</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Nombre *</label>
                      <input
                        type="text"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Apellido *</label>
                      <input
                        type="text"
                        required
                        value={formData.apellido}
                        onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
                  >
                    Continuar
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-bold mb-6">Dirección de Envío</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Dirección *</label>
                      <input
                        type="text"
                        required
                        value={formData.direccion}
                        onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Calle, número, referencia"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Ciudad *</label>
                        <input
                          type="text"
                          required
                          value={formData.ciudad}
                          onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Provincia *</label>
                        <input
                          type="text"
                          required
                          value={formData.provincia}
                          onChange={(e) => setFormData({...formData, provincia: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Código Postal</label>
                        <input
                          type="text"
                          value={formData.codigoPostal}
                          onChange={(e) => setFormData({...formData, codigoPostal: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">País *</label>
                        <select
                          value={formData.pais}
                          onChange={(e) => setFormData({...formData, pais: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="Ecuador">Ecuador</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold"
                    >
                      Continuar
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="text-xl font-bold mb-6">Método de Pago</h2>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="pago"
                        value="transferencia"
                        checked={formData.metodoPago === 'transferencia'}
                        onChange={(e) => setFormData({...formData, metodoPago: e.target.value})}
                        className="mr-3"
                      />
                      <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
                      <div>
                        <p className="font-bold">Transferencia Bancaria</p>
                        <p className="text-sm text-gray-500">Te enviaremos los datos por email</p>
                      </div>
                    </label>
                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="pago"
                        value="paypal"
                        checked={formData.metodoPago === 'paypal'}
                        onChange={(e) => setFormData({...formData, metodoPago: e.target.value})}
                        className="mr-3"
                      />
                      <span className="font-bold mr-3">PayPal</span>
                      <div>
                        <p className="text-sm text-gray-500">Paga con tu cuenta PayPal</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-700">Pago 100% Seguro</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Tus datos están encriptados y seguros
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                    >
                      Realizar Pedido
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="font-bold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-green-600">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-green-600">
                    Añade ${(50 - cartTotal).toFixed(2)} más para envío gratis
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-indigo-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Envío gratis en pedidos +$50</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>30 días de garantía</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
