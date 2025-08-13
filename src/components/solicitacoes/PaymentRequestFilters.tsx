'use client';

import { useState } from 'react';
import { usePaymentRequests } from '@/contexts/PaymentRequestsContext';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { PaymentRequestFilters as FilterType, PaymentRequestStatus, PaymentRequestPriority } from '@/types/paymentRequest';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';

export function PaymentRequestFilters() {
  const { filters, setFilters, clearFilters } = usePaymentRequests();
  const { suppliers } = useSuppliers();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterType>(filters);

  const statusOptions: { value: PaymentRequestStatus; label: string; color: string }[] = [
    { value: 'RASCUNHO', label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
    { value: 'PENDENTE_VALIDACAO', label: 'Pendente Validação', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'EM_ANALISE', label: 'Em Análise', color: 'bg-blue-100 text-blue-800' },
    { value: 'VALIDADO', label: 'Validado', color: 'bg-purple-100 text-purple-800' },
    { value: 'AUTORIZADO', label: 'Autorizado', color: 'bg-green-100 text-green-800' },
    { value: 'REJEITADO', label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
    { value: 'CANCELADO', label: 'Cancelado', color: 'bg-gray-100 text-gray-800' },
    { value: 'PAGO', label: 'Pago', color: 'bg-green-100 text-green-800' }
  ];

  const priorityOptions: { value: PaymentRequestPriority; label: string }[] = [
    { value: 'BAIXA', label: 'Baixa' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'URGENTE', label: 'Urgente' }
  ];

  const handleInputChange = (key: keyof FilterType, value: string | number | Date | boolean | undefined) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    setIsExpanded(false);
  };

  const resetFilters = () => {
    setLocalFilters({});
    clearFilters();
    setIsExpanded(false);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof FilterType] !== undefined && filters[key as keyof FilterType] !== ''
  );

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const parseDate = (dateString: string) => {
    return dateString ? new Date(dateString) : undefined;
  };

  return (
    <Card className="mb-6">
      {/* Header dos Filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Busca Rápida */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por título, fornecedor ou descrição..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.search || ''}
                onChange={(e) => handleInputChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>

            {/* Status Rápido */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={localFilters.status || ''}
              onChange={(e) => handleInputChange('status', e.target.value as PaymentRequestStatus || undefined)}
            >
              <option value="">Todos os Status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <span className="text-sm text-gray-600">
                {Object.keys(filters).length} filtro(s) ativo(s)
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isExpanded ? 'Menos Filtros' : 'Mais Filtros'}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="inline-flex items-center text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros Expandidos */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Prioridade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.priority || ''}
                onChange={(e) => handleInputChange('priority', e.target.value as PaymentRequestPriority || undefined)}
              >
                <option value="">Todas as Prioridades</option>
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fornecedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.supplierId || ''}
                onChange={(e) => handleInputChange('supplierId', e.target.value || undefined)}
              >
                <option value="">Todos os Fornecedores</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Contrato Válido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status do Contrato
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.hasValidContract !== undefined ? localFilters.hasValidContract.toString() : ''}
                onChange={(e) => handleInputChange('hasValidContract', e.target.value === '' ? undefined : e.target.value === 'true')}
              >
                <option value="">Todos os Contratos</option>
                <option value="true">Com Contrato Válido</option>
                <option value="false">Sem Contrato Válido</option>
              </select>
            </div>
          </div>

          {/* Filtros de Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data Início
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.dateFrom ? formatDate(localFilters.dateFrom) : ''}
                onChange={(e) => handleInputChange('dateFrom', parseDate(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data Fim
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.dateTo ? formatDate(localFilters.dateTo) : ''}
                onChange={(e) => handleInputChange('dateTo', parseDate(e.target.value))}
              />
            </div>
          </div>

          {/* Filtros de Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Valor Mínimo (AOA)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.amountMin || ''}
                onChange={(e) => handleInputChange('amountMin', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Valor Máximo (AOA)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={localFilters.amountMax || ''}
                onChange={(e) => handleInputChange('amountMax', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Sem limite"
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Use os filtros acima para refinar sua busca
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsExpanded(false)}
              >
                Fechar
              </Button>
              <Button onClick={applyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tags de Filtros Ativos */}
      {hasActiveFilters && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600">Filtros ativos:</span>
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Busca: &quot;{filters.search}&quot;
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters.search;
                    setFilters(newFilters);
                    setLocalFilters(newFilters);
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters.status;
                    setFilters(newFilters);
                    setLocalFilters(newFilters);
                  }}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.priority && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Prioridade: {filters.priority}
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters.priority;
                    setFilters(newFilters);
                    setLocalFilters(newFilters);
                  }}
                  className="ml-1 text-orange-600 hover:text-orange-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters.supplierId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Fornecedor: {suppliers.find(s => s.id === filters.supplierId)?.companyName}
                <button
                  onClick={() => {
                    const newFilters = { ...filters };
                    delete newFilters.supplierId;
                    setFilters(newFilters);
                    setLocalFilters(newFilters);
                  }}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
