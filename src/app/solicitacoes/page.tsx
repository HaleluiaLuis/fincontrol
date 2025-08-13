'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePaymentRequests } from '@/contexts/PaymentRequestsContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PaymentRequestStatus } from '@/types/paymentRequest';
import { PaymentRequestFilters } from '@/components/solicitacoes/PaymentRequestFilters';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  DollarSign
} from 'lucide-react';

// Componente para estatísticas
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  description 
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
  description?: string;
}) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}

// Componente para lista de solicitações
function RequestsList() {
  const { filteredRequests } = usePaymentRequests();
  const router = useRouter();

  const getStatusInfo = (status: PaymentRequestStatus) => {
    switch (status) {
      case 'RASCUNHO':
        return { color: 'bg-gray-100 text-gray-800', icon: FileText, text: 'Rascunho' };
      case 'PENDENTE_VALIDACAO':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pendente Validação' };
      case 'EM_ANALISE':
        return { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Em Análise' };
      case 'VALIDADO':
        return { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, text: 'Validado' };
      case 'AUTORIZADO':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Autorizado' };
      case 'REJEITADO':
        return { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejeitado' };
      case 'CANCELADO':
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Cancelado' };
      case 'PAGO':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Pago' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: FileText, text: status };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  if (filteredRequests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma solicitação encontrada
        </h3>
        <p className="text-gray-600 mb-6">
          Comece criando sua primeira solicitação de pagamento
        </p>
        <Button 
          onClick={() => router.push('/solicitacoes/nova')}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => {
        const statusInfo = getStatusInfo(request.status);
        const StatusIcon = statusInfo.icon;
        
        return (
          <div 
            key={request.id} 
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-blue-500 bg-white rounded-lg border border-gray-200"
            onClick={() => router.push(`/solicitacoes/${request.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.text}
                  </span>
                  {(request.status === 'PENDENTE_VALIDACAO' || request.status === 'EM_ANALISE' || request.status === 'VALIDADO') && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Ação Requerida
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {request.description}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>
                    <span className="font-medium">Fornecedor:</span> {request.supplierName}
                  </span>
                  <span>
                    <span className="font-medium">Valor:</span> {formatCurrency(request.totalAmount)}
                  </span>
                  <span>
                    <span className="font-medium">Criado em:</span> {' '}
                    {request.createdAt.toLocaleDateString('pt-AO')}
                  </span>
                  {request.dueDate && (
                    <span className={request.dueDate < new Date() ? 'text-red-600 font-medium' : ''}>
                      <span className="font-medium">Vencimento:</span> {' '}
                      {request.dueDate.toLocaleDateString('pt-AO')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(request.totalAmount)}
                </div>
                {request.priority === 'ALTA' && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                    Urgente
                  </span>
                )}
              </div>
            </div>
            
            {request.publicComments && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Observações:</span> {request.publicComments}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SolicitacoesPage() {
  const { getStats, loading, refreshRequests } = usePaymentRequests();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const stats = getStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshRequests();
    setRefreshing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitações de Pagamento</h1>
          <p className="mt-2 text-gray-600">
            Gerencie e acompanhe todas as solicitações de pagamento
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
          <Button onClick={() => router.push('/solicitacoes/nova')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Solicitações"
          value={stats.total}
          icon={FileText}
          color="blue"
          description="Todas as solicitações"
        />
        <StatsCard
          title="Pendentes"
          value={stats.byStatus.PENDENTE_VALIDACAO + stats.byStatus.EM_ANALISE + stats.byStatus.VALIDADO}
          icon={Clock}
          color="orange"
          description="Aguardando processamento"
        />
        <StatsCard
          title="Valor Total"
          value={formatCurrency(stats.totalAmount)}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Em Atraso"
          value={stats.overdueSolicitations}
          icon={AlertTriangle}
          color="red"
          description="Solicitações vencidas"
        />
      </div>

      {/* Filtros */}
      <PaymentRequestFilters />

      {/* Lista de Solicitações */}
      <RequestsList />
    </div>
  );
}
