// Componente para exibir o status de uma fatura
import { InvoiceStatus } from '@/types';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

export function InvoiceStatusBadge({ status, className = '' }: InvoiceStatusBadgeProps) {
  const getStatusConfig = (status: InvoiceStatus) => {
    switch (status) {
      case 'PENDENTE':
        return { label: 'Pendente', chip: 'chip-amber', icon: '📋' };
      case 'EM_VALIDACAO':
        return { label: 'Em Validação', chip: 'chip-amber', icon: '�' };
      case 'PENDENTE_PRESIDENTE':
        return { label: 'Pendente Presidente', chip: 'chip-amber', icon: '👔' };
      case 'AUTORIZADA':
        return { label: 'Autorizada', chip: 'chip-indigo', icon: '✅' };
      case 'REJEITADA':
        return { label: 'Rejeitada', chip: 'chip-red', icon: '❌' };
      case 'REGISTRADA':
        return { label: 'Registrada', chip: 'chip-blue', icon: '📁' };
      case 'PENDENTE_PAGAMENTO':
        return { label: 'Pendente Pagamento', chip: 'chip-amber', icon: '💰' };
      case 'PAGA':
        return { label: 'Paga', chip: 'chip-green', icon: '✅' };
      case 'CANCELADA':
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
