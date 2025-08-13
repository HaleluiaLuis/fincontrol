'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SuppliersProvider, useSuppliers } from '@/contexts/SuppliersContext';
import { SupplierFilters } from '@/components/suppliers/SupplierFilters';
import { SupplierList } from '@/components/suppliers/SupplierList';
import { SuccessNotification } from '@/components/suppliers/SuccessNotification';
import { Supplier } from '@/types/supplier';
import { PlusIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Suspense } from 'react';

function SupplierStats() {
  const { getStats } = useSuppliers();
  const stats = getStats();

  const statCards = [
    {
      title: 'Total de Fornecedores',
      value: stats.total,
      icon: ChartBarIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Fornecedores Ativos',
      value: stats.active,
      icon: ChartBarIcon,
      color: 'text-green-600'
    },
    {
      title: 'Aguardando Aprovação',
      value: stats.pending,
      icon: ChartBarIcon,
      color: 'text-yellow-600'
    },
    {
      title: 'Contratos Expirando',
      value: stats.contractsExpiringSoon,
      icon: DocumentTextIcon,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.title}
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stat.value}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SupplierPageContent() {
  const { filteredSuppliers } = useSuppliers();

  const handleEditSupplier = (supplier: Supplier) => {
    console.log('Edit supplier:', supplier);
    // TODO: Abrir modal de edição ou navegar para página de edição
  };

  return (
    <div className="space-y-6">
      {/* Notificação de sucesso */}
      <Suspense fallback={null}>
        <SuccessNotification />
      </Suspense>

      {/* Estatísticas */}
      <SupplierStats />

      {/* Filtros */}
      <SupplierFilters />

      {/* Header da lista */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Fornecedores ({filteredSuppliers.length})
          </h2>
          <p className="text-sm text-gray-500">
            Gerencie todos os fornecedores da instituição
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Exportar
          </button>
          
          <Link
            href="/fornecedores/novo"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Link>
        </div>
      </div>

      {/* Lista de fornecedores */}
      <SupplierList onEdit={handleEditSupplier} />
    </div>
  );
}

export default function FornecedoresPage() {
  return (
    <ProtectedRoute requiredPermissions={['suppliers.read']}>
      <SuppliersProvider>
        <MainLayout
          title="Fornecedores"
          subtitle="Gestão completa de fornecedores e prestadores de serviços"
        >
          <SupplierPageContent />
        </MainLayout>
      </SuppliersProvider>
    </ProtectedRoute>
  );
}
