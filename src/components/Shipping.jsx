import { Truck, Package, MapPin, Clock, Shield } from 'lucide-react';

export default function Shipping({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Política de Envíos</h1>
          
          <div className="space-y-8">
            <section className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Envío Gratis</h2>
                  <p className="text-gray-600">En pedidos mayores a $50</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="w-6 h-6 text-indigo-600" />
                    <h3 className="font-bold">Tiempo de Procesamiento</h3>
                  </div>
                  <p className="text-gray-600">1-2 días hábiles</p>
                  <p className="text-sm text-gray-500">Los pedidos se procesan de lunes a viernes</p>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    <h3 className="font-bold">Tiempo de Entrega</h3>
                  </div>
                  <p className="text-gray-600">3-7 días hábiles</p>
                  <p className="text-sm text-gray-500">Dependiendo de tu ubicación</p>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <h3 className="font-bold">Zonas de Envío</h3>
                  </div>
                  <p className="text-gray-600">Todo Ecuador</p>
                  <p className="text-sm text-gray-500">No envíamos a Apartados Postales</p>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-6 h-6 text-indigo-600" />
                    <h3 className="font-bold">Seguimiento</h3>
                  </div>
                  <p className="text-gray-600">Tracking incluido</p>
                  <p className="text-sm text-gray-500">Recibeupdates por email</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Costos de Envío</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Destino</th>
                      <th className="border p-3 text-left">Costo</th>
                      <th className="border p-3 text-left">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">Guayaquil & Quito</td>
                      <td className="border p-3">$3.99</td>
                      <td className="border p-3">2-3 días</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Cuenca, Ambato, Manta</td>
                      <td className="border p-3">$4.99</td>
                      <td className="border p-3">3-4 días</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Otras ciudades</td>
                      <td className="border p-3">$5.99</td>
                      <td className="border p-3">4-7 días</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="border p-3 font-bold">Pedidos +$50</td>
                      <td className="border p-3 font-bold text-green-600">¡GRATIS!</td>
                      <td className="border p-3">3-5 días</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Notas Importantes</h2>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Los pedidos se procesan en 1-2 días hábiles</li>
                <li>✅ No entregamos en Apartados Postales</li>
                <li>✅ Asegúrate de que tu dirección sea correcta</li>
                <li>✅ Puedes rastrear tu pedido con el número de seguimiento</li>
                <li>✅ En épocas festivas puede haber retrasos</li>
              </ul>
            </section>

            <section className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-3">¿Tienes dudas?</h2>
              <p className="mb-4">Contáctanos y te ayudamos con tu envío</p>
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
