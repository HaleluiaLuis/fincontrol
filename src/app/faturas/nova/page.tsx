'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoices } from '@/contexts/InvoicesContext';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InvoiceType, PaymentTerm, InvoiceItem, CreateInvoiceData } from '@/types/invoice';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  AlertTriangle,
  Calculator,
  Save,
  Send
} from 'lucide-react';

interface FormData {
  supplierInvoiceNumber: string;
  type: InvoiceType;
  paymentTerm: PaymentTerm;
  customPaymentDays?: number;
  description: string;
  publicNotes: string;
  issueDate: string;
  dueDate: string;
  supplierId: string;
  contractId?: string;
  contractNumber?: string;
  paymentRequestId?: string;
  items: InvoiceItem[];
}

interface ItemFormData {
  description: string;
  category: string;
  quantity: string;
  unitPrice: string;
  discountPercent: string;
  taxPercent: string;
}

const initialFormData: FormData = {
  supplierInvoiceNumber: '',
  type: 'SERVICO',
  paymentTerm: '30_DIAS',
  description: '',
  publicNotes: '',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  supplierId: '',
  items: []
};

const initialItemData: ItemFormData = {
  description: '',
  category: '',
  quantity: '1',
  unitPrice: '0',
  discountPercent: '0',
  taxPercent: '0'
};

export default function NovaFaturaPage() {
  const router = useRouter();
  const { createInvoice } = useInvoices();
  const { suppliers } = useSuppliers();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [itemFormData, setItemFormData] = useState<ItemFormData>(initialItemData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  // Calcular data de vencimento automaticamente
  useEffect(() => {
    if (formData.issueDate && formData.paymentTerm !== 'PERSONALIZADO') {
      const issueDate = new Date(formData.issueDate);
      let daysToAdd = 0;
      
      switch (formData.paymentTerm) {
        case 'A_VISTA':
          daysToAdd = 0;
          break;
        case '30_DIAS':
          daysToAdd = 30;
          break;
        case '45_DIAS':
          daysToAdd = 45;
          break;
        case '60_DIAS':
          daysToAdd = 60;
          break;
        case '90_DIAS':
          daysToAdd = 90;
          break;
      }
      
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + daysToAdd);
      
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.issueDate, formData.paymentTerm]);

  // Usar dias personalizados quando aplicável
  useEffect(() => {
    if (formData.paymentTerm === 'PERSONALIZADO' && formData.customPaymentDays && formData.issueDate) {
      const issueDate = new Date(formData.issueDate);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + formData.customPaymentDays);
      
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.customPaymentDays, formData.paymentTerm, formData.issueDate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierId) newErrors.supplier = 'Selecione um fornecedor';
    if (!formData.supplierInvoiceNumber.trim()) newErrors.supplierInvoiceNumber = 'Número da fatura do fornecedor é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.issueDate) newErrors.issueDate = 'Data de emissão é obrigatória';
    if (!formData.dueDate) newErrors.dueDate = 'Data de vencimento é obrigatória';
    if (formData.items.length === 0) newErrors.items = 'Adicione pelo menos um item';
    
    if (formData.paymentTerm === 'PERSONALIZADO' && (!formData.customPaymentDays || formData.customPaymentDays < 1)) {
      newErrors.customPaymentDays = 'Dias para pagamento personalizado deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateItemTotals = (item: ItemFormData): { totalPrice: number, finalAmount: number, discountAmount: number, taxAmount: number } => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const discountPercent = parseFloat(item.discountPercent) || 0;
    const taxPercent = parseFloat(item.taxPercent) || 0;

    const totalPrice = quantity * unitPrice;
    const discountAmount = totalPrice * (discountPercent / 100);
    const afterDiscount = totalPrice - discountAmount;
    const taxAmount = afterDiscount * (taxPercent / 100);
    const finalAmount = afterDiscount + taxAmount;

    return { totalPrice, finalAmount, discountAmount, taxAmount };
  };

  const addItem = () => {
    const itemErrors: Record<string, string> = {};

    if (!itemFormData.description.trim()) itemErrors.description = 'Descrição é obrigatória';
    if (!itemFormData.category.trim()) itemErrors.category = 'Categoria é obrigatória';
    if (!itemFormData.quantity || parseFloat(itemFormData.quantity) <= 0) itemErrors.quantity = 'Quantidade deve ser maior que 0';
    if (!itemFormData.unitPrice || parseFloat(itemFormData.unitPrice) <= 0) itemErrors.unitPrice = 'Preço unitário deve ser maior que 0';

    if (Object.keys(itemErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...itemErrors }));
      return;
    }

    const { totalPrice, finalAmount, discountAmount, taxAmount } = calculateItemTotals(itemFormData);

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: itemFormData.description,
      category: itemFormData.category,
      quantity: parseFloat(itemFormData.quantity),
      unitPrice: parseFloat(itemFormData.unitPrice),
      totalPrice,
      discountPercent: parseFloat(itemFormData.discountPercent) || undefined,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      taxPercent: parseFloat(itemFormData.taxPercent) || undefined,
      taxAmount: taxAmount > 0 ? taxAmount : undefined,
      finalAmount
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setItemFormData(initialItemData);
    setShowItemForm(false);
    
    // Limpar erros relacionados a itens
    setErrors(prevErrors => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { description, category, quantity, unitPrice, ...restErrors } = prevErrors;
      return restErrors;
    });
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalDiscount = formData.items.reduce((sum, item) => sum + (item.discountAmount || 0), 0);
    const totalTax = formData.items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
    const totalAmount = formData.items.reduce((sum, item) => sum + item.finalAmount, 0);

    return { subtotal, totalDiscount, totalTax, totalAmount };
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { subtotal, totalDiscount, totalTax, totalAmount } = calculateTotals();

      const invoiceData: CreateInvoiceData = {
        supplierInvoiceNumber: formData.supplierInvoiceNumber,
        type: formData.type,
        paymentTerm: formData.paymentTerm,
        customPaymentDays: formData.paymentTerm === 'PERSONALIZADO' ? formData.customPaymentDays : undefined,
        description: formData.description,
        publicNotes: formData.publicNotes || undefined,
        issueDate: new Date(formData.issueDate),
        dueDate: new Date(formData.dueDate),
        supplierId: formData.supplierId,
        paymentRequestId: formData.paymentRequestId,
        items: formData.items.map(item => ({
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          discountPercent: item.discountPercent,
          discountAmount: item.discountAmount,
          taxPercent: item.taxPercent,
          taxAmount: item.taxAmount,
          finalAmount: item.finalAmount
        }))
      };

      // TODO: Implementar lógica para rascunho vs enviada
      // O status será definido no contexto baseado no parâmetro isDraft
      console.log('Creating invoice as draft:', isDraft);

      const invoice = await createInvoice(invoiceData);
      router.push(`/faturas/${invoice.id}`);
    } catch (error) {
      console.error('Erro ao criar fatura:', error);
      setErrors({ submit: 'Erro ao criar fatura. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(amount);
  };

  const { subtotal, totalDiscount, totalTax, totalAmount } = calculateTotals();

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
            <h1 className="text-3xl font-bold text-gray-900">Nova Fatura</h1>
            <p className="mt-2 text-gray-600">
              Registrar nova fatura para processamento
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dados Básicos */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados Básicos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fornecedor *
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))}
                    className={`w-full p-3 border rounded-lg ${errors.supplier ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Selecione um fornecedor</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.companyName}
                      </option>
                    ))}
                  </select>
                  {errors.supplier && (
                    <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número da Fatura (Fornecedor) *
                  </label>
                  <input
                    type="text"
                    value={formData.supplierInvoiceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, supplierInvoiceNumber: e.target.value }))}
                    className={`w-full p-3 border rounded-lg ${errors.supplierInvoiceNumber ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Ex: INV-2025-001"
                  />
                  {errors.supplierInvoiceNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.supplierInvoiceNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Fatura
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as InvoiceType }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="SERVICO">Serviço</option>
                    <option value="PRODUTO">Produto</option>
                    <option value="MISTO">Misto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Pagamento
                  </label>
                  <select
                    value={formData.paymentTerm}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentTerm: e.target.value as PaymentTerm }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="A_VISTA">À Vista</option>
                    <option value="30_DIAS">30 Dias</option>
                    <option value="45_DIAS">45 Dias</option>
                    <option value="60_DIAS">60 Dias</option>
                    <option value="90_DIAS">90 Dias</option>
                    <option value="PERSONALIZADO">Personalizado</option>
                  </select>
                </div>

                {formData.paymentTerm === 'PERSONALIZADO' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dias para Pagamento *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.customPaymentDays || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, customPaymentDays: parseInt(e.target.value) }))}
                      className={`w-full p-3 border rounded-lg ${errors.customPaymentDays ? 'border-red-300' : 'border-gray-300'}`}
                    />
                    {errors.customPaymentDays && (
                      <p className="mt-1 text-sm text-red-600">{errors.customPaymentDays}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Emissão *
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                    className={`w-full p-3 border rounded-lg ${errors.issueDate ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.issueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.issueDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Vencimento *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className={`w-full p-3 border rounded-lg ${errors.dueDate ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Contrato (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.contractNumber || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Ex: CONT-2025-001"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={`w-full p-3 border rounded-lg ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Descreva o serviço ou produto fornecido..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações Públicas
                </label>
                <textarea
                  value={formData.publicNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicNotes: e.target.value }))}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Observações visíveis a todos os usuários..."
                />
              </div>
            </Card>

            {/* Itens da Fatura */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Itens da Fatura</h2>
                <Button
                  type="button"
                  onClick={() => setShowItemForm(true)}
                  disabled={showItemForm}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {errors.items && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.items}</p>
                </div>
              )}

              {/* Formulário de novo item */}
              {showItemForm && (
                <Card className="p-4 mb-6 bg-blue-50 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Novo Item</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição *
                      </label>
                      <input
                        type="text"
                        value={itemFormData.description}
                        onChange={(e) => setItemFormData(prev => ({ ...prev, description: e.target.value }))}
                        className={`w-full p-3 border rounded-lg ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Descrição do item..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoria *
                      </label>
                      <input
                        type="text"
                        value={itemFormData.category}
                        onChange={(e) => setItemFormData(prev => ({ ...prev, category: e.target.value }))}
                        className={`w-full p-3 border rounded-lg ${errors.category ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="Ex: Serviços TI"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade *
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={itemFormData.quantity}
                        onChange={(e) => setItemFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        className={`w-full p-3 border rounded-lg ${errors.quantity ? 'border-red-300' : 'border-gray-300'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço Unitário (AOA) *
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={itemFormData.unitPrice}
                        onChange={(e) => setItemFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                        className={`w-full p-3 border rounded-lg ${errors.unitPrice ? 'border-red-300' : 'border-gray-300'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Desconto (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={itemFormData.discountPercent}
                        onChange={(e) => setItemFormData(prev => ({ ...prev, discountPercent: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taxa/Imposto (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={itemFormData.taxPercent}
                        onChange={(e) => setItemFormData(prev => ({ ...prev, taxPercent: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Preview do cálculo */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Preview: {formatCurrency(calculateItemTotals(itemFormData).finalAmount)}
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <Button type="button" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => {
                        setShowItemForm(false);
                        setItemFormData(initialItemData);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Card>
              )}

              {/* Lista de itens */}
              {formData.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.description}</p>
                              <p className="text-sm text-gray-500">{item.category}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {formatCurrency(item.finalAmount)}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo Financeiro */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Resumo Financeiro
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {totalDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Desconto:</span>
                    <span className="text-sm font-medium text-red-600">-{formatCurrency(totalDiscount)}</span>
                  </div>
                )}
                
                {totalTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxas/Impostos:</span>
                    <span className="text-sm font-medium text-blue-600">+{formatCurrency(totalTax)}</span>
                  </div>
                )}
                
                <hr className="my-3" />
                
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </Card>

            {/* Ações */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
              
              <div className="space-y-3">
                <Button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={loading || formData.items.length === 0}
                  className="w-full"
                  variant="secondary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar como Rascunho'}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={loading || formData.items.length === 0}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? 'Enviando...' : 'Enviar Fatura'}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Anexar Documentos
                </Button>
              </div>

              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {errors.submit}
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
