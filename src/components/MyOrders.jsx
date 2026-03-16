import { useState, useEffect } from 'react';
import { Package, Eye, Clock, Check, Truck, X, ChevronRight } from 'lucide-react';
import { getCurrentUser, fetchUserOrders } from '../lib/supabase';

export default function MyOrders({ onNavigate }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const userOrders = await fetchUserOrders(currentUser.id);
        setOrders(userOrders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
    setLoading(false);
  }

  const statusConfig = {
    pendiente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pendiente' },
    confirmado: { color: 'bg-blue-100 text-blue-800', icon: Check, label: 'Confirmado' },
    enviado: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Enviado' },
    entregado: { color: 'bg-green-100 text-green-800', icon: Check, label: 'Entregado' },
    cancelado: { color: 'bg-red-100 text-red-800', icon: X, label: 'Cancelado' }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Mis Pedidos</h1>
          <p className="text-gray-600 mb-6">Inicia sesión para ver tu historial de pedidos</p>
          <button onClick={() => onNavigate('home')} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => onNavigate('home')} className="text-gray-500 hover:text-indigo-600">Inicio</button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-800 font-medium">Mis Pedidos</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No tienes pedidos</h2>
            <p className="text-gray-500 mb-6">¡Empieza a comprar!</p>
            <button onClick={() => onNavigate('shop')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold">
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.pendiente;
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-EC', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon className="w-4 h-4 inline mr-1" />
                        {status.label}
                      </span>
                      <span className="font-bold text-indigo-600">${order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">{order.order_items?.length || 0} producto(s)</p>
                        <div className="flex gap-2">
                          {order.order_items?.slice(0, 3).map((item, i) => (
                            <div key={i} className="text-xs text-gray-600">
                              {item.product_name} x{item.quantity}
                            </div>
                          ))}
                          {(order.order_items?.length || 0) > 3 && (
                            <span className="text-xs text-gray-500">+{order.order_items.length - 3} más</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Pedido #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleDateString('es-EC')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[selectedOrder.status]?.color || statusConfig.pendiente.color}`}>
                    {statusConfig[selectedOrder.status]?.label || 'Pendiente'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Envío a</p>
                <p className="font-medium">{selectedOrder.nombre} {selectedOrder.apellido}</p>
                <p className="text-sm">{selectedOrder.direccion}</p>
                <p className="text-sm">{selectedOrder.ciudad}, {selectedOrder.provincia}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Productos</p>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item, i) => (
                    <div key={i} className="flex justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{item.product_name} x{item.quantity}</span>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span>${selectedOrder.envio?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
