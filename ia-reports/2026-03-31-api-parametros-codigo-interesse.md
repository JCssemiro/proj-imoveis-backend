# API alinhada: parâmetros por `codigo`, interesse com boolean e arrays

**Data:** 2026-03-31

## O que foi feito

- **`parametros`:** listagens paginadas e `GET /parametros` sem `ordem`; removidos endpoints de aceite/opções de quartos/suítes; `tipoimovel` expõe `finalidadeUsoCodigo`; `plano` usa `codigo` + `precoMensal`.
- **`interesse`:** DTOs com `*Codigo`, `aceitaFinanciamento` (boolean), `quartos`/`suites` como `number[]`; resposta espelha códigos e arrays; `UpdateInterestDto` via `@nestjs/mapped-types` para validação parcial no PATCH.
- **`prospecto`:** filtros de query renomeados para `tipoImovelCodigo`, `finalidadeContratacaoCodigo`, `finalidadeUsoCodigo`, `mobiliaCodigo`; card do lead com `aceitaFinanciamento` boolean e `quartos`/`suites` numéricos.
- **Auth / usuário:** `planoCodigo` no registro de corretor e no `PATCH` de plano; `usuario.planocodigo`; payload `plan` com `codigo`, `nome`, `precoMensal` (sem `id` separado).
- **`prisma/seed.ts`:** `planocodigo: 2` no corretor de exemplo.

## Melhorias aplicadas nesta iteração

1. Consistência de nomes na API (`Codigo` vs `Id` interno removido do contrato).
2. Tipagem Prisma em `interests`/`leads` com `satisfies Prisma.interesseimovelInclude` e `GetPayload` para `toPropertyInterest` / `toInterestCard`.
3. Cast explícito `as unknown as` em `parametros.service` para compatibilidade estrita do delegate genérico do Prisma.

## Próximos passos

1. Parar `npm run dev` e rodar `npx prisma generate` se ocorrer EPERM no Windows.
2. Atualizar cliente/front: payloads de interesse, filtros de prospecto, `planoCodigo` e objeto `plan` no login/perfil.
