export default function Terms({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Términos y Condiciones</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Aceptación de Términos</h2>
              <p>
                Al acceder y utilizar DropShop Ecuador, aceptas estar vinculado por estos términos y condiciones. 
                Si no estás de acuerdo con alguno de estos términos, por favor no utilices nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Uso del Sitio</h2>
              <p>Estás de acuerdo en:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>No utilizar el sitio para fines ilegales</li>
                <li>No intentar obtener acceso no autorizado</li>
                <li>No realizar compras falsas o fraudulentas</li>
                <li>Proporcionar información veraz y actualizada</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Cuentas de Usuario</h2>
              <p>
                Al crear una cuenta, eres responsable de mantener la confidencialidad de tu cuenta y contraseña. 
                Aceptas responsabilidad por todas las actividades que ocurran bajo tu cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Pedidos y Pagos</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Los precios mostrados incluyen IVA</li>
                <li>Nos reservamos el derecho de rechazar cualquier pedido</li>
                <li>Los pagos se procesan de forma segura</li>
                <li>Confirmaremos tu pedido por email</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Envíos</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Envíos a todo Ecuador</li>
                <li>Envío gratis en pedidos mayores a $50</li>
                <li>Tiempo de entrega: 3-7 días hábiles</li>
                <li>No entregamos en Apartados Postales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Devoluciones</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>30 días para devoluciones</li>
                <li>El producto debe estar sin usar y en empaque original</li>
                <li>El cliente asume costos de envío para devoluciones</li>
                <li>Reembolso en 5-10 días hábiles</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Garantías</h2>
              <p>
                Todos los productos cuentan con garantía del fabricante. La garantía no cubre daños 
                causados por uso inadecuado o manipulación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Limitación de Responsabilidad</h2>
              <p>
                DropShop Ecuador no será responsable por daños directos, indirectos, incidentales 
                o consecuentes derivados del uso de nuestro sitio o productos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Propiedad Intelectual</h2>
              <p>
                Todo el contenido de este sitio es propiedad de DropShop Ecuador y está protegido 
                por derechos de autor y leyes de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contacto</h2>
              <p>
                Para preguntas sobre estos términos: <strong>info@dropshop.ec</strong>
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
