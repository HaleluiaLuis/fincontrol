'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Network error while fetching categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: {
    name: string;
    type: 'RECEITA' | 'DESPESA';
    color?: string;
    description?: string;
  }) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(prev => [data.category, ...prev]);
        return data.category;
      } else {
        throw new Error(data.error || 'Failed to create category');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      throw err;
    }
  };

  const getCategoriesByType = (type: 'RECEITA' | 'DESPESA') => {
    return categories.filter(category => category.type === type);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    getCategoriesByType,
    refetch: fetchCategories,
  };
}
