# FinControl - Sistema de Controle Financeiro

## 🏛️ Instituto Superior Politécnico do Bié

Sistema de controle de custos e gestão financeira desenvolvido em Next.js com TypeScript para o Instituto Superior Politécnico do Bié.

## ✨ Funcionalidades Principais

### 💰 Dashboard Financeiro
- Resumo executivo de receitas e despesas
- Visão geral do saldo atual
- Indicadores de performance financeira
- Interface premium com sidebar de navegação

### 📋 Gestão de Faturas
- **Registro completo**: Cadastro de faturas recebidas de fornecedores
- **Fluxo hierárquico**: Sistema de aprovação em 5 etapas:
  1. Fornecedor → Submissão inicial
  2. Gabinete de Contratação → Análise técnica
  3. Presidente → Aprovação estratégica
  4. Gabinete de Apoio → Validação administrativa
  5. Finanças → Processamento do pagamento
- **Rastreamento**: Acompanhamento completo do status de cada fatura
- **Alertas**: Notificações de faturas vencidas
- **Documentos**: Sistema de anexos para comprovantes

### 💸 Controle de Transações
- Registro de receitas e despesas
- Categorização por tipo de transação
- Histórico completo com filtros avançados
- Status de confirmação (pendente, confirmada, cancelada)

### 🏢 Gestão de Fornecedores
- Cadastro completo de fornecedores
- Informações de contato e dados fiscais
- Controle de status (ativo, inativo, pendente)
- Histórico de transações por fornecedor

### 📊 Relatórios Financeiros
- Relatórios executivos com métricas principais
- Análise de receitas vs despesas
- Fluxo de caixa e projeções
- Relatórios por categoria e fornecedor
- Exportação de dados

### ⚙️ Configurações do Sistema
- Configurações institucionais
- Gestão de usuários e permissões
- Configuração do workflow de aprovação
- Sistema de backup e restauração
- Personalização de notificações

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript (strict mode)
- **Estilização**: Tailwind CSS
- **Componentes**: React 19
- **Build Tool**: Turbopack
- **Moeda**: Kwanza Angolano (AOA)

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # Páginas (App Router)
│   ├── page.tsx           # Dashboard principal
│   ├── faturas/           # Gestão de faturas
│   ├── transacoes/        # Controle de transações
│   ├── fornecedores/      # Gestão de fornecedores
│   ├── relatorios/        # Relatórios financeiros
│   └── configuracoes/     # Configurações do sistema
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Button, Input, etc.)
│   ├── layout/           # Layout principal e sidebar
│   ├── dashboard/        # Componentes do dashboard
│   ├── transactions/     # Componentes de transações
│   └── invoices/         # Componentes de faturas
├── hooks/                # Custom hooks
│   ├── useTransactions.ts
│   └── useInvoices.ts
├── types/                # Definições TypeScript
├── data/                 # Dados mockados para MVP
└── utils/                # Utilitários e helpers
```

## 🚀 Como Executar

1. **Instalação das dependências**:
```bash
npm install
```

2. **Execução em modo desenvolvimento**:
```bash
npm run dev
```

3. **Acesso ao sistema**:
- Local: http://localhost:3000
- Network: http://192.168.1.5:3000

## 💰 Sistema Monetário

O sistema utiliza o **Kwanza Angolano (AOA)** como moeda padrão, com formatação localizada para Angola:
- Formato: `123.456,78 Kz`
- Locale: `pt-AO`
- Currency: `AOA`

## 👥 Fluxo de Aprovação

### Hierarquia de Aprovação de Faturas:
1. **Fornecedor** - Submissão da fatura
2. **Gabinete de Contratação** - Análise técnica e conformidade
3. **Presidente** - Aprovação estratégica e orçamentária
4. **Gabinete de Apoio** - Validação administrativa
5. **Finanças** - Processamento final e pagamento

Cada etapa permite:
- ✅ Aprovação com comentários
- ❌ Rejeição com motivos
- 📝 Solicitação de esclarecimentos
- 📄 Anexo de documentos adicionais

## 🎨 Design Premium

- **Interface moderna**: Gradientes e sombras premium
- **Sidebar responsiva**: Navegação intuitiva com ícones
- **Cards informativos**: Exibição clara de métricas
- **Cores temáticas**: 
  - Verde: Receitas e aprovações
  - Vermelho: Despesas e rejeições
  - Azul: Informações neutras
  - Amarelo: Alertas e pendências

## 📱 Responsividade

- **Desktop**: Layout completo com sidebar
- **Tablet**: Sidebar colapsável
- **Mobile**: Navegação por menu hambúrguer
- **Adaptativo**: Componentes que se ajustam automaticamente

## 🔒 Segurança e Backup

- **Backup automático**: Configurado para execução diária
- **Controle de acesso**: Sistema de roles e permissões
- **Auditoria**: Log completo de todas as ações
- **Validação**: Verificação rigorosa de dados

## 📈 Próximas Funcionalidades

- [ ] Gráficos interativos (Chart.js)
- [ ] Integração com banco de dados
- [ ] Sistema de autenticação
- [ ] API para integração externa
- [ ] Notificações push
- [ ] Relatórios em PDF
- [ ] Dashboard em tempo real

## 🤝 Contribuição

Este é um MVP (Produto Mínimo Viável) desenvolvido especificamente para o Instituto Superior Politécnico do Bié. Para modificações ou melhorias, siga as diretrizes de desenvolvimento estabelecidas.

## 📞 Suporte

Sistema desenvolvido com foco na realidade angolana e nas necessidades específicas da instituição de ensino superior.

---

**Desenvolvido com ❤️ para o Instituto Superior Politécnico do Bié**
**Tecnologia: Next.js 15 + TypeScript + Tailwind CSS**
**Versão: 1.0.0 - Janeiro 2025**
