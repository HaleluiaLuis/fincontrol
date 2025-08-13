'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayments } from '@/contexts/PaymentsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ArrowLeft,
  Save,
  Calendar,
  DollarSign,
  Building,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { CreatePaymentData, PaymentMethod } from '@/types/payment';

const NewPaymentPage = () => {
  const router = useRouter();
  const { createPayment, bankAccounts, loading } = usePayments();
  const { user } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>({
    type: 'FORNECEDOR',
    paymentMethod: 'TRANSFERENCIA_BANCARIA',
    currency: 'AOA',
    priority: 'NORMAL',
    dueDate: '',
    sourceAccountId: '',
    beneficiaryBankData: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      accountType: 'CORRENTE',
      currency: 'AOA'
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'TRANSFERENCIA_BANCARIA', label: 'Transferência Bancária' },
    { value: 'TED', label: 'TED' },
    { value: 'PIX', label: 'PIX' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'DINHEIRO', label: 'Dinheiro' }
  ];

  const currencies = [
    { value: 'AOA', label: 'Kwanza (AOA)' },
    { value: 'USD', label: 'Dólar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ];

  const priorities = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'URGENTE', label: 'Urgente' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Valor é obrigatório e deve ser maior que zero';
    }

    if (!formData.beneficiaryBankData?.accountName?.trim()) {
      newErrors['beneficiaryBankData.accountName'] = 'Nome do beneficiário é obrigatório';
    }

    if (!formData.beneficiaryBankData?.bankName?.trim()) {
      newErrors['beneficiaryBankData.bankName'] = 'Nome do banco é obrigatório';
    }

    if (!formData.beneficiaryBankData?.accountNumber?.trim()) {
      newErrors['beneficiaryBankData.accountNumber'] = 'Número da conta é obrigatório';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }

    if (!formData.sourceAccountId?.trim()) {
      newErrors.sourceAccountId = 'Conta de origem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    setSubmitting(true);
    try {
      const paymentData: CreatePaymentData = {
        amount: formData.amount!,
        currency: formData.currency!,
        paymentMethod: formData.paymentMethod!,
        type: formData.type!,
        priority: formData.priority!,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        description: formData.description,
        sourceAccountId: formData.sourceAccountId!,
        beneficiaryBankData: formData.beneficiaryBankData!
      };

      const newPayment = await createPayment(paymentData);
      router.push(`/pagamentos/${newPayment.id}`);
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      setErrors({ submit: 'Erro ao criar pagamento. Tente novamente.' });
    } finally {
      setSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }

    // Limpar erro quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const amount = Number(value) / 100;
    handleInputChange('amount', amount);
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
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/pagamentos">
          <Button variant="secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Pagamento</h1>
          <p className="text-gray-600">Criar um novo pagamento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Erro geral */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700">{errors.submit}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Informações Básicas
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor *
                </label>
                <Input
                  type="text"
                  value={formData.amount ? (formData.amount * 100).toFixed(0).slice(0, -2) + ',' + (formData.amount * 100).toFixed(0).slice(-2) : ''}
                  onChange={handleAmountChange}
                  placeholder="0,00"
                  className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moeda *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de Pagamento *
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {paymentMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descrição do pagamento..."
                />
              </div>
            </div>
          </Card>

          {/* Dados do Beneficiário */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Dados do Beneficiário
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome/Razão Social *
                </label>
                <Input
                  type="text"
                  value={formData.beneficiaryBankData?.accountName || ''}
                  onChange={(e) => handleInputChange('beneficiaryBankData.accountName', e.target.value)}
                  placeholder="Nome do beneficiário"
                  className={errors['beneficiaryBankData.accountName'] ? 'border-red-500' : ''}
                />
                {errors['beneficiaryBankData.accountName'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['beneficiaryBankData.accountName']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banco *
                </label>
                <Input
                  type="text"
                  value={formData.beneficiaryBankData?.bankName || ''}
                  onChange={(e) => handleInputChange('beneficiaryBankData.bankName', e.target.value)}
                  placeholder="Nome do banco"
                  className={errors['beneficiaryBankData.bankName'] ? 'border-red-500' : ''}
                />
                {errors['beneficiaryBankData.bankName'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['beneficiaryBankData.bankName']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número da Conta *
                </label>
                <Input
                  type="text"
                  value={formData.beneficiaryBankData?.accountNumber || ''}
                  onChange={(e) => handleInputChange('beneficiaryBankData.accountNumber', e.target.value)}
                  placeholder="000000-0"
                  className={errors['beneficiaryBankData.accountNumber'] ? 'border-red-500' : ''}
                />
                {errors['beneficiaryBankData.accountNumber'] && (
                  <p className="text-red-500 text-xs mt-1">{errors['beneficiaryBankData.accountNumber']}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Conta *
                </label>
                <select
                  value={formData.beneficiaryBankData?.accountType || 'CORRENTE'}
                  onChange={(e) => handleInputChange('beneficiaryBankData.accountType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CORRENTE">Conta Corrente</option>
                  <option value="POUPANCA">Poupança</option>
                  <option value="SALARIO">Conta Salário</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IBAN (Opcional)
                </label>
                <Input
                  type="text"
                  value={formData.beneficiaryBankData?.iban || ''}
                  onChange={(e) => handleInputChange('beneficiaryBankData.iban', e.target.value)}
                  placeholder="AO06 0000 0000 0000 0000 0000 0"
                />
              </div>
            </div>
          </Card>

          {/* Datas e Conta */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Datas e Conta de Origem
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento *
                </label>
                <Input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className={errors.dueDate ? 'border-red-500' : ''}
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Agendada (Opcional)
                </label>
                <Input
                  type="date"
                  value={formData.scheduledDate ? formData.scheduledDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conta de Origem *
                </label>
                <select
                  value={formData.sourceAccountId || ''}
                  onChange={(e) => handleInputChange('sourceAccountId', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.sourceAccountId ? 'border-red-500' : ''}`}
                >
                  <option value="">Selecione uma conta</option>
                  {bankAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.bankName} - {account.accountNumber} ({account.currency})
                    </option>
                  ))}
                </select>
                {errors.sourceAccountId && (
                  <p className="text-red-500 text-xs mt-1">{errors.sourceAccountId}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Ações */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-end space-x-4">
                <Link href="/pagamentos">
                  <Button variant="secondary" disabled={submitting}>
                    Cancelar
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {submitting ? 'Salvando...' : 'Salvar Pagamento'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPaymentPage;
