import { useState } from 'react';
import { ChevronDown, Shield, FileText, Truck, RotateCcw, Package, Lock, Copyright, Mail } from 'lucide-react';

function AccordionItem({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Icon className="w-5 h-5 text-indigo-600" />
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

export default function Terms({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Términos y Condiciones</h1>
          <p className="text-gray-600">Última actualización: {new Date().toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-blue-800">
            <strong>Nota importante:</strong> Al acceder y utilizar DropShop Ecuador, aceptas estar vinculado por estos términos y condiciones. Si no estás de acuerdo, por favor no utilices nuestro sitio.
          </p>
        </div>

        <AccordionItem title="Uso del Sitio Web" icon={Shield} defaultOpen>
          <div className="space-y-3 pt-2">
            <p>Estás de acuerdo en:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>No utilizar el sitio para fines ilegales o no autorizados</li>
              <li>No intentar obtener acceso no autorizado a sistemas o información</li>
              <li>No realizar compras falsas o fraudulentas</li>
              <li>Proporcionar información veraz y actualizada</li>
              <li>No violar ninguna ley o regulación aplicable</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Cuentas de Usuario" icon={Lock}>
          <div className="space-y-3 pt-2">
            <p>Al crear una cuenta:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña</li>
              <li>Aceptas responsabilidad por todas las actividades bajo tu cuenta</li>
              <li>Debes notificarnos inmediatamente de cualquier uso no autorizado</li>
              <li>Debes tener al menos 18 años para realizar compras</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Pedidos y Pagos" icon={Package}>
          <div className="space-y-3 pt-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Los precios mostrados incluyen IVA</li>
              <li>Nos reservamos el derecho de rechazar cualquier pedido</li>
              <li>Los pagos se procesan de forma segura</li>
              <li>Confirmaremos tu pedido por email</li>
              <li>Aceptamos: Transferencia, PayPhone, Contra Entrega, Tarjetas</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Política de Envíos" icon={Truck}>
          <div className="space-y-3 pt-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Envíos a todo Ecuador</li>
              <li>Envío gratis en pedidos mayores a $50</li>
              <li>Tiempo de entrega: 3-7 días hábiles</li>
              <li>No entregamos en Apartados Postales</li>
              <li>El cliente debe verificar que su dirección sea correcta</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Devoluciones y Reembolsos" icon={RotateCcw}>
          <div className="space-y-3 pt-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>30 días para devoluciones</li>
              <li>El producto debe estar sin usar y en empaque original</li>
              <li>El cliente asume costos de envío para devoluciones</li>
              <li>Reembolso en 5-10 días hábiles</li>
              <li>No aplicamos devolución en productos usados o dañados</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Garantías" icon={Shield}>
          <div className="space-y-3 pt-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Todos los productos cuentan con garantía del fabricante</li>
              <li>La garantía no cubre daños causados por uso inadecuado</li>
              <li>Productos defectuosos serán reemplazados sin costo</li>
              <li>Consultar garantía específica por producto</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Limitación de Responsabilidad" icon={Copyright}>
          <div className="space-y-3 pt-2">
            <p>DropShop Ecuador no será responsable por:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Daños directos, indirectos o consecuentes</li>
              <li>Pérdida de ganancias o ingresos</li>
              <li>Daños por virus o malware</li>
              <li>Problemas técnicos fuera de nuestro control</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Propiedad Intelectual" icon={Copyright}>
          <div className="space-y-3 pt-2">
            <ul className="list-disc pl-5 space-y-1">
              <li>Todo el contenido del sitio es propiedad de DropShop Ecuador</li>
              <li>Está protegido por derechos de autor y leyes de propiedad intelectual</li>
              <li>No puedes copiar, modificar o distribuir nuestro contenido</li>
              <li>Logos y marcas son propiedad de sus respectivos dueños</li>
            </ul>
          </div>
        </AccordionItem>

        <AccordionItem title="Contacto" icon={Mail}>
          <div className="space-y-3 pt-2">
            <p>Para preguntas sobre estos términos:</p>
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
            <button onClick={() => onNavigate('privacy')} className="text-indigo-600 hover:underline text-sm">Política de Privacidad</button>
            <button onClick={() => onNavigate('shipping')} className="text-indigo-600 hover:underline text-sm">Política de Envíos</button>
            <button onClick={() => onNavigate('returns')} className="text-indigo-600 hover:underline text-sm">Devoluciones</button>
          </div>
        </div>
      </div>
    </div>
  );
}
