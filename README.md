# FinControl - Sistema de Controle de Custos

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Sistema de controle financeiro desenvolvido para o **Instituto Superior Politécnico do Bie**, criado como MVP (Produto Mínimo Viável) para gestão de receitas, despesas e controle orçamentário.

## 🏫 Sobre o Projeto

O FinControl é uma aplicação web moderna e **totalmente responsiva** desenvolvida em Next.js que permite ao Instituto Superior Politécnico do Bie gerenciar suas finanças de forma eficiente e organizada.

## ✨ Funcionalidades Principais

### 📊 Dashboard Financeiro
- Visão geral com resumo de receitas, despesas e saldo atual
- Cards informativos com métricas financeiras em tempo real
- Interface responsiva que adapta para mobile, tablet e desktop

### 💰 Gestão de Transações
- **CRUD Completo**: Cadastro, edição, visualização e exclusão de transações
- **Categorização Inteligente**: Sistema específico para instituições educacionais
- **Filtros Avançados**: Por categoria, tipo, período e status
- **Tabela Responsiva**: Layout adaptável - cards em mobile, tabela em desktop

### 📋 Sistema de Faturas
- **Controle Completo**: Gestão de faturas de fornecedores
- **Fluxo Hierárquico**: Sistema de aprovação seguindo organização institucional
- **Workflow Tracking**: Acompanhamento visual do status de cada fatura
- **Interface Dual**: Cards otimizados para mobile, tabelas para desktop

### 📱 Design Responsivo
- **Mobile-First**: Interface otimizada para dispositivos móveis
- **Breakpoints Inteligentes**: Adaptação fluida entre dispositivos
- **Touch-Friendly**: Botões e interações otimizadas para touch
- **Performance**: Carregamento rápido em qualquer dispositivo

## 🎯 Categorias Pré-configuradas

### 💸 **Despesas**
- **Recursos Humanos**: Salários, benefícios, formação
- **Infraestrutura**: Energia, água, internet, manutenção, segurança
- **Material Didático**: Livros, softwares educacionais, material escolar
- **Laboratórios**: Equipamentos científicos, reagentes, manutenção
- **Administrativo**: Papelaria, seguros, serviços terceirizados
- **Marketing**: Publicidade, eventos, material promocional

### 💰 **Receitas**
- **Mensalidades**: Propinas dos estudantes
- **Taxas**: Matrícula, inscrição, certificados
- **Cursos de Extensão**: Formação continuada, workshops
- **Parcerias**: Convênios, projetos colaborativos
- **Subsídios**: Apoio governamental, bolsas, financiamentos

## 🚀 Tecnologias Utilizadas

- **Framework**: [Next.js 15](https://nextjs.org/) com App Router
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 3](https://tailwindcss.com/)
- **UI Framework**: [React 19](https://react.dev/)
- **Build Tool**: Turbopack (desenvolvimento otimizado)
- **Deployment**: Pronto para Vercel, Netlify ou AWS

## 📱 Estratégia de Responsividade

### 🎨 **Design System**
- **Mobile-First**: Interface base otimizada para smartphones
- **Breakpoints**: `sm:640px` → `md:768px` → `lg:1024px` → `xl:1280px`
- **Layout Duplo**: Cards para mobile, tabelas para desktop
- **Touch Optimization**: Botões e áreas de toque otimizadas

### 📊 **Componentes Adaptativos**
- **Tabelas Responsivas**: Scroll horizontal + layout de cards
- **Formulários**: Campos empilhados em mobile, grid em desktop
- **Navegação**: Sidebar colapsável com backdrop em mobile
- **Dashboard**: Cards redimensionáveis com informações prioritárias

## 📋 Fluxo de Aprovação de Faturas

O sistema implementa um fluxo hierárquico personalizado para aprovação de faturas:

1. **Fornecedor** → Entrega fatura após prestação de serviço
2. **Gabinete de Contratação** → Recebe, verifica se há contrato/documentação, inicia validação
3. **Presidente** → Autoriza ou não a continuidade do processo
4. **Gabinete de Apoio** → Registra a fatura autorizada  
5. **Finanças** → Efetua o pagamento
6. **Sistema** → Registra, controla e atualiza os estados e valores pagos/pendentes

### Estados das Faturas

- **Pendente Contratação**: Aguardando verificação do Gabinete de Contratação
- **Pendente Presidente**: Aguardando autorização do Presidente  
- **Aprovada - Aguarda Registro**: Aprovada pelo Presidente, aguardando registro
- **Registrada**: Registrada no Gabinete de Apoio
- **Pendente Pagamento**: Enviada para o departamento de Finanças
- **Paga**: Pagamento efetuado com sucesso
- **Rejeitada**: Rejeitada em qualquer etapa do processo
- **Cancelada**: Fatura cancelada

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação e Execução

1. **Clone o repositório** (se aplicável) ou navegue até a pasta do projeto

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Execute o projeto em modo desenvolvimento**:
   ```bash
   npm run dev
   ```

## 🔧 Instalação e Configuração

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** 
- **Git** ([Download](https://git-scm.com/))

### 🚀 **Instalação Rápida**

```bash
# 1. Clone o repositório
git clone https://github.com/HaleluiaLuis/fincontrol.git

# 2. Navegue para o diretório
cd fincontrol

# 3. Instale as dependências
npm install
# ou
yarn install

# 4. Execute o projeto em modo de desenvolvimento
npm run dev
# ou
yarn dev

# 5. Acesse a aplicação
# Abra http://localhost:3000 no seu navegador
```

### ⚙️ **Scripts Disponíveis**

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Cria build de produção
npm run start        # Inicia o servidor de produção
npm run lint         # Executa verificação de código
npm run type-check   # Verifica tipos TypeScript
```

## 📱 Screenshots

### 🖥️ **Desktop**
- **Dashboard**: Visão completa com todas as métricas
- **Tabelas**: Layout completo com todas as colunas
- **Sidebar**: Navegação expandida com descrições

### 📱 **Mobile**
- **Dashboard**: Cards otimizados para toque
- **Listas**: Cards verticais com informações essenciais
- **Menu**: Sidebar colapsável com overlay

### 🖥️ **Tablet**
- **Layout Híbrido**: Combinação entre mobile e desktop
- **Navegação**: Sidebar adaptável conforme orientação

## 💡 Como Usar

### ➕ **Adicionar Nova Transação**

1. **Acesso**: Clique no botão `+ Nova Transação` no header
2. **Preenchimento**:
   - **Tipo**: 💰 Receita ou 💸 Despesa
   - **Categoria**: Selecione categoria apropriada
   - **Descrição**: Detalhes da transação
   - **Valor**: Quantia em AOA (Kwanza Angolano)
   - **Data**: Data da movimentação
   - **Status**: ⏳ Pendente, ✅ Confirmada ou ❌ Cancelada
3. **Confirmação**: Clique em `Adicionar Transação`

### 📋 **Gestão de Faturas**

1. **Navegação**: Acesse `📋 Gestão de Faturas` no menu
2. **Visualização**: Consulte resumo por status de aprovação
3. **Ações Disponíveis**:
   - **👁️ Ver Detalhes**: Informações completas + workflow tracker
   - **✅ Aprovar**: Avançar fatura (conforme permissões do usuário)
   - **❌ Rejeitar**: Rejeitar com comentários obrigatórios
4. **Acompanhamento**: Monitor progress no fluxo hierárquico

### 📊 **Dashboard Financeiro**

1. **Resumo**: Visualize métricas principais em cards responsivos
2. **Gráficos**: Acompanhe tendências de receitas vs despesas
3. **Filtros**: Use filtros por período, categoria e tipo
4. **Relatórios**: Exporte dados para análise externa

## 📁 Estrutura do Projeto

```
fincontrol/
├── 📁 .github/
│   └── copilot-instructions.md   # Instruções para GitHub Copilot
├── 📁 src/
│   ├── 📁 app/                   # App Router do Next.js 15
│   │   ├── 📄 globals.css        # Estilos globais + Tailwind
│   │   ├── 📄 layout.tsx         # Layout raiz da aplicação
│   │   ├── 📄 page.tsx           # Dashboard principal (/)
│   │   ├── 📁 transacoes/        # Página de transações (/transacoes)
│   │   ├── 📁 faturas/           # Página de faturas (/faturas)
│   │   ├── 📁 fornecedores/      # Página de fornecedores (/fornecedores)
│   │   ├── 📁 relatorios/        # Página de relatórios (/relatorios)
│   │   └── 📁 configuracoes/     # Página de configurações (/configuracoes)
│   ├── 📁 components/            # Componentes React reutilizáveis
│   │   ├── 📁 dashboard/         # Cards de resumo financeiro
│   │   ├── 📁 transactions/      # Formulários e tabelas de transações
│   │   ├── 📁 invoices/          # Componentes de gestão de faturas
│   │   ├── 📁 layout/            # Header, Sidebar, MainLayout
│   │   └── 📁 ui/                # Button, Card, Input (design system)
│   ├── 📁 data/                  # Dados mock para desenvolvimento
│   ├── 📁 hooks/                 # Custom hooks (useTransactions, useInvoices)
│   └── 📁 types/                 # Definições TypeScript
├── 📄 package.json               # Dependências e scripts
├── 📄 tailwind.config.js         # Configuração do Tailwind CSS
├── 📄 tsconfig.json              # Configuração do TypeScript
└── 📄 README.md                  # Este arquivo
```

## 🎯 Próximas Funcionalidades (Roadmap)

### 🔄 **Fase 2: Integração Backend**
- [ ] **Banco de Dados**: PostgreSQL/MongoDB integration
- [ ] **Autenticação**: Sistema de login com diferentes perfis
- [ ] **API REST**: Endpoints para CRUD de todas entidades
- [ ] **Persistência**: Substituir mock data por dados reais

### 📊 **Fase 3: Analytics Avançados**
- [ ] **Relatórios PDF**: Geração automática de relatórios
- [ ] **Gráficos Interativos**: Charts.js ou Recharts integration
- [ ] **Dashboard Analytics**: Métricas avançadas e KPIs
- [ ] **Exportação**: Excel, CSV, PDF export capabilities

### 🔧 **Fase 4: Funcionalidades Avançadas**
- [ ] **Notificações**: Sistema de alertas e lembretes
- [ ] **Backup Automático**: Sistema de backup de dados
- [ ] **Audit Log**: Histórico de alterações e ações
- [ ] **Multi-tenancy**: Suporte para múltiplas instituições

### 📱 **Fase 5: Mobile App**
- [ ] **PWA**: Progressive Web App com offline support
- [ ] **App Nativo**: React Native ou Flutter app
- [ ] **Push Notifications**: Notificações push mobile
- [ ] **Sincronização**: Sync entre web e mobile

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 📋 **Guidelines de Contribuição**
- **Código**: Siga os padrões TypeScript e ESLint
- **Commits**: Use conventional commits (feat:, fix:, docs:)
- **Testes**: Adicione testes para novas funcionalidades
- **Documentação**: Atualize README quando necessário

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Halelúia Luís**
- GitHub: [@HaleluiaLuis](https://github.com/HaleluiaLuis)
- Email: [haleluialuis@gmail.com](mailto:haleluialuis@gmail.com)

## 🙏 Agradecimentos

- **Instituto Superior Politécnico do Bie** - Cliente e inspiração do projeto
- **Next.js Team** - Framework incrível para React
- **Tailwind CSS** - Sistema de design utility-first
- **Vercel** - Plataforma de deploy e hospedagem

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no GitHub!**

🚀 **Deploy:** [FinControl Live Demo](https://fincontrol-halelualuis.vercel.app) *(em breve)*
- [ ] Sistema de autenticação
- [ ] Relatórios avançados com gráficos
- [ ] Exportação de dados (PDF, Excel)
- [ ] Sistema de aprovação de despesas
- [ ] Planejamento orçamentário
- [ ] Notificações de vencimentos
- [ ] API REST para integração

## 🤝 Contribuição

Este é um projeto MVP. Para contribuições ou sugestões, entre em contato com a equipe de desenvolvimento.

## 📄 Licença

Este projeto foi desenvolvido especificamente para o Instituto Superior Politécnico do Bie.

---

**Instituto Superior Politécnico do Bie** - Sistema de Controle Financeiro v1.0
