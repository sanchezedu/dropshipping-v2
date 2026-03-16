import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookiePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('dropshop-cookies-accepted');
    if (!accepted) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('dropshop-cookies-accepted', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cookie className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Usamos cookies para mejorar tu experiencia. Al continuar, aceptas nuestro uso de cookies.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={accept}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
          >
            Aceptar
          </button>
          <button 
            onClick={() => setShow(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
