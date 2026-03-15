export default function NotFound({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Página No Encontrada</h1>
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => onNavigate('home')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700"
          >
            Volver al Inicio
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300"
          >
            Ver Productos
          </button>
        </div>
      </div>
    </div>
  );
}
