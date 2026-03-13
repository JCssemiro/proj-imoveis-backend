-- =============================================================================
-- ImobiConnect - Schema otimizado: escalabilidade, confiabilidade e performance
-- Parâmetros: finalidade, tipoImovel, tipoCasa, compraOuAluguel, mobilia
-- =============================================================================

-- Enums (mantidos para status e tipos de usuário)
CREATE TYPE "UserType" AS ENUM ('client', 'broker');
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'in_progress', 'closed');
CREATE TYPE "SenderType" AS ENUM ('client', 'broker');

-- =============================================================================
-- Tabelas de parâmetros (parametrização: sem alterar schema para novos valores)
-- =============================================================================

CREATE TABLE "Finalidade" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Finalidade_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TipoImovel" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TipoImovel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TipoCasa" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TipoCasa_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompraOuAluguel" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompraOuAluguel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Mobilia" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mobilia_pkey" PRIMARY KEY ("id")
);

-- Índices únicos por código (consistência e lookups rápidos)
CREATE UNIQUE INDEX "Finalidade_codigo_key" ON "Finalidade"("codigo");
CREATE UNIQUE INDEX "TipoImovel_codigo_key" ON "TipoImovel"("codigo");
CREATE UNIQUE INDEX "TipoCasa_codigo_key" ON "TipoCasa"("codigo");
CREATE UNIQUE INDEX "CompraOuAluguel_codigo_key" ON "CompraOuAluguel"("codigo");
CREATE UNIQUE INDEX "Mobilia_codigo_key" ON "Mobilia"("codigo");

-- Índices para listagens ordenadas (dropdowns, filtros)
CREATE INDEX "Finalidade_ativo_ordem_idx" ON "Finalidade"("ativo", "ordem");
CREATE INDEX "TipoImovel_ativo_ordem_idx" ON "TipoImovel"("ativo", "ordem");
CREATE INDEX "TipoCasa_ativo_ordem_idx" ON "TipoCasa"("ativo", "ordem");
CREATE INDEX "CompraOuAluguel_ativo_ordem_idx" ON "CompraOuAluguel"("ativo", "ordem");
CREATE INDEX "Mobilia_ativo_ordem_idx" ON "Mobilia"("ativo", "ordem");

-- =============================================================================
-- Usuario
-- =============================================================================

CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "cpf" TEXT,
    "creci" TEXT,
    "subscriptionActive" BOOLEAN,
    "avatar" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE INDEX "Usuario_type_idx" ON "Usuario"("type");

-- =============================================================================
-- InteresseImovel (tipos corretos + FKs para parâmetros)
-- =============================================================================

CREATE TABLE "InteresseImovel" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "locations" TEXT[],
    "compraOuAluguelId" TEXT NOT NULL,
    "finalidadeId" TEXT NOT NULL,
    "tipoImovelId" TEXT NOT NULL,
    "tipoCasaId" TEXT NOT NULL,
    "mobiliaId" TEXT NOT NULL,
    "quartos" INTEGER,
    "suites" INTEGER,
    "metragemTerreno" INTEGER,
    "areaConstruida" INTEGER,
    "minPrice" INTEGER NOT NULL DEFAULT 0,
    "maxPrice" INTEGER NOT NULL DEFAULT 0,
    "features" TEXT[],
    "notes" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteresseImovel_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "InteresseImovel_minPrice_non_negative" CHECK ("minPrice" >= 0),
    CONSTRAINT "InteresseImovel_maxPrice_non_negative" CHECK ("maxPrice" >= 0),
    CONSTRAINT "InteresseImovel_price_range" CHECK ("minPrice" <= "maxPrice"),
    CONSTRAINT "InteresseImovel_quartos_non_negative" CHECK ("quartos" IS NULL OR "quartos" >= 0),
    CONSTRAINT "InteresseImovel_suites_non_negative" CHECK ("suites" IS NULL OR "suites" >= 0),
    CONSTRAINT "InteresseImovel_metragem_non_negative" CHECK ("metragemTerreno" IS NULL OR "metragemTerreno" >= 0),
    CONSTRAINT "InteresseImovel_area_non_negative" CHECK ("areaConstruida" IS NULL OR "areaConstruida" >= 0)
);

CREATE INDEX "InteresseImovel_clientId_idx" ON "InteresseImovel"("clientId");
CREATE INDEX "InteresseImovel_createdAt_idx" ON "InteresseImovel"("createdAt");
CREATE INDEX "InteresseImovel_isActive_idx" ON "InteresseImovel"("isActive");
-- Índices compostos para filtros comuns (listagem por cliente ativo, busca por tipo/finalidade)
CREATE INDEX "InteresseImovel_clientId_isActive_idx" ON "InteresseImovel"("clientId", "isActive");
CREATE INDEX "InteresseImovel_finalidadeId_tipoImovelId_idx" ON "InteresseImovel"("finalidadeId", "tipoImovelId");
CREATE INDEX "InteresseImovel_minPrice_maxPrice_idx" ON "InteresseImovel"("minPrice", "maxPrice");

-- =============================================================================
-- Prospecto (Lead)
-- =============================================================================

CREATE TABLE "Prospecto" (
    "id" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "brokerId" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prospecto_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Prospecto_interestId_key" ON "Prospecto"("interestId");
CREATE INDEX "Prospecto_brokerId_idx" ON "Prospecto"("brokerId");
CREATE INDEX "Prospecto_status_idx" ON "Prospecto"("status");
CREATE INDEX "Prospecto_createdAt_idx" ON "Prospecto"("createdAt");
-- Índice composto para dashboard do corretor (leads novos por corretor)
CREATE INDEX "Prospecto_brokerId_status_idx" ON "Prospecto"("brokerId", "status");
-- Índice parcial para fila de leads não atribuídos (performance)
CREATE INDEX "Prospecto_status_new_idx" ON "Prospecto"("status") WHERE "status" = 'new';

-- =============================================================================
-- Conversa
-- =============================================================================

CREATE TABLE "Conversa" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "propertyInterestSummary" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversa_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Conversa_leadId_key" ON "Conversa"("leadId");
CREATE INDEX "Conversa_clientId_idx" ON "Conversa"("clientId");
CREATE INDEX "Conversa_brokerId_idx" ON "Conversa"("brokerId");
CREATE INDEX "Conversa_updatedAt_idx" ON "Conversa"("updatedAt");

-- =============================================================================
-- Mensagem
-- =============================================================================

CREATE TABLE "Mensagem" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mensagem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Mensagem_conversationId_idx" ON "Mensagem"("conversationId");
CREATE INDEX "Mensagem_createdAt_idx" ON "Mensagem"("createdAt");
-- Ordenação de mensagens por conversa
CREATE INDEX "Mensagem_conversationId_createdAt_idx" ON "Mensagem"("conversationId", "createdAt");

-- =============================================================================
-- Foreign Keys
-- =============================================================================

ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_compraOuAluguelId_fkey" FOREIGN KEY ("compraOuAluguelId") REFERENCES "CompraOuAluguel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_finalidadeId_fkey" FOREIGN KEY ("finalidadeId") REFERENCES "Finalidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_tipoImovelId_fkey" FOREIGN KEY ("tipoImovelId") REFERENCES "TipoImovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_tipoCasaId_fkey" FOREIGN KEY ("tipoCasaId") REFERENCES "TipoCasa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InteresseImovel" ADD CONSTRAINT "InteresseImovel_mobiliaId_fkey" FOREIGN KEY ("mobiliaId") REFERENCES "Mobilia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Prospecto" ADD CONSTRAINT "Prospecto_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "InteresseImovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Prospecto" ADD CONSTRAINT "Prospecto_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversa" ADD CONSTRAINT "Conversa_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Prospecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Mensagem" ADD CONSTRAINT "Mensagem_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
