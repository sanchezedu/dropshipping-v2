import { useState, useEffect } from 'react';
import { Cookie, Shield, X, Settings, Check } from 'lucide-react';

export default function CookiePopup() {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('dropshop-cookie-consent');
    if (!consent) {
      // Show popup after a short delay for better UX
      setTimeout(() => setShow(true), 1000);
    } else {
      // Apply saved preferences
      const saved = JSON.parse(consent);
      if (saved.analytics) {
        enableAnalytics();
      }
    }
  }, []);

  const enableAnalytics = () => {
    // Google Analytics - enable tracking if consent given
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  };

  const savePreferences = ( prefs ) => {
    const consentData = {
      necessary: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('dropshop-cookie-consent', JSON.stringify(consentData));
    
    if (prefs.analytics) {
      enableAnalytics();
    }
    
    setShow(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('dropshop-cookie-consent', JSON.stringify(allConsent));
    enableAnalytics();
    setShow(false);
  };

  const rejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('dropshop-cookie-consent', JSON.stringify(minimalConsent));
    setShow(false);
  };

  const handleAccept = () => {
    savePreferences({ necessary: true, analytics: true, marketing: true });
  };

  if (!show) return null;

  const animationStyle = {
    animation: 'slideUp 0.5s ease-out'
  };

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      {/* Main Cookie Banner */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-50 animate-slide-up">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                🍪 Política de Cookies
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra tienda. 
                Algunas cookies son necesarias para el funcionamiento del sitio, mientras que otras son opcionales.
              </p>
            </div>
            <button 
              onClick={() => setShow(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-auto"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cookie Types Explanation */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-400">Necesarias</span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300">
                Essential for the site to work. Cannot be disabled.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800 dark:text-blue-400">Analíticas</span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Nos ayudan a entender cómo usas la tienda (Google Analytics).
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800 dark:text-purple-400">Marketing</span>
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Used for personalized ads and promotions.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            <button 
              onClick={() => setShowSettings(true)}
              className="px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Personalizar
            </button>
            <button 
              onClick={rejectAll}
              className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Rechazar Todo
            </button>
            <button 
              onClick={acceptAll}
              className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-600/25 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Aceptar Todo
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Preferencias de Cookies
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Cookies Necesarias</p>
                  <p className="text-xs text-gray-500">Requeridas para el funcionamiento</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Cookies Analíticas</p>
                  <p className="text-xs text-gray-500">Google Analytics</p>
                </div>
                <button 
                  onClick={() => setPreferences(p => ({...p, analytics: !p.analytics}))}
                  className={`w-12 h-6 rounded-full transition-colors ${preferences.analytics ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${preferences.analytics ? 'translate-x-7' : 'translate-x-1'} mt-1`} />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Cookies de Marketing</p>
                  <p className="text-xs text-gray-500">Personalización de anuncios</p>
                </div>
                <button 
                  onClick={() => setPreferences(p => ({...p, marketing: !p.marketing}))}
                  className={`w-12 h-6 rounded-full transition-colors ${preferences.marketing ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${preferences.marketing ? 'translate-x-7' : 'translate-x-1'} mt-1`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancelar
              </button>
              <button 
                onClick={() => savePreferences(preferences)}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Guardar Preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
