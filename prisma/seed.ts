import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar usuários padrão do sistema
  await prisma.user.upsert({
    where: { email: 'admin@ispobie.ao' },
    update: {},
    create: {
      name: 'Administrador Sistema',
      email: 'admin@ispobie.ao',
      role: 'ADMIN',
      department: 'TI',
    },
  })

  await prisma.user.upsert({
    where: { email: 'contratacao@ispobie.ao' },
    update: {},
    create: {
      name: 'Gabinete de Contratação',
      email: 'contratacao@ispobie.ao',
      role: 'GABINETE_CONTRATACAO',
      department: 'Contratação',
    },
  })

  await prisma.user.upsert({
    where: { email: 'presidente@ispobie.ao' },
    update: {},
    create: {
      name: 'Presidente ISPB',
      email: 'presidente@ispobie.ao',
      role: 'PRESIDENTE',
      department: 'Presidência',
    },
  })

  await prisma.user.upsert({
    where: { email: 'apoio@ispobie.ao' },
    update: {},
    create: {
      name: 'Gabinete de Apoio',
      email: 'apoio@ispobie.ao',
      role: 'GABINETE_APOIO',
      department: 'Apoio Administrativo',
    },
  })

  await prisma.user.upsert({
    where: { email: 'financas@ispobie.ao' },
    update: {},
    create: {
      name: 'Departamento Finanças',
      email: 'financas@ispobie.ao',
      role: 'FINANCAS',
      department: 'Finanças',
    },
  })

  // Criar categorias padrão
  const categorias = [
    { name: 'Material de Escritório', type: 'DESPESA' as const, color: '#ef4444' },
    { name: 'Serviços de Manutenção', type: 'DESPESA' as const, color: '#f97316' },
    { name: 'Combustível', type: 'DESPESA' as const, color: '#eab308' },
    { name: 'Telefone e Internet', type: 'DESPESA' as const, color: '#22c55e' },
    { name: 'Material Didático', type: 'DESPESA' as const, color: '#3b82f6' },
    { name: 'Serviços de Limpeza', type: 'DESPESA' as const, color: '#8b5cf6' },
    { name: 'Propinas Estudantes', type: 'RECEITA' as const, color: '#10b981' },
    { name: 'Taxas Administrativas', type: 'RECEITA' as const, color: '#059669' },
    { name: 'Outras Receitas', type: 'RECEITA' as const, color: '#0d9488' },
  ]

  for (const categoria of categorias) {
    await prisma.category.create({
      data: categoria,
    })
  }

  // Criar alguns fornecedores exemplo
  const fornecedores = [
    {
      name: 'Papelaria Central Ltda',
      taxId: '5401234567',
      email: 'vendas@papelcentral.ao',
      phone: '+244 222 123 456',
      address: 'Rua Principal, 123, Kuito, Bié',
      status: 'ATIVO' as const,
    },
    {
      name: 'Serviços de Manutenção SA',
      taxId: '5401234568',
      email: 'servicos@manutencao.ao',
      phone: '+244 222 789 012',
      address: 'Av. da Independência, 456, Kuito, Bié',
      status: 'ATIVO' as const,
    },
    {
      name: 'Combustíveis do Bié',
      taxId: '5401234569',
      email: 'vendas@combbie.ao',
      phone: '+244 222 345 678',
      address: 'Estrada Nacional, Km 5, Kuito, Bié',
      status: 'ATIVO' as const,
    },
  ]

  for (const fornecedor of fornecedores) {
    await prisma.supplier.upsert({
      where: { taxId: fornecedor.taxId },
      update: {},
      create: fornecedor,
    })
  }

  console.log('✅ Seed executado com sucesso!')
  console.log('Usuários criados:', 5)
  console.log('Categorias criadas:', categorias.length)
  console.log('Fornecedores criados:', fornecedores.length)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
