import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast } = useStore();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
  };

  const colors = {
    success: 'bg-white border-green-500',
    error: 'bg-white border-red-500',
    info: 'bg-white border-blue-500'
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-3 md:left-6 right-3 md:right-auto z-50 animate-slide-up">
      <div className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl shadow-xl border-l-4 ${colors[toast.type || 'success']}`}>
        {icons[toast.type || 'success']}
        <p className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2">{toast.message}</p>
      </div>
    </div>
  );
}
