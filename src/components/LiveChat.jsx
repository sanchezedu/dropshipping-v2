import { useState } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! 👋 Bienvenido a DropShop Ecuador. ¿En qué puedo ayudarte?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const quickReplies = [
    '¿Tienen envío gratis?',
    '¿Cuáles son los métodos de pago?',
    '¿Cuánto tarda el envío?',
    'Quiero hacer un pedido'
  ];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { from: 'user', text: newMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Gracias por tu mensaje. Un agente te responderá pronto. También puedes escribirnos directamente a WhatsApp: +593 99 123 4567' 
      }]);
    }, 1000);
    
    setNewMessage('');
  };

  const handleQuickReply = (text) => {
    setMessages(prev => [...prev, { from: 'user', text }]);
    
    setTimeout(() => {
      let response = 'Gracias por tu mensaje. ¿Hay algo más en lo que pueda ayudarte?';
      
      if (text.includes('envío')) {
        response = '¡Sí! Envío gratis en pedidos mayores a $50. Entregamos en todo Ecuador en 3-7 días hábiles.';
      } else if (text.includes('pago')) {
        response = 'Aceptamos: Transferencia, Contra Entrega, PayPhone y todas las tarjetas de crédito/débito.';
      } else if (text.includes('tarda')) {
        response = 'El envío tarda entre 3-7 días hábiles dependiendo de tu ubicación. Envío gratis en pedidos +$50.';
      } else if (text.includes('pedido')) {
        response = '¡Perfecto! Puedes agregar los productos que quieras al carrito y proceder al checkout. ¿Necesitas ayuda con algo específico?';
      }
      
      setMessages(prev => [...prev, { from: 'bot', text: response }]);
    }, 1000);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/593991234567?text=Hola%20DropShop,%20tengo%20una%20consulta', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden md:block">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-slate-700">
          {/* Header */}
          <div className="bg-green-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-bold">DropShop Ecuador</h3>
                <p className="text-green-100 text-xs">En línea • Responde rápido</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-green-600 p-1 rounded">
                <Minimize2 className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-green-600 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-900">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.from === 'user' 
                    ? 'bg-green-500 text-white rounded-br-md' 
                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-bl-md shadow'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 border rounded-full text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* WhatsApp Button */}
            <button
              onClick={openWhatsApp}
              className="w-full mt-2 py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chatear en WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
