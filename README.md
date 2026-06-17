# 🍕 Sistema de Gestão de Pizzaria

Sistema completo de **gestão de pizzaria**, dividido em três partes:

## 📝 Descrição do Projeto

O sistema é composto por três aplicações integradas:

### 1. Backoffice (Frontend React)

Painel administrativo responsável pelo gerenciamento da operação da pizzaria.

Funcionalidades:

* Gerenciamento de clientes
* Gerenciamento de pedidos
* Controle financeiro
* Gestão de funcionários
* Gestão de itens do cardápio
* Recebimento de pedidos em tempo real via Socket.io

### 2. Cliente (Frontend React)

Landing page institucional e área do cliente.

Funcionalidades:

* Cadastro e autenticação
* Histórico de pedidos
* Sistema de pontuação/fidelidade
* Carrinho de compras
* Realização de pedidos online

### 3. Backend (NestJS + Prisma)

API responsável por toda a lógica de negócio da aplicação.

Funcionalidades:

* Autenticação JWT
* Controle de acesso por Roles e Permissions
* CRUD completo dos recursos
* Comunicação em tempo real com Socket.io
* Persistência de dados com Prisma ORM

---

## ⚙️ Tecnologias Utilizadas

### Frontend (Backoffice e Cliente)

* React
* TypeScript
* Socket.io Client
* Styled Components
* Vitest

### Backend

* NestJS
* TypeScript
* Prisma ORM
* JWT Authentication
* Socket.io
* Jest

---

## 🏗️ Estrutura do Projeto

```text
├── backoffice-frontend/
├── client-frontend/
├── backend/
└── .github/
    └── workflows/
```

### Diretórios

| Diretório             | Descrição                      |
| --------------------- | ------------------------------ |
| `backoffice-frontend` | Painel administrativo          |
| `client-frontend`     | Landing page e área do cliente |
| `backend`             | API NestJS                     |
| `.github/workflows`   | Pipeline CI/CD                 |

---

## 🚀 Como Executar

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Disponível em:

```text
http://localhost:3000
```

### Frontend - Backoffice

```bash
cd backoffice-frontend
npm install
npm run dev
```

### Frontend - Cliente

```bash
cd client-frontend
npm install
npm run dev
```

Disponível em:

```text
http://localhost:5173
```

---

## 📚 Funcionalidades Principais

### Backend

#### Autenticação

* Login de usuários
* Login de clientes
* JWT Authentication
* Controle por Roles

#### CRUDs

* Clientes
* Pedidos
* Funcionários
* Itens do cardápio

#### Tempo Real

* Atualização de pedidos via Socket.io

---

### Área do Cliente

* Consulta de histórico de pedidos
* Consulta de pontuação acumulada
* Carrinho de compras
* Realização de pedidos
* Programa de fidelidade

---

### Backoffice

* Gerenciamento de clientes
* Gerenciamento de pedidos
* Gerenciamento financeiro
* Gerenciamento de funcionários
* Gerenciamento de cardápio
* Monitoramento em tempo real

---

# 🧪 Testes Automatizados

Durante o processo de melhoria e refatoração do sistema foram implementados testes automatizados para validar regras de negócio, autenticação e funções utilitárias.

## Backend (Jest)

### Arquivos de Teste

#### `backend/test/utils.spec.ts`

Valida:

* Geração de mensagens em alemão (`messageGenerator`)
* Cálculo de pontos de fidelidade (`loyaltyPointsCheck`)
* Paginação (`paginate`)

  * Total de páginas
  * Cálculo correto de `skip`

#### `backend/test/auth.service.spec.ts`

Valida:

* Login de usuários inexistentes
* Login de clientes inexistentes
* Lançamento de `NotFoundException`
* Lançamento de `ForbiddenException`
* Validação de tokens JWT

### Correções

Foi corrigido o teste:

```text
revenue.service.spec.ts
```

que estava incompatível com uma refatoração anterior do serviço.

---

## Customer Frontend (Vitest)

### Arquivo de Teste

#### `customer/test/functions.test.ts`

Valida:

* `intlNumberFormatter`
* `listConfig`

  * Todos os tipos
  * Todos os tamanhos em alemão
* `thenHandler`

  * Execução correta do `toast.success`
* `dateFormatter`

  * Retorno `undefined` para valores nulos

---

## Configuração dos Testes

### Vitest

Adicionado suporte ao Vitest em:

```text
backoffice/vite.config.ts
customer/vite.config.ts
```

Scripts adicionados:

```json
{
  "test": "vitest",
  "test:watch": "vitest --watch"
}
```

---

### Jest

Atualizado para buscar testes em:

```text
src/
test/
```

permitindo melhor separação entre código de produção e testes.

---

# 🔄 Integração Contínua (CI)

Foi criado um pipeline automatizado utilizando GitHub Actions.

Arquivo:

```text
.github/workflows/test.yml
```

### Execução

Disparado automaticamente em:

* Push para a branch `main`
* Pull Requests para `main`

### Jobs Executados

| Job        | Objetivo               |
| ---------- | ---------------------- |
| Backend    | Executar testes Jest   |
| Backoffice | Executar testes Vitest |
| Customer   | Executar testes Vitest |

Os três jobs são executados em paralelo para reduzir o tempo de validação.

---

# 📊 Resultado Final

| Aplicação  | Quantidade de Testes | Status           |
| ---------- | -------------------- | ---------------- |
| Backend    | 25                   | ✅ Todos passando |
| Backoffice | 5                    | ✅ Todos passando |
| Customer   | 11                   | ✅ Todos passando |

### Total

```text
41 testes automatizados executados com sucesso.
```

Todos os módulos do sistema possuem validações automatizadas integradas ao pipeline de CI, garantindo maior confiabilidade e facilitando futuras manutenções e evoluções do projeto.

---

## 📝 Licença

Distribuído sob a licença MIT.
