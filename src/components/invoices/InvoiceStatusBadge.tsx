// Componente para exibir o status de uma fatura
import { InvoiceStatus } from '@/types';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className = '' }: InvoiceStatusBadgeProps) {
  const getStatusConfig = (status: InvoiceStatus) => {
    switch (status) {
      case 'pendente_contratacao':
        return {
          label: 'Pendente Contratação',
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: '📋'
        };
      case 'pendente_presidente':
        return {
          label: 'Pendente Presidente',
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: '👔'
        };
      case 'rejeitada':
        return {
          label: 'Rejeitada',
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: '❌'
        };
      case 'aprovada_registro':
        return {
          label: 'Aprovada - Aguarda Registro',
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: '📝'
        };
      case 'registrada':
        return {
          label: 'Registrada',
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          icon: '📁'
        };
      case 'pendente_pagamento':
        return {
          label: 'Pendente Pagamento',
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: '💰'
        };
      case 'paga':
        return {
          label: 'Paga',
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: '✅'
        };
      case 'cancelada':
        return {
          label: 'Cancelada',
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '🚫'
        };
      default:
        return {
          label: 'Status Desconhecido',
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: '❓'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}
