import { useState } from 'react';
import { User, Package, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';

export default function UserAccount({ onNavigate, onClose }) {
  const [user, setUser] = useState(null);
  const [orders] = useState([]);

  function handleLogout() {
    setUser(null);
    if (onClose) onClose();
    if (onNavigate) onNavigate('home');
  }

  // Show login prompt
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Mi Cuenta</h1>
          <p className="text-gray-500 mb-6">Inicia sesión para ver tu cuenta y pedidos</p>
          
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-3">
            Iniciar Sesión
          </button>
          
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold">
            Crear Cuenta
          </button>

          <div className="mt-6 pt-6 border-t">
            <button onClick={() => onNavigate('home')} className="text-indigo-600 hover:underline">
              ← Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
