'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function RelatoriosPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [period, setPeriod] = useState(() => new Date().toISOString().slice(0,7));
  const [search, setSearch] = useState('');

  const reportDefinitions = [
    { id: 'receitas_despesas', icon: '📊', label: 'Receitas x Despesas', accent: 'accent-blue', desc: 'Análise comparativa mensal de receitas e despesas' },
    { id: 'fluxo_caixa', icon: '💰', label: 'Fluxo de Caixa', accent: 'accent-green', desc: 'Projeção e análise do fluxo de caixa mensal' },
    { id: 'status_faturas', icon: '📋', label: 'Status das Faturas', accent: 'accent-purple', desc: 'Distribuição por status das faturas' },
    { id: 'por_categoria', icon: '🏷️', label: 'Por Categoria', accent: 'accent-orange', desc: 'Gastos agrupados por categoria' },
    { id: 'fornecedores', icon: '🏢', label: 'Fornecedores', accent: 'accent-indigo', desc: 'Pagamentos por fornecedor' },
    { id: 'executivo', icon: '📈', label: 'Executivo', accent: 'accent-red', desc: 'Resumo executivo de métricas principais' }
  ];

  const visibleReports = selectedReport
    ? reportDefinitions.filter(r => r.id === selectedReport)
    : reportDefinitions.filter(r => r.label.toLowerCase().includes(search.toLowerCase()));

  const headerActions = (
    <>
      <Button
        variant="soft"
        size="sm"
        iconLeft={<span className="text-base">📊</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
      >
        Exportar Dashboard
      </Button>
      <Button
        variant="primary"
        size="sm"
        iconLeft={<span className="text-base">📈</span>}
        className="!h-9 px-3 gap-1.5 font-medium"
      >
        Relatório Personalizado
      </Button>
    </>
  );

  return (
    <MainLayout 
      title="Relatórios Financeiros" 
      subtitle="Análises e relatórios detalhados do desempenho financeiro"
      actions={headerActions}
    >
      {/* Filtros */}
      <div className="mb-8 surface p-6 rounded-xl">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-60">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-600 mb-1">Pesquisar</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Filtrar relatórios..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-600 mb-1">Período</label>
            <input
              type="month"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex-1 min-w-60">
            <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-600 mb-1">Selecionado</label>
            <div className="chip chip-indigo !text-[10px]">{selectedReport ? reportDefinitions.find(r=>r.id===selectedReport)?.label : 'Todos'}</div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {reportDefinitions.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReport(prev => prev === r.id ? null : r.id)}
              className={`chip ${r.id===selectedReport ? 'chip-indigo' : 'chip-blue'} cursor-pointer !text-[10px]`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Relatórios / Resultados */}
      <div className="surface-elevated overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-alt)]">
          <h3 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase">Relatórios Disponíveis</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gere e visualize resultados diretamente abaixo</p>
        </div>
        <div className="grid gap-px bg-[var(--border-subtle)] md:grid-cols-2 lg:grid-cols-3">
          {visibleReports.map(r => (
            <div key={r.id} className="bg-white p-5 flex flex-col justify-between row-zebra">
              <div>
                <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-1 text-sm"><span className="text-base">{r.icon}</span> {r.label}</h4>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{r.desc}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => alert(`Gerando relatório: ${r.label} (${period})`)}
                  className="action-btn !h-8 px-3 text-[11px] w-full"
                >Gerar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder de visualização (será alimentado após gerar) */}
      {selectedReport && (
        <div className="mt-10 surface p-6 rounded-xl">
          <h4 className="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100 uppercase mb-4">Visualização - {reportDefinitions.find(r=>r.id===selectedReport)?.label}</h4>
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            (Área reservada para gráficos / tabelas detalhadas do relatório selecionado para o período {period}).
          </div>
        </div>
      )}

  {/* Seção de análises visuais removida conforme solicitação anterior - agora substituída pelo preview */}
    </MainLayout>
  );
}
