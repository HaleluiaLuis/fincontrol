// Componente para exibir o fluxo de aprovação de uma fatura
import { Invoice, WorkflowStep } from '@/types';
import { Card } from '@/components/ui/Card';

interface WorkflowTrackerProps {
  invoice: Invoice;
}

export function WorkflowTracker({ invoice }: WorkflowTrackerProps) {
  const workflowSteps: { step: WorkflowStep; label: string; icon: string }[] = [
    { step: 'gabinete_contratacao', label: 'Gabinete de Contratação', icon: '📋' },
    { step: 'presidente', label: 'Presidente', icon: '👔' },
    { step: 'gabinete_apoio', label: 'Gabinete de Apoio', icon: '📝' },
    { step: 'financas', label: 'Finanças', icon: '💰' },
    { step: 'concluido', label: 'Concluído', icon: '✅' }
  ];

  const getStepStatus = (step: WorkflowStep) => {
    // Verificar se já foi aprovado
    const approvalStep = invoice.approvalHistory.find(a => a.step === step);
    if (approvalStep) {
      return approvalStep.action === 'aprovado' ? 'completed' : 'rejected';
    }

    // Verificar se é o passo atual
    if (invoice.currentStep === step) {
      return 'current';
    }

    // Verificar se ainda não chegou neste passo
    const stepIndex = workflowSteps.findIndex(s => s.step === step);
    const currentIndex = workflowSteps.findIndex(s => s.step === invoice.currentStep);
    
    if (stepIndex > currentIndex) {
      return 'pending';
    }

    return 'pending';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'rejected':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'current':
        return 'bg-blue-100 border-blue-500 text-blue-800 ring-2 ring-blue-200';
      case 'pending':
        return 'bg-gray-100 border-gray-300 text-gray-600';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card title="Fluxo de Aprovação">
      <div className="space-y-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, index) => {
            const status = getStepStatus(step.step);
            const isLast = index === workflowSteps.length - 1;

            return (
              <div key={step.step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 text-lg font-medium ${getStepClasses(status)}`}
                >
                  {step.icon}
                </div>
                <div className="ml-2 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{step.label}</p>
                  {status === 'current' && (
                    <p className="text-xs text-blue-600">Em andamento</p>
                  )}
                </div>
                {!isLast && (
                  <div className="hidden sm:block w-8 h-0.5 bg-gray-300 mx-4"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Approval History */}
        {invoice.approvalHistory.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Histórico de Aprovações</h4>
            <div className="space-y-3">
              {invoice.approvalHistory.map((approval) => (
                <div
                  key={approval.id}
                  className={`p-3 rounded-lg border ${
                    approval.action === 'aprovado'
                      ? 'bg-green-50 border-green-200'
                      : approval.action === 'rejeitado'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {approval.userName}
                      </p>
                      <p className="text-xs text-gray-600">
                        {workflowSteps.find(s => s.step === approval.step)?.label}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          approval.action === 'aprovado'
                            ? 'bg-green-100 text-green-800'
                            : approval.action === 'rejeitado'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {approval.action === 'aprovado' ? '✅ Aprovado' : 
                         approval.action === 'rejeitado' ? '❌ Rejeitado' : 
                         '⚠️ Correção Solicitada'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(approval.timestamp)}
                      </p>
                    </div>
                  </div>
                  {approval.comments && (
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Comentários:</span> {approval.comments}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
