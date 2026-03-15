import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const colors = {
    success: 'bg-white border-green-500',
    error: 'bg-white border-red-500',
    info: 'bg-white border-blue-500'
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border-l-4 ${colors[toast.type || 'success']}`}>
        {icons[toast.type || 'success']}
        <p className="text-sm font-medium text-gray-800">{toast.message}</p>
      </div>
    </div>
  );
}
