# ADR-003: Padrão CQRS com MediatR

**Status:** Aceito
**Data:** 2024-12-01
**Autor:** Time Hypesoft

---

## Contexto

Com a adoção de Clean Architecture, precisávamos de um padrão para organizar os casos de uso da camada Application e desacoplar os controllers dos handlers de negócio. Os requisitos:
- Separar operações de leitura (Queries) das de escrita (Commands)
- Injetar comportamentos transversais (validação, logging) sem modificar os handlers
- Facilitar testes unitários dos handlers de forma isolada

## Decisão

Adotamos o padrão **CQRS (Command Query Responsibility Segregation)** implementado com a biblioteca **MediatR**.

### Estrutura de Commands e Queries

```
Application/
├── Commands/
│   ├── Products/
│   │   ├── CreateProductCommand.cs   → record com dados de entrada
│   │   ├── UpdateProductCommand.cs
│   │   ├── DeleteProductCommand.cs
│   │   └── UpdateStockCommand.cs
│   └── Categories/
│       ├── CreateCategoryCommand.cs
│       ├── UpdateCategoryCommand.cs
│       └── DeleteCategoryCommand.cs
├── Queries/
│   ├── Products/GetProductsQuery.cs  → filtros de paginação e busca
│   ├── Dashboard/GetDashboardQuery.cs
│   └── Sales/GetSalesDataQuery.cs
└── Handlers/
    ├── Products/ProductHandlers.cs   → implementações IRequestHandler<>
    └── ...
```

### Pipeline Behaviors

MediatR permite behaviors que interceptam todas as requisições:

```csharp
// ValidationBehavior<TRequest, TResponse>
// Executa FluentValidation antes de cada handler
// Lança ValidationException com todos os erros de campo
```

### Como funciona no controller

```csharp
// ProductsController
[HttpPost]
public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
{
    var command = new CreateProductCommand(request.Name, ...);
    var result = await _mediator.Send(command); // MediatR despacha para CreateProductHandler
    return CreatedAtAction(..., result);
}
```

## Alternativas consideradas

| Opção | Motivo de descarte |
|---|---|
| Application Services diretos | Sem pipeline de behaviors; mais acoplamento controller-serviço |
| Sem CQRS (repositórios diretos nos controllers) | Viola Single Responsibility; dificulta testes |
| Carter (minimal API) | Menos familiar; menos suporte a behaviors e validação |

## Consequências

**Positivas:**
- Cada handler tem uma única responsabilidade
- Validação, logging e outros cross-cutting concerns aplicados automaticamente via behaviors
- Testes de handler são simples (mock repositories + assert resultado)
- Novos casos de uso: basta criar Command + Handler sem modificar código existente

**Negativas:**
- Mais indireção: para entender o fluxo, precisa navegar de Controller → Command → Handler
- MediatR pode esconder acoplamento implícito entre handlers
- Overhead mínimo de reflection/DI para cada requisição
