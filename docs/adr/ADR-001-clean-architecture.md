# ADR-001: Adoção de Clean Architecture com DDD

**Status:** Aceito
**Data:** 2024-12-01
**Autor:** Time Hypesoft

---

## Contexto

Precisávamos de uma arquitetura para o sistema de gestão de produtos que:
- Fosse de fácil manutenção e evolução ao longo do tempo
- Permitisse testar a lógica de negócio de forma isolada
- Separasse claramente as responsabilidades entre as camadas
- Facilitasse a troca de tecnologias (banco de dados, framework) sem impacto nas regras de negócio

## Decisão

Adotamos **Clean Architecture** combinada com **Domain-Driven Design (DDD)**, organizada em quatro camadas:

```
Hypesoft.Domain         ← Entidades, eventos de domínio, interfaces
Hypesoft.Application    ← Casos de uso (CQRS), DTOs, validadores
Hypesoft.Infrastructure ← Implementações: repositórios, banco, seed
Hypesoft.API            ← Controllers REST, middlewares, configurações
```

A regra de dependência é estrita: as camadas externas dependem das internas, nunca o contrário.

### Princípios DDD aplicados

- **Entidades ricas**: `Product` e `Category` encapsulam comportamento (ex: `Product.UpdateStock()`, `Product.IsLowStock`)
- **Eventos de domínio**: `ProductCreatedEvent`, `StockUpdatedEvent` para desacoplar efeitos colaterais
- **Interfaces de repositório**: definidas no Domain, implementadas na Infrastructure
- **Value Objects**: presentes onde adequado para encapsular invariantes

## Alternativas consideradas

| Opção | Motivo de descarte |
|---|---|
| MVC simples (sem camadas) | Dificulta testes; lógica de negócio espalhada nos controllers |
| Onion Architecture | Similar à Clean Architecture — mesmos benefícios, menos familiar ao time |
| Vertical Slice | Boa para features isoladas, mas dificulta compartilhamento de regras de negócio |

## Consequências

**Positivas:**
- Lógica de negócio completamente testável sem dependência de banco ou HTTP
- Trocar MongoDB por PostgreSQL exigiria mudanças apenas na Infrastructure
- Novos desenvolvedores entendem rapidamente onde cada tipo de código vai

**Negativas:**
- Mais arquivos e indireção para funcionalidades simples
- Curva de aprendizado inicial maior para times não familiarizados com DDD
