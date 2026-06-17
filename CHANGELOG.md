# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Não lançado]

## [1.1.0] - 2026-06-17

### Adicionado

- **CS-19** — `WsAuthCustomerGuard` implementando `CanActivate` extraído do handler do order gateway, centralizando a validação do token WebSocket do cliente em um guard dedicado
- **CS-32** — `existEmail(email, excludeId?)` agora aceita um `excludeId` opcional para ignorar a própria entidade, permitindo validação de e-mail duplicado durante atualizações de cliente sem falsos positivos

### Alterado

- **CS-13** — Extraído `markOverdueFinances()` como comando separado no `FinanceService`, aplicando a separação de Comando-Consulta (CQS) para que o método de busca não altere estado como efeito colateral
- **CS-14** — Introduzida a utilitária genérica `paginate<T>(model, options)` em `utils/function.ts` usando `Promise.all` para count e findMany concorrentes; aplicada em `FinanceService`, `UserService`, `CustomerService` e `MenuService`
- **CS-15** — Extraídos os objetos `where` e `select` como variáveis nomeadas em todas as chamadas paginadas dos services, eliminando duplicação inline
- **CS-16** — Extraído `getTodayRange()` como método privado no `FinanceService`, eliminando cálculos repetidos de limite de data
- **CS-17** — Centralizado `hashPassword()` como utilitária assíncrona em `utils/function.ts` usando `bcrypt.genSalt()`; substituídas todas as chamadas inline de `bcrypt.hashSync` em `AuthService`, `UserService` e `CustomerService`
- **CS-22** — Substituído o alias `TRole` pelo enum `Role` diretamente no `UserService`, garantindo tipagem segura via enum já existente
- **CS-24** — Substituído o switch de `loyaltyPointsCheck` por um mapa constante `LOYALTY_POINTS: Record<TTypeCheck, number>`, simplificando a consulta de pontos para uma única expressão
- **CS-25** — Substituído o registro direto de `PrismaService` em `providers` pela importação do `PrismaModule` em `OrderModule`, `UserModule`, `CustomerModule`, `MenuModule` e `ContactModule`
- **CS-26** — Substituída a instância direta de `CustomerService` nos providers do `ContactModule` pela importação do `CustomerModule`, respeitando o encapsulamento de módulos do NestJS
- **CS-29** — `RevenueService.payRevenue()` agora delega a busca do cliente ao `CustomerService.findOne()` em vez de consultar `prisma.customer` diretamente; adicionado `status: true` ao select de `CustomerService.findOne()`
- **CS-33** — Centralizadas as interfaces `IUserReq` e `ICustomerReq` em `src/utils/types.d.ts`; atualizados `UserController` e `CustomerController` para importar a partir desse arquivo, removendo duplicação de interfaces locais
- **CS-35** — Extraídas as constantes `USER_TOKEN_TTL = '1 days'` e `CUSTOMER_TOKEN_TTL = '3 days'` no `AuthService`, substituindo strings mágicas inline em `createUserToken` e `createCustomerToken`

### Removido

- **CS-30** — Removidos os métodos mortos `findAllRevenue()` e `deleteAll()` do `RevenueService`, que nunca eram chamados por nenhum controller ou service
- **CS-31** — Removido o arquivo `UpdateRevenueDto` sem uso em `src/revenue/dto/`

### Corrigido

- **CS-05** — `switchStatus` agora lança `NotFoundException` quando o registro alvo não existe, em vez de não fazer nada silenciosamente
- **CS-06** — `payRevenue` agora valida a existência do registro de receita antes de alternar o status do pagamento, lançando `NotFoundException` para IDs inexistentes
- **CS-09** — Respostas de erro do WebSocket no order gateway não expõem mais objetos de exceção internos; os erros agora são serializados como mensagens simples
- **CS-10** — O DTO de criação de receita agora usa `@IsDateString()` em vez de `@IsString()` para o campo `date`, alinhando a validação com o tipo esperado
- **CS-11** — Corrigido o typo `emial` no enum `ContactType`, renomeado para `email`
- **CS-12** — Renomeados os arquivos de DTO que haviam sido criados com sufixo ` copy` para seus nomes canônicos
- **CS-18** — Removida a chamada duplicada de `checkCustomerToken` no order gateway, que era invocada duas vezes por conexão
- **CS-20** — Substituído `req: any` pelo tipo `IUserReq` nos parâmetros de requisição do `FinanceController`
- **CS-21** — Campos string em DTOs que mapeiam para enums agora utilizam tipos de enum explícitos com validação `@IsEnum()`, em vez de `string` puro
- **CS-23** — Padronizadas todas as mensagens de erro em alemão em `AuthService`, `CustomerService`, `UserService`, `MenuService`, `OrderService`, `FinanceService` e `RevenueService`; removidas as mensagens residuais em português
- **CS-27** — Adicionado `FindOrderQueryDto` com validação `@IsEnum` para os parâmetros de query `revenue` e `sequence` no `OrderController`
- **CS-28** — Adicionado `FindFinanceQueryDto` com validações `@IsDateString()`, `@IsInt()` e `@IsEnum()` para os parâmetros de query de finanças; habilitado `ValidationPipe({ transform: true })` globalmente no `main.ts`

### Segurança

- **CS-01** — Segredo JWT movido de string fixa para `process.env.JWT_SECRET`, evitando exposição de credenciais no controle de versão
- **CS-02** — Rotas de receita agora protegidas com `AuthGuard` e `RoleGuard`, impedindo acesso não autenticado
- **CS-04** — `origin` do CORS restrito à lista `allowedOrigins` derivada de `process.env.FRONT_URL`, bloqueando requisições cross-origin arbitrárias
- **CS-07** — Guards de autenticação agora lançam `UnauthorizedException` em tokens inválidos, em vez de permitir que a requisição passe silenciosamente
- **CS-08** — Header `Authorization` ausente ou malformado nos guards agora é tratado explicitamente, retornando resposta não autorizada em vez de lançar um erro não tratado

## [1.0.0] - 2025-01-01

### Adicionado

- Lançamento inicial: backend NestJS com autenticação, gestão de clientes, CRUD de cardápio, gateway de pedidos via WebSocket, módulo financeiro e rastreamento de receitas para a Pizzaria Bei Giovanni
