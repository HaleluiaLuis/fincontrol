'use client';

import { useSuppliers } from '@/contexts/SuppliersContext';
import { Supplier } from '@/types/supplier';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import Link from 'next/link';

interface SupplierListProps {
  onEdit?: (supplier: Supplier) => void;
}

export function SupplierList({ onEdit }: SupplierListProps) {
  const { filteredSuppliers, loading, deleteSupplier } = useSuppliers();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (supplier: Supplier) => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor "${supplier.companyName}"?`)) {
      try {
        setDeletingId(supplier.id);
        await deleteSupplier(supplier.id);
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        alert('Erro ao excluir fornecedor. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVO':
        return 'bg-green-100 text-green-800';
      case 'INATIVO':
        return 'bg-gray-100 text-gray-800';
      case 'PENDENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENSO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SERVICOS':
        return 'bg-blue-100 text-blue-800';
      case 'PRODUTOS':
        return 'bg-purple-100 text-purple-800';
      case 'MISTO':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(value);
  };

  const getTotalContractValue = (supplier: Supplier) => {
    return supplier.contracts
      .filter(c => c.status === 'VIGENTE')
      .reduce((sum, contract) => sum + contract.value, 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredSuppliers.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum fornecedor encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar os filtros ou cadastre um novo fornecedor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="divide-y divide-gray-200">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {supplier.companyName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                        {supplier.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(supplier.category)}`}>
                        {supplier.category}
                      </span>
                    </div>
                    {supplier.tradeName && (
                      <p className="text-sm text-gray-600">
                        Nome Fantasia: {supplier.tradeName}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      NIF: {supplier.nif}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {/* Contato */}
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.address.city}, {supplier.address.province}
                  </div>
                </div>

                {/* Informações adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Contratos Ativos:</span>
                    <span className="ml-2 text-gray-900">
                      {supplier.contracts.filter(c => c.status === 'VIGENTE').length}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Valor Total:</span>
                    <span className="ml-2 text-gray-900">
                      {formatCurrency(getTotalContractValue(supplier))}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Última Atualização:</span>
                    <span className="ml-2 text-gray-900">
                      {supplier.updatedAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  href={`/fornecedores/${supplier.id}`}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <EyeIcon className="h-4 w-4" />
                </Link>
                
                <button
                  onClick={() => onEdit?.(supplier)}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(supplier)}
                  disabled={deletingId === supplier.id}
                  className="inline-flex items-center p-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {supplier.observations && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Observações:</span> {supplier.observations}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
