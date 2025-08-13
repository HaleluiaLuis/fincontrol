'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePaymentRequests } from '@/contexts/PaymentRequestsContext';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PaymentRequestPriority } from '@/types/paymentRequest';
import { PaymentRequestItem } from '@/types/paymentRequest';
import { 
  Plus, 
  Trash2, 
  ArrowLeft,
  FileText,
  DollarSign,
  AlertCircle,
  Save,
  Send
} from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  title: string;
  description: string;
  supplierId: string;
  items: Omit<PaymentRequestItem, 'id'>[];
  priority: PaymentRequestPriority;
  dueDate: string;
  publicComments: string;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  supplierId: '',
  items: [
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      category: ''
    }
  ],
  priority: 'NORMAL',
  dueDate: '',
  publicComments: ''
};

export default function NovaSolicitacaoPage() {
  const router = useRouter();
  const { createPaymentRequest, loading } = usePaymentRequests();
  const { suppliers, loading: suppliersLoading } = useSuppliers();
  
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Calcular totais quando items mudarem
  useEffect(() => {
    const updatedItems = formData.items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));
    
    if (JSON.stringify(updatedItems) !== JSON.stringify(formData.items)) {
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  }, [formData.items]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.supplierId) {
      newErrors.supplierId = 'Fornecedor é obrigatório';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Pelo menos um item é necessário';
    }

    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Descrição do item é obrigatória';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantidade deve ser maior que 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Preço unitário deve ser maior que 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | PaymentRequestPriority) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (index: number, field: keyof Omit<PaymentRequestItem, 'id'>, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalcular total automaticamente
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
    
    // Limpar erro do item se houver
    const errorKey = `item_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        category: ''
      }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (asDraft = false) => {
    if (!asDraft && !validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setSubmitting(true);
    
    try {
      const requestData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined
      };

      await createPaymentRequest(requestData);
      
      toast.success(asDraft ? 'Rascunho salvo com sucesso!' : 'Solicitação criada com sucesso!');
      router.push('/solicitacoes?success=nova-solicitacao');
      
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      toast.error('Erro ao criar solicitação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalGeral = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  if (suppliersLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/solicitacoes')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Solicitação de Pagamento</h1>
          <p className="mt-2 text-gray-600">
            Crie uma nova solicitação de pagamento para seus fornecedores
          </p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Informações Básicas */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Informações Básicas</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Solicitação *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Material de Escritório - Janeiro 2025"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Descreva detalhadamente o que está sendo solicitado..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor *
              </label>
              <select
                value={formData.supplierId}
                onChange={(e) => handleInputChange('supplierId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.supplierId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um fornecedor</option>
                {suppliers.filter(s => s.status === 'ATIVO').map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.companyName} - {supplier.nif}
                  </option>
                ))}
              </select>
              {errors.supplierId && <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as PaymentRequestPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="BAIXA">Baixa</option>
                <option value="NORMAL">Normal</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações Públicas
              </label>
              <textarea
                value={formData.publicComments}
                onChange={(e) => handleInputChange('publicComments', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observações que serão visíveis para todos os envolvidos no processo..."
              />
            </div>
          </div>
        </Card>

        {/* Items da Solicitação */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Items da Solicitação</h2>
            </div>
            <Button type="button" onClick={addItem} variant="secondary" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-gray-900">Item {index + 1}</h3>
                  {formData.items.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`item_${index}_description`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Resma de papel A4"
                    />
                    {errors[`item_${index}_description`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_description`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`item_${index}_quantity`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preço Unitário (AOA) *
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`item_${index}_unitPrice`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item_${index}_unitPrice`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_unitPrice`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total (AOA)
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md font-medium text-gray-900">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>

                  <div className="md:col-span-2 lg:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Material de Escritório, Serviços TI, etc."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-semibold text-gray-900">Total Geral:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(totalGeral)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Ações */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.push('/solicitacoes')}
          >
            Cancelar
          </Button>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit(true)}
              disabled={submitting || loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {submitting ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting || loading}
            >
              <Send className="h-4 w-4 mr-2" />
              {submitting ? 'Criando...' : 'Criar Solicitação'}
            </Button>
          </div>
        </div>
      </form>

      {/* Informações Adicionais */}
      <Card className="mt-8 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <h3 className="font-medium mb-1">Informações sobre o processo:</h3>
            <ul className="space-y-1 text-blue-700">
              <li>• Sua solicitação será enviada para validação pelo Gabinete de Contratação</li>
              <li>• Após validação, seguirá para aprovação da Presidência</li>
              <li>• Você receberá notificações sobre mudanças de status</li>
              <li>• Rascunhos podem ser editados até serem enviados</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
