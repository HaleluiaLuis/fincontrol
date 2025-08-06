'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('geral');

  const headerActions = (
    <>
      <Button variant="secondary" size="sm">
        💾 Backup Sistema
      </Button>
      <Button variant="primary" size="sm">
        💾 Salvar Configurações
      </Button>
    </>
  );

  const tabs = [
    { id: 'geral', name: 'Geral', icon: '⚙️' },
    { id: 'usuarios', name: 'Usuários', icon: '👥' },
    { id: 'workflow', name: 'Workflow', icon: '🔄' },
    { id: 'notificacoes', name: 'Notificações', icon: '🔔' },
    { id: 'backup', name: 'Backup', icon: '💾' },
    { id: 'sobre', name: 'Sobre', icon: 'ℹ️' },
  ];

  return (
    <MainLayout 
      title="Configurações do Sistema" 
      subtitle="Personalize e configure o sistema de controle financeiro"
      actions={headerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu lateral de configurações */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das configurações */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'geral' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">⚙️ Configurações Gerais</h3>
                
                <div className="space-y-6">
                  {/* Informações da Instituição */}
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">🏛️ Informações da Instituição</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Instituição</label>
                        <input
                          type="text"
                          defaultValue="Instituto Superior Politécnico do Bié"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIF</label>
                        <input
                          type="text"
                          defaultValue="5401234567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                        <input
                          type="text"
                          defaultValue="Kuito, Província do Bié, Angola"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input
                          type="text"
                          defaultValue="+244 248 123 456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configurações Financeiras */}
                  <div className="border-b border-gray-200 pb-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">💰 Configurações Financeiras</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Moeda Padrão</label>
                        <select defaultValue="AOA" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value="AOA">Kwanza Angolano (AOA)</option>
                          <option value="USD">Dólar Americano (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ano Fiscal</label>
                        <select defaultValue="2025" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Configurações do Sistema */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">🖥️ Configurações do Sistema</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Modo Escuro</label>
                          <p className="text-sm text-gray-500">Ativar tema escuro para o sistema</p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Notificações por Email</label>
                          <p className="text-sm text-gray-500">Receber notificações por email</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Backup Automático</label>
                          <p className="text-sm text-gray-500">Realizar backup diário automático</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usuarios' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">👥 Gestão de Usuários</h3>
                
                <div className="mb-6">
                  <Button variant="primary" size="sm">
                    + Adicionar Usuário
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                              A
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Admin Sistema</div>
                              <div className="text-sm text-gray-500">admin@ispobie.ao</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Administrador
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Ativo
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                          <button className="text-red-600 hover:text-red-900">Desativar</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'workflow' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">🔄 Configuração do Workflow</h3>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-blue-900 mb-4">Fluxo de Aprovação de Faturas</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-sm font-medium">1. Fornecedor</span>
                        <span className="text-xs text-gray-500">Submissão inicial</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-sm font-medium">2. Gabinete de Contratação</span>
                        <span className="text-xs text-gray-500">Análise técnica</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-sm font-medium">3. Presidente</span>
                        <span className="text-xs text-gray-500">Aprovação estratégica</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-sm font-medium">4. Gabinete de Apoio</span>
                        <span className="text-xs text-gray-500">Validação administrativa</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded border">
                        <span className="text-sm font-medium">5. Finanças</span>
                        <span className="text-xs text-gray-500">Processamento do pagamento</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notificacoes' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">🔔 Configurações de Notificações</h3>
                
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4">Notificações por Email</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm">Nova fatura recebida</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm">Fatura aprovada</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span className="text-sm">Fatura vencida</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span className="text-sm">Relatórios semanais</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">💾 Backup e Restauração</h3>
                
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-green-900 mb-4">Status do Backup</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-green-800">Último backup: Hoje às 03:00</p>
                      <p className="text-sm text-green-800">Próximo backup: Amanhã às 03:00</p>
                      <p className="text-sm text-green-800">Status: ✅ Funcionando normalmente</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="primary" className="w-full">
                      🔄 Fazer Backup Agora
                    </Button>
                    <Button variant="secondary" className="w-full">
                      📥 Restaurar Backup
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sobre' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">ℹ️ Sobre o Sistema</h3>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                      FC
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">FinControl</h4>
                    <p className="text-gray-600 mb-4">Sistema de Controle Financeiro</p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Versão:</span>
                          <span>1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Desenvolvido para:</span>
                          <span>ISPB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Tecnologia:</span>
                          <span>Next.js 15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Última atualização:</span>
                          <span>Janeiro 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h5 className="font-medium text-gray-900 mb-3">Funcionalidades Principais</h5>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="mr-2">✅</span>
                        Gestão de Faturas
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">✅</span>
                        Controle de Transações
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">✅</span>
                        Workflow de Aprovação
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">✅</span>
                        Gestão de Fornecedores
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">✅</span>
                        Relatórios Financeiros
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">✅</span>
                        Sistema de Backup
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
