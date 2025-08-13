'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ConditionalRender } from '@/components/auth/ConditionalRender';

export function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Seção do Administrador */}
      <ConditionalRender requiredRoles={['ADMIN']}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            🔧 Painel do Administrador
          </h3>
          <p className="text-red-700 text-sm">
            Acesso total ao sistema - gerenciamento de usuários, configurações e monitoramento.
          </p>
          <div className="mt-3 space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Gerenciar Usuários
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Configurações
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Relatórios Completos
            </span>
          </div>
        </div>
      </ConditionalRender>

      {/* Seção do Gabinete de Contratação */}
      <ConditionalRender requiredRoles={['GABINETE_CONTRATACAO']}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📋 Gabinete de Contratação
          </h3>
          <p className="text-blue-700 text-sm">
            Responsável pela criação e validação inicial de solicitações de pagamento.
          </p>
          <div className="mt-3 space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Criar Solicitações
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Gerenciar Fornecedores
            </span>
          </div>
        </div>
      </ConditionalRender>

      {/* Seção do Presidente */}
      <ConditionalRender requiredRoles={['PRESIDENTE']}>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            👑 Gabinete da Presidência
          </h3>
          <p className="text-purple-700 text-sm">
            Autorização de solicitações de pagamento conforme política institucional.
          </p>
          <div className="mt-3 space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Aprovar Solicitações
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Relatórios Executivos
            </span>
          </div>
        </div>
      </ConditionalRender>

      {/* Seção do Gabinete de Apoio */}
      <ConditionalRender requiredRoles={['GABINETE_APOIO']}>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            📝 Gabinete de Apoio
          </h3>
          <p className="text-green-700 text-sm">
            Registro e organização de faturas após aprovação presidencial.
          </p>
          <div className="mt-3 space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Registrar Faturas
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Organizar Documentos
            </span>
          </div>
        </div>
      </ConditionalRender>

      {/* Seção das Finanças */}
      <ConditionalRender requiredRoles={['FINANCAS']}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            💰 Departamento de Finanças
          </h3>
          <p className="text-yellow-700 text-sm">
            Processamento de pagamentos e controle financeiro institucional.
          </p>
          <div className="mt-3 space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Processar Pagamentos
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Controle Orçamentário
            </span>
          </div>
        </div>
      </ConditionalRender>

      {/* Seção de Usuário Comum/Visualizador */}
      <ConditionalRender requiredRoles={['USER', 'VIEWER']} mode="any">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            👀 Acesso de Consulta
          </h3>
          <p className="text-gray-700 text-sm">
            Visualização de relatórios e consulta de informações financeiras.
          </p>
          <div className="mt-3 space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Consultar Relatórios
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Visualizar Dados
            </span>
          </div>
        </div>
      </ConditionalRender>

      {/* Informações do usuário atual */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📊 Suas Informações
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Nome:</span>
            <p className="text-gray-900">{user.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Email:</span>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Departamento:</span>
            <p className="text-gray-900">{user.profile?.department || 'Não informado'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Permissões:</span>
            <p className="text-gray-900">{user.permissions.length} ativas</p>
          </div>
        </div>

        {/* Lista de permissões */}
        <div className="mt-4">
          <span className="font-medium text-gray-600 text-sm">Suas Permissões:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.permissions.map((permission) => (
              <span
                key={permission}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
