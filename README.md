# 📌 Sistema de Gestão de Pizzaria

Sistema completo de **gestão de pizzaria**, dividido em três partes:

## 1. 📝 Descrição do Projeto
1. **Backoffice (Front React):** Painel administrativo para gerenciar clientes, pedidos, financeiro, funcionários e itens do cardápio. Pedidos chegam em **tempo real** via Socket.io.
2. **Cliente (Front React):** Landing page + área do cliente com histórico de pedidos, pontuação acumulada e possibilidade de **adicionar itens ao carrinho e fazer pedidos**. Cada pedido gera pontos.
3. **Backend (NestJS + Prisma):** Mantem a logica de tudo, com **autenticação**, **roles/permissions** e comunicação em tempo real via Socket.io.

## 2. ⚙️ Tecnologias
- **Backoffice e Customer:** React, TypeScript, Socket.io, styled-components
- **Backend:** NestJS, TypeScript, Socket.io, JWT Auth, Roles, **Prisma**

## 3. 🏗️ Estrutura dos Projetos
- `backoffice-frontend/` → painel administrativo
- `client-frontend/` → área do cliente + landing page
- `backend/` → API NestJS com autenticação, roles e Socket.io

## 4. 🚀 Como rodar
- Instruções separadas para **frontend backoffice**, **frontend cliente** e **backend**.
- Comandos de instalação (`npm install`) e execução (`npm run dev`)
- URLs padrão:
  - Backend: `http://localhost:3000`
  - Frontend: `http://localhost:5173`

## 5. 📚 Rotas e Funcionalidades principais
- **Backend:**
  - Auth: login, roles
  - CRUD: clientes, pedidos, funcionários, itens do cardápio
  - Socket.io: pedidos em tempo real
- **Cliente:**
  - Visualizar pedidos, pontuação, histórico
  - **Adicionar itens ao carrinho e fazer pedidos**
- **Backoffice:**
  - Gerenciar todos os recursos (CRUD completo)

## 7. 📝 Licença
- MIT
