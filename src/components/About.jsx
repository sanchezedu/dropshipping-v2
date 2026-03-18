import { Heart, Truck, Shield, Star } from 'lucide-react';

export default function About({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre Epicentro Digital Ec</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu tienda de confianza para los mejores productos con envío a todo Ecuador
          </p>
        </section>

        {/* Mission */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-gray-600 mb-4">
                En Epicentro Digital Ec nuestra misión es ofrecer productos de alta calidad a los mejores precios, 
                con un servicio al cliente excepcional y envíos rápidos a todo el país.
              </p>
              <p className="text-gray-600">
                Creemos que comprar en línea debe ser fácil, seguro y confiable. Por eso trabajamos 
                día a día para mejorar tu experiencia de compra.
              </p>
            </div>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">¿Qué vendemos?</h3>
              <ul className="space-y-2">
                <li>✅ Electrónica de última generación</li>
                <li>✅ Accesorios tecnológicos</li>
                <li>✅ Productos para el hogar</li>
                <li>✅ Equipos de fitness</li>
                <li>✅ Y mucho más...</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros Valores</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Honestidad</h3>
              <p className="text-gray-600 text-sm">Transparencia en cada transacción</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Confianza</h3>
              <p className="text-gray-600 text-sm">Seguridad en tus compras</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Rapidez</h3>
              <p className="text-gray-600 text-sm">Envíos veloces a todo el país</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="font-bold text-lg mb-2">Calidad</h3>
              <p className="text-gray-600 text-sm">Productos seleccionados</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">¿Por Qué Elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-bold text-lg mb-2">Productos de Calidad</h3>
              <p className="text-gray-600">Seleccionamos los mejores productos para ti</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="font-bold text-lg mb-2">Mejores Precios</h3>
              <p className="text-gray-600">Competimos en precio y calidad</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-bold text-lg mb-2">Atención Personalizada</h3>
              <p className="text-gray-600">Te acompañamos en todo el proceso</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Listo para comprar?</h2>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700"
          >
            Ver Productos
          </button>
        </section>
      </div>
    </div>
  );
}
