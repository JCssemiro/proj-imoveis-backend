# Vários corretores por lead + fechar lead pelo cliente

**Data:** 2026-03-31

## Regras de negócio

1. **Conversas:** Vários corretores podem abrir conversa sobre o **mesmo** lead; só não pode haver **duas conversas ativas** entre o **mesmo par** (lead + corretor).
2. **Bloqueio de novas conversas:** Quando o prospecto está `status = closed` **ou** o `interesseimovel.ativo = false` (inclusive após “remover” interesse pelo cliente), novas conversas são recusadas.
3. **Fechar lead:** Cliente pode `PATCH /interesse/:id/fechar`, que define `prospecto.status = closed`.

## Alterações técnicas

- **`ConversationsService.create`:** Removidos o bloqueio global “um chat ativo por corretor” e o bloqueio por `corretorid` do prospecto. Incluídas validações de lead fechado / interesse inativo e conflito se já existir conversa **ativa** para o mesmo `leadId` + `corretorId`.
- **`LeadsService`:** Listagem para corretores passa a considerar leads **abertos** (`status ≠ closed`) com **interesse ativo**, visíveis a **todos** os corretores (pool). `findOne` alinha a mesma regra (sem ocultar por `corretorid` de outro).
- **`InterestsService` + controller:** Novo `fecharLead` e rota `PATCH /interesse/:id/fechar` (cliente).

## Próximos passos sugeridos

- Documentar no front: fluxo “Encerrar lead” vs “Desativar interesse” (DELETE lógico).
- Opcional: ao fechar lead, encerrar automaticamente conversas abertas desse prospecto.
