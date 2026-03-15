import { useState } from 'react';
import { ChevronDown, Shield, User, Cookie, Mail, Lock, Eye } from 'lucide-react';

function AccordionItem({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-bold text-lg">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-gray-50 text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Privacy({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Política de Privacidad</h1>
          <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <p className="text-green-800">
            <strong>Tu privacidad es importante:</strong> En DropShop Ecuador nos comprometemos a proteger tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos tu información.
          </p>
        </div>

        <AccordionItem title="Información que Recopilamos" icon={User} defaultOpen>
          <div className="space-y-3 pt-2">
            <p>Recopilamos la siguiente información:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nombre completo</li>
              <li>Dirección de correo electrónico</li>
              <li>Número de teléfono</li>
              <li>Dirección de envío</li>
              <li>Información de pago (procesada de forma segura)</li>
              <li>Historial de compras</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Cómo Usamos tu Información" icon={Eye}>
          <div className="space-y-3 pt-2">
            <p>Utilizamos tu información para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Procesar tus pedidos</li>
              <li>Comunicarnos contigo sobre tu compra</li>
              <li>Enviar actualizaciones sobre tu pedido</li>
              <li>Mejorar nuestros servicios</li>
              <li>Enviar ofertas promocionales (si aceptaste)</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Protección de Datos" icon={Lock}>
          <div className="space-y-3 pt-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Tu información personal está protegida mediante medidas de seguridad</li>
              <li>Utilizamos encriptación SSL para proteger tus datos</li>
              <li>Acceso limitado solo a personal autorizado</li>
              <li>Monitoreamos nuestro sistema para detectar vulnerabilidades</li>
              <li>No almacenamos datos de tarjetas de crédito</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Cookies" icon={Cookie}>
          <div className="space-y-3 pt-2">
            <p>Nuestro sitio utiliza cookies para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mejorar tu experiencia de navegación</li>
              <li>Recordar tus preferencias</li>
              <li>Analizar el tráfico del sitio</li>
              <li>Personalizar contenido y anuncios</li>
            </ul>
            <p className="pt-2">Puedes desactivar las cookies en tu navegador, pero algunas funciones del sitio pueden no funcionar correctamente.</p>
          </div>
        </AccordionItem>

        <AccordionItem title="Compartir Información" icon={User}>
          <div className="space-y-3 pt-2">
            <p>No vendemos ni alquilamos tu información personal. Compartimos información solo con:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Proveedores de pago (para procesar transacciones)</li>
              <li>Servicios de envío (para entregar pedidos)</li>
              <li>Cuando sea requerido por ley</li>
              <li>Con tu consentimiento explícito</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Tus Derechos" icon={Shield}>
          <div className="space-y-3 pt-2">
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Acceder a tu información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar eliminación de tus datos</li>
              <li>Opt-out de comunicaciones promocionales</li>
              <li>Exportar tus datos en formato legible</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Contacto" icon={Mail}>
          <div className="space-y-3 pt-2">
            <p>Si tienes preguntas sobre esta política:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email: info@dropshop.ec</li>
              <li>WhatsApp: +593 99 123 4567</li>
            </ul>
          </div>
        </AccordionItem>

        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center">
          <p className="text-sm text-gray-500">
            © 2026 DropShop Ecuador. Todos los derechos reservados.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={() => onNavigate('terms')} className="text-green-600 hover:underline text-sm">Términos y Condiciones</button>
            <button onClick={() => onNavigate('shipping')} className="text-green-600 hover:underline text-sm">Política de Envíos</button>
            <button onClick={() => onNavigate('returns')} className="text-green-600 hover:underline text-sm">Devoluciones</button>
          </div>
        </div>
      </div>
    </div>
  );
}
