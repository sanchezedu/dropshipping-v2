import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';

const WHATSAPP_NUMBER = '593991234567'; // Tu número de WhatsApp
const WHATSAPP_MESSAGE = 'Hola! Tengo una consulta sobre';

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Hide tooltip after first interaction
  useState(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button - Only show on desktop */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border p-4 mb-2">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">DropShop Ecuador</p>
                <p className="text-xs text-green-600">En línea</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              ¡Hola! 👋 ¿En qué podemos ayudarte hoy?
            </p>
            <button onClick={handleWhatsAppClick} className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
              <Send className="w-4 h-4" />
              Escribir mensaje
            </button>
          </div>
        )}

        <button
          onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
          className="w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white" />
          )}
        </button>

        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg mb-2">
            ¿Necesitas ayuda?
            <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-gray-800 transform rotate-45"></div>
          </div>
        )}
      </div>
    </>
  );
}
