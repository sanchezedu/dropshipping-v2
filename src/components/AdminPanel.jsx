import { useState, useEffect } from 'react';
import { fetchAllOrders, fetchStats, updateOrderStatus } from '../lib/supabase';
import { Package, DollarSign, ShoppingCart, Clock, Eye, Lock, X, LogOut } from 'lucide-react';

// Password simple para el admin
const ADMIN_PASSWORD = 'DropShop2024!';

export default function AdminPanel({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      loadData();
    } else {
      setError('Contraseña incorrecta');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    if (onNavigate) onNavigate('home');
  }

  async function loadData() {
    setLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([fetchAllOrders(), fetchStats()]);
      setOrders(ordersData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  }

  async function handleStatusChange(orderId, newStatus) {
    await updateOrderStatus(orderId, newStatus);
    loadData();
  }

  const statusColors = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold">Panel de Admin</h1>
            <p className="text-gray-500">Ingresa la contraseña para continuar</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
              Ingresar
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button onClick={() => onNavigate('home')} className="text-indigo-600 hover:underline text-sm">
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administracion - DropShop</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600">
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Admin Menu */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4">
          <button onClick={() => {}} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium">
            Pedidos
          </button>
          <button onClick={() => onNavigate('products')} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
            Productos
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ventas Totales</p>
                <p className="text-2xl font-bold">${stats.totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pedidos</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Productos</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Pedidos Recientes</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Cargando...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay pedidos ainda</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{order.nombre} {order.apellido}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">${order.total?.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || statusColors.pendiente}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-EC')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                          <Eye className="w-5 h-5" />
                        </button>
                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="text-sm border rounded px-2 py-1">
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Pedido #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-500 text-sm">Cliente</h3>
                  <p>{selectedOrder.nombre} {selectedOrder.apellido}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500 text-sm">Email</h3>
                  <p>{selectedOrder.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500 text-sm">Telefono</h3>
                  <p>{selectedOrder.telefono}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500 text-sm">Ciudad</h3>
                  <p>{selectedOrder.ciudad}, {selectedOrder.provincia}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-500 text-sm mb-2">Direccion</h3>
                <p>{selectedOrder.direccion}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-500 text-sm mb-2">Productos</h3>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item, i) => (
                    <div key={i} className="flex justify-between bg-gray-50 p-2 rounded">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between"><span>Subtotal:</span><span>${selectedOrder.subtotal?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Envio:</span><span>${selectedOrder.envio?.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span><span>${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
