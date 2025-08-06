'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useTransactions } from '@/hooks/useTransactions';
import { useInvoices } from '@/hooks/useInvoices';
import { Button } from '@/components/ui/Button';

export default function RelatoriosPage() {
  const { getTransactionsSummary } = useTransactions();
  const { getInvoicesSummary } = useInvoices();
  
  const transactionsSummary = getTransactionsSummary();
  const invoicesSummary = getInvoicesSummary();

  const headerActions = (
    <>
      <Button variant="secondary" size="sm">
        📊 Exportar Dashboard
      </Button>
      <Button variant="primary" size="sm">
        📈 Relatório Personalizado
      </Button>
    </>
  );

  return (
    <MainLayout 
      title="Relatórios Financeiros" 
      subtitle="Análises e relatórios detalhados do desempenho financeiro"
      actions={headerActions}
    >
      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Transações */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Resumo de Transações</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Total Receitas</span>
              <span className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(transactionsSummary.totalReceitas)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-800">Total Despesas</span>
              <span className="text-lg font-bold text-red-600">
                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(transactionsSummary.totalDespesas)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">Saldo Atual</span>
              <span className="text-lg font-bold text-blue-600">
                {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(transactionsSummary.saldoAtual)}
              </span>
            </div>
          </div>
        </div>

        {/* Faturas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Resumo de Faturas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">Pendentes</span>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-600">{invoicesSummary.totalPendentes}</div>
                <div className="text-sm text-yellow-600">
                  {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(invoicesSummary.valorPendente)}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-800">Aprovadas</span>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{invoicesSummary.totalAprovadas}</div>
                <div className="text-sm text-blue-600">
                  {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(invoicesSummary.valorAprovado)}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-800">Pagas</span>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{invoicesSummary.totalPagas}</div>
                <div className="text-sm text-green-600">
                  {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(invoicesSummary.valorPago)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Relatório de Receitas e Despesas */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">📊 Receitas x Despesas</h4>
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-2">
              📈
            </div>
          </div>
          <p className="text-blue-100 text-sm mb-4">Análise comparativa mensal de receitas e despesas</p>
          <Button variant="secondary" size="sm" className="w-full">
            Gerar Relatório
          </Button>
        </div>

        {/* Relatório de Fluxo de Caixa */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">💰 Fluxo de Caixa</h4>
            <div className="bg-green-400 bg-opacity-30 rounded-full p-2">
              💸
            </div>
          </div>
          <p className="text-green-100 text-sm mb-4">Projeção e análise do fluxo de caixa mensal</p>
          <Button variant="secondary" size="sm" className="w-full">
            Gerar Relatório
          </Button>
        </div>

        {/* Relatório de Faturas */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">📋 Status das Faturas</h4>
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-2">
              📄
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-4">Relatório detalhado do status das faturas</p>
          <Button variant="secondary" size="sm" className="w-full">
            Gerar Relatório
          </Button>
        </div>

        {/* Relatório por Categoria */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">🏷️ Por Categoria</h4>
            <div className="bg-orange-400 bg-opacity-30 rounded-full p-2">
              📊
            </div>
          </div>
          <p className="text-orange-100 text-sm mb-4">Análise de gastos por categoria de despesa</p>
          <Button variant="secondary" size="sm" className="w-full">
            Gerar Relatório
          </Button>
        </div>

        {/* Relatório de Fornecedores */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">🏢 Fornecedores</h4>
            <div className="bg-indigo-400 bg-opacity-30 rounded-full p-2">
              👥
            </div>
          </div>
          <p className="text-indigo-100 text-sm mb-4">Relatório de pagamentos por fornecedor</p>
          <Button variant="secondary" size="sm" className="w-full">
            Gerar Relatório
          </Button>
        </div>

        {/* Relatório Executivo */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">📈 Executivo</h4>
            <div className="bg-red-400 bg-opacity-30 rounded-full p-2">
              👔
            </div>
          </div>
          <p className="text-red-100 text-sm mb-4">Relatório executivo com métricas principais</p>
          <Button variant="secondary" size="sm" className="w-full">
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Gráficos e Análises */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">📊 Análises Visuais</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Placeholder para gráfico de pizza - categorias */}
          <div className="text-center">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-gray-400">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm">Gráfico de Despesas por Categoria</p>
                <p className="text-xs text-gray-500 mt-1">Em desenvolvimento</p>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Distribuição por Categoria</h4>
            <p className="text-sm text-gray-600">Análise percentual dos gastos por categoria</p>
          </div>

          {/* Placeholder para gráfico de linha - tendência */}
          <div className="text-center">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-gray-400">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-sm">Tendência Mensal</p>
                <p className="text-xs text-gray-500 mt-1">Em desenvolvimento</p>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900">Evolução Temporal</h4>
            <p className="text-sm text-gray-600">Tendência de receitas e despesas ao longo do tempo</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
