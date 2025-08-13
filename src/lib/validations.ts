import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['receita', 'despesa']),
  amount: z.number({ invalid_type_error: 'Valor inválido' }).positive('Valor deve ser positivo'),
  description: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'Data inválida (YYYY-MM-DD)'),
  status: z.enum(['pendente','confirmada','cancelada']).default('pendente'),
  tags: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['receita', 'despesa']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida'),
  description: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
