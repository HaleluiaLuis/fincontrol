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
        return { label: 'Pendente Contratação', chip: 'chip-amber', icon: '📋' };
      case 'pendente_presidente':
        return { label: 'Pendente Presidente', chip: 'chip-amber', icon: '👔' };
      case 'rejeitada':
        return { label: 'Rejeitada', chip: 'chip-red', icon: '❌' };
      case 'aprovada_registro':
        return { label: 'Aprovada - Aguarda Registro', chip: 'chip-indigo', icon: '📝' };
      case 'registrada':
        return { label: 'Registrada', chip: 'chip-blue', icon: '📁' };
      case 'pendente_pagamento':
        return { label: 'Pendente Pagamento', chip: 'chip-amber', icon: '💰' };
      case 'paga':
        return { label: 'Paga', chip: 'chip-green', icon: '✅' };
      case 'cancelada':
        return { label: 'Cancelada', chip: 'chip-red', icon: '🚫' };
      default:
        return { label: 'Status Desconhecido', chip: 'chip-indigo', icon: '❓' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`chip ${config.chip} ${className}`}>
      <span className="text-sm leading-none">{config.icon}</span>
      {config.label}
    </span>
  );
}
