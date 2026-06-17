# 🍕 Sistema de Gestão de Pizzaria

Sistema completo de **gestão de pizzaria**, dividido em três partes:

## 📝 Descrição do Projeto

O sistema é composto por três aplicações integradas:

### 1. Backend (NestJS + Prisma)

API responsável por toda a lógica de negócio da aplicação.

**Funcionalidades:**

* Autenticação JWT
* Controle de acesso por Roles e Permissions
* CRUD completo dos recursos
* Comunicação em tempo real com Socket.io
* Persistência de dados com Prisma ORM

> Os módulos de **Backoffice (Frontend React)** e **Cliente (Frontend React)** não foram analisados durante o processo de Clean Code, sendo o foco do trabalho exclusivamente o Backend.

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

| Diretório           | Descrição      |
| ------------------- | -------------- |
| `backend`           | API NestJS     |
| `.github/workflows` | Pipeline CI/CD |

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

## Configuração dos Testes

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

| Job     | Objetivo                                    |
| ------- | ------------------------------------------- |
| Backend | Executar testes Jest e análise de cobertura |

---

# 📊 Resultado Final

## Cobertura de Testes (Jest)

| Métrica         | Resultado        |
| --------------- | ---------------- |
| Statements      | 17,96% (152/846) |
| Branches        | 14,81% (20/135)  |
| Functions       | 14,86% (22/148)  |
| Lines           | 16,99% (129/759) |
| Cobertura Média | **16,16%**       |

### Principais módulos cobertos

| Módulo  | Coverage |
| ------- | -------- |
| Utils   | 95%      |
| Guards  | 57,57%   |
| Auth    | 48,27%   |
| Prisma  | 45,45%   |
| Revenue | 37,93%   |

### Resumo

| Aplicação | Quantidade de Testes | Coverage Médio | Status           |
| --------- | -------------------- | -------------- | ---------------- |
| Backend   | 25                   | 16,16%         | ✅ Todos passando |

### Total

```text
25 testes automatizados executados com sucesso.
```

Os testes foram integrados ao pipeline de CI e executados automaticamente a cada alteração na branch principal ou abertura de Pull Requests, contribuindo para a confiabilidade da aplicação e permitindo a evolução contínua da base de código.

---

## 📝 Licença

Distribuído sob a licença MIT.
