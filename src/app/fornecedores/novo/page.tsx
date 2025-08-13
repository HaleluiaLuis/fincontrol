'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SuppliersProvider, useSuppliers } from '@/contexts/SuppliersContext';
import { CreateSupplierData } from '@/types/supplier';
import { ArrowLeftIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function NovoFornecedorContent() {
  const router = useRouter();
  const { createSupplier, validateNIF } = useSuppliers();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateSupplierData>({
    companyName: '',
    tradeName: '',
    nif: '',
    category: 'SERVICOS',
    address: {
      street: '',
      city: '',
      province: 'Luanda',
      postalCode: '',
      country: 'Angola'
    },
    phone: '',
    email: '',
    website: '',
    bankInfo: {
      bankName: '',
      accountNumber: '',
      iban: '',
      swift: ''
    },
    observations: ''
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateSupplierData] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nome da empresa é obrigatório';
    }

    if (!formData.nif.trim()) {
      newErrors.nif = 'NIF é obrigatório';
    } else if (formData.nif.length !== 10) {
      newErrors.nif = 'NIF deve ter 10 dígitos';
    } else if (!validateNIF(formData.nif)) {
      newErrors.nif = 'Já existe um fornecedor com este NIF';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const cleanedData = {
        ...formData,
        bankInfo: formData.bankInfo?.bankName ? formData.bankInfo : undefined
      };

      await createSupplier(cleanedData);
      router.push('/fornecedores?success=created');
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      setErrors({ submit: 'Erro ao salvar fornecedor. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Novo Fornecedor" subtitle="Cadastrar novo fornecedor">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/fornecedores" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar para Fornecedores
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Fornecedor</h1>
              <p className="text-gray-600">Preencha as informações básicas</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Tech Solutions Angola Lda"
                />
                {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NIF *</label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => handleInputChange('nif', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nif ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="5401234567"
                  maxLength={10}
                />
                {errors.nif && <p className="mt-1 text-sm text-red-600">{errors.nif}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SERVICOS">Prestador de Serviços</option>
                  <option value="PRODUTOS">Fornecedor de Produtos</option>
                  <option value="MISTO">Misto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+244 923 456 789"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="contato@empresa.ao"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Link href="/fornecedores" className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default function NovoFornecedorPage() {
  return (
    <ProtectedRoute requiredPermissions={['suppliers.create']}>
      <SuppliersProvider>
        <NovoFornecedorContent />
      </SuppliersProvider>
    </ProtectedRoute>
  );
}
