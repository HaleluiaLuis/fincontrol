'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePayments } from '@/contexts/PaymentsContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  AlertCircle,
  CreditCard,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import Link from 'next/link';

const PaymentDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { 
    getPayment, 
    deletePayment, 
    approvePayment, 
    rejectPayment,
    processPayment,
    cancelPayment,
    canUserApprovePayment,
    canUserProcessPayment,
    loading
  } = usePayments();

  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const paymentId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  if (!paymentId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ID do pagamento inválido</h1>
          <Link href="/pagamentos">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Pagamentos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const payment = getPayment(paymentId);

  const formatCurrency = (amount: number, currency: string = 'AOA') => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('pt-AO', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROCESSADO':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'FALHADO':
      case 'REJEITADO':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDENTE':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'AGENDADO':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'CANCELADO':
        return <PauseCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'PROCESSADO': 'bg-green-100 text-green-800',
      'FALHADO': 'bg-red-100 text-red-800',
      'REJEITADO': 'bg-red-100 text-red-800',
      'PENDENTE': 'bg-yellow-100 text-yellow-800',
      'AGENDADO': 'bg-blue-100 text-blue-800',
      'CANCELADO': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {getStatusIcon(status)}
        <span className="ml-2">{status}</span>
      </Badge>
    );
  };

  const handleApprove = async () => {
    if (!payment) return;
    
    setActionLoading(true);
    try {
      await approvePayment(payment.id);
      router.refresh();
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!payment || !rejectReason.trim()) return;
    
    setActionLoading(true);
    try {
      await rejectPayment(payment.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      router.refresh();
    } catch (error) {
      console.error('Erro ao rejeitar pagamento:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!payment) return;
    
    setActionLoading(true);
    try {
      await processPayment({
        paymentId: payment.id,
        processedDate: new Date()
      });
      router.refresh();
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!payment) return;
    
    const reason = prompt('Motivo do cancelamento:');
    if (!reason) return;
    
    setActionLoading(true);
    try {
      await cancelPayment(payment.id, reason);
      router.refresh();
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!payment) return;
    
    const confirm = window.confirm('Tem certeza que deseja excluir este pagamento?');
    if (!confirm) return;
    
    setActionLoading(true);
    try {
      await deletePayment(payment.id);
      router.push('/pagamentos');
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pagamento não encontrado</h1>
          <Link href="/pagamentos">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Pagamentos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/pagamentos">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {payment.paymentNumber}
            </h1>
            <p className="text-gray-600">Detalhes do pagamento</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusBadge(payment.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Informações do Pagamento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Valor</label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(payment.amount, payment.currency)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Método</label>
                <p className="text-lg font-medium">{payment.paymentMethod}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Vencimento</label>
                <p className="text-sm">{formatDate(payment.dueDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Processamento</label>
                <p className="text-sm">{formatDate(payment.processedDate)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-600">Descrição</label>
                <p className="text-sm">{payment.description || 'Nenhuma descrição'}</p>
              </div>
            </div>
          </Card>

          {/* Dados do Beneficiário */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Dados do Beneficiário
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nome/Razão Social</label>
                <p className="font-medium">{payment.beneficiaryBankData.accountName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Banco</label>
                <p className="text-sm">{payment.beneficiaryBankData.bankName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Conta</label>
                <p className="text-sm">{payment.beneficiaryBankData.accountNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo de Conta</label>
                <p className="text-sm">{payment.beneficiaryBankData.accountType}</p>
              </div>
              {payment.beneficiaryBankData.swiftCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">SWIFT</label>
                  <p className="text-sm">{payment.beneficiaryBankData.swiftCode}</p>
                </div>
              )}
              {payment.beneficiaryBankData.iban && (
                <div>
                  <label className="text-sm font-medium text-gray-600">IBAN</label>
                  <p className="text-sm">{payment.beneficiaryBankData.iban}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar de Ações */}
        <div className="space-y-6">
          {/* Ações do Pagamento */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Ações</h2>
            <div className="space-y-2">
              {payment.status === 'PENDENTE' && canUserApprovePayment(payment.id) && (
                <>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700" 
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Rejeitar
                  </Button>
                </>
              )}
              
              {payment.status === 'AGENDADO' && canUserProcessPayment(payment.id) && (
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={handleProcess}
                  disabled={actionLoading}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Processar
                </Button>
              )}
              
              {(payment.status === 'PENDENTE' || payment.status === 'AGENDADO') && (
                <Button 
                  variant="secondary" 
                  className="w-full" 
                  onClick={handleCancel}
                  disabled={actionLoading}
                >
                  <PauseCircle className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              )}
              
              <Link href={`/pagamentos/${payment.id}/editar`}>
                <Button variant="secondary" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
              
              <Button 
                variant="danger" 
                className="w-full" 
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </Card>

          {/* Informações Adicionais */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Informações</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Criado por</label>
                <p className="text-sm">{payment.createdBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Criação</label>
                <p className="text-sm">{formatDate(payment.createdAt)}</p>
              </div>
              {payment.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Aprovado por</label>
                  <p className="text-sm">{payment.approvedBy}</p>
                </div>
              )}
              {payment.externalReference && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Referência Externa</label>
                  <p className="text-sm font-mono">{payment.externalReference}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Rejeição */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Rejeitar Pagamento</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Motivo da rejeição
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Descreva o motivo da rejeição..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="secondary" 
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700" 
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
              >
                Rejeitar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsPage;
