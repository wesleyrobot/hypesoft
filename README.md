# Hypesoft - Sistema de Gestão de Produtos

Sistema completo de gestão de produtos desenvolvido como desafio técnico da Hypesoft.

## Demo

[Clique aqui para assistir ao vídeo de apresentação](demo.mp4)

> Para assistir diretamente no GitHub, acesse o arquivo [demo.mp4](demo.mp4) no repositório — o GitHub abrirá o player de vídeo automaticamente.

## Stack Tecnológica

### Frontend
- React 18 + TypeScript + Vite
- TailwindCSS + componentes customizados (Shadcn-style)
- TanStack Query (React Query)
- React Hook Form + Zod
- Recharts (gráficos)
- Keycloak JS (autenticação)

### Backend
- .NET 9 + C#
- Clean Architecture + DDD
- CQRS + MediatR
- MongoDB Driver
- FluentValidation
- AutoMapper
- Serilog
- Swagger/OpenAPI

### Infraestrutura
- MongoDB 7
- Keycloak 26
- Docker + Docker Compose
- Nginx (reverse proxy)

## Pré-requisitos

- Docker Desktop 4.0+
- Git

## Como Executar

```bash
# Clone o repositório
git clone <seu-repositorio>
cd hypesoft-challenge

# Execute com Docker Compose
docker-compose up -d

# Verifique os containers
docker-compose ps
```

## URLs de Acesso

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:5000 |
| Swagger | http://localhost:5000/swagger |
| Keycloak | http://localhost:8080 |
| Mongo Express | http://localhost:8081 |

## Credenciais Padrão

### Keycloak
- Admin console: http://localhost:8080/admin
- Usuário: `admin` / Senha: `admin123`

### Usuários da Aplicação
| Usuário | Senha | Role |
|---------|-------|------|
| admin | admin123 | admin, user |
| manager | manager123 | manager, user |

### Mongo Express
- Usuário: `admin` / Senha: `admin123`

## Arquitetura

### Backend — Clean Architecture + DDD

```
backend/
├── Hypesoft.Domain/          # Entidades, eventos, interfaces de repositório
├── Hypesoft.Application/     # CQRS (Commands/Queries), Handlers, DTOs, Validators
├── Hypesoft.Infrastructure/  # MongoDB, repositórios, seed de dados
└── Hypesoft.API/             # Controllers REST, middlewares, Swagger
```

### Frontend — Modular

```
frontend/src/
├── components/        # UI base, layout (Sidebar)
├── pages/            # Dashboard, Products, Categories, Stock, Statistics
├── services/         # API services (axios)
├── hooks/            # Custom hooks
├── types/            # TypeScript types
└── lib/              # axios, keycloak, utils
```

## Funcionalidades

- **Dashboard**: Total de produtos, valor do estoque, estoque baixo, gráfico por categoria
- **Produtos**: CRUD completo com busca, filtro por categoria e paginação
- **Categorias**: Gerenciamento de categorias
- **Estoque**: Controle de estoque baixo (< 10 unidades) com atualização manual
- **Estatísticas**: Gráficos de barras e pizza por categoria
- **Autenticação**: Integração com Keycloak (JWT)

## Desenvolvimento Local

```bash
# Backend
cd backend
dotnet restore
dotnet run --project Hypesoft.API

# Frontend (requer Node.js 18+)
cd frontend
npm install
npm run dev
```

## Dados de Exemplo

O sistema é populado automaticamente com:
- 5 categorias (Camisetas, Calças, Jaquetas, Acessórios, Calçados)
- 10 produtos com dados realistas
- Alguns produtos com estoque baixo para demonstração

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/products | Listar produtos (paginado) |
| GET | /api/products/{id} | Buscar produto |
| GET | /api/products/low-stock | Produtos com estoque baixo |
| POST | /api/products | Criar produto |
| PUT | /api/products/{id} | Atualizar produto |
| DELETE | /api/products/{id} | Excluir produto |
| PATCH | /api/products/{id}/stock | Atualizar estoque |
| GET | /api/categories | Listar categorias |
| POST | /api/categories | Criar categoria |
| PUT | /api/categories/{id} | Atualizar categoria |
| DELETE | /api/categories/{id} | Excluir categoria |
| GET | /api/dashboard | Dados do dashboard |
| GET | /health | Health check |

---

## Decisões Técnicas

### Clean Architecture + DDD
O backend foi estruturado em quatro camadas isoladas (`Domain`, `Application`, `Infrastructure`, `API`). A camada `Domain` não depende de nenhuma outra — entidades como `Product` e `Category` encapsulam sua própria lógica de negócio (ex: `IsLowStock` calculado automaticamente, eventos de domínio como `StockUpdatedEvent`). Isso garante que regras de negócio nunca vazem para controllers ou repositórios.

### CQRS + MediatR
Commands (escrita) e Queries (leitura) são classes separadas despachadas via MediatR. Isso permite:
- **Validação automática**: um `ValidationBehavior` intercepta toda requisição antes de chegar ao handler, executando FluentValidation e retornando erros de campo detalhados
- **Testabilidade**: cada handler é testado de forma isolada com mocks NSubstitute
- **Extensibilidade**: adicionar logging, auditoria ou cache exige apenas um novo behavior, sem modificar handlers existentes

### MongoDB + EF Core Provider
MongoDB foi escolhido pela flexibilidade de schema e performance em leitura. A integração via `MongoDB.EntityFrameworkCore` permite usar LINQ e `DbContext` familiares, mantendo o código de infraestrutura agnóstico ao banco. O seed de dados (`DataSeeder`) é executado automaticamente na inicialização, garantindo ambiente reproduzível.

### Keycloak 26 (OAuth2/OIDC)
Toda autenticação é delegada ao Keycloak, eliminando código custom de sessão e hash de senha. O frontend usa o fluxo PKCE (Authorization Code Flow) via `keycloak-js`, armazenando tokens apenas em memória (não em `localStorage`). O backend valida o JWT pela chave pública do realm, sem contato com o Keycloak em cada requisição. O arquivo `realm-export.json` garante que usuários, roles e clients sejam recriados automaticamente no container.

### React + TanStack Query
O estado do servidor é gerenciado exclusivamente pelo TanStack Query, que cuida de cache, revalidação e estados de loading/error sem Redux ou Context global. Formulários usam React Hook Form + Zod para validação tipada no cliente, espelhando as regras do FluentValidation no backend.

---

## Showcase de Funcionalidades

### Dashboard em tempo real
- Cards com total de produtos, valor total do estoque, quantidade em estoque baixo e número de categorias
- Gráfico de barras por categoria (quantidade em estoque) e gráfico de pizza com distribuição percentual
- Dados recalculados a cada acesso via query dedicada no backend

### Gestão de Produtos (CRUD completo)
- Listagem paginada com busca por nome/descrição e filtro por categoria
- Criação e edição via modal com validação de campos (nome obrigatório, preço > 0, estoque >= 0)
- Exclusão com confirmação
- Badge visual de "Estoque Baixo" para produtos com menos de 10 unidades

### Controle de Estoque
- Página dedicada listando apenas produtos com estoque crítico
- Atualização de quantidade diretamente na tabela sem sair da página
- Evento de domínio `StockUpdatedEvent` disparado a cada alteração (extensível para notificações)

### Estatísticas de Vendas
- Gráficos de vendas simuladas por período: diário (14 dias), semanal (7 semanas), mensal (12 meses)
- Filtro por categoria
- Construído com Recharts — responsivo e sem dependências pesadas

### Autenticação com perfis
- Login via Keycloak com redirecionamento automático
- Role `admin`: acesso total (CRUD de produtos e categorias, dashboard, estatísticas)
- Role `manager`: gerencia produtos e categorias
- Role `user`: somente leitura
- Token renovado silenciosamente sem logout forçado

---

## Diferenciais Implementados

### Cobertura de testes: 92,4% de linhas / 89,6% de branches
O projeto possui **95 testes backend** e **35+ testes frontend**, superando o threshold de 85% configurado no Coverlet. Os testes cobrem handlers de comando e query, validadores, behaviors MediatR, serviços frontend e componentes UI. Para rodar:
```bash
cd backend && dotnet test --collect:"XPlat Code Coverage"
cd frontend && npx vitest run --coverage
```

### Testes E2E com Playwright via Docker
Testes end-to-end completos sem precisar instalar Node.js localmente. O serviço `playwright` no `docker-compose.yml` usa perfil `test` e depende do nginx estar saudável:
```bash
docker compose --profile test run --rm playwright
```

### Architecture Decision Records (ADRs)
Quatro ADRs documentam as decisões arquiteturais com contexto, alternativas descartadas e consequências:
- `docs/adr/ADR-001-clean-architecture.md`
- `docs/adr/ADR-002-mongodb-efcore.md`
- `docs/adr/ADR-003-cqrs-mediatr.md`
- `docs/adr/ADR-004-keycloak-auth.md`

### Rate Limiting
A API aplica `AspNetCoreRateLimit` com limite de 100 requisições/minuto e 1.000/hora por IP, retornando HTTP 429 com header `Retry-After` quando excedido.

### Headers de Segurança via Nginx
O proxy Nginx adiciona automaticamente:
- `X-Frame-Options: SAMEORIGIN` — previne clickjacking
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer-when-downgrade`

### Swagger com autenticação JWT
O Swagger UI em `/swagger` permite testar endpoints protegidos: basta colar o Bearer token obtido do Keycloak. A configuração `SecurityDefinition` já está incluída no `Program.cs`.

### Pipeline de validação MediatR
`ValidationBehavior<TRequest, TResponse>` intercepta todos os commands antes da execução. Se FluentValidation encontrar erros, retorna um `ValidationException` com dicionário de erros por campo — sem nenhuma validação manual nos controllers.

### Seed de dados reproduzível
`DataSeeder` verifica se o banco está vazio e insere 5 categorias + 10 produtos automaticamente. O realm Keycloak é importado via `--import-realm` no startup do container. Ambiente totalmente reproduzível com um único `docker-compose up`.
