export default function Privacy({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Información que Recopilamos</h2>
              <p>En DropShop Ecuador recopilamos la siguiente información:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de envío</li>
                <li>Información de pago (procesada de forma segura)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Cómo Usamos tu Información</h2>
              <p>Utilizamos tu información para:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Procesar tus pedidos</li>
                <li>Comunicarnos contigo sobre tu compra</li>
                <li>Enviar actualizaciones sobre tu pedido</li>
                <li>Mejorar nuestros servicios</li>
                <li>Enviar ofertas promocionales (si aceptaste)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Protección de Datos</h2>
              <p>
                Tu información personal está protegida mediante medidas de seguridad físicas y electrónicas. 
                Utilizamos encriptación SSL para proteger tus datos durante la transmisión.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
              <p>
                Nuestro sitio utiliza cookies para mejorar tu experiencia de navegación. Las cookies 
                nos ayudan a recordar tus preferencias y analizar el tráfico del sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Compartir Información</h2>
              <p>
                No vendemos ni alquilamos tu información personal. Compartimos información solo con:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Proveedores de pago (para procesar transacciones)</li>
                <li>Servicios de envío (para entregar pedidos)</li>
                <li>Cuando sea requerido por ley</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Tus Derechos</h2>
              <p>Tienes derecho a:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Acceder a tu información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar eliminación de tus datos</li>
                <li>Opt-out de comunicaciones promocionales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta política, contáctanos en: 
                <strong> info@dropshop.ec</strong>
              </p>
            </section>

            <p className="text-sm text-gray-500 pt-4 border-t">
              Última actualización: {new Date().toLocaleDateString('es-EC')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
