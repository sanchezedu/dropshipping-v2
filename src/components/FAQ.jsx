import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ({ onNavigate }) {
  const faqs = [
    { q: '¿Cómo hago un pedido?', a: '1. Busca el producto que deseas. 2. Haz clic en "Agregar al Carrito". 3. Ve al carrito y haz clic en "Finalizar Compra". 4. Completa tus datos y método de pago.' },
    { q: '¿Cuánto tiempo tarda el envío?', a: 'El tiempo de entrega es de 3-7 días hábiles dependiendo de tu ubicación. Los pedidos se procesan en 1-2 días hábiles.' },
    { q: '¿Cuál es el costo de envío?', a: 'El envío es gratis en pedidos mayores a $50. Para pedidos menores, el costo varía entre $3.99 y $5.99 según tu ciudad.' },
    { q: '¿Puedo devolver un producto?', a: 'Sí, tienes 30 días para devolver cualquier producto en su estado original con empaque. Contáctanos para iniciar el proceso.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos: Tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPhone, Transferencia bancaria y Pago contra entrega.' },
    { q: '¿Hacen envíos a todo Ecuador?', a: 'Sí, hacemos envíos a todo el territorio ecuatoriano incluyendo islas Galápagos.' },
    { q: '¿Cómo puedo rastrear mi pedido?', a: 'Una vez enviado tu pedido, recibirás un número de seguimiento por email. También puedes contactarnos para conocer el estado.' },
    { q: '¿Los productos tienen garantía?', a: 'Sí, todos nuestros productos cuentan con garantía del fabricante. La garantía varía por producto (consulta las especificaciones).' },
    { q: '¿Puedo comprar por WhatsApp?', a: 'Sí! Puedes escribirnos al +593 99 123 4567 para hacer tu pedido directamente.' },
    { q: '¿Cómo contacto al servicio al cliente?', a: 'Puedes contactarnos por: Email: info@dropshop.ec, WhatsApp: +593 99 123 4567, o através del formulario de contacto.' }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4">Preguntas Frecuentes</h1>
        <p className="text-center text-gray-600 mb-12">Encuentra respuestas a las dudas más comunes</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50">
                <span className="font-medium text-gray-800">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-gray-600">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">¿No encontraste lo que buscabas?</p>
          <button onClick={() => onNavigate('contact')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700">
            Contáctanos
          </button>
        </div>
      </div>
    </div>
  );
}
