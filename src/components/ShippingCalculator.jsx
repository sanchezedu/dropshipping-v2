import { useState } from 'react';
import { Truck, MapPin, Clock, DollarSign } from 'lucide-react';

export default function ShippingCalculator() {
  const [ciudad, setCiudad] = useState('');
  const [calculado, setCalculado] = useState(null);

  // Costos de envío por ciudad (precios aproximados en Ecuador)
  const costosEnvio = {
    'guayaquil': { costo: 3.99, tiempo: '2-3 días', zona: 'Costa' },
    'quito': { costo: 4.99, tiempo: '2-3 días', zona: 'Sierra' },
    'cuenca': { costo: 5.99, tiempo: '3-4 días', zona: 'Sierra' },
    'manta': { costo: 4.99, tiempo: '3-4 días', zona: 'Costa' },
    'portoviejo': { costo: 4.99, tiempo: '3-4 días', zona: 'Costa' },
    'machala': { costo: 5.99, tiempo: '3-4 días', zona: 'Costa' },
    'esmeraldas': { costo: 6.99, tiempo: '4-5 días', zona: 'Costa' },
    ' Ibarra': { costo: 5.99, tiempo: '3-4 días', zona: 'Sierra' },
    'loja': { costo: 6.99, tiempo: '4-5 días', zona: 'Sierra' },
    'ambato': { costo: 5.99, tiempo: '3-4 días', zona: 'Sierra' },
    'riobamba': { costo: 5.99, tiempo: '3-4 días', zona: 'Sierra' },
    'latacunga': { costo: 5.99, tiempo: '3-4 días', zona: 'Sierra' },
    'quevedo': { costo: 4.99, tiempo: '3-4 días', zona: 'Costa' },
    'bahía': { costo: 4.99, tiempo: '3-4 días', zona: 'Costa' },
    'durán': { costo: 3.99, tiempo: '2-3 días', zona: 'Costa' },
  };

  const calcular = () => {
    const ciudadLower = ciudad.toLowerCase().trim();
    const resultado = costosEnvio[ciudadLower];
    
    if (resultado) {
      setCalculado({
        ...resultado,
        ciudad: ciudad.charAt(0).toUpperCase() + ciudad.slice(1).toLowerCase(),
        gratis: false
      });
    } else {
      // Ciudad no encontrada - mostrar costo promedio
      setCalculado({
        costo: 6.99,
        tiempo: '4-6 días',
        zona: 'Nacional',
        ciudad: ciudad.charAt(0).toUpperCase() + ciudad.slice(1).toLowerCase(),
        gratis: false,
        mensaje: 'Ciudad principal'
      });
    }
  };

  const ciudadesPrincipales = Object.keys(costosEnvio);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Truck className="w-5 h-5 text-indigo-600" />
        Calculador de Envío
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            ¿A qué ciudad quieres que enviaremos?
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                placeholder="Escribe tu ciudad..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                list="ciudades"
              />
              <datalist id="ciudades">
                {ciudadesPrincipales.map(c => (
                  <option key={c} value={c.charAt(0).toUpperCase() + c.slice(1)} />
                ))}
              </datalist>
            </div>
            <button
              onClick={calcular}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Calcular
            </button>
          </div>
        </div>

        {calculado && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-green-800 dark:text-green-200">
                {calculado.ciudad}
              </span>
              <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                {calculado.zona}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Costo envío:
                </span>
                <span className="font-bold text-green-600">
                  ${calculado.costo.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Tiempo:
                </span>
                <span className="font-medium">
                  {calculado.tiempo}
                </span>
              </div>
            </div>

            {calculado.costo >= 5 && (
              <p className="text-xs text-green-600 mt-2">
                💡 Agrega ${(5 - calculado.costo).toFixed(2)} más para envío gratis (pedidos +$50)
              </p>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">Ciudades principales:</p>
          <p>{ciudadesPrincipales.slice(0, 8).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}...</p>
        </div>
      </div>
    </div>
  );
}
