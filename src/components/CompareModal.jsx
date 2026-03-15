import { X, Check, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CompareModal({ onClose, onNavigate }) {
  const { compareList, clearCompare, isInCompare, toggleCompare } = useStore();

  if (compareList.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2"><X className="w-5 h-5" /></button>
          <h3 className="text-xl font-bold mb-4">Comparar Productos</h3>
          <p className="text-gray-500 mb-4">No hay productos para comparar.</p>
          <p className="text-sm text-gray-400">Agrega productos usando el botón de comparación en las tarjetas.</p>
        </div>
      </div>
    );
  }

  const features = ['Precio', 'Rating', 'Ventas', 'Categoría', 'Garantía'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Comparar Productos ({compareList.length})</h3>
          <div className="flex gap-2">
            <button onClick={clearCompare} className="text-red-500 text-sm flex items-center gap-1 hover:underline"><Trash2 className="w-4 h-4" /> Limpiar</button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 bg-gray-50 w-32"></th>
                {compareList.map(p => (
                  <th key={p.id} className="p-3 bg-gray-50 min-w-[180px]">
                    <div className="relative">
                      <button onClick={() => toggleCompare(p)} className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full"><X className="w-3 h-3 text-red-500" /></button>
                      <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-lg mx-auto mb-2" />
                      <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 font-medium text-gray-600">Precio</td>
                {compareList.map(p => <td key={p.id} className="p-3 text-center font-bold text-indigo-600">${p.price.toFixed(2)}</td>)}
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-medium text-gray-600">Rating</td>
                {compareList.map(p => <td key={p.id} className="p-3 text-center">{p.rating} ★</td>)}
              </tr>
              <tr>
                <td className="p-3 font-medium text-gray-600">Ventas</td>
                {compareList.map(p => <td key={p.id} className="p-3 text-center">{p.reviews.toLocaleString()}</td>)}
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 font-medium text-gray-600">Categoría</td>
                {compareList.map(p => <td key={p.id} className="p-3 text-center capitalize">{p.category}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-medium text-gray-600">Garantía</td>
                {compareList.map(p => <td key={p.id} className="p-3 text-center"><Check className="w-5 h-5 text-green-500 inline" /></td>)}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          {compareList.slice(0, 1).map(p => (
            <button key={p.id} onClick={() => { onClose(); onNavigate('product', p); }} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
              Ver Detalle
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
