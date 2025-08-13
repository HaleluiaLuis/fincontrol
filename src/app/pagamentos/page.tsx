'use client';

import React, { useState } from 'react';
import { usePayments } from '@/contexts/PaymentsContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  TrendingUp,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

const PaymentsPage = () => {
  const { 
    payments, 
    loading, 
    getStats
  } = usePayments();

  const [searchTerm, setSearchTerm] = useState('');
  const stats = getStats();

  // Função para filtrar pagamentos
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm || 
      payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.description && payment.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      payment.beneficiaryBankData.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }).slice(0, 10);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PROCESSADO':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FALHADO':
      case 'REJEITADO':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDENTE':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'AGENDADO':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
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
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

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
      month: 'short',
      day: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Pagamentos</h1>
          <p className="text-gray-600">Controle e execução de pagamentos</p>
        </div>
        <Link href="/pagamentos/novo">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Pagamento
          </Button>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pagamentos</p>
              <p className="text-2xl font-bold">{stats.totalPayments}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-green-600 flex items-center mt-2">
            <TrendingUp className="w-3 h-3 mr-1" />
            {formatCurrency(stats.totalAmount)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processados</p>
              <p className="text-2xl font-bold text-green-600">{stats.processedPayments}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">
            {formatCurrency(stats.processedAmount)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <p className="text-xs text-yellow-600 mt-2">
            {formatCurrency(stats.pendingAmount)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencidos</p>
              <p className="text-2xl font-bold text-red-600">{stats.overduePayments}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-xs text-red-600 mt-2">
            Requer atenção imediata
          </p>
        </Card>
      </div>

      {/* Pesquisa */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Pesquisar por número, beneficiário ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de Pagamentos */}
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Pagamentos Recentes</h2>
          <p className="text-gray-600">Últimos pagamentos registrados no sistema</p>
        </div>
        
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(payment.status)}
                </div>
                <div>
                  <Link 
                    href={`/pagamentos/${payment.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {payment.paymentNumber}
                  </Link>
                  <p className="text-sm text-gray-600">{payment.beneficiaryBankData.accountName}</p>
                  <p className="text-xs text-gray-500">{payment.description || 'Sem descrição'}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatCurrency(payment.amount, payment.currency)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatDate(payment.dueDate)}
                </div>
                <div className="mt-1">
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            </div>
          ))}
          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum pagamento encontrado
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentsPage;
