'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoices } from '@/contexts/InvoicesContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InvoiceStatus } from '@/types/invoice';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  Building,
  Calendar,
  Eye
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

// Componente para lista de faturas
function InvoicesList() {
  const { filteredInvoices, canUserValidate } = useInvoices();
  const router = useRouter();

  const getStatusInfo = (status: InvoiceStatus) => {
    switch (status) {
      case 'RASCUNHO':
        return { color: 'bg-gray-100 text-gray-800', icon: FileText, text: 'Rascunho' };
      case 'ENVIADA':
        return { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Enviada' };
      case 'RECEBIDA':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Recebida' };
      case 'EM_VALIDACAO':
        return { color: 'bg-orange-100 text-orange-800', icon: Clock, text: 'Em Validação' };
      case 'VALIDADA':
        return { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, text: 'Validada' };
      case 'APROVADA_PAGAMENTO':
        return { color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle, text: 'Aprovada Pagamento' };
      case 'PAGA':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Paga' };
      case 'VENCIDA':
        return { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Vencida' };
      case 'CONTESTADA':
        return { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Contestada' };
      case 'CANCELADA':
        return { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Cancelada' };
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-AO');
  };

  if (filteredInvoices.length === 0) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma fatura encontrada
        </h3>
        <p className="text-gray-600 mb-6">
          As faturas aparecerão aqui quando forem registradas
        </p>
        <Button 
          onClick={() => router.push('/faturas/nova')}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Fatura
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredInvoices.map((invoice) => {
        const statusInfo = getStatusInfo(invoice.status);
        const StatusIcon = statusInfo.icon;
        const canValidate = canUserValidate();
        const isOverdue = invoice.isOverdue;
        
        return (
          <div 
            key={invoice.id} 
            className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-green-500 bg-white rounded-lg border border-gray-200"
            onClick={() => router.push(`/faturas/${invoice.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {invoice.invoiceNumber}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.text}
                  </span>
                  {canValidate && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Ação Requerida
                    </span>
                  )}
                  {isOverdue && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Vencida
                    </span>
                  )}
                </div>
                
                {invoice.description && (
                  <p className="text-gray-600 mb-3">
                    {invoice.description}
                  </p>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {invoice.supplierName}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Emissão: {formatDate(invoice.issueDate)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Vencimento: {formatDate(invoice.dueDate)}
                  </span>
                  {invoice.supplierInvoiceNumber && (
                    <span>
                      <span className="font-medium">N° Fornecedor:</span> {invoice.supplierInvoiceNumber}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(invoice.totalAmount)}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    invoice.type === 'SERVICO' 
                      ? 'bg-blue-100 text-blue-800'
                      : invoice.type === 'PRODUTO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {invoice.type}
                  </span>
                </div>
              </div>
            </div>
            
            {invoice.publicNotes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Observações:</span> {invoice.publicNotes}
                </p>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {invoice.paymentRequestId && (
                  <span className="text-sm text-gray-500">
                    Solicitação: #{invoice.paymentRequestId}
                  </span>
                )}
                {invoice.contractNumber && (
                  <span className="text-sm text-gray-500">
                    Contrato: {invoice.contractNumber}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/faturas/${invoice.id}`);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FaturasPage() {
  const { getStats, loading, refreshInvoices } = useInvoices();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const stats = getStats();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshInvoices();
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
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Faturas</h1>
          <p className="mt-2 text-gray-600">
            Controle e processamento de todas as faturas
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
          <Button onClick={() => router.push('/faturas/nova')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Faturas"
          value={stats.total}
          icon={FileText}
          color="blue"
          description="Todas as faturas registradas"
        />
        <StatsCard
          title="Pendente Validação"
          value={stats.pendingValidation}
          icon={Clock}
          color="orange"
          description="Aguardando processamento"
        />
        <StatsCard
          title="Valor Total"
          value={formatCurrency(stats.totalAmount)}
          icon={DollarSign}
          color="green"
          description={`Pago: ${formatCurrency(stats.paidAmount)}`}
        />
        <StatsCard
          title="Vencidas"
          value={stats.overdueInvoices}
          icon={AlertTriangle}
          color="red"
          description={formatCurrency(stats.overdueAmount)}
        />
      </div>

      {/* Lista de Faturas */}
      <InvoicesList />
    </div>
  );
}
