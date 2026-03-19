 # Relatório: Endpoints de parâmetros para front-end
 
 **Data:** 19/03/2026  
 **Escopo:** Ajuste da forma como o backend recebe dados parametrizados do front-end; criação de endpoints públicos para listagem de parâmetros e remoção de validações hardcoded no DTO de interesse.
 
 ---
 
 ## 1. Contexto (consulta do histórico)
 
 Foi consultado o relatório anterior em `./ia-reports/2025-03-19-refatoracao-migracao-base.md` do início ao fim para manter consistência com o novo schema (tabelas `finalidade`, `tipoimovel`, `tipocasa`, `mobilia`, `feature`, `plano` e normalização de `features`/`localizacoes`).
 
 ---
 
 ## 2. O que foi implementado
 
 ### 2.1. Novos endpoints públicos de parâmetros
 
 Criado módulo `src/parametros/` com:
 
 - `GET /api/v1/parametros` (todos)
 - `GET /api/v1/parametros/finalidade`
 - `GET /api/v1/parametros/tipoimovel`
 - `GET /api/v1/parametros/tipocasa`
 - `GET /api/v1/parametros/mobilia`
 - `GET /api/v1/parametros/feature`
 - `GET /api/v1/parametros/plano`
 - `GET /api/v1/parametros/compraoualuguel`
 
 Esses endpoints retornam apenas itens `ativo=true` das tabelas do banco (exceto `compraoualuguel`, que é retornado via enum fixo no backend).
 
 Formato das respostas: `{ id, codigo, label, ordem }` (para as tabelas), e em `compraoualuguel`: `{ valor, label, ordem }`.
 
 ### 2.2. Ajuste do DTO de cadastro de interesse (front -> back): apenas IDs
 
 O DTO `CreateInterestDto` foi alterado para aceitar **apenas IDs (UUID)** retornados pelos endpoints de parâmetros:
 
 - `finalidadeId`, `tipoImovelId`: obrigatórios (UUID)
 - `tipoCasaId`, `mobiliaId`: opcionais (UUID); se omitidos, o backend usa o primeiro ativo por ordem
 - `featureIds`: array de UUID retornados por `GET /parametros/feature`
 - `compraOuAluguel`: valores fixos `compra` ou `aluguel` (de `GET /parametros/compraoualuguel`)
 
 Filtro de leads (`GET /prospecto`): query `tipoImovelId` (UUID) em vez de `tipoImovel` (código).
 
 ### 2.3. Validação por ID e ativo
 
 O `InterestsService` valida no banco por `id` e `ativo=true`, garantindo que apenas parâmetros existentes e ativos sejam usados. Mensagens de erro orientam o uso dos IDs de `GET /parametros/...`.
 
 ---
 
 ## 3. Revisão crítica (>= 3 pontos de performance/segurança)
 
 1. **Uso de ID em vez de código:** o front envia apenas UUID; validação no backend por `id` e `ativo`. Reduz enumeração por código e desacopla payload de mudanças em `codigo`/label.
 
 2. **Segurança dos endpoints públicos:** os endpoints são `@Public()` e retornam apenas metadados não sensíveis (`id/codigo/label/ordem`) filtrados por `ativo=true`. Como a API já possui `ThrottlerModule` global, o risco de scraping massivo é mitigado por rate limit.
 
 3. **Robustez contra payloads grandes e abuse:** os limites já implementados no `InterestsService` continuam garantindo previsibilidade em alto volume (máx. `50` localizações, `30` features, e `5000` caracteres em `observacoes`). Isso protege tanto performance quanto superfície de ataque.
 
 ---
 
 ## 4. Próximas melhorias sugeridas
 
 - Considerar cache (por exemplo, memória/Redis) para endpoints de parâmetros, já que são tipicamente estáveis e consultados com alta frequência no front.
 - Adicionar paginação se futuramente `feature`/`feature`-related crescerem de forma significativa (hoje são listas pequenas).
 
 ---
 
 ## 5. Arquivos modificados/criados
 
 **Criados**
 - `src/parametros/parametros.module.ts`
 - `src/parametros/parametros.controller.ts`
 - `src/parametros/parametros.service.ts`
 
 **Alterados**
 - `src/app.module.ts` (registrar `ParametrosModule`)
 - `src/interests/dto/create-interest.dto.ts` (contrato por IDs: finalidadeId, tipoImovelId, tipoCasaId, mobiliaId, featureIds; @IsUUID)
 - `src/interests/interests.service.ts` (validação por id e ativo; mensagens de erro com referência a GET /parametros)
 - `src/leads/leads.controller.ts` e `src/leads/leads.service.ts` (filtro por tipoImovelId em vez de tipoImovel)
 - `README.md` (documentação dos endpoints públicos de parâmetros)

