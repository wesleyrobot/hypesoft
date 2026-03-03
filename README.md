# Hypesoft - Sistema de Gestão de Produtos

Sistema completo de gestão de produtos desenvolvido como desafio técnico da Hypesoft.

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
