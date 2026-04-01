# Revisão geral + tentativa de `migrate deploy`

**Data:** 2026-03-31

## Contexto compactado (conversa)

API ImobiConnect (Nest + Prisma + Postgres): parâmetros por `codigo` int; `interesseimovel` com FKs numéricas, boolean aceita financiamento, arrays quartos/suítes, preços `numeric(14,2)`, status lead 1–4, sem corretor atribuído no interesse; plano em reais; entidades UUID; VARCHAR limitado; vários corretores podem conversar no mesmo lead; `GET /usuario/eu` com `plan`; DTOs/Swagger alinhados.

## Revisão executada

| Verificação | Resultado |
|-------------|-----------|
| `npx prisma validate` | OK |
| `npx tsc --noEmit` | OK |
| Testes Jest | Nenhum spec no projeto |
| `npx prisma generate` | **EPERM** (Windows com `npm run dev` ativo — parar o dev e rodar de novo) |

## Migrações (`npx prisma migrate deploy`)

Execução contra o banco configurado em `.env` (Render): **falhou** com `P3018` / `42710` — **`type "tipousuario" already exists`**.

Interpretação: o banco **já contém** objetos de uma versão anterior (ou migração parcial). A `20250309000000_init` assume base **vazia** e não pode ser reaplicada por cima sem alinhar estado.

### Como destravar (escolha conforme ambiente)

1. **Base nova ou aceitável apagar dados (dev/staging):** no Postgres, `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` (e permissões), depois `npx prisma migrate deploy`. Ou `npx prisma migrate reset` apontando para DB local de desenvolvimento.
2. **Produção com dados a manter:** não rodar o `init` de novo; usar **baseline** ou migrações incrementais que alterem o schema atual até bater com `schema.prisma` (trabalho manual ou gerado com cuidado).
3. **Estado “failed” no histórico Prisma:** após corrigir o banco manualmente, `npx prisma migrate resolve --applied "20250309000000_init"` **só** se o schema aplicado for **equivalente** ao da migration (evitar marcar aplicado com drift).

## Próximos passos sugeridos

1. Parar `npm run dev` → `npx prisma generate`.
2. Decidir estratégia para o Postgres remoto (reset vs migrações incrementais).
3. Opcional: adicionar testes de integração mínimos para fluxos críticos (auth, interesse, conversa).
