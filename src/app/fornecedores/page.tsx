'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { mockSuppliers } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

export default function FornecedoresPage() {
  const headerActions = (
    <>
      <Button variant="secondary" size="sm">
        📤 Exportar Lista
      </Button>
      <Button variant="primary" size="sm">
        + Novo Fornecedor
      </Button>
    </>
  );

  return (
    <MainLayout 
      title="Gestão de Fornecedores" 
      subtitle="Cadastro e controle de fornecedores e prestadores de serviços"
      actions={headerActions}
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Fornecedores</p>
              <p className="text-2xl font-bold">{mockSuppliers.length}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
              🏢
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Fornecedores Ativos</p>
              <p className="text-2xl font-bold">{mockSuppliers.filter(s => s.status === 'ativo').length}</p>
            </div>
            <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
              ✅
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Aguardando Aprovação</p>
              <p className="text-2xl font-bold">{mockSuppliers.filter(s => s.status === 'pendente').length}</p>
            </div>
            <div className="bg-yellow-400 bg-opacity-30 rounded-full p-3">
              ⏳
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Contratos Ativos</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
              📋
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Pesquisa */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="🔍 Pesquisar fornecedores..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select defaultValue="" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
            </select>
            <select defaultValue="" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todas as categorias</option>
              <option value="servicos">Serviços</option>
              <option value="materiais">Materiais</option>
              <option value="equipamentos">Equipamentos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Fornecedores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">🏢 Lista de Fornecedores</h3>
          <p className="text-sm text-gray-600 mt-1">
            Cadastro completo de fornecedores e prestadores de serviços
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockSuppliers.map((supplier, index) => (
                <tr key={supplier.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {supplier.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.taxId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{supplier.contact.email}</div>
                    <div className="text-sm text-gray-500">{supplier.contact.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Serviços Gerais
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      supplier.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : supplier.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.status === 'ativo' ? '✅ Ativo' : 
                       supplier.status === 'pendente' ? '⏳ Pendente' : '❌ Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors">
                        👁️ Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-lg transition-colors">
                        ✏️ Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
