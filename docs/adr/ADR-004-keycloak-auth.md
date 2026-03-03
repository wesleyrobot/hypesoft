# ADR-004: Autenticação e Autorização com Keycloak

**Status:** Aceito
**Data:** 2024-12-01
**Autor:** Time Hypesoft

---

## Contexto

O sistema precisava de autenticação robusta com suporte a:
- Login federado (OAuth2/OpenID Connect)
- Gestão de usuários e roles sem código custom
- Proteção de rotas no frontend e validação de tokens no backend
- Múltiplos perfis de acesso (admin, manager, user)

## Decisão

Adotamos **Keycloak 26** como Identity Provider (IdP), integrado via:
- **Frontend**: `keycloak-js` para fluxo PKCE (Authorization Code Flow)
- **Backend**: JWT Bearer validation via `Microsoft.AspNetCore.Authentication.JwtBearer`

### Configuração do Realm `hypesoft`

```
Realm: hypesoft
├── Clients
│   ├── hypesoft-frontend  (public, standard flow + PKCE)
│   └── hypesoft-api       (bearer-only)
└── Roles
    ├── admin   → acesso total
    ├── manager → gerenciar produtos e categorias
    └── user    → leitura apenas
```

### Usuários pré-configurados

| Usuário | Senha | Roles |
|---|---|---|
| admin | admin123 | admin, user |
| manager | manager123 | manager, user |

### Fluxo de autenticação

```
1. Usuário acessa o frontend
2. keycloak-js detecta ausência de token → redireciona para Keycloak login
3. Keycloak autentica e emite JWT assinado
4. frontend armazena token (em memória, não localStorage)
5. Cada requisição à API inclui: Authorization: Bearer <token>
6. Backend valida assinatura e claims do JWT
7. [Authorize] nos controllers protege endpoints sensíveis
```

### Configuração no backend

```csharp
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = "http://keycloak:8080/realms/hypesoft";
        options.Audience = "hypesoft-api";
        options.RequireHttpsMetadata = false;
    });
```

### Importação automática do realm

O arquivo `keycloak/realm-export.json` é importado automaticamente na inicialização do container via `--import-realm`, garantindo que o ambiente seja reproduzível.

## Alternativas consideradas

| Opção | Motivo de descarte |
|---|---|
| ASP.NET Core Identity + JWT próprio | Mais código a manter; sem SSO; sem gestão de usuários via UI |
| Auth0 | Serviço externo pago; dependência de terceiro; não roda offline |
| Okta | Mesmos problemas do Auth0 |
| Basic Auth | Inseguro para produção; sem OAuth2 |

## Consequências

**Positivas:**
- Gestão de usuários e roles via console Keycloak (sem código)
- Tokens JWT verificáveis por qualquer serviço com a chave pública do realm
- SSO pronto para futuras expansões do sistema
- Realm exportável/importável para reproduzir o ambiente

**Negativas:**
- Adiciona um serviço externo (~500MB de RAM) ao docker-compose
- Tempo de inicialização do Keycloak (~90s) aumenta o startup do ambiente
- Configuração inicial do realm é complexa (mitigado pelo `realm-export.json`)
