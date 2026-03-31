# Relatório de decisões – Banco de dados ImobiConnect

Este documento descreve todas as tabelas do banco de dados e as decisões de modelagem, tipos de dados, integridade e performance tomadas no projeto.

**Referência:** migration `20250309000000_init`, schema Prisma e regras de negócio em API-ARQ.md.

---

## Índice

1. [Visão geral e princípios](#1-visão-geral-e-princípios)
2. [Tipos enumerados (ENUMs)](#2-tipos-enumerados-enums)
3. [Tabelas de parâmetros](#3-tabelas-de-parâmetros)
4. [Usuario](#4-usuario)
5. [InteresseImovel](#5-interesseimovel)
6. [Prospecto (Lead)](#6-prospecto-lead)
7. [Conversa](#7-conversa)
8. [Mensagem](#8-mensagem)
9. [Integridade referencial (FKs)](#9-integridade-referencial-fks)
10. [Índices e performance](#10-índices-e-performance)

---

## 1. Visão geral e princípios

### 1.1 Objetivos do modelo

- **Parametrização:** domínios como finalidade, tipo de imóvel e mobília em tabelas próprias, permitindo novos valores sem alterar o schema.
- **Confiabilidade:** CHECKs para faixas numéricas, FKs para consistência e UNIQUE onde a regra de negócio exige unicidade.
- **Performance:** índices em chaves estrangeiras e em colunas usadas em filtros e ordenação; índice parcial para a fila de leads novos.
- **Escalabilidade:** uso de UUID como PK; tipos numéricos adequados (INTEGER para preços e métricas); modelo preparado para índices GIN em arrays e, no futuro, particionamento.

### 1.2 Convenções gerais

| Aspecto | Decisão |
|--------|--------|
| Chave primária | `TEXT` com UUID (gerado no app ou no banco). |
| Nomes de tabelas | Minúsculas no banco (ex.: `usuario`, `interesseimovel`, `prospecto`, `conversa`, `mensagem`); modelos Prisma com PascalCase e mapeamento via `@@map`. |
| Timestamps | `TIMESTAMP(3)` com precisão de milissegundos; `createdAt`/`updatedAt` com DEFAULT. |
| Campos opcionais | Nullable quando o valor não é obrigatório; DEFAULT quando faz sentido (ex.: `notes DEFAULT ''`). |

---

## 2. Tipos enumerados (ENUMs)

Foram mantidos ENUMs no PostgreSQL para valores fixos e de domínio restrito.

| ENUM | Valores | Uso |
|------|---------|-----|
| **UserType** | `client`, `broker` | Tipo do usuário; usado em autorização (rotas por perfil). |
| **LeadStatus** | `new`, `contacted`, `in_progress`, `closed` | Ciclo de vida do lead; permite filtros e relatórios por estágio. |
| **SenderType** | `client`, `broker` | Quem enviou a mensagem no chat; evita inferência apenas por `senderId`. |

**Decisão:** ENUMs garantem validação no banco e evitam valores inválidos; ocupam pouco espaço e deixam o modelo explícito.

---

## 3. Tabelas de parâmetros

As tabelas **Finalidade**, **TipoImovel**, **TipoCasa**, **CompraOuAluguel** e **Mobilia** seguem o mesmo desenho.

### 3.1 Motivo da parametrização

- Inclusão/desativação de valores sem migração de schema.
- Integridade via FK (apenas valores cadastrados podem ser usados).
- Separação entre identificador de negócio (`codigo`) e texto de exibição (`label`).

### 3.2 Estrutura comum

| Campo | Tipo | Obrigatório | Decisão |
|-------|------|-------------|--------|
| **id** | TEXT (UUID) | Sim | Chave primária estável; permite geração no app ou no banco. |
| **codigo** | TEXT | Sim, UNIQUE | Identificador de negócio (ex.: `residencial`, `casa`). Deve ser imutável na prática. |
| **label** | TEXT | Sim | Nome para exibição; pode ser alterado sem quebrar referências. |
| **ativo** | BOOLEAN | Sim, DEFAULT true | Soft delete: desativa sem remover linha; evita quebrar FKs em InteresseImovel. |
| **ordem** | INTEGER | Sim, DEFAULT 0 | Ordem em listas/dropdowns; usado no índice `(ativo, ordem)`. |
| **createdAt** | TIMESTAMP(3) | Sim, DEFAULT now() | Auditoria de criação. |

### 3.3 Índices nas tabelas de parâmetros

- **UNIQUE(codigo):** garante unicidade e lookup rápido por código.
- **INDEX(ativo, ordem):** listagem de parâmetros ativos já ordenada para dropdowns e filtros.

### 3.4 Papel de cada tabela

| Tabela | Papel no negócio |
|--------|-------------------|
| **Finalidade** | Uso do imóvel (residencial, comercial, rural, investimento). |
| **TipoImovel** | Tipo do imóvel (casa, apartamento, terreno, comercial, rural). |
| **TipoCasa** | Subtipo quando imóvel é casa (padrão, sobrado, geminada, condomínio, indiferente). |
| **CompraOuAluguel** | Intenção: compra ou aluguel. |
| **Mobilia** | Mobiliado, não mobiliado ou indiferente. |

---

## 4. Usuario

Representa usuários da plataforma (clientes e corretores).

### 4.1 Campos

| Campo | Tipo | Obrigatório | Decisão |
|-------|------|-------------|--------|
| **id** | TEXT (UUID) | Sim | Chave primária. |
| **name** | TEXT | Sim | Nome completo; sem limite rígido. |
| **email** | TEXT | Sim, UNIQUE | Login e recuperação de senha; um cadastro por e-mail. |
| **phone** | TEXT | Sim | Contato; TEXT por formatos variados (DDI, etc.). |
| **passwordHash** | TEXT | Sim | Hash da senha (ex.: bcrypt); nunca armazenar senha em texto puro. |
| **type** | UserType | Sim | Papel: client ou broker; base para autorização. |
| **creci** | TEXT | Não | Registro profissional do corretor; nullable para clientes. |
| **subscriptionActive** | BOOLEAN | Não | Assinatura ativa do corretor; nullable quando não aplicável. |
| **avatar** | TEXT | Não | URL do avatar em storage externo. |
| **resetPasswordToken** | TEXT | Não | Token único para recuperação de senha; preenchido apenas nesse fluxo. |
| **resetPasswordExpires** | TIMESTAMP(3) | Não | Expiração do token; permite limpeza de tokens antigos. |
| **createdAt** | TIMESTAMP(3) | Sim, DEFAULT now() | Data de cadastro. |
| **updatedAt** | TIMESTAMP(3) | Sim, DEFAULT now() | Última alteração; NOT NULL + DEFAULT evita erro em INSERT. |

### 4.2 Índices

- **UNIQUE(email):** login e garantia de um usuário por e-mail.
- **INDEX(type):** filtrar clientes vs corretores (ex.: listagem de corretores).

---

## 5. InteresseImovel

Representa um interesse de compra ou aluguel com critérios (local, tipo, preço, etc.).

### 5.1 Campos

| Campo | Tipo | Obrigatório | Decisão |
|-------|------|-------------|--------|
| **id** | TEXT (UUID) | Sim | Chave primária. |
| **clientId** | TEXT (FK Usuario) | Sim | Dono do interesse; CASCADE ao excluir usuário. |
| **locations** | TEXT[] | Não | Bairros/regiões de interesse; array nativo do PostgreSQL. |
| **compraOuAluguelId** | TEXT (FK CompraOuAluguel) | Sim | Compra ou aluguel; valor controlado por tabela de parâmetros. |
| **finalidadeId** | TEXT (FK Finalidade) | Sim | Finalidade do imóvel. |
| **tipoImovelId** | TEXT (FK TipoImovel) | Sim | Tipo do imóvel. |
| **tipoCasaId** | TEXT (FK TipoCasa) | Sim | Subtipo quando aplicável (ex.: indiferente). |
| **mobiliaId** | TEXT (FK Mobilia) | Sim | Mobiliado ou não. |
| **quartos** | INTEGER | Não | Número de quartos; NULL = indiferente. INTEGER para filtros e comparações. |
| **suites** | INTEGER | Não | Número de suítes; NULL = indiferente. |
| **metragemTerreno** | INTEGER | Não | Metragem do terreno em m². |
| **areaConstruida** | INTEGER | Não | Área construída em m². |
| **minPrice** | INTEGER | Sim, DEFAULT 0 | Valor mínimo da faixa; CHECK ≥ 0 e ≤ maxPrice. |
| **maxPrice** | INTEGER | Sim, DEFAULT 0 | Valor máximo da faixa. |
| **features** | TEXT[] | Não | Características desejadas (ex.: piscina); array flexível. |
| **notes** | TEXT | Sim, DEFAULT '' | Observações livres; DEFAULT '' evita NULL. |
| **isActive** | BOOLEAN | Sim, DEFAULT true | Soft delete do interesse. |
| **createdAt** | TIMESTAMP(3) | Sim, DEFAULT now() | Data de criação. |

### 5.2 Restrições (CHECKs)

- `minPrice >= 0` e `maxPrice >= 0`.
- `minPrice <= maxPrice`.
- `quartos`, `suites`, `metragemTerreno`, `areaConstruida`: quando não NULL, devem ser >= 0.

### 5.3 Índices

- **clientId:** listar interesses do cliente.
- **createdAt:** ordenar por data de criação.
- **isActive:** filtrar ativos/inativos.
- **(clientId, isActive):** listagem de interesses ativos por cliente.
- **(finalidadeId, tipoImovelId):** filtros por tipo e finalidade.
- **(minPrice, maxPrice):** buscas por faixa de preço.

---

## 6. Prospecto (Lead)

Representa um lead no funil comercial: um interesse que virou oportunidade. Relação 1:1 com InteresseImovel.

### 6.1 Campos

| Campo | Tipo | Obrigatório | Decisão |
|-------|------|-------------|--------|
| **id** | TEXT (UUID) | Sim | Chave primária. |
| **interestId** | TEXT (FK InteresseImovel) | Sim, UNIQUE | Um lead por interesse; CASCADE ao excluir interesse. |
| **brokerId** | TEXT (FK Usuario) | Não | Corretor responsável; NULL quando lead ainda não atribuído; SET NULL se corretor for removido. |
| **status** | LeadStatus | Sim, DEFAULT 'new' | Estágio do lead no funil. |
| **createdAt** | TIMESTAMP(3) | Sim, DEFAULT now() | Data de criação do lead. |

### 6.2 Índices

- **UNIQUE(interestId):** garante 1:1 com InteresseImovel.
- **brokerId:** “meus leads” (dashboard do corretor).
- **status:** fila por estágio.
- **createdAt:** ordenar por data.
- **(brokerId, status):** dashboard do corretor por status.
- **Índice parcial** em `status` WHERE `status = 'new'`: otimiza a fila de leads novos com índice menor.

---

## 7. Conversa

Representa um canal de conversa entre cliente e corretor a partir de um lead. Uma conversa por lead.

### 7.1 Campos

| Campo | Tipo | Obrigatório | Decisão |
|-------|------|-------------|--------|
| **id** | TEXT (UUID) | Sim | Chave primária. |
| **clientId** | TEXT (FK Usuario) | Sim | Participante cliente; CASCADE. |
| **brokerId** | TEXT (FK Usuario) | Sim | Participante corretor. |
| **leadId** | TEXT (FK Prospecto) | Sim, UNIQUE | Uma conversa por lead; ligação com o interesse via lead. |
| **propertyInterestSummary** | TEXT | Sim | Resumo do interesse (ex.: “Compra - Casa em Zona Sul - R$ 500k a R$ 800k”); evita JOIN ao InteresseImovel só para listar conversas. |
| **updatedAt** | TIMESTAMP(3) | Sim, DEFAULT now() | Atualizado a cada nova mensagem; usado para ordenar “conversas recentes”. |

### 7.2 Índices

- **UNIQUE(leadId):** garante uma conversa por lead.
- **clientId** e **brokerId:** listar conversas por participante.
- **updatedAt:** ordenar por última atividade.

---

## 8. Mensagem

Mensagens do chat entre cliente e corretor.

### 8.1 Campos

| Campo | Tipo | Obrigatório | Decisão |
|-------|------|-------------|--------|
| **id** | TEXT (UUID) | Sim | Chave primária. |
| **conversationId** | TEXT (FK Conversa) | Sim | Conversa a que pertence; CASCADE ao excluir conversa. |
| **senderId** | TEXT (FK Usuario) | Sim | Autor da mensagem. |
| **senderType** | SenderType | Sim | client ou broker; redundante com senderId+Conversa, mas torna a regra explícita e simplifica consultas. |
| **content** | TEXT | Sim | Conteúdo da mensagem. |
| **imageUrl** | TEXT | Não | URL de anexo (ex.: imagem). |
| **createdAt** | TIMESTAMP(3) | Sim, DEFAULT now() | Ordem cronológica. |

### 8.2 Índices

- **conversationId:** mensagens de uma conversa.
- **createdAt:** ordenação global (menos usado).
- **(conversationId, createdAt):** padrão de acesso típico do chat: “mensagens da conversa X em ordem cronológica”.

---

## 9. Integridade referencial (FKs)

### 9.1 Resumo das políticas

| Origem | Destino | ON DELETE | Motivo |
|--------|---------|-----------|--------|
| interesseimovel.clientId | usuario | CASCADE | Interesses do cliente são removidos com a conta. |
| interesseimovel.*Id (parâmetros) | finalidade, tipoimovel, etc. | RESTRICT | Não apagar parâmetro ainda referenciado. |
| prospecto.interestId | interesseimovel | CASCADE | Lead existe apenas com o interesse. |
| prospecto.brokerId | usuario | SET NULL | Lead permanece; fica sem corretor atribuído. |
| conversa.clientId, brokerId, leadId | usuario / prospecto | CASCADE | Conversa é removida com usuário ou lead, conforme regra de negócio. |
| mensagem.conversationId, senderId | conversa / usuario | CASCADE | Mensagens e conversas são removidas em cascata. |

### 9.2 Decisões

- **RESTRICT em parâmetros:** protege catálogos; desativação via campo `ativo` em vez de DELETE.
- **CASCADE em relações principais:** evita órfãos (interesses sem usuário, mensagens sem conversa).
- **SET NULL em Prospecto.brokerId:** preserva o lead e o histórico quando o corretor deixa a plataforma.

---

## 10. Índices e performance

### 10.1 Princípios adotados

- Índice em toda FK usada em filtros ou JOINs.
- Índices compostos para padrões de query comuns (ex.: cliente + ativo, broker + status).
- Índice parcial para cenário específico (leads com status = 'new').
- UNIQUE onde a regra de negócio exige (email, interestId, leadId).

### 10.2 Resumo por tabela

(Nomes físicos no banco em minúsculas: `finalidade`, `tipoimovel`, `tipocasa`, `compraoualuguel`, `mobilia`, `usuario`, `interesseimovel`, `prospecto`, `conversa`, `mensagem`.)

| Tabela (física) | Índices |
|------------------|---------|
| Parâmetros (finalidade, tipoimovel, etc.) | UNIQUE(codigo); INDEX(ativo, ordem). |
| usuario | UNIQUE(email); INDEX(type). |
| interesseimovel | clientId; createdAt; isActive; (clientId, isActive); (finalidadeId, tipoImovelId); (minPrice, maxPrice). |
| prospecto | UNIQUE(interestId); brokerId; status; createdAt; (brokerId, status); parcial(status) WHERE status = 'new'. |
| conversa | UNIQUE(leadId); clientId; brokerId; updatedAt. |
| mensagem | conversationId; createdAt; (conversationId, createdAt). |

### 10.3 Possíveis evoluções (BD.md)

- Índice GIN em `interesseimovel.locations` e `interesseimovel.features` se houver busca por conteúdo do array.
- Índice composto em conversa `(brokerId, updatedAt DESC)` ou `(clientId, updatedAt DESC)` se listagens por data forem críticas.

---

## Conclusão

O modelo do ImobiConnect foi desenhado com:

1. **Parametrização** por tabelas de domínio (Finalidade, TipoImovel, TipoCasa, CompraOuAluguel, Mobilia), com estrutura id/codigo/label/ativo/ordem.
2. **Tipos adequados:** inteiros para números e preços, TEXT para textos e UUIDs, arrays nativos para listas.
3. **Confiabilidade:** CHECKs em faixas e valores numéricos; FKs com políticas explícitas (CASCADE, RESTRICT, SET NULL).
4. **Performance:** índices em FKs e em colunas de filtro/ordenação; compostos e parcial onde há padrões de acesso conhecidos.
5. **Escalabilidade:** UUIDs como PKs; espaço para GIN em arrays e particionamento futuro (ex.: mensagem por tempo).

Este relatório serve como referência para manutenção do schema e para futuras migrações e otimizações.
