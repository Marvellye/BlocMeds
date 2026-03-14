import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={cn(
      "fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-glass glass-effect",
      "animate-fade-in-up z-50 min-w-[300px] max-w-md",
      type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
    )}>
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
      )}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
