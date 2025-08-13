'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { suppliersService } from '@/services/suppliers.service';
import { getErrorMessage } from '@/lib/utils';
import { 
  Supplier, 
  CreateSupplierData, 
  UpdateSupplierData, 
  SupplierFilters,
  SupplierStats
} from '@/types/supplier';

interface SuppliersContextType {
  // Estado
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  
  // Filtros e busca
  filters: SupplierFilters;
  filteredSuppliers: Supplier[];
  
  // Ações
  createSupplier: (data: CreateSupplierData) => Promise<Supplier>;
  updateSupplier: (data: UpdateSupplierData) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  getSupplier: (id: string) => Supplier | undefined;
  
  // Filtros
  setFilters: (filters: SupplierFilters) => void;
  clearFilters: () => void;
  
  // Estatísticas
  getStats: () => SupplierStats;
  
  // Utilitários
  refreshSuppliers: () => Promise<void>;
  validateNIF: (nif: string, excludeId?: string) => boolean;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export function SuppliersProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<SupplierFilters>({});

  // Carregar fornecedores via API
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await suppliersService.getSuppliers(1, 1000);
      if (response.success && response.data) {
        setSuppliers(response.data.data);
      } else {
        setError('Erro ao carregar fornecedores');
      }
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Aplicar filtros
  const filteredSuppliers = suppliers.filter(supplier => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !supplier.companyName.toLowerCase().includes(searchLower) &&
        !supplier.tradeName?.toLowerCase().includes(searchLower) &&
        !supplier.nif.toLowerCase().includes(searchLower) &&
        !supplier.email?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    if (filters.status && supplier.status !== filters.status) {
      return false;
    }
    
    if (filters.category && supplier.category !== filters.category) {
      return false;
    }
    
    if (filters.province && supplier.address.province !== filters.province) {
      return false;
    }
    
    if (filters.createdFrom && supplier.createdAt < filters.createdFrom) {
      return false;
    }
    
    if (filters.createdTo && supplier.createdAt > filters.createdTo) {
      return false;
    }
    
    return true;
  });

  const createSupplier = async (data: CreateSupplierData): Promise<Supplier> => {
    try {
      const response = await suppliersService.createSupplier(data);
      if (response.success && response.data) {
        setSuppliers(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao criar fornecedor');
      }
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const updateSupplier = async (data: UpdateSupplierData): Promise<Supplier> => {
    try {
      const response = await suppliersService.updateSupplier(data.id, data);
      if (response.success && response.data) {
        setSuppliers(prev => prev.map(supplier => supplier.id === data.id ? response.data : supplier));
        return response.data;
      } else {
        throw new Error(response.message || 'Erro ao atualizar fornecedor');
      }
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const deleteSupplier = async (id: string): Promise<void> => {
    try {
      const response = await suppliersService.deleteSupplier(id);
      if (response.success) {
        setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      } else {
        throw new Error(response.message || 'Erro ao excluir fornecedor');
      }
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      setError(getErrorMessage(error));
      throw error;
    }
  };

  const getSupplier = (id: string): Supplier | undefined => {
    return suppliers.find(supplier => supplier.id === id);
  };

  const setFilters = (newFilters: SupplierFilters) => {
    setFiltersState(newFilters);
  };

  const clearFilters = () => {
    setFiltersState({});
  };

  const getStats = (): SupplierStats => {
    const total = suppliers.length;
    const active = suppliers.filter(s => s.status === 'ATIVO').length;
    const inactive = suppliers.filter(s => s.status === 'INATIVO').length;
    const pending = suppliers.filter(s => s.status === 'PENDENTE').length;

    const byCategory = {
      servicos: suppliers.filter(s => s.category === 'SERVICOS').length,
      produtos: suppliers.filter(s => s.category === 'PRODUTOS').length,
      misto: suppliers.filter(s => s.category === 'MISTO').length
    };

    // Converter para array como esperado pela interface
    const provinceCount = suppliers.reduce((acc, supplier) => {
      const province = supplier.address.province;
      acc[province] = (acc[province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byProvince = Object.entries(provinceCount).map(([province, count]) => ({
      province,
      count
    }));

    // Calcular contratos que expiram em breve (30 dias)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const contractsExpiringSoon = suppliers.reduce((count, supplier) => {
      const expiring = supplier.contracts.filter(contract => 
        contract.endDate <= thirtyDaysFromNow && 
        contract.status === 'VIGENTE'
      ).length;
      return count + expiring;
    }, 0);

    // Calcular valor total de transações
    const totalTransactionValue = suppliers.reduce((total, supplier) => {
      const supplierTotal = supplier.transactions
        .filter(t => t.status === 'CONCLUIDO')
        .reduce((sum, t) => sum + t.value, 0);
      return total + supplierTotal;
    }, 0);

    return {
      total,
      active,
      inactive,
      pending,
      byCategory,
      byProvince,
      contractsExpiringSoon,
      totalTransactionValue
    };
  };

  const refreshSuppliers = async (): Promise<void> => {
    await loadSuppliers();
  };

  const validateNIF = (nif: string, excludeId?: string): boolean => {
    // Validação básica do NIF angolano (deve ter 10 dígitos)
    if (!/^\d{10}$/.test(nif)) {
      return false;
    }

    // Verificar se já existe outro fornecedor com o mesmo NIF
    const existingSupplier = suppliers.find(s => s.nif === nif && s.id !== excludeId);
    return !existingSupplier;
  };

  const value: SuppliersContextType = {
    suppliers,
    loading,
    error,
    filters,
    filteredSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplier,
    setFilters,
    clearFilters,
    getStats,
    refreshSuppliers,
    validateNIF
  };

  return (
    <SuppliersContext.Provider value={value}>
      {children}
    </SuppliersContext.Provider>
  );
}

export function useSuppliers() {
  const context = useContext(SuppliersContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SuppliersProvider');
  }
  return context;
}
