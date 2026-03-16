import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser } from '../lib/supabase';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';

export default function AuthPanel({ onNavigate, onClose, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '', nombre: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('Error checking user');
    }
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSending(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        showToast('Sesión iniciada correctamente', 'success');
      } else {
        await signUp(formData.email, formData.password);
        showToast('Cuenta creada. Revisa tu email para confirmar.', 'success');
      }
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  async function handleLogout() {
    await signOut();
    setUser(null);
    showToast('Sesión cerrada', 'success');
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  // User is logged in
  if (user) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium">{user.email}</p>
            <p className="text-xs text-gray-500">Cuenta verificada</p>
          </div>
        </div>

        <div className="space-y-2">
          <button onClick={() => { if (onClose) onClose(); if (onNavigate) onNavigate('account'); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
            <Package className="w-5 h-5 text-gray-500" />
            <span>Mis Pedidos</span>
          </button>
          <button onClick={() => { if (onClose) onClose(); if (onNavigate) onNavigate('wishlist'); }} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
            <Heart className="w-5 h-5 text-gray-500" />
            <span>Mis Favoritos</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    );
  }

  // Login/Register form
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Tu nombre" />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="tu@email.com" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" required minLength={6} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={sending} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
          {sending ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline text-sm">
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}
