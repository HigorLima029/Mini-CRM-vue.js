# 🏢 Vue CRM - Sistema de Gestão de Clientes

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)
![Vuex](https://img.shields.io/badge/Vuex-4.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Um Mini CRM moderno e responsivo desenvolvido com Vue.js 3, demonstrando boas práticas de arquitetura frontend e gerenciamento de estado.

[🌐 Demo ao Vivo](https://seu-projeto.vercel.app) • [�documentation](#-funcionalidades) • [🚀 Instalação](#-instalação)

</div>

---
## ✨ Funcionalidades

### 📊 Dashboard
- Cards com métricas em tempo real (total de clientes, ativos, valor total, ticket médio)
- Gráficos interativos com Chart.js
- Visão geral do pipeline de vendas
- Lista de clientes recentes

### 👥 Gestão de Clientes
- ✅ **CRUD Completo** (Criar, Ler, Atualizar, Deletar)
- 🔍 Busca em tempo real
- 🏷️ Filtros por status e estágio
- 📱 Tabela responsiva com Vuetify

### 🎯 Pipeline de Vendas (Kanban)
- Visualização em colunas: **Lead → Contato → Fechado**
- Movimentação de clientes entre estágios
- Cards com informações resumidas
- Atualização em tempo real

### 📈 Relatórios
- Métricas de performance
- Gráficos de vendas mensais
- Taxa de conversão
- Exportação (em desenvolvimento)

---

## 🛠️ Tecnologias Utilizadas

### Core
|
 Tecnologia 
|
 Versão 
|
 Descrição 
|
|
**
Vue.js
**
|
 3.x 
|
 Framework JavaScript progressivo 
|
|
**
Vuex
**
|
 4.x 
|
 Gerenciamento de estado centralizado (Flux) 
|
|
**
Vue Router
**
|
 4.x 
|
 Roteamento SPA 
|
|
**
Vuetify
**
|
 3.x 
|
 Framework de componentes Material Design 
|

### Ferramentas
|
 Tecnologia 
|
 Descrição 

|
|
**
Vite
**
|
 Build tool e dev server 
|
|
**
Axios
**
|
 Cliente HTTP para requisições API 
|
|
**
Chart.js
**
|
 Gráficos interativos 
|
|
**
Vue ChartJS
**
|
 Wrapper do Chart.js para Vue 
|

### Arquitetura
src/
├── components/ # Componentes reutilizáveis
│ ├── dashboard/ # Componentes do dashboard
│ └── customers/ # Componentes de clientes
├── views/ # Páginas/Views
├── store/ # Vuex Store
│ └── modules/ # Módulos do Vuex
├── router/ # Configuração de rotas
├── services/ # Serviços (API)
└── plugins/ # Plugins (Vuetify)

text

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/vue-crm.git

# 2. Entre na pasta
cd vue-crm

# 3. Instale as dependências
npm install

# 4. Rode o projeto
npm run dev

# 5. Acesse no navegador
http://localhost:5173
📦 Scripts Disponíveis
Comando	Descrição
npm run dev	Inicia o servidor de desenvolvimento
npm run build	Gera build de produção
npm run preview	Preview do build de produção
npm run lint	Executa o linter
🏗️ Arquitetura e Padrões
Vuex Store (Flux Pattern)
javascript
// Estado centralizado com módulos
store/
├── index.js           # Store principal
└── modules/
    └── customers.js   # Módulo de clientes
        ├── state      # Estado
        ├── getters    # Computações derivadas
        ├── mutations  # Modificações síncronas
        └── actions    # Operações assíncronas
Componentes
Composition API com setup()
Props e Emits bem definidos
Componentes reutilizáveis e desacoplados
Rotas
Lazy loading para otimização
Meta fields para títulos e ícones
Navegação com Vue Router
🔄 Fluxo de Dados
text
┌─────────────────────────────────────────────────────────┐
│                         VUEX                             │
│  ┌─────────┐    ┌──────────┐    ┌─────────────────┐     │
│  │ Actions │───▶│ Mutations│───▶│      State      │     │
│  └─────────┘    └──────────┘    └─────────────────┘     │
│       ▲                                │                 │
│       │                                ▼                 │
│  ┌─────────┐                    ┌─────────────────┐     │
│  │  API    │                    │    Getters      │     │
│  └─────────┘                    └─────────────────┘     │
│                                        │                 │
└────────────────────────────────────────│─────────────────┘
                                         ▼
                              ┌─────────────────┐
                              │   Components    │
                              └─────────────────┘
📱 Responsividade
O sistema é totalmente responsivo, adaptando-se a:

🖥️ Desktop (1200px+)
💻 Laptop (992px - 1199px)
📱 Tablet (768px - 991px)
📱 Mobile (< 768px)
🎨 Temas e Customização
Cores Principais
Cor	Hex	Uso
Primary	#6366f1	Ações principais
Success	#10b981	Status ativo
Warning	#f59e0b	Status pendente
Error	#ef4444	Status inativo
Customização
O tema pode ser customizado em src/plugins/vuetify.js

🔮 Roadmap / Melhorias Futuras
 Autenticação JWT
 Backend com Node.js/Express
 Banco de dados PostgreSQL
 Testes unitários com Vitest
 Testes E2E com Cypress
 PWA (Progressive Web App)
 Modo escuro (Dark Mode)
 Exportação PDF/Excel
 Notificações push
 Dashboard customizável
 
👨‍💻 Autor

Higor de LIMA

LinkedIn: https://www.linkedin.com/in/higor-lima-594b46175/
GitHub: https://github.com/HigorLima029

