'use client';

import React, { useState, useEffect } from 'react';
import { useReports } from '@/contexts/ReportsContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  CreditCard,
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportsPage() {
  const {
    dashboardData,
    loading,
    refreshData,
    exportReport
  } = useReports();

  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleExport = async (format: 'PDF' | 'EXCEL' | 'CSV') => {
    if (!dashboardData) return;
    
    setExportLoading(true);
    try {
      const fileName = await exportReport(dashboardData, {
        format: format.toLowerCase() as 'pdf' | 'excel' | 'csv',
        includeCharts: true,
        includeDetails: true,
        template: 'detailed'
      });
      
      // Create download link
      const link = document.createElement('a');
      link.href = `/api/exports/${fileName}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout title="Relatórios">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!dashboardData) {
    return (
      <ProtectedRoute>
        <MainLayout title="Relatórios">
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum dado disponível</p>
            <Button onClick={refreshData} className="mt-4">
              Recarregar Dados
            </Button>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const { 
    financialMetrics, 
    cashFlowData, 
    categoryAnalysis, 
    monthlyComparison
  } = dashboardData;

  return (
    <ProtectedRoute>
      <MainLayout title="Relatórios Financeiros">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h1>
              <p className="text-gray-600 mt-2">
                Análise completa das finanças e performance do sistema
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => handleExport('PDF')}
                disabled={exportLoading}
                variant="danger"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                onClick={() => handleExport('EXCEL')}
                disabled={exportLoading}
                variant="success"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Excel
              </Button>
              <Button
                onClick={() => handleExport('CSV')}
                disabled={exportLoading}
                variant="secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Métricas Financeiras */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {financialMetrics?.totalReceita ? (
                      financialMetrics.totalReceita.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'AOA'
                      })
                    ) : 'AOA 0,00'}
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {financialMetrics?.crescimentoReceita || 0}%
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {financialMetrics?.totalDespesas ? (
                      financialMetrics.totalDespesas.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'AOA'
                      })
                    ) : 'AOA 0,00'}
                  </div>
                  <div className="flex items-center text-sm text-red-600">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {financialMetrics?.crescimentoDespesas || 0}%
                  </div>
                </div>
                <CreditCard className="h-12 w-12 text-red-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {financialMetrics ? (
                      (financialMetrics.totalReceita - financialMetrics.totalDespesas).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'AOA'
                      })
                    ) : 'AOA 0,00'}
                  </div>
                  <div className="flex items-center text-sm text-blue-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {((financialMetrics?.totalReceita || 0) - (financialMetrics?.totalDespesas || 0)) / (financialMetrics?.totalReceita || 1) * 100}%
                  </div>
                </div>
                <FileText className="h-12 w-12 text-blue-600 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transações</p>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {(cashFlowData || []).length}
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <Users className="w-4 h-4 mr-1" />
                    Registros
                  </div>
                </div>
                <Users className="h-12 w-12 text-purple-600 opacity-20" />
              </div>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fluxo de Caixa */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa - Últimos 7 Dias</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'AOA'
                      }),
                      'Valor'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="receitas"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Receitas"
                  />
                  <Line
                    type="monotone"
                    dataKey="despesas"
                    stroke="#EF4444"
                    strokeWidth={2}
                    name="Despesas"
                  />
                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Saldo"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Análise por Categorias */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Distribuição por Categorias</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryAnalysis || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {(categoryAnalysis || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'AOA'
                      }),
                      'Valor'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Comparação Mensal */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Comparação Mensal - Receitas vs Despesas</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyComparison || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'AOA'
                    }),
                    'Valor'
                  ]}
                />
                <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
