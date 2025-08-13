'use client';

import { useState } from 'react';
import { useSuppliers } from '@/contexts/SuppliersContext';
import { SupplierFilters as ISupplierFilters } from '@/types/supplier';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function SupplierFilters() {
  const { filters, setFilters, clearFilters } = useSuppliers();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof ISupplierFilters, value: string) => {
    if (value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      {/* Busca principal */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, NIF, email..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
        >
          <FunnelIcon className="h-5 w-5" />
          Filtros
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
              {Object.keys(filters).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <XMarkIcon className="h-5 w-5" />
            Limpar
          </button>
        )}
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              <option value="SERVICOS">Serviços</option>
              <option value="PRODUTOS">Produtos</option>
              <option value="MISTO">Misto</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="PENDENTE">Pendente</option>
              <option value="SUSPENSO">Suspenso</option>
            </select>
          </div>

          {/* Província */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Província
            </label>
            <select
              value={filters.province || ''}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas</option>
              <option value="Luanda">Luanda</option>
              <option value="Benguela">Benguela</option>
              <option value="Huambo">Huambo</option>
              <option value="Huíla">Huíla</option>
              <option value="Cabinda">Cabinda</option>
              <option value="Malanje">Malanje</option>
              <option value="Lunda Norte">Lunda Norte</option>
              <option value="Lunda Sul">Lunda Sul</option>
              <option value="Moxico">Moxico</option>
              <option value="Cuando Cubango">Cuando Cubango</option>
              <option value="Cunene">Cunene</option>
              <option value="Namibe">Namibe</option>
              <option value="Uíge">Uíge</option>
              <option value="Zaire">Zaire</option>
              <option value="Bengo">Bengo</option>
              <option value="Bié">Bié</option>
              <option value="Cuanza Norte">Cuanza Norte</option>
              <option value="Cuanza Sul">Cuanza Sul</option>
            </select>
          </div>

          {/* Status do Contrato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contrato
            </label>
            <select
              value={filters.contractStatus || ''}
              onChange={(e) => handleFilterChange('contractStatus', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="VIGENTE">Vigente</option>
              <option value="VENCIDO">Vencido</option>
              <option value="SUSPENSO">Suspenso</option>
              <option value="RESCINDIDO">Rescindido</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
