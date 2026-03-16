import { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, Clock, Eye, Lock, X, LogOut, Plus, Pencil, Trash2, Search, Settings, Users, TrendingUp, ShoppingBag, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { products as localProducts } from '../data/products';

const ADMIN_PASSWORD = 'DropShop2024!';

export default function AdminPanel({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Product form states
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', price: '', oldPrice: '', image: '', category: 'electronica',
    description: '', features: '', rating: '4.5', reviews: '0', stock: true, tags: ''
  });

  function handleLogin(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      loadAllData();
    } else {
      setError('Contraseña incorrecta');
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    if (onNavigate) onNavigate('home');
  }

  async function loadAllData() {
    setLoading(true);
    try {
      // Load products
      const { data: productsData } = await supabase.from('products').select('*').order('id');
      setProducts(productsData || []);
      
      // Load orders
      const { data: ordersData } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
      setOrders(ordersData || []);
      
      // Calculate stats
      const totalSales = (ordersData || []).reduce((sum, o) => sum + (o.total || 0), 0);
      const pendingOrders = (ordersData || []).filter(o => o.status === 'pendiente').length;
      setStats({
        totalSales,
        totalOrders: ordersData?.length || 0,
        totalProducts: productsData?.length || 0,
        pendingOrders
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  }

  // Replace all local products in Supabase
  async function importAllProducts() {
    if (!confirm(`¿Reemplazar todos los productos con los ${localProducts.length} productos locales? Esto borrará los productos actuales.`)) return;
    
    setLoading(true);
    try {
      // First delete all existing products
      await supabase.from('products').delete().neq('id', 0);
      
      // Then insert all local products
      const productsToInsert = localProducts.map(product => ({
        name: product.name,
        price: product.price,
        old_price: product.oldPrice || product.price * 1.5,
        image: product.image,
        category: product.category,
        description: product.description,
        features: product.features || [],
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        stock: product.stock !== false,
        tags: product.tags || []
      }));
      
      const { error } = await supabase.from('products').insert(productsToInsert);
      
      if (error) throw error;
      
      alert('¡Productos importados correctamente!');
      loadAllData();
    } catch (error) {
      console.error('Error importing products:', error);
      alert('Error al importar productos: ' + error.message);
    }
    setLoading(false);
  }

  // Product functions
  async function handleSaveProduct() {
    setLoading(true);
    try {
      const productData = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        old_price: parseFloat(productForm.oldPrice) || parseFloat(productForm.price) * 1.5,
        image: productForm.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        category: productForm.category,
        description: productForm.description,
        features: productForm.features.split(',').map(f => f.trim()).filter(f => f),
        rating: parseFloat(productForm.rating),
        reviews: parseInt(productForm.reviews),
        stock: productForm.stock,
        tags: productForm.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingProduct) {
        await supabase.from('products').update(productData).eq('id', editingProduct.id);
      } else {
        await supabase.from('products').insert([productData]);
      }
      
      setEditingProduct(null);
      setIsAddingProduct(false);
      resetProductForm();
      loadAllData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
    setLoading(false);
  }

  async function handleDeleteProduct(product) {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    try {
      await supabase.from('products').delete().eq('id', product.id);
      loadAllData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  function startEditProduct(product) {
    setProductForm({
      name: product.name || '',
      price: product.price?.toString() || '',
      oldPrice: product.old_price?.toString() || '',
      image: product.image || '',
      category: product.category || 'electronica',
      description: product.description || '',
      features: product.features?.join(', ') || '',
      rating: product.rating?.toString() || '4.5',
      reviews: product.reviews?.toString() || '0',
      stock: product.stock ?? true,
      tags: product.tags?.join(', ') || ''
    });
    setEditingProduct(product);
    setIsAddingProduct(true);
  }

  function resetProductForm() {
    setProductForm({
      name: '', price: '', oldPrice: '', image: '', category: 'electronica',
      description: '', features: '', rating: '4.5', reviews: '0', stock: true, tags: ''
    });
  }

  // Order functions
  async function handleUpdateOrderStatus(orderId, newStatus) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    loadAllData();
  }

  const statusColors = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  };

  const categories = ['electronica', 'accesorios', 'fitness', 'hogar'];

  // Login screen
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
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="Contraseña" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
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
          <h1 className="text-2xl font-bold text-gray-900">Panel de Admin - DropShop</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600">
            <LogOut className="w-5 h-5" /> <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
              { id: 'products', label: 'Productos', icon: Package },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
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

            {/* Import Products Button */}
            <div className="bg-white rounded-xl shadow p-4">
              <button onClick={importAllProducts} disabled={loading}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Importar Productos Locales ({localProducts.length})
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Agrega los 36 productos locales a la base de datos
              </p>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-bold">Pedidos Recientes</h2>
                <button onClick={() => setActiveTab('orders')} className="text-indigo-600 hover:underline text-sm">Ver todos</button>
              </div>
              <div className="divide-y">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.nombre} {order.apellido}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${order.total?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="p-4 text-gray-500 text-center">No hay pedidos</p>}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <h2 className="font-bold text-xl">Todos los Pedidos ({orders.length})</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">Cargando...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No hay pedidos</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{order.id}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm">{order.nombre} {order.apellido}</div>
                          <div className="text-xs text-gray-500">{order.email}</div>
                        </td>
                        <td className="px-4 py-3 font-bold">${order.total?.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1">
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('es-EC')}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelectedOrder(order)} className="text-indigo-600 hover:text-indigo-900">
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Add/Edit Product Form */}
            {isAddingProduct && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                  <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); resetProductForm(); }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre *</label>
                    <input type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio *</label>
                    <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio Anterior</label>
                    <input type="number" step="0.01" value={productForm.oldPrice} onChange={(e) => setProductForm({...productForm, oldPrice: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoría</label>
                    <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg">
                      {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">URL Imagen</label>
                    <input type="url" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="https://..." />
                    {productForm.image && <img src={productForm.image} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg" />}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" rows={3} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Características (separadas por coma)</label>
                    <input type="text" value={productForm.features} onChange={(e) => setProductForm({...productForm, features: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Caracteristica 1, Caracteristica 2, ..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <input type="number" step="0.1" min="0" max="5" value={productForm.rating} onChange={(e) => setProductForm({...productForm, rating: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ventas</label>
                    <input type="number" value={productForm.reviews} onChange={(e) => setProductForm({...productForm, reviews: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags (separados por coma)</label>
                    <input type="text" value={productForm.tags} onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="bestseller, nuevo, descuento" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <select value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value === 'true'})}
                      className="w-full px-4 py-2 border rounded-lg">
                      <option value="true">Disponible</option>
                      <option value="false">Agotado</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleSaveProduct} disabled={loading || !productForm.name || !productForm.price}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); resetProductForm(); }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Products Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Todos los Productos ({products.length})</h2>
              <button onClick={() => { resetProductForm(); setEditingProduct(null); setIsAddingProduct(true); }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700">
                <Plus className="w-5 h-5" /> Agregar Producto
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow overflow-hidden">
                  <div className="flex">
                    <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-24 h-24 object-cover" />
                    <div className="p-4 flex-1">
                      <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-indigo-600">${product.price?.toFixed(2)}</span>
                        {product.old_price && product.old_price > product.price && (
                          <span className="text-sm text-gray-400 line-through">${product.old_price?.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t p-3 flex gap-2">
                    <button onClick={() => startEditProduct(product)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-100">
                      <Pencil className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => handleDeleteProduct(product)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm hover:bg-red-100">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
                <div><h3 className="text-sm text-gray-500">Cliente</h3><p>{selectedOrder.nombre} {selectedOrder.apellido}</p></div>
                <div><h3 className="text-sm text-gray-500">Email</h3><p>{selectedOrder.email}</p></div>
                <div><h3 className="text-sm text-gray-500">Teléfono</h3><p>{selectedOrder.telefono}</p></div>
                <div><h3 className="text-sm text-gray-500">Ciudad</h3><p>{selectedOrder.ciudad}, {selectedOrder.provincia}</p></div>
              </div>
              <div><h3 className="text-sm text-gray-500 mb-2">Dirección</h3><p>{selectedOrder.direccion}</p></div>
              <div><h3 className="text-sm text-gray-500 mb-2">Productos</h3>
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
                <div className="flex justify-between"><span>Envío:</span><span>${selectedOrder.envio?.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold"><span>Total:</span><span>${selectedOrder.total?.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
