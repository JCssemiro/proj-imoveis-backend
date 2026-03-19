# Relatório: Paginação e filtros de listagem

**Data:** 19/03/2026  
**Escopo:** Paginação em todos os endpoints de listagem; DTO padrão de retorno; filtros adicionais na listagem de leads.

---

## 1. O que foi implementado

### 1.1. DTO padrão de paginação

- **Query (entrada):** `pagina` e `tamanho` na URL. Valor padrão de **20** para `tamanho` quando não informado; **1** para `pagina`. Máximo de **100** itens por página.
- **Resposta (saída):** Objeto padrão com:
  - `paginaAtual`: número da página (1-based)
  - `totalPaginas`: total de páginas
  - `qtdElementos`: quantidade total de elementos (todas as páginas)
  - `conteudo`: array com os itens da página atual

Arquivos em `src/common/dto/`:
- `pagination-query.dto.ts`: DTO de query e função `getPaginationParams(query)` para obter `page`, `size`, `skip`.
- `paginated-response.dto.ts`: classe `PaginatedResponseDto<T>` e função `buildPaginatedResponse(page, size, total, conteudo)`.

### 1.2. Endpoints com paginação

| Endpoint | Query params | Retorno |
|----------|--------------|---------|
| `GET /interesse` | `pagina`, `tamanho`, `isActive` | `{ paginaAtual, totalPaginas, qtdElementos, conteudo }` |
| `GET /prospecto` | `pagina`, `tamanho` + filtros | idem |
| `GET /conversa` | `pagina`, `tamanho` | idem |
| `GET /corretor` | `pagina`, `tamanho` | idem |

Padrão quando não se envia: `tamanho=20`, `pagina=1`.

### 1.3. Filtros na listagem de leads (`GET /prospecto`)

Além dos já existentes (`status`, `tipoImovelId`, `regiao`, `maxPrice`), foram adicionados:

- **finalidadeId** (UUID): filtro por finalidade do interesse
- **tipoCasaId** (UUID): filtro por tipo de casa
- **mobiliaId** (UUID): filtro por mobília
- **compraOuAluguel**: `compra` ou `aluguel`
- **minPrice**: preço mínimo do interesse
- **maxPrice**: preço máximo (já existia)
- **dataInicio**: data mínima de criação do lead (ISO 8601)
- **dataFim**: data máxima de criação do lead (ISO 8601)

IDs devem ser os retornados por `GET /parametros/...`.

---

## 2. Arquivos criados/alterados

**Criados**
- `src/common/dto/pagination-query.dto.ts`
- `src/common/dto/paginated-response.dto.ts`

**Alterados**
- `src/interests/interests.service.ts`, `interests.controller.ts`
- `src/leads/leads.service.ts`, `leads.controller.ts`
- `src/conversations/conversations.service.ts`, `conversations.controller.ts`
- `src/brokers/brokers.service.ts`, `brokers.controller.ts`

---

## 3. Exemplo de resposta paginada

```json
{
  "paginaAtual": 1,
  "totalPaginas": 3,
  "qtdElementos": 55,
  "conteudo": [ ... ]
}
```

Exemplo de chamada: `GET /api/v1/interesse?pagina=1&tamanho=20` (ou sem parâmetros para usar o padrão).
