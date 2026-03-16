import { useState, useEffect } from 'react';
import { Cookie, Shield, X, Settings } from 'lucide-react';

export default function CookiePopup() {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
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
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
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
      
      {/* Main Cookie Banner - Mobile optimized */}
      <div className="fixed inset-0 bg-black/60 z-40 md:hidden" style={{ animation: 'fadeIn 0.3s' }} />
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-50 md:rounded-2xl md:bottom-4 md:left-4 md:right-4 md:max-w-md md:mx-auto" style={{ animation: 'slideUp 0.4s ease-out' }}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">🍪 Cookies</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Usamos cookies para mejorar tu experiencia.</p>
            </div>
            <button onClick={() => setShow(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={acceptAll} className="w-full px-3 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> Aceptar Todo
            </button>
            <div className="flex gap-2">
              <button onClick={() => setShowSettings(true)} className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                Personalizar
              </button>
              <button onClick={rejectAll} className="flex-1 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal - Mobile slide from bottom */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 z-60 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">⚙️ Preferencias</h3>
                <button onClick={() => setShowSettings(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Necesarias</p>
                    <p className="text-xs text-gray-500">Sempre activas</p>
                  </div>
                  <div className="w-9 h-5 bg-green-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Analíticas</p>
                    <p className="text-xs text-gray-500">Google Analytics</p>
                  </div>
                  <button onClick={() => setPreferences(p => ({...p, analytics: !p.analytics}))} className={`w-9 h-5 rounded-full transition-colors ${preferences.analytics ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${preferences.analytics ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Marketing</p>
                    <p className="text-xs text-gray-500">Anuncios personalizados</p>
                  </div>
                  <button onClick={() => setPreferences(p => ({...p, marketing: !p.marketing}))} className={`w-9 h-5 rounded-full transition-colors ${preferences.marketing ? 'bg-purple-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${preferences.marketing ? 'translate-x-4' : 'translate-x-0.5'} mt-0.5`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={() => setShowSettings(false)} className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium">
                  Cancelar
                </button>
                <button onClick={() => savePreferences(preferences)} className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium">
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
