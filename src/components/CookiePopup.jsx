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
    // Always show for now to debug - can be reverted later
    const timer = setTimeout(() => setShow(true), 1500);
    
    // Listen for custom event to show settings
    const handleShowSettings = () => {
      setShow(true);
      setShowSettings(true);
    };
    window.addEventListener('showCookieSettings', handleShowSettings);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('showCookieSettings', handleShowSettings);
    };
  }, []);

  const enableAnalytics = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  };

  const savePreferences = (prefs) => {
    const consentData = {
      necessary: true,
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('dropshop-cookie-consent', JSON.stringify(consentData));
    if (prefs.analytics) enableAnalytics();
    setShow(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    localStorage.setItem('dropshop-cookie-consent', JSON.stringify({
      necessary: true, analytics: true, marketing: true, timestamp: new Date().toISOString()
    }));
    enableAnalytics();
    setShow(false);
  };

  const rejectAll = () => {
    localStorage.setItem('dropshop-cookie-consent', JSON.stringify({
      necessary: true, analytics: false, marketing: false, timestamp: new Date().toISOString()
    }));
    setShow(false);
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      
      {/* Main Cookie Banner - Mobile Optimized */}
      <div className="fixed inset-0 bg-black/60 z-40" style={{ animation: 'fadeIn 0.3s' }} />
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-50" style={{ animation: 'slideUp 0.4s ease-out' }}>
        <div className="p-4 sm:p-5">
          {/* Header - Compact */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                🍪 Cookies
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                Usamos cookies para mejorar tu experiencia. 
                <span className="hidden sm:inline"> Algunas son necesarias, otras opcionales.</span>
              </p>
            </div>
            <button onClick={() => setShow(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Cookie Types - Horizontal scroll on mobile */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex-shrink-0 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg px-2.5 py-1.5">
              <span className="text-xs font-medium text-green-700 dark:text-green-400">✓ Necesarias</span>
            </div>
            <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg px-2.5 py-1.5">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">📊 Analíticas</span>
            </div>
            <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg px-2.5 py-1.5">
              <span className="text-xs font-medium text-purple-700 dark:text-purple-400">📣 Marketing</span>
            </div>
          </div>

          {/* Buttons - Full width stacked on mobile */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="order-3 sm:order-1 flex-1 sm:flex-none px-3 py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Personalizar</span>
            </button>
            <button 
              onClick={rejectAll}
              className="order-2 flex-1 px-3 py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Rechazar
            </button>
            <button 
              onClick={acceptAll}
              className="order-1 sm:order-3 flex-1 px-3 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Aceptar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal - Mobile Friendly */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm max-h-[85vh] overflow-y-auto">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  ⚙️ Preferencias
                </h3>
                <button onClick={() => setShowSettings(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2">
                {/* Necessary */}
                <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Necesarias</p>
                    <p className="text-xs text-gray-500">Sempre activas</p>
                  </div>
                  <div className="w-9 h-5 bg-green-500 rounded-full relative flex-shrink-0">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Analíticas</p>
                    <p className="text-xs text-gray-500">Google Analytics</p>
                  </div>
                  <button 
                    onClick={() => setPreferences(p => ({...p, analytics: !p.analytics}))}
                    className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 ${preferences.analytics ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${preferences.analytics ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5`} />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Marketing</p>
                    <p className="text-xs text-gray-500">Anuncios personalizados</p>
                  </div>
                  <button 
                    onClick={() => setPreferences(p => ({...p, marketing: !p.marketing}))}
                    className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 ${preferences.marketing ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${preferences.marketing ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => savePreferences(preferences)}
                  className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
