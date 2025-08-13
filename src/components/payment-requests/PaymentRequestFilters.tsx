'use client';

import { useState } from 'react';
import { usePaymentRequests } from '@/contexts/PaymentRequestsContext';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PaymentRequestStatus, PaymentRequestPriority } from '@/types/paymentRequest';
import { 
  Search, 
  Filter, 
  X,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export default function PaymentRequestFilters() {
  const { filters, setFilters, clearFilters, filteredRequests } = usePaymentRequests();
  const { suppliers } = useSuppliers();
  const [isExpanded, setIsExpanded] = useState(false);

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

  const priorityOptions: { value: PaymentRequestPriority; label: string; color: string }[] = [
    { value: 'BAIXA', label: 'Baixa', color: 'bg-blue-100 text-blue-800' },
    { value: 'NORMAL', label: 'Normal', color: 'bg-gray-100 text-gray-800' },
    { value: 'ALTA', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENTE', label: 'Urgente', color: 'bg-red-100 text-red-800' }
  ];

  const updateFilters = (key: string, value: string | boolean | number | Date | undefined) => {
    setFilters({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  };

  const handleDateFromChange = (dateString: string) => {
    updateFilters('dateFrom', dateString ? new Date(dateString) : undefined);
  };

  const handleDateToChange = (dateString: string) => {
    updateFilters('dateTo', dateString ? new Date(dateString) : undefined);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <Card className="p-6 mb-6">
      {/* Barra de busca sempre visível */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por título, fornecedor ou descrição..."
            value={filters.search || ''}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {filters.search && (
            <button
              onClick={() => updateFilters('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button
          variant={isExpanded ? 'primary' : 'secondary'}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 relative"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-4 space-y-6">
          {/* Linha 1: Status e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilters('status', e.target.value as PaymentRequestStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) => updateFilters('priority', e.target.value as PaymentRequestPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as prioridades</option>
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor
              </label>
              <select
                value={filters.supplierId || ''}
                onChange={(e) => updateFilters('supplierId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os fornecedores</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Linha 2: Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data inicial
              </label>
              <input
                type="date"
                value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data final
              </label>
              <input
                type="date"
                value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateToChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contrato Válido
              </label>
              <select
                value={filters.hasValidContract === undefined ? '' : filters.hasValidContract.toString()}
                onChange={(e) => updateFilters('hasValidContract', 
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Com contrato válido</option>
                <option value="false">Sem contrato válido</option>
              </select>
            </div>
          </div>

          {/* Linha 3: Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor mínimo (AOA)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.amountMin || ''}
                onChange={(e) => updateFilters('amountMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor máximo (AOA)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.amountMax || ''}
                onChange={(e) => updateFilters('amountMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredRequests.length} solicitação(ões) encontrada(s)
            </div>
            
            <div className="flex gap-3">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setIsExpanded(false)}
              >
                Fechar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros ativos resumidos */}
      {hasActiveFilters && !isExpanded && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
              <button
                onClick={() => updateFilters('status', undefined)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.priority && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Prioridade: {priorityOptions.find(p => p.value === filters.priority)?.label}
              <button
                onClick={() => updateFilters('priority', undefined)}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.supplierId && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Fornecedor: {suppliers.find(s => s.id === filters.supplierId)?.companyName}
              <button
                onClick={() => updateFilters('supplierId', undefined)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(filters.dateFrom || filters.dateTo) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <Calendar className="h-3 w-3 mr-1" />
              Período: {filters.dateFrom?.toLocaleDateString('pt-AO')} - {filters.dateTo?.toLocaleDateString('pt-AO')}
              <button
                onClick={() => {
                  updateFilters('dateFrom', undefined);
                  updateFilters('dateTo', undefined);
                }}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(filters.amountMin || filters.amountMax) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <DollarSign className="h-3 w-3 mr-1" />
              Valor: {filters.amountMin && `Min: ${filters.amountMin.toLocaleString('pt-AO')}`}
              {filters.amountMin && filters.amountMax && ' - '}
              {filters.amountMax && `Max: ${filters.amountMax.toLocaleString('pt-AO')}`}
              <button
                onClick={() => {
                  updateFilters('amountMin', undefined);
                  updateFilters('amountMax', undefined);
                }}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.hasValidContract !== undefined && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {filters.hasValidContract ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Com contrato válido
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Sem contrato válido
                </>
              )}
              <button
                onClick={() => updateFilters('hasValidContract', undefined)}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
