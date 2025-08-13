'use client';

import { useCallback, useEffect, useMemo, useState, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';

type TabId = 'geral' | 'usuarios' | 'workflow' | 'notificacoes' | 'backup' | 'sobre';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'gestor' | 'financeiro';
  active: boolean;
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<TabId>('geral');

  // Estado: Geral
  const [institutionName, setInstitutionName] = useState('Instituto Superior Politécnico do Bié');
  const [nif, setNif] = useState('5401234567');
  const [address, setAddress] = useState('Kuito, Província do Bié, Angola');
  const [phone, setPhone] = useState('+244 248 123 456');
  const [currency, setCurrency] = useState('AOA');
  const [fiscalYear, setFiscalYear] = useState('2025');
  const [darkMode, setDarkMode] = useState(false); // TODO: integrar com tema global
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  // Estado: feedback
  const [saving, setSaving] = useState(false);
  const [backupRunning, setBackupRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Mock usuários (futuro: integrar serviço /api/users)
  const users: UserRow[] = useMemo(() => ([{
    id: 'u-admin', name: 'Admin Sistema', email: 'admin@ispobie.ao', role: 'admin', active: true
  }]), []);

  const totalUsers = users.length;

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    // Simular chamada API
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    showMessage('Configurações salvas com sucesso');
  }, [showMessage]);

  const handleBackup = useCallback(async () => {
    setBackupRunning(true);
    await new Promise(r => setTimeout(r, 1200));
    setBackupRunning(false);
    showMessage('Backup concluído');
  }, [showMessage]);

  // Persistir aba selecionada no hash (UX simples)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  const headerActions = (
    <>
      <Button
        variant="soft"
        size="sm"
        iconLeft={<span className="text-base">🗄️</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
        disabled={backupRunning}
        onClick={handleBackup}
      >
        {backupRunning ? 'Processando...' : 'Backup'}
      </Button>
      <Button
        variant="primary"
        size="sm"
        iconLeft={<span className="text-base">💾</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
        disabled={saving}
        onClick={handleSave}
      >
        {saving ? 'Salvando...' : 'Salvar'}
      </Button>
    </>
  );

  const tabs: { id: TabId; name: string; icon: string }[] = [
    { id: 'geral', name: 'Geral', icon: '⚙️' },
    { id: 'usuarios', name: 'Usuários', icon: '👥' },
    { id: 'workflow', name: 'Workflow', icon: '🔄' },
    { id: 'notificacoes', name: 'Notificações', icon: '🔔' },
    { id: 'backup', name: 'Backup', icon: '💾' },
    { id: 'sobre', name: 'Sobre', icon: 'ℹ️' },
  ];

  return (
    <Suspense fallback={<div className="p-8 text-sm text-text-soft">Carregando configurações...</div>}>
    <MainLayout 
      title="Configurações do Sistema" 
      subtitle="Personalize e configure o sistema de controle financeiro"
      actions={headerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu lateral de configurações */}
        <div className="lg:col-span-1">
          <div className="surface p-4 rounded-xl">
            <h3 className="text-xs font-semibold tracking-wide text-gray-700 uppercase mb-3">Categorias</h3>
            <nav className="flex flex-col gap-2" role="tablist" aria-orientation="vertical">
              {tabs.map(tab => {
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition relative group ${selected ? 'bg-[var(--surface-alt)] ring-1 ring-[var(--border-subtle)] text-strong' : 'hover:bg-[var(--surface-alt)] text-gray-600'} `}
                  >
                    <span className="text-base leading-none">{tab.icon}</span>
                    <span className="truncate">{tab.name}</span>
                    {selected && <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-gradient-to-b from-indigo-400 to-indigo-600" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo das configurações */}
        <div className="lg:col-span-3">
          <div className="surface-elevated p-6 rounded-xl" role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}> 
            {message && (
              <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 flex items-start gap-2">
                <span className="mt-0.5">✅</span>
                <span>{message}</span>
              </div>
            )}
            {activeTab === 'geral' && (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase mb-6">Configurações Gerais</h3>
                
                <div className="space-y-6">
                  {/* Informações da Instituição */}
                  <div className="pb-6 border-b border-gray-200/60 dark:border-gray-800/60">
                    <h4 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase mb-4">Informações da Instituição</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 mb-1 uppercase">Nome da Instituição</label>
                        <input
                          type="text"
                          value={institutionName}
                          onChange={e => setInstitutionName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/70 dark:bg-gray-950/30 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 mb-1 uppercase">NIF</label>
                        <input
                          type="text"
                          value={nif}
                          onChange={e => setNif(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/70 dark:bg-gray-950/30 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 mb-1 uppercase">Endereço</label>
                        <input
                          type="text"
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/70 dark:bg-gray-950/30 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 mb-1 uppercase">Telefone</label>
                        <input
                          type="text"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/70 dark:bg-gray-950/30 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configurações Financeiras */}
                  <div className="pb-6 border-b border-gray-200/60 dark:border-gray-800/60">
                    <h4 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase mb-4">Configurações Financeiras</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 mb-1 uppercase">Moeda Padrão</label>
                        <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/70 dark:bg-gray-950/30 focus:ring-2 focus:ring-blue-500">
                          <option value="AOA">Kwanza Angolano (AOA)</option>
                          <option value="USD">Dólar Americano (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 mb-1 uppercase">Ano Fiscal</label>
                        <select value={fiscalYear} onChange={e => setFiscalYear(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/70 dark:bg-gray-950/30 focus:ring-2 focus:ring-blue-500">
                          {['2025','2026','2027'].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Configurações do Sistema */}
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase mb-4">Configurações do Sistema</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 uppercase">Modo Escuro</label>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Ativar tema escuro para o sistema</p>
                        </div>
                        <input type="checkbox" className="toggle" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 uppercase">Notificações por Email</label>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Receber notificações por email</p>
                        </div>
                        <input type="checkbox" className="toggle" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs font-medium tracking-wide text-gray-600 dark:text-gray-400 uppercase">Backup Automático</label>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">Realizar backup diário automático</p>
                        </div>
                        <input type="checkbox" className="toggle" checked={autoBackup} onChange={e => setAutoBackup(e.target.checked)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usuarios' && (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase mb-6">Gestão de Usuários</h3>
                
                <div className="mb-5 flex items-center justify-between">
                  <Button variant="primary" size="sm" iconLeft={<span className="text-base">＋</span>} className="!h-8 px-3 gap-1.5 font-medium">Adicionar Usuário</Button>
                  <span className="text-[11px] text-gray-500">Total: {totalUsers}</span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
                  <table className="min-w-full divide-y divide-[var(--border-subtle)] text-sm">
                    <thead className="bg-[var(--surface-alt)]">
                      <tr className="text-[11px] text-gray-500 uppercase tracking-wide">
                        <th className="px-4 py-2 text-left font-medium">Usuário</th>
                        <th className="px-4 py-2 text-left font-medium">Função</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                        <th className="px-4 py-2 text-center font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {users.map(u => (
                        <tr className="row-zebra" key={u.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-indigo-500/90 text-white flex items-center justify-center text-xs font-semibold ring-2 ring-white/60">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 leading-none">{u.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="chip chip-indigo !text-[11px] !py-0.5">
                              {u.role === 'admin' ? 'Administrador' : u.role === 'gestor' ? 'Gestor' : 'Financeiro'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`chip ${u.active ? 'chip-green' : 'chip-amber'} !text-[11px] !py-0.5`}>
                              {u.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex justify-center gap-2">
                              <button className="action-btn !h-7 px-2.5 text-[11px]" disabled>Editar</button>
                              <button className="action-btn !h-7 px-2.5 text-[11px]" disabled>{u.active ? 'Desativar' : 'Ativar'}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'workflow' && (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase mb-6">Configuração do Workflow</h3>
                
                <div className="space-y-6">
                  <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-alt)]">
                    <h4 className="text-xs font-semibold tracking-wide text-indigo-700 uppercase mb-4">Fluxo de Aprovação de Faturas</h4>
                    <ol className="space-y-2 text-sm">
                      {[
                        ['Fornecedor','Submissão inicial'],
                        ['Gabinete de Contratação','Análise técnica'],
                        ['Presidente','Aprovação estratégica'],
                        ['Gabinete de Apoio','Validação administrativa'],
                        ['Finanças','Processamento do pagamento']
                      ].map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 rounded-md bg-white/60 border border-[var(--border-subtle)]">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-semibold shrink-0">{idx+1}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 leading-tight">{step[0]}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{step[1]}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notificacoes' && (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase mb-6">Configurações de Notificações</h3>
                
                <div className="space-y-6">
                  <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-alt)]">
                    <h4 className="text-xs font-semibold tracking-wide text-gray-700 uppercase mb-4">Notificações por Email</h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      {([
                        ['Nova fatura recebida', true],
                        ['Fatura aprovada', true],
                        ['Fatura vencida', true],
                        ['Relatórios semanais', false]
                      ] as [string, boolean][]).map(([label, checked]) => (
                        <label key={label} className="flex items-center gap-3 p-2 rounded-md bg-white/60 border border-[var(--border-subtle)]">
                          <input type="checkbox" defaultChecked={checked} className="accent-indigo-600" />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase mb-6">Backup e Restauração</h3>
                
                <div className="space-y-6">
                  <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-alt)]">
                    <h4 className="text-xs font-semibold tracking-wide text-green-700 uppercase mb-4">Status do Backup</h4>
                    <dl className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <dt className="text-[11px] font-medium uppercase text-gray-500 mb-1">Último</dt>
                        <dd className="font-semibold text-gray-800">Hoje 03:00</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase text-gray-500 mb-1">Próximo</dt>
                        <dd className="font-semibold text-gray-800">Amanhã 03:00</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium uppercase text-gray-500 mb-1">Status</dt>
                        <dd><span className="chip chip-green !text-[11px] !py-0.5">Operacional</span></dd>
                      </div>
                    </dl>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="primary" className="flex-1" iconLeft={<span>🔄</span>} disabled={backupRunning} onClick={handleBackup}>
                      {backupRunning ? 'Processando...' : 'Fazer Backup'}
                    </Button>
                    <Button variant="soft" className="flex-1" iconLeft={<span>📥</span>}>Restaurar</Button>
                  </div>
                </div>
              </div>
            )}

  {activeTab === 'sobre' && (
              <div>
        <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase mb-6">Sobre o Sistema</h3>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-sm ring-1 ring-black/5">
                      FC
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-1">FinControl</h4>
                    <p className="text-sm text-gray-600 mb-5">Sistema de Controle Financeiro</p>
                    <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-sm">
                      {[['Versão','1.0.0'],['Desenvolvido para','ISPB'],['Tecnologia','Next.js 15'],['Última atualização','Jan 2025']].map(item => (
                        <div key={item[0]} className="p-3 rounded-lg bg-[var(--surface-alt)] border border-[var(--border-subtle)] flex flex-col">
                          <span className="text-[11px] font-medium uppercase text-gray-500 mb-1">{item[0]}</span>
                          <span className="font-medium text-gray-800">{item[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-8">
                    <h5 className="text-xs font-semibold tracking-wide text-gray-700 uppercase mb-3">Funcionalidades Principais</h5>
                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                      {['Gestão de Faturas','Controle de Transações','Workflow de Aprovação','Gestão de Fornecedores','Relatórios Financeiros','Sistema de Backup'].map(f => (
                        <li key={f} className="flex items-center gap-1.5 p-2 rounded-md bg-[var(--surface-alt)] border border-[var(--border-subtle)]">
                          <span>✅</span><span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  </MainLayout>
  </Suspense>
  );
}
