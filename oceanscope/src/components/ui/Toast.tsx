import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type?: ToastType;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Toast = ({ type = 'info', message, duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  };

  const Icon = icons[type];

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <Icon className="toast-icon" />
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default Toast;