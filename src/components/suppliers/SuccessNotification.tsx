'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SuccessNotificationProps {
  onClose?: () => void;
}

export function SuccessNotification({ onClose }: SuccessNotificationProps) {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    if (success) {
      switch (success) {
        case 'created':
          setMessage('Fornecedor criado com sucesso!');
          break;
        case 'updated':
          setMessage('Fornecedor atualizado com sucesso!');
          break;
        case 'deleted':
          setMessage('Fornecedor excluído com sucesso!');
          break;
        default:
          setMessage('Operação realizada com sucesso!');
      }
      setShow(true);
      
      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
        // Remove the success param from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('success');
        window.history.replaceState({}, '', url.toString());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, onClose]);

  const handleClose = () => {
    setShow(false);
    onClose?.();
    // Remove the success param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('success');
    window.history.replaceState({}, '', url.toString());
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-green-800">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-green-400 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
