import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, X, Check, Search, Upload, Image, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ProductManager({ onNavigate, showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    image: '',
    category: 'electronica',
    description: '',
    features: '',
    rating: '4.5',
    reviews: '0',
    stock: true,
    tags: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('id');
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      showToast('Error cargando productos', 'error');
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        old_price: parseFloat(formData.oldPrice) || parseFloat(formData.price) * 1.5,
        image: formData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        category: formData.category,
        description: formData.description,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        stock: formData.stock,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
        showToast('Producto actualizado', 'success');
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
        showToast('Producto creado', 'success');
      }

      setEditingProduct(null);
      setIsAddingNew(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Error guardando producto', 'error');
    }
    setSaving(false);
  }

  async function handleDelete(product) {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id);
      if (error) throw error;
      showToast('Producto eliminado', 'success');
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Error eliminando producto', 'error');
    }
  }

  function startEdit(product) {
    setFormData({
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
    setIsAddingNew(true);
  }

  function startAdd() {
    resetForm();
    setEditingProduct(null);
    setIsAddingNew(true);
  }

  function resetForm() {
    setFormData({
      name: '',
      price: '',
      oldPrice: '',
      image: '',
      category: 'electronica',
      description: '',
      features: '',
      rating: '4.5',
      reviews: '0',
      stock: true,
      tags: ''
    });
  }

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['electronica', 'accesorios', 'fitness', 'hogar'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate('admin')} className="text-gray-500 hover:text-indigo-600">
              ← Volver
            </button>
            <h1 className="text-2xl font-bold">Gestionar Productos</h1>
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
              {products.length} productos
            </span>
          </div>
          <button onClick={startAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700">
            <Plus className="w-5 h-5" /> Agregar Producto
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAddingNew && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={() => { setIsAddingNew(false); setEditingProduct(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio Anterior</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">URL Imagen</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://..."
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Características (separadas por coma)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Caracteristica 1, Caracteristica 2, ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ventas</label>
                <input
                  type="number"
                  value={formData.reviews}
                  onChange={(e) => setFormData({...formData, reviews: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (separados por coma)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="bestseller, nuevo, descuento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <select
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value === 'true'})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="true">Disponible</option>
                  <option value="false">Agotado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !formData.name || !formData.price}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => { setIsAddingNew(false); setEditingProduct(null); }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
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
                  <button onClick={() => startEdit(product)} className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm hover:bg-blue-100">
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <button onClick={() => handleDelete(product)} className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm hover:bg-red-100">
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
