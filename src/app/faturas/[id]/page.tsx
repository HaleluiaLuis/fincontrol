'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useInvoices } from '@/contexts/InvoicesContext';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Invoice, InvoiceStatus, InvoiceAuditLog } from '@/types/invoice';
import { 
  ArrowLeft,
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  User,
  History,
  CreditCard,
  ChevronRight
} from 'lucide-react';

// Componente para o status da fatura
function StatusBadge({ status }: { status: InvoiceStatus }) {
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

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
      <StatusIcon className="h-4 w-4 mr-2" />
      {statusInfo.text}
    </span>
  );
}

// Componente para workflow/histórico
function WorkflowTimeline({ invoice }: { invoice: Invoice }) {
  const workflow = [
    { status: 'RASCUNHO', label: 'Rascunho', completed: true },
    { status: 'ENVIADA', label: 'Enviada', completed: true },
    { status: 'RECEBIDA', label: 'Recebida', completed: true },
    { status: 'EM_VALIDACAO', label: 'Em Validação', completed: invoice.status !== 'RASCUNHO' && invoice.status !== 'ENVIADA' },
    { status: 'VALIDADA', label: 'Validada', completed: ['VALIDADA', 'APROVADA_PAGAMENTO', 'PAGA'].includes(invoice.status) },
    { status: 'APROVADA_PAGAMENTO', label: 'Aprovada', completed: ['APROVADA_PAGAMENTO', 'PAGA'].includes(invoice.status) },
    { status: 'PAGA', label: 'Paga', completed: invoice.status === 'PAGA' }
  ];

  return (
    <div className="space-y-4">
      {workflow.map((step, index) => (
        <div key={step.status} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'bg-gray-100 border-gray-300 text-gray-400'
          }`}>
            {step.completed ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="text-xs font-bold">{index + 1}</span>
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              step.completed ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.label}
            </p>
          </div>
          {index < workflow.length - 1 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </div>
      ))}
    </div>
  );
}

// Componente para auditoria
function AuditTrail({ logs }: { logs: InvoiceAuditLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-6">
        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum histórico disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{log.action}</p>
              <p className="text-xs text-gray-500">
                {log.date.toLocaleDateString('pt-AO')} às {log.date.toLocaleTimeString('pt-AO')}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-1">{log.userName} - {log.userRole}</p>
            <p className="text-sm text-gray-500 mt-2">{log.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente principal
export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getInvoice, deleteInvoice, validateInvoice, approveForPayment, markAsPaid, contestInvoice, canUserValidate, canUserApprovePayment } = useInvoices();
  const { getSupplier } = useSuppliers();
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [contestReason, setContestReason] = useState('');
  const [notes, setNotes] = useState('');

  const invoiceId = params.id as string;

  useEffect(() => {
    const fetchInvoice = () => {
      const invoiceData = getInvoice(invoiceId);
      setInvoice(invoiceData || null);
      setLoading(false);
    };

    fetchInvoice();
  }, [invoiceId, getInvoice]);

  const supplier = invoice ? getSupplier(invoice.supplierId) : null;
  const canValidate = canUserValidate();
  const canApprove = canUserApprovePayment();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-AO');
  };

  const handleValidate = async () => {
    if (!invoice) return;
    setActionLoading(true);
    try {
      await validateInvoice(invoice.id, notes);
      setInvoice({ ...invoice, status: 'VALIDADA' });
      setNotes('');
    } catch (error) {
      console.error('Erro ao validar fatura:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!invoice) return;
    setActionLoading(true);
    try {
      await approveForPayment(invoice.id, notes);
      setInvoice({ ...invoice, status: 'APROVADA_PAGAMENTO' });
      setNotes('');
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!invoice) return;
    setActionLoading(true);
    try {
      const paymentData = {
        amount: invoice.totalAmount,
        reference: `PAG-${invoice.invoiceNumber}`,
        date: new Date()
      };
      await markAsPaid(invoice.id, paymentData);
      setInvoice({ ...invoice, status: 'PAGA' });
    } catch (error) {
      console.error('Erro ao marcar como paga:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleContest = async () => {
    if (!invoice || !contestReason.trim()) return;
    setActionLoading(true);
    try {
      await contestInvoice(invoice.id, contestReason);
      setInvoice({ ...invoice, status: 'CONTESTADA' });
      setShowContestModal(false);
      setContestReason('');
    } catch (error) {
      console.error('Erro ao contestar fatura:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    if (window.confirm('Tem certeza que deseja excluir esta fatura? Esta ação não pode ser desfeita.')) {
      setActionLoading(true);
      try {
        await deleteInvoice(invoice.id);
        router.push('/faturas');
      } catch (error) {
        console.error('Erro ao excluir fatura:', error);
        setActionLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Fatura não encontrada
          </h3>
          <p className="text-gray-600 mb-6">
            A fatura solicitada não existe ou foi removida.
          </p>
          <Button onClick={() => router.push('/faturas')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Faturas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/faturas')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Fatura {invoice.invoiceNumber}
            </h1>
            <p className="mt-2 text-gray-600">
              Detalhes completos e ações disponíveis
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <StatusBadge status={invoice.status} />
          {invoice.isOverdue && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Vencida
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informações da Fatura */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Informações da Fatura</h2>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Fornecedor</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {supplier?.companyName || 'Fornecedor não encontrado'}
                </p>
                {supplier?.email && (
                  <p className="text-sm text-gray-600">{supplier.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Valor Total</label>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatCurrency(invoice.totalAmount)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Data de Emissão</label>
                <p className="text-base text-gray-900 mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDate(invoice.issueDate)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Data de Vencimento</label>
                <p className={`text-base mt-1 flex items-center ${
                  invoice.isOverdue ? 'text-red-600 font-semibold' : 'text-gray-900'
                }`}>
                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDate(invoice.dueDate)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Tipo</label>
                <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium mt-1 ${
                  invoice.type === 'SERVICO' 
                    ? 'bg-blue-100 text-blue-800'
                    : invoice.type === 'PRODUTO'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {invoice.type}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Prazo de Pagamento</label>
                <p className="text-base text-gray-900 mt-1">
                  {invoice.paymentTerm === '30_DIAS' ? '30 dias' :
                   invoice.paymentTerm === '60_DIAS' ? '60 dias' :
                   invoice.paymentTerm === '90_DIAS' ? '90 dias' : 'À vista'}
                </p>
              </div>
            </div>

            {invoice.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Descrição</label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{invoice.description}</p>
                </div>
              </div>
            )}

            {invoice.publicNotes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">Observações</label>
                <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-900">{invoice.publicNotes}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Itens da Fatura */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Itens da Fatura</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Unit.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.description}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(item.finalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Total Geral:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-600">
                      {formatCurrency(invoice.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ações */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
            
            <div className="space-y-3">
              {canValidate && invoice.status === 'EM_VALIDACAO' && (
                <div>
                  <textarea
                    placeholder="Observações da validação..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3"
                    rows={3}
                  />
                  <Button 
                    onClick={handleValidate} 
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {actionLoading ? 'Validando...' : 'Validar Fatura'}
                  </Button>
                </div>
              )}

              {canApprove && invoice.status === 'VALIDADA' && (
                <div>
                  <textarea
                    placeholder="Observações da aprovação..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3"
                    rows={3}
                  />
                  <Button 
                    onClick={handleApprovePayment}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {actionLoading ? 'Aprovando...' : 'Aprovar Pagamento'}
                  </Button>
                </div>
              )}

              {invoice.status === 'APROVADA_PAGAMENTO' && (
                <Button 
                  onClick={handleMarkAsPaid}
                  disabled={actionLoading}
                  className="w-full"
                  variant="secondary"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  {actionLoading ? 'Processando...' : 'Marcar como Paga'}
                </Button>
              )}

              <Button 
                onClick={() => setShowContestModal(true)}
                disabled={actionLoading || invoice.status === 'PAGA'}
                className="w-full"
                variant="ghost"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Contestar
              </Button>

              <Button className="w-full" variant="ghost">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </Card>

          {/* Workflow */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Aprovação</h3>
            <WorkflowTimeline invoice={invoice} />
          </Card>

          {/* Documentos */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
            
            {invoice.documents.length > 0 ? (
              <div className="space-y-3">
                {invoice.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">Nenhum documento anexado</p>
                <Button variant="ghost" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Anexar Documento
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Auditoria */}
      <div className="mt-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Histórico de Auditoria</h2>
          <AuditTrail logs={invoice.auditLog} />
        </Card>
      </div>

      {/* Modal de Contestação */}
      {showContestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contestar Fatura</h3>
              <button
                onClick={() => setShowContestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo da contestação
              </label>
              <textarea
                value={contestReason}
                onChange={(e) => setContestReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                rows={4}
                placeholder="Descreva o motivo da contestação..."
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowContestModal(false)}
                variant="ghost"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleContest}
                disabled={!contestReason.trim() || actionLoading}
                className="flex-1"
                variant="secondary"
              >
                {actionLoading ? 'Contestando...' : 'Contestar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
