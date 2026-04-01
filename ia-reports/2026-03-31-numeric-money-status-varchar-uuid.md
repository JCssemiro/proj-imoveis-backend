# Banco: NUMERIC monetário, status numérico, VARCHAR, UUID, remoção corretor no interesse

**Data:** 2026-03-31

## Alterações

1. **`plano.precomensal`:** `numeric(14,2)` (Prisma `Decimal`). Seed em **reais** (ex.: 99.00, 299.00, 599.00) — antes eram centavos inteiros; **breaking** para quem assumia centavos.
2. **`interesseimovel.minprice` / `maxprice`:** `numeric(14,2)`; API continua expondo números via `decimalToNumber`.
3. **Status do lead:** enum PostgreSQL `statuslead` removido; coluna `status smallint` com `check (1–4)`: **1** novo, **2** contatado, **3** em andamento, **4** encerrado. Constantes em `src/common/constants/status-lead.ts` (ordem = funil).
4. **Textos:** troca de `text` para `varchar` com limites (nomes, email, observações, mensagens, URLs, localização, etc.) para reduzir superfície de abuso e alinhar com validação da API. *Obs.:* isso não substitui validação na aplicação; limita armazenamento e alguns vetores de payload enorme.
5. **`interesseimovel`:** removidos `corretoratribuidoid` e relação com corretor; removida atribuição em `PATCH /prospecto/:id`; listagem de corretores usa `totalConversas` (contagem de `conversa` como corretor) em vez de “leads atribuídos”.
6. **Identificadores (decisão):** mantido **UUID** (`uuid` no PostgreSQL, `@db.Uuid` no Prisma) para **entidades** (`usuario`, `interesseimovel`, `localizacaointeresse`, `conversa`, `mensagem`). **Catálogo / parâmetros** continuam com **`codigo` inteiro** como PK de negócio (independente das FKs numéricas do interesse).

### Por que UUID nas entidades (e não serial global)?

| Aspecto | UUID | Auto-incremento (bigint/serial) |
|--------|------|----------------------------------|
| Exposição na API | Opaco, não revela volume nem ordem de criação | Sequência previsível (enumeração / correlação) |
| Ambientes distribuídos / futuros writes fora do DB | Geração segura sem coordenação central | Exige sequências ou alocação de faixas |
| Tamanho / índice | 16 bytes; índices um pouco maiores | 8 bytes (bigint); mais compacto |
| Legibilidade / debug | Menos amigável | Mais simples em logs manuais |

**Conclusão:** para usuários, interesses, conversas e mensagens, UUID equilibra segurança na superfície da API e flexibilidade operacional; tabelas de parâmetro com `codigo` fixo continuam inteiros por serem catálogo estável.

## Próximos passos

1. Parar `npm run dev` e rodar `npx prisma generate` se ocorrer EPERM no Windows.
2. Banco novo: `npx prisma migrate deploy` (ou reset em dev).
3. Front: `status` numérico 1–4; `precoMensal` em reais; payload sem `brokerId` no lead; listagem de corretores: `totalConversas`.
