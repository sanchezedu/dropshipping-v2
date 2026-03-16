import { useState, useEffect } from 'react';
import { Cookie, X, Shield, FileText } from 'lucide-react';

export default function CookiePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('dropshop-cookies-accepted');
    const rejected = localStorage.getItem('dropshop-cookies-rejected');
    if (!accepted && !rejected) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('dropshop-cookies-accepted', 'true');
    localStorage.removeItem('dropshop-cookies-rejected');
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem('dropshop-cookies-rejected', 'true');
    localStorage.removeItem('dropshop-cookies-accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-4 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm text-gray-100">
              🍪 Utilizamos cookies para mejorar tu experiencia. 
              Al continuar navegando, aceptas nuestra 
              <a href="#privacy" className="underline hover:text-yellow-400 ml-1">Política de Privacidad</a> y 
              <a href="#cookies" className="underline hover:text-yellow-400 ml-1">Política de Cookies</a>.
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button 
            onClick={accept}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Aceptar
          </button>
          <button 
            onClick={reject}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
