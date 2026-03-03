# ADR-002: MongoDB com EF Core Provider como Banco de Dados

**Status:** Aceito
**Data:** 2024-12-01
**Autor:** Time Hypesoft

---

## Contexto

Para o sistema de gestão de produtos, precisávamos escolher entre banco de dados relacional e documento. Os requisitos principais:
- Estrutura de produto flexível (campos podem variar no futuro)
- Performance em leituras para dashboards e listagens
- Escalabilidade horizontal para crescimento
- Facilidade de desenvolvimento e containerização

## Decisão

Adotamos **MongoDB 7** como banco de dados principal, acessado via **EF Core com MongoDB Provider** (`MongoDB.EntityFrameworkCore`).

### Por que MongoDB?

- Produtos e categorias têm estrutura semi-estruturada que se beneficia de documentos
- Escalabilidade horizontal nativa (sharding)
- Flexibilidade para adicionar campos sem migrations
- Excelente performance para leituras de dashboards com agregações

### Por que EF Core + MongoDB Provider?

- Abstração familiar para desenvolvedores .NET
- Permite trocar para SQL Server/PostgreSQL mudando apenas o provider e os repositórios
- LINQ sobre coleções MongoDB sem escrever queries manuais
- Integração com o padrão Repository já utilizado no projeto

### Configuração

```csharp
// Infrastructure/Extensions/ServiceExtensions.cs
services.AddDbContext<MongoDbContext>(options =>
    options.UseMongoDB(connectionString, databaseName));
```

Collections mapeadas:
- `products` → `Product`
- `categories` → `Category`
- `sale_transactions` → `SaleTransaction`

## Alternativas consideradas

| Opção | Motivo de descarte |
|---|---|
| PostgreSQL + EF Core | Menos flexível para estrutura de produto; migrations mais custosas |
| MongoDB Driver direto | Mais verboso; sem abstração de Repository padrão |
| Redis | Apenas para cache; não substitui banco principal |
| SQLite | Não adequado para produção com alta concorrência |

## Consequências

**Positivas:**
- Sem migrations para adicionar campos aos documentos
- Agregações de dashboard executadas no servidor MongoDB (performáticas)
- Setup simples via Docker com volume persistente

**Negativas:**
- Sem suporte a transações ACID completas entre coleções (MongoDB 4+ suporta em replica set)
- EF Core MongoDB Provider não suporta todos os operadores nativos do MongoDB
- Joins entre coleções são menos eficientes que SQL
