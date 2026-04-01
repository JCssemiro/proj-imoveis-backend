# Parâmetros públicos (sem JWT)

**Data:** 2026-04-01

- `ParametrosController` anotado com `@Public()` (respeitado pelo `JwtAuthGuard` global via `IS_PUBLIC_KEY`).
- Removido `@ApiBearerAuth` do controller para o Swagger refletir acesso sem token.
- Ajuste na descrição de `GET /parametros/plano`: `precoMensal` em reais (não centavos).
