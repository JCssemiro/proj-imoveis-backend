# DELETE interesse: exclusão física com cascade

**Data:** 2026-03-31

## Alteração

- `InterestsService.remove` passou de `update({ ativo: false })` para `interesseimovel.delete`.
- O PostgreSQL já possui `prospectointeresseimovelidfkey` … `on delete cascade` e `conversaleadidfkey` … `on delete cascade` (e `mensagem` em `conversa`), portanto ao apagar o interesse removem-se automaticamente o **prospecto**, as **conversas** desse lead e as **mensagens**.

## Documentação

- Swagger do `DELETE /interesse/:id` atualizado para descrever o comportamento.

## Observação

- Para apenas impedir novas conversas sem apagar dados, o cliente continua com `PATCH /interesse/:id/fechar`.
