'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePaymentRequests } from '@/contexts/PaymentRequestsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PaymentRequestStatus, PaymentRequest } from '@/types/paymentRequest';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  MessageSquare,
  Eye,
  Edit
} from 'lucide-react';

// Componente para o status da solicitação
function StatusBadge({ status, className = '' }: { status: PaymentRequestStatus; className?: string }) {
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

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${className}`}>
      <StatusIcon className="h-4 w-4 mr-2" />
      {statusInfo.text}
    </span>
  );
}

// Componente para o workflow visual
function WorkflowProgress({ request }: { request: PaymentRequest }) {
  const { getWorkflow } = usePaymentRequests();
  const workflow = getWorkflow(request.id);

  if (!workflow) return null;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso da Solicitação</h3>
      <div className="flex items-center justify-between">
        {workflow.steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-600'
                    : step.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.status === 'COMPLETED' && <CheckCircle className="h-5 w-5" />}
                {step.status === 'IN_PROGRESS' && <Clock className="h-5 w-5" />}
                {step.status === 'PENDING' && <div className="w-3 h-3 rounded-full bg-gray-300" />}
              </div>
              <p className="text-xs font-medium text-gray-900 mt-2 text-center max-w-20">
                {step.title}
              </p>
              <p className="text-xs text-gray-500 text-center max-w-24">
                {step.description}
              </p>
            </div>
            {index < workflow.steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-4 min-w-16">
                <div
                  className={`h-full ${
                    workflow.steps[index + 1].status !== 'PENDING' ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                  style={{
                    width:
                      workflow.steps[index + 1].status === 'COMPLETED'
                        ? '100%'
                        : workflow.steps[index + 1].status === 'IN_PROGRESS'
                        ? '50%'
                        : '0%'
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">
          Etapa {workflow.currentStep} de {workflow.totalSteps}
        </span>
      </div>
    </Card>
  );
}

// Componente para botões de ação
function ActionButtons({ request }: { request: PaymentRequest }) {
  const { user } = useAuth();
  const { approveRequest, rejectRequest, validateRequest } = usePaymentRequests();
  const [loading, setLoading] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  // Lógica simples para verificar se o usuário pode aprovar
  const canApprove = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const handleAction = async (action: 'approve' | 'reject' | 'validate') => {
    if (!user) return;
    
    setLoading(true);
    try {
      switch (action) {
        case 'approve':
          await approveRequest(request.id, comment || undefined);
          break;
        case 'reject':
          if (!comment.trim()) {
            alert('Comentário obrigatório para rejeição');
            return;
          }
          await rejectRequest(request.id, comment);
          break;
        case 'validate':
          await validateRequest(request.id, comment || undefined);
          break;
      }
      setShowCommentModal(null);
      setComment('');
    } catch (error) {
      console.error('Erro na ação:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canApprove) return null;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Ações Disponíveis</h3>
        <div className="flex gap-3">
          {user?.role === 'GABINETE_CONTRATACAO' && 
           (request.status === 'PENDENTE_VALIDACAO' || request.status === 'EM_ANALISE') && (
            <>
              <Button
                onClick={() => setShowCommentModal('validate')}
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validar
              </Button>
              <Button
                onClick={() => setShowCommentModal('reject')}
                variant="danger"
                disabled={loading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
            </>
          )}
          
          {user?.role === 'PRESIDENTE' && request.status === 'VALIDADO' && (
            <>
              <Button
                onClick={() => setShowCommentModal('approve')}
                className="bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Autorizar
              </Button>
              <Button
                onClick={() => setShowCommentModal('reject')}
                variant="danger"
                disabled={loading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Modal de Comentário */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {showCommentModal === 'approve' && 'Autorizar Solicitação'}
              {showCommentModal === 'reject' && 'Rejeitar Solicitação'}
              {showCommentModal === 'validate' && 'Validar Solicitação'}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentário {showCommentModal === 'reject' && '(obrigatório)'}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Adicione seus comentários sobre esta decisão..."
                required={showCommentModal === 'reject'}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCommentModal(null);
                  setComment('');
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => handleAction(showCommentModal as 'approve' | 'reject' | 'validate')}
                disabled={loading || (showCommentModal === 'reject' && !comment.trim())}
                className={showCommentModal === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                {loading ? 'Processando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SolicitacaoDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const { getPaymentRequest } = usePaymentRequests();
  
  const requestId = params.id as string;
  const [request, setRequest] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId) {
      const paymentRequest = getPaymentRequest(requestId);
      setRequest(paymentRequest || null);
      setLoading(false);
    }
  }, [requestId, getPaymentRequest]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Solicitação não encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            A solicitação que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={() => router.push('/solicitacoes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às Solicitações
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/solicitacoes')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{request.title}</h1>
            <p className="text-gray-600 mt-1">Solicitação #{request.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={request.status} />
          {request.priority === 'ALTA' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Urgente
            </span>
          )}
          <Button variant="secondary">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workflow */}
          <WorkflowProgress request={request} />

          {/* Informações Básicas */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Solicitação</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <p className="mt-1 text-gray-900">{request.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Building className="inline h-4 w-4 mr-1" />
                    Fornecedor
                  </label>
                  <p className="mt-1 text-gray-900">{request.supplierName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    Valor Total
                  </label>
                  <p className="mt-1 text-xl font-bold text-green-600">
                    {formatCurrency(request.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Data da Solicitação
                  </label>
                  <p className="mt-1 text-gray-900">{formatDate(request.requestDate)}</p>
                </div>
                {request.dueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Prazo
                    </label>
                    <p className={`mt-1 ${request.dueDate < new Date() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {formatDate(request.dueDate)}
                      {request.dueDate < new Date() && ' (Vencido)'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <User className="inline h-4 w-4 mr-1" />
                  Criado por
                </label>
                <p className="mt-1 text-gray-900">{request.createdBy}</p>
                <p className="text-sm text-gray-500">
                  em {formatDate(request.createdAt)}
                </p>
              </div>

              {request.publicComments && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <MessageSquare className="inline h-4 w-4 mr-1" />
                    Observações Públicas
                  </label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                    <p className="text-gray-900">{request.publicComments}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Items da Solicitação */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Itens da Solicitação</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qtd
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unit.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {request.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      Subtotal:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(request.subtotal)}
                    </td>
                  </tr>
                  {request.tax > 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Impostos:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(request.tax)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                      Total Geral:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-green-600">
                      {formatCurrency(request.totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Histórico de Aprovações */}
          {request.approvals.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Aprovações</h3>
              <div className="space-y-4">
                {request.approvals.map((approval) => (
                  <div key={approval.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {approval.userName} ({approval.userRole.replace('_', ' ')})
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(approval.date)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        approval.action === 'APROVAR' 
                          ? 'bg-green-100 text-green-800'
                          : approval.action === 'REJEITAR'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {approval.action}
                      </span>
                    </div>
                    {approval.comments && (
                      <p className="mt-2 text-sm text-gray-700">{approval.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ações */}
          <ActionButtons request={request} />

          {/* Informações do Contrato */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Status do Contrato</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Possui Contrato:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  request.hasValidContract 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.hasValidContract ? 'Sim' : 'Não'}
                </span>
              </div>
              {request.contractNumber && (
                <div>
                  <span className="text-sm text-gray-600">Número:</span>
                  <p className="text-sm font-medium text-gray-900">{request.contractNumber}</p>
                </div>
              )}
              {request.contractExpiryDate && (
                <div>
                  <span className="text-sm text-gray-600">Vencimento:</span>
                  <p className={`text-sm font-medium ${
                    request.contractExpiryDate < new Date() ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {formatDate(request.contractExpiryDate)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Documentos */}
          {request.documents.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Documentos</h3>
              <div className="space-y-2">
                {request.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{document.name}</p>
                        <p className="text-xs text-gray-500">
                          {document.type} • {(document.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Estatísticas Rápidas */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última atualização:</span>
                <span className="text-sm text-gray-900">
                  {formatDate(request.updatedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Modificado por:</span>
                <span className="text-sm text-gray-900">{request.lastModifiedBy}</span>
              </div>
              {request.currentApprover && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aguardando:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {request.currentApprover}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
