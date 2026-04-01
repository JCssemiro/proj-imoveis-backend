# Refatoração do banco: parâmetros smallint, sem prospecto/feature/tipocasa

**Data:** 2026-03-31

## Resumo

- **Migration inicial** reescrita: removidas `feature`, `tipocasa`, `prospecto`, `interesseimovelfeature`, enum `compraoualuguel`.
- **Parâmetros** com PK `smallserial`, colunas `codigo`, `nome`, `ordem`, `ativo`: `finalidadeuso`, `finalidadecontratacao`, `tipoimovel` (com FK `finalidadeusoid`), `mobilia`, `urgencia`, `aceitafinanciamento`, `opcaoquartos`, `opcaosuites`.
- **`interesseimovel`:** FKs smallint para os parâmetros; `metragem`, `minprice`/`maxprice`, `observacoes`, `status` (lead), `corretoratribuidoid`; N:N com `opcaoquartos` e `opcaosuites` via tabelas de junção.
- **`localizacaointeresse`:** CEP, logradouro, bairro, cidade, UF, codibgecidade.
- **`conversa`:** `interesseimovelid` (substitui `leadid`); `ativo` e índices já embutidos na init.
- **`plano`:** `precomensal` (centavos), `codigo`, `nome`; `usuario.planoid` smallint.
- **Migrations posteriores** `20260319100000` e `20260331120000`: apenas `SELECT 1` (lógica incorporada na init).

## API

- **Parâmetros:** novos paths (`/finalidadeuso`, `/finalidadecontratacao`, `/urgencia`, `/aceitafinanciamento`, `/opcaoquartos`, `/opcaosuites`); removidos `tipocasa`, `feature`, `compraoualuguel` estático; `tipoimovel` retorna `finalidadeUsoId`; `plano` retorna `precoMensal`.
- **Interesse:** DTOs com IDs numéricos; `CreateConversationDto` usa `interesseImovelId`.
- **Auth / usuário:** resposta inclui `plan` (`id`, `codigo`, `nome`, `precoMensal`); registro de corretor aceita `planoId` opcional (padrão 2); `PATCH /usuario/plano` com `planoId` numérico.
- **Prospecto (rota):** continua listando **interesses** (UUID = id do “lead”).

## Próximos passos

1. Banco do zero: `npx prisma migrate deploy` (ou `migrate reset` em dev).
2. Com `npm run dev` ativo, pare o servidor e rode `npx prisma generate`.
3. Atualizar frontend para IDs int e novos campos de localização / quartos / suítes.
