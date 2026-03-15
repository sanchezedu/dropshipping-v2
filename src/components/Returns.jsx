import { RotateCcw, Check, X, AlertCircle } from 'lucide-react';

export default function Returns({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Política de Devoluciones</h1>
          
          <div className="space-y-8">
            <section className="bg-indigo-50 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <RotateCcw className="w-8 h-8 text-indigo-600" />
                <div>
                  <h2 className="text-2xl font-bold">30 Días para Devoluciones</h2>
                  <p className="text-gray-600">Cambia de opinión sin problemas</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">¿Cómo Devolver un Producto?</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="border rounded-xl p-6 text-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-indigo-600">1</span>
                  </div>
                  <h3 className="font-bold mb-2">Contáctanos</h3>
                  <p className="text-sm text-gray-600">Escríbenos dentro de 30 días</p>
                </div>
                <div className="border rounded-xl p-6 text-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-indigo-600">2</span>
                  </div>
                  <h3 className="font-bold mb-2">Envía el Producto</h3>
                  <p className="text-sm text-gray-600">Empaqueta en estado original</p>
                </div>
                <div className="border rounded-xl p-6 text-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-indigo-600">3</span>
                  </div>
                  <h3 className="font-bold mb-2">Recibe tu Reembolso</h3>
                  <p className="text-sm text-gray-600">5-10 días hábiles</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Condiciones</h2>
              <ul className="space-y-2">
                <li>✅ Producto sin usar y en empaque original</li>
                <li>✅ 30 días desde la fecha de recepción</li>
                <li>✅ Incluir comprobante de compra</li>
                <li>❌ No se aceptan productos usados</li>
                <li>❌ No hay devolución en productos en oferta</li>
              </ul>
            </section>

            <section className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-3">¿Necesitas ayuda?</h2>
              <button
                onClick={() => onNavigate('contact')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Contactar
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
