# Segurança: rotas públicas, código HTTP em erros e escopo por usuário

**Data:** 2026-03-31

## O que foi feito

### 1. Rotas sem JWT (lista fechada)

- **GET** `/api/v1/health`, `/api/v1/docs`, `/api/v1/docs-json`
- **POST** `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/recuperar-senha`

Implementação em `JwtAuthGuard`: normalização de path (query string, barra final, URL absoluta) e conjuntos fixos `PUBLIC_GET_PATHS` / `PUBLIC_AUTH_POST_PATHS`. Removidos `@Public()` dos controllers e o comportamento antigo que liberava qualquer path contendo `docs` ou `health` (risco de bypass).

O decorador `@Public()` permanece suportado via `Reflector` para exceções futuras pontuais.

### 2. Campo `code` nas respostas de erro

- `HttpExceptionFilter` passa a enviar `code` igual ao **status HTTP numérico** (ex.: `404`, `400`), em falhas e sucesso de erro tratado.

### 3. Segunda camada de autorização

- **RolesGuard:** exige `user.sub` e `user.type` quando há `@Roles()`; caso contrário `401`.
- **Leads (corretor):** listagem e detalhe limitados a leads **sem corretor** (`corretorid` nulo) ou **atribuídos ao corretor autenticado**. Detalhe de lead de outro corretor retorna `404` (sem vazar existência). `PATCH` bloqueia atualização se o lead já pertence a outro corretor.
- **Conversas:** criação de conversa bloqueada se o lead já está atribuído a outro corretor. Listagem/detalhe/mensagens já validavam participação (`clientid` / `corretorid`).
- **Parâmetros e listagem de corretores:** passam a exigir JWT (`ApiBearerAuth`); removido acesso público.

## Melhorias aplicadas (≥3)

1. Allowlist estrita de paths públicos (remove `includes('docs')` amplo).
2. Escopo de dados em `LeadsService` alinhado ao modelo de negócio (pool + próprios leads).
3. Validação de posse do lead ao abrir conversa + `RolesGuard` mais rigoroso.

## Próximos passos sugeridos

- Atualizar front: enviar `Authorization` em `/parametros`, `/corretor` e fluxos que antes eram públicos.
- Revisar testes e documentação que mencionem rotas públicas ou `code` textual antigo.
