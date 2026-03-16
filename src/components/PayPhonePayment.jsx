import { useState } from 'react';
import { CreditCard, Smartphone, Lock, CheckCircle, XCircle } from 'lucide-react';

export default function PayPhonePayment({ total, onSuccess, onError }) {
  const [paymentMethod, setPaymentMethod] = useState('payphone');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [message, setMessage] = useState('');

  // PayPhone configuration (these would come from environment variables in production)
  const PAYPHONE_CLIENT_ID = 'TU_CLIENT_ID';
  const PAYPHONE_ENV = 'production'; // production or sandbox

  const handlePayment = async () => {
    if (!phone) {
      setMessage('Por favor ingresa tu número de teléfono');
      return;
    }

    setLoading(true);
    setStatus('processing');
    setMessage('Procesando pago...');

    // Simulate PayPhone payment for demo purposes
    // In production, this would call the PayPhone API
    setTimeout(() => {
      // For demo, we'll simulate a successful payment
      // In real implementation, this would use PayPhone's SDK/API
      setStatus('success');
      setMessage('Pago procesado exitosamente!');
      setLoading(false);
      
      if (onSuccess) {
        onSuccess({
          method: 'payphone',
          phone: phone,
          amount: total,
          transactionId: 'PP-' + Date.now()
        });
      }
    }, 2000);
  };

  // Different payment methods available
  const paymentMethods = [
    {
      id: 'payphone',
      name: 'PayPhone',
      icon: Smartphone,
      description: 'Paga con tu cuenta PayPhone',
      color: 'bg-green-500'
    },
    {
      id: 'card',
      name: 'Tarjeta Débito/Crédito',
      icon: CreditCard,
      description: 'Visa, Mastercard, etc.',
      color: 'bg-blue-500'
    },
    {
      id: 'transfer',
      name: 'Transferencia',
      icon: CheckCircle,
      description: 'Transferencia bancaria',
      color: 'bg-purple-500'
    },
    {
      id: 'cod',
      name: 'Contra Entrega',
      icon: XCircle,
      description: 'Pagas cuando recibes',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <Lock className="w-5 h-5 text-green-600" />
        Método de Pago
      </h3>

      {/* Payment Methods Selection */}
      <div className="space-y-2">
        {paymentMethods.map(method => (
          <label 
            key={method.id}
            className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              paymentMethod === method.id 
                ? 'border-indigo-600 bg-indigo-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => setPaymentMethod(method.id)}
              className="sr-only"
            />
            <div className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center`}>
              <method.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{method.name}</p>
              <p className="text-sm text-gray-500">{method.description}</p>
            </div>
            {paymentMethod === method.id && (
              <CheckCircle className="w-6 h-6 text-indigo-600" />
            )}
          </label>
        ))}
      </div>

      {/* PayPhone specific inputs */}
      {paymentMethod === 'payphone' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <label className="block text-sm font-medium mb-2">
            Número de teléfono PayPhone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+593 99 123 4567"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-xs text-green-700 mt-2">
            Se te enviará una notificación de pago a tu teléfono
          </p>
        </div>
      )}

      {/* Contra Entrega info */}
      {paymentMethod === 'cod' && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-sm text-orange-800">
            <strong>Importante:</strong> El pago se realizará cuando recibas tu pedido en la dirección indicada. El repartidor llevará la máquina de tarjetas o puedes pagar en efectivo.
          </p>
        </div>
      )}

      {/* Transferencia info */}
      {paymentMethod === 'transfer' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm font-medium mb-2">Datos para transferencia:</p>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Banco:</strong> Pichincha</p>
            <p><strong>Cuenta:</strong> 1234567890</p>
            <p><strong>Tipo:</strong> Corriente</p>
            <p><strong>CI/RUC:</strong> 1234567890001</p>
          </div>
          <p className="text-xs text-purple-700 mt-2">
            Envía el comprobante al WhatsApp de la tienda
          </p>
        </div>
      )}

      {/* Status messages */}
      {status === 'success' && (
        <div className="bg-green-100 border border-green-400 rounded-xl p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-medium">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-100 border border-red-400 rounded-xl p-4 text-center">
          <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-800 font-medium">{message}</p>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={loading || status === 'success'}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
          status === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
        } disabled:opacity-50`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : status === 'success' ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Pago Exitoso
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pagar ${total.toFixed(2)}
          </>
        )}
      </button>

      {/* Security notice */}
      <p className="text-xs text-gray-500 text-center">
        Tus datos están seguros. Pago encriptado con SSL.
      </p>
    </div>
  );
}
