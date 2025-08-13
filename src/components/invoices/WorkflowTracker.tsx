// Componente para exibir o fluxo de aprovação de uma fatura
import { Invoice } from '@/types';
import { Card } from '@/components/ui/Card';

interface WorkflowTrackerProps {
  invoice: Invoice;
}

export function WorkflowTracker({ invoice }: WorkflowTrackerProps) {
  // Temporariamente simplificado - será refatorado na Fase 3 para usar PaymentRequest
  return (
    <Card title="Fluxo de Aprovação">
      <div className="p-4">
        <div className="text-sm text-gray-500">
          <p>Componente temporariamente simplificado.</p>
          <p><strong>Fatura:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Status:</strong> Em desenvolvimento</p>
          <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="text-blue-700 text-xs">
              ℹ️ Este componente será refatorado na Fase 3 para integrar com o sistema de aprovações via PaymentRequest.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
