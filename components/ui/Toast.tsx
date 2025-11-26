
import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-emerald-400" />,
    error: <ExclamationCircleIcon className="w-6 h-6 text-red-400" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-400" />,
  };

  const borders = {
    success: 'border-emerald-500/50',
    error: 'border-red-500/50',
    info: 'border-blue-500/50',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-fade-in-up">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-[#121214]/95 backdrop-blur-md border ${borders[toast.type]} shadow-2xl min-w-[300px] max-w-md`}>
        <div className="flex-shrink-0">
          {icons[toast.type]}
        </div>
        <p className="text-sm font-medium text-white flex-1">{toast.message}</p>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
