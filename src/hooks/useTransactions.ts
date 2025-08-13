// Hook para gerenciar transações
'use client';

import { useState } from 'react';
import { Transaction, TransactionFormData, FinancialSummary } from '@/types';
// LEGADO: Este hook será removido. Mantido apenas até migração completa.
import { nextTransactionId } from '@/lib/id';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Função para adicionar nova transação
  const addTransaction = (transactionData: TransactionFormData) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: nextTransactionId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Função para editar transação
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id 
          ? { ...transaction, ...updates, updatedAt: new Date().toISOString() }
          : transaction
      )
    );
  };

  // Função para deletar transação
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  // Calcular resumo financeiro
  const getFinancialSummary = (invoicesSummary?: {
    totalPendentes: number;
    totalAprovadas: number;
    totalPagas: number;
    valorPendente: number;
    valorAprovado: number;
    valorPago: number;
  }): FinancialSummary => {
    const confirmedTransactions = transactions.filter(t => t.status === 'confirmada');
    
    const totalReceitas = confirmedTransactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDespesas = confirmedTransactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);

    const saldo = totalReceitas - totalDespesas;

    return {
      totalReceitas,
      totalDespesas,
      saldo,
      periodo: {
        inicio: new Date().toISOString().split('T')[0],
        fim: new Date().toISOString().split('T')[0]
      },
      faturas: invoicesSummary || {
        totalPendentes: 0,
        totalAprovadas: 0,
        totalPagas: 0,
        valorPendente: 0,
        valorAprovado: 0,
        valorPago: 0
      }
    };
  };

  // Filtrar transações por período
  const getTransactionsByPeriod = (startDate: string, endDate: string) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      return transactionDate >= start && transactionDate <= end;
    });
  };

  // Filtrar transações por tipo
  const getTransactionsByType = (type: 'receita' | 'despesa') => {
    return transactions.filter(transaction => transaction.type === type);
  };

  // Filtrar transações por categoria
  const getTransactionsByCategory = (categoryId: string) => {
    return transactions.filter(transaction => transaction.category === categoryId);
  };

  // Obter transações por mês
  const getMonthlyTransactions = (year: number, month: number) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });
  };

  // Obter resumo de transações
  const getTransactionsSummary = () => {
    const totalReceitas = transactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalDespesas = transactions
      .filter(t => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const saldoAtual = totalReceitas - totalDespesas;
    
    return {
      totalReceitas,
      totalDespesas,
      saldoAtual,
      totalTransacoes: transactions.length
    };
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getFinancialSummary,
    getTransactionsByPeriod,
    getTransactionsByType,
    getTransactionsByCategory,
    getMonthlyTransactions,
    getTransactionsSummary,
  };
}
