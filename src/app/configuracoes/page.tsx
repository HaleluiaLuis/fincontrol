'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Role } from '@/types';

interface ProfileSetting {
  key: string;
  label: string;
  description: string;
  type: 'boolean' | 'select' | 'text';
  value: string | boolean;
  options?: { label: string; value: string }[];
  roles?: Role[];
}

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const { hasRole } = usePermissions();

  // Configurações específicas por perfil
  const [settings, setSettings] = useState<ProfileSetting[]>([
    // Configurações para todos os usuários
    {
      key: 'notifications',
      label: 'Notificações',
      description: 'Receber notificações do sistema',
      type: 'boolean',
      value: true
    },
    {
      key: 'theme',
      label: 'Tema',
      description: 'Aparência do sistema',
      type: 'select',
      value: 'light',
      options: [
        { label: 'Claro', value: 'light' },
        { label: 'Escuro', value: 'dark' },
        { label: 'Automático', value: 'auto' }
      ]
    },

    // Configurações específicas para Gabinete de Contratação
    {
      key: 'auto_approve_small',
      label: 'Auto-aprovação de Valores Pequenos',
      description: 'Aprovar automaticamente faturas até 10.000 AOA',
      type: 'boolean',
      value: false,
      roles: ['GABINETE_CONTRATACAO']
    },
    {
      key: 'supplier_validation',
      label: 'Validação de Fornecedores',
      description: 'Nível de validação para novos fornecedores',
      type: 'select',
      value: 'strict',
      options: [
        { label: 'Básica', value: 'basic' },
        { label: 'Rigorosa', value: 'strict' },
        { label: 'Muito Rigorosa', value: 'very_strict' }
      ],
      roles: ['GABINETE_CONTRATACAO']
    },

    // Configurações específicas para Presidente
    {
      key: 'approval_threshold',
      label: 'Limite de Aprovação',
      description: 'Valor acima do qual requer aprovação presidencial',
      type: 'select',
      value: '100000',
      options: [
        { label: '50.000 AOA', value: '50000' },
        { label: '100.000 AOA', value: '100000' },
        { label: '200.000 AOA', value: '200000' },
        { label: '500.000 AOA', value: '500000' }
      ],
      roles: ['PRESIDENTE']
    },
    {
      key: 'executive_reports',
      label: 'Relatórios Executivos',
      description: 'Frequência de relatórios executivos',
      type: 'select',
      value: 'weekly',
      options: [
        { label: 'Diário', value: 'daily' },
        { label: 'Semanal', value: 'weekly' },
        { label: 'Mensal', value: 'monthly' }
      ],
      roles: ['PRESIDENTE']
    },

    // Configurações específicas para Gabinete de Apoio
    {
      key: 'document_template',
      label: 'Modelo de Documento',
      description: 'Modelo padrão para registro de faturas',
      type: 'select',
      value: 'standard',
      options: [
        { label: 'Padrão', value: 'standard' },
        { label: 'Detalhado', value: 'detailed' },
        { label: 'Simplificado', value: 'simple' }
      ],
      roles: ['GABINETE_APOIO']
    },

    // Configurações específicas para Finanças
    {
      key: 'payment_method',
      label: 'Método de Pagamento Padrão',
      description: 'Método preferencial para processar pagamentos',
      type: 'select',
      value: 'bank_transfer',
      options: [
        { label: 'Transferência Bancária', value: 'bank_transfer' },
        { label: 'Cheque', value: 'check' },
        { label: 'Dinheiro', value: 'cash' }
      ],
      roles: ['FINANCAS']
    },
    {
      key: 'reconciliation_frequency',
      label: 'Frequência de Reconciliação',
      description: 'Com que frequência reconciliar contas',
      type: 'select',
      value: 'daily',
      options: [
        { label: 'Diária', value: 'daily' },
        { label: 'Semanal', value: 'weekly' },
        { label: 'Mensal', value: 'monthly' }
      ],
      roles: ['FINANCAS']
    },

    // Configurações específicas para Admin
    {
      key: 'backup_frequency',
      label: 'Frequência de Backup',
      description: 'Frequência de backup do sistema',
      type: 'select',
      value: 'daily',
      options: [
        { label: 'A cada 6 horas', value: '6h' },
        { label: 'Diário', value: 'daily' },
        { label: 'Semanal', value: 'weekly' }
      ],
      roles: ['ADMIN']
    },
    {
      key: 'audit_retention',
      label: 'Retenção de Logs de Auditoria',
      description: 'Tempo para manter logs de auditoria',
      type: 'select',
      value: '365',
      options: [
        { label: '90 dias', value: '90' },
        { label: '180 dias', value: '180' },
        { label: '1 ano', value: '365' },
        { label: '2 anos', value: '730' }
      ],
      roles: ['ADMIN']
    }
  ]);

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const getVisibleSettings = () => {
    return settings.filter(setting => {
      if (!setting.roles) return true; // Settings without role restrictions are visible to all
      return setting.roles.some(role => hasRole(role));
    });
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      ADMIN: 'Administrador do Sistema',
      GABINETE_CONTRATACAO: 'Gabinete de Contratação',
      PRESIDENTE: 'Presidente da Instituição',
      GABINETE_APOIO: 'Gabinete de Apoio Administrativo',
      FINANCAS: 'Departamento de Finanças',
      USER: 'Usuário Padrão',
      VIEWER: 'Visualizador'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      ADMIN: 'Acesso total ao sistema, gerenciamento de usuários e configurações avançadas',
      GABINETE_CONTRATACAO: 'Criação e validação inicial de solicitações de pagamento e gestão de fornecedores',
      PRESIDENTE: 'Autorização de solicitações conforme política institucional',
      GABINETE_APOIO: 'Registro e organização de faturas após aprovação presidencial',
      FINANCAS: 'Processamento de pagamentos e controle financeiro',
      USER: 'Acesso básico para consulta de informações',
      VIEWER: 'Acesso somente leitura para relatórios e consultas'
    };
    return descriptions[role as keyof typeof descriptions] || 'Perfil personalizado';
  };

  const getPermissionsByCategory = () => {
    if (!user) return {};
    
    const categories: { [key: string]: string[] } = {};
    
    user.permissions.forEach(permission => {
      const [category] = permission.split('.');
      if (!categories[category]) categories[category] = [];
      categories[category].push(permission);
    });

    return categories;
  };

  if (!user) return null;

  const visibleSettings = getVisibleSettings();
  const permissionCategories = getPermissionsByCategory();

  return (
    <ProtectedRoute>
      <MainLayout
        title="Configurações"
        subtitle="Configurações do perfil e personalização do sistema"
      >
        <div className="space-y-8">
          {/* Informações do Perfil Atual */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Perfil Atual</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Informações Básicas</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Nome:</span>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="text-sm font-medium text-gray-900">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Departamento:</span>
                      <span className="text-sm font-medium text-gray-900">{user.profile?.department || 'Não informado'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600">Perfil de Acesso</h3>
                  <div className="mt-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {getRoleDisplayName(user.role)}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {getRoleDescription(user.role)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Permissões Ativas ({user.permissions.length})
                </h3>
                <div className="space-y-3">
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category} className="border border-gray-100 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {permissions.map(permission => (
                          <span
                            key={permission}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {permission.split('.')[1]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Configurações por Perfil */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Configurações do Sistema
            </h2>
            
            <div className="space-y-6">
              {visibleSettings.length > 0 ? (
                visibleSettings.map(setting => (
                  <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {setting.label}
                        </h3>
                        {setting.roles && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            Específico do perfil
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      {setting.type === 'boolean' && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={typeof setting.value === 'boolean' ? setting.value : false}
                            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                      
                      {setting.type === 'select' && (
                        <select
                          value={typeof setting.value === 'string' ? setting.value : ''}
                          onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                          className="block w-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {setting.options?.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Nenhuma configuração específica disponível para seu perfil.
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
