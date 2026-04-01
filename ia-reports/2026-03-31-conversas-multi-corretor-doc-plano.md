# Documentação: múltiplos corretores por lead + plano no GET /usuario/eu

**Data:** 2026-03-31

## Comportamento (já existente)

- **Conversas:** a checagem de duplicidade usa `(interesseimovelid, corretorid, ativo)`. Ou seja, **cada corretor** pode ter a sua conversa no mesmo lead; não há bloqueio global “só um corretor por interesse”.
- **GET/PATCH /usuario/eu** e **PATCH /usuario/plano:** já incluíam `include: { plano: true }` e o payload `plan` via `planFromRow`. Clientes e usuários sem `planocodigo` recebem `plan: null`.

## O que foi feito

- Comentário no `ConversationsService` e descrição no Swagger do `POST /conversa` deixando explícito o suporte a **vários corretores** no mesmo interesse.
- DTOs de resposta `UserProfileResponseDto` / `UserPlanResponseDto` e `@ApiOkResponse` no controller de usuário para o OpenAPI refletir o objeto `plan`.
