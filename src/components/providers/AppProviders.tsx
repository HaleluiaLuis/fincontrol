"use client";
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { InvoicesProvider } from '@/contexts/InvoicesContext';
import { PaymentsProvider } from '@/contexts/PaymentsContext';
import { PaymentRequestsProvider } from '@/contexts/PaymentRequestsContext';
import { SuppliersProvider } from '@/contexts/SuppliersContext';
import { ReportsProvider } from '@/contexts/ReportsContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';
import { TransactionsProvider } from '@/contexts/TransactionsContext';

/**
 * Componente agregador de Providers para manter a ordem e reduzir ruído em layout.
 * Ordem: Auth -> Theme -> Domain (Invoices, PaymentRequests, Payments, Suppliers, Reports)
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <InvoicesProvider>
          <PaymentRequestsProvider>
            <PaymentsProvider>
              <SuppliersProvider>
                <CategoriesProvider>
                  <TransactionsProvider>
                    <ReportsProvider>
                      {children}
                    </ReportsProvider>
                  </TransactionsProvider>
                </CategoriesProvider>
              </SuppliersProvider>
            </PaymentsProvider>
          </PaymentRequestsProvider>
        </InvoicesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
