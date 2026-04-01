"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
const status_lead_1 = require("../common/constants/status-lead");
const decimal_1 = require("../common/utils/decimal");
const interestInclude = {
    client: true,
    finalidadecontratacao: true,
    finalidadeuso: true,
    tipoimovel: true,
    mobilia: true,
    urgencia: true,
    localizacoes: true,
};
function optInt(v) {
    if (v === undefined || v === '')
        return undefined;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : undefined;
}
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toInterestCard(row) {
        const locs = (row.localizacoes ?? [])
            .map((loc) => loc.bairro || loc.cidade || loc.cep || '')
            .filter(Boolean);
        return {
            id: row.id,
            clientId: row.clientid,
            clientName: row.client.nome,
            clientPhone: row.client.telefone,
            clientEmail: row.client.email,
            locations: locs,
            finalidadeContratacao: row.finalidadecontratacao.nome,
            finalidadeUso: row.finalidadeuso.nome,
            tipoImovel: row.tipoimovel.nome,
            mobilia: row.mobilia.nome,
            urgencia: row.urgencia.nome,
            aceitaFinanciamento: row.aceitafinanciamento,
            quartos: row.quartos ?? [],
            suites: row.suites ?? [],
            metragem: row.metragem,
            minPrice: (0, decimal_1.decimalToNumber)(row.minprice),
            maxPrice: (0, decimal_1.decimalToNumber)(row.maxprice),
            notes: row.observacoes,
            status: row.status,
            createdAt: row.criadoem.toISOString(),
            isActive: row.ativo,
        };
    }
    async findAll(_brokerId, filters, pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const statusFilter = optInt(filters.status);
        const where = {
            ativo: true,
            ...(statusFilter !== undefined
                ? { status: statusFilter }
                : { status: { not: status_lead_1.STATUS_LEAD.CLOSED } }),
        };
        const tipoCodigo = optInt(filters.tipoImovelCodigo);
        if (tipoCodigo !== undefined)
            where.tipoimovelcodigo = tipoCodigo;
        const fcCodigo = optInt(filters.finalidadeContratacaoCodigo);
        if (fcCodigo !== undefined) {
            where.finalidadecontratacaocodigo = fcCodigo;
        }
        else if (filters.compraOuAluguel === 'compra') {
            where.finalidadecontratacaocodigo = 1;
        }
        else if (filters.compraOuAluguel === 'aluguel') {
            where.finalidadecontratacaocodigo = 2;
        }
        const fuCodigo = optInt(filters.finalidadeUsoCodigo);
        if (fuCodigo !== undefined)
            where.finalidadeusocodigo = fuCodigo;
        const mobCodigo = optInt(filters.mobiliaCodigo);
        if (mobCodigo !== undefined)
            where.mobiliacodigo = mobCodigo;
        if (filters.regiao) {
            where.localizacoes = {
                some: {
                    OR: [
                        { cep: { contains: filters.regiao } },
                        { bairro: { contains: filters.regiao, mode: 'insensitive' } },
                        { cidade: { contains: filters.regiao, mode: 'insensitive' } },
                        { codibgecidade: filters.regiao },
                    ],
                },
            };
        }
        if (filters.minPrice !== undefined && filters.minPrice !== null) {
            where.minprice = { gte: filters.minPrice };
        }
        if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
            where.maxprice = { lte: filters.maxPrice };
        }
        if (filters.dataInicio || filters.dataFim) {
            where.criadoem = {};
            if (filters.dataInicio)
                where.criadoem.gte = new Date(filters.dataInicio);
            if (filters.dataFim)
                where.criadoem.lte = new Date(filters.dataFim);
        }
        const [total, rows] = await Promise.all([
            this.prisma.interesseimovel.count({ where }),
            this.prisma.interesseimovel.findMany({
                where,
                orderBy: { criadoem: 'desc' },
                include: interestInclude,
                skip,
                take: size,
            }),
        ]);
        const conteudo = rows.map((r) => ({
            id: r.id,
            interest: this.toInterestCard(r),
            createdAt: r.criadoem.toISOString(),
        }));
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, conteudo);
    }
    async findOne(id, _brokerId) {
        const row = await this.prisma.interesseimovel.findUnique({
            where: { id },
            include: interestInclude,
        });
        if (!row)
            throw new common_1.NotFoundException('Lead não encontrado');
        if ((0, status_lead_1.isClosedStatus)(row.status) || !row.ativo) {
            throw new common_1.NotFoundException('Lead não encontrado');
        }
        return {
            id: row.id,
            interest: this.toInterestCard(row),
            createdAt: row.criadoem.toISOString(),
        };
    }
    async update(id, dto, _currentBrokerId) {
        const row = await this.prisma.interesseimovel.findUnique({
            where: { id },
            include: interestInclude,
        });
        if (!row)
            throw new common_1.NotFoundException('Lead não encontrado');
        const updated = await this.prisma.interesseimovel.update({
            where: { id },
            data: {
                ...(dto.status !== undefined && { status: dto.status }),
            },
            include: interestInclude,
        });
        return {
            id: updated.id,
            interest: this.toInterestCard(updated),
            createdAt: updated.criadoem.toISOString(),
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map