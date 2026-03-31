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
const interestInclude = {
    client: true,
    finalidade: true,
    tipoimovel: true,
    tipocasa: true,
    mobilia: true,
    localizacoes: true,
    features: { include: { feature: true } },
};
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toPropertyInterest(row) {
        const label = (r) => r?.label ?? r?.codigo ?? '';
        const num = (n) => (n != null ? String(n) : '');
        const localizacoesResposta = row.localizacoes.map((loc) => loc.bairro || loc.cep || loc.municipiocodibge || '').filter(Boolean);
        const featuresResposta = row.features.map((f) => f.feature.label ?? f.feature.codigo);
        return {
            id: row.id,
            clientId: row.clientid,
            clientName: row.client.nome,
            clientPhone: row.client.telefone,
            clientEmail: row.client.email,
            locations: localizacoesResposta,
            compraOuAluguel: row.compraoualuguel,
            finalidade: label(row.finalidade),
            tipoImovel: label(row.tipoimovel),
            tipoCasa: label(row.tipocasa),
            quartos: num(row.quartos),
            suites: num(row.suites),
            metragemTerreno: num(row.metragemterreno),
            areaConstruida: num(row.areaconstruida),
            mobilia: label(row.mobilia),
            minPrice: row.minprice,
            maxPrice: row.maxprice,
            features: featuresResposta,
            notes: row.observacoes,
            createdAt: row.criadoem.toISOString(),
            isActive: row.ativo,
        };
    }
    async findAll(brokerId, filters, pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const interesseWhere = {};
        if (filters.tipoImovelId)
            interesseWhere.tipoimovelid = filters.tipoImovelId;
        if (filters.finalidadeId)
            interesseWhere.finalidadeid = filters.finalidadeId;
        if (filters.tipoCasaId)
            interesseWhere.tipocasaid = filters.tipoCasaId;
        if (filters.mobiliaId)
            interesseWhere.mobiliaid = filters.mobiliaId;
        if (filters.compraOuAluguel === 'compra' || filters.compraOuAluguel === 'aluguel') {
            interesseWhere.compraoualuguel = filters.compraOuAluguel;
        }
        if (filters.regiao) {
            interesseWhere.localizacoes = {
                some: {
                    OR: [
                        { cep: filters.regiao },
                        { bairro: filters.regiao },
                        { municipiocodibge: filters.regiao },
                    ],
                },
            };
        }
        if (filters.minPrice !== undefined && filters.minPrice !== null) {
            interesseWhere.minprice = { gte: filters.minPrice };
        }
        if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
            interesseWhere.maxprice = { lte: filters.maxPrice };
        }
        const prospectoWhere = {
            ...(filters.status && { status: filters.status }),
            ...(Object.keys(interesseWhere).length > 0 && { interesse: interesseWhere }),
        };
        if (filters.dataInicio || filters.dataFim) {
            prospectoWhere.criadoem = {};
            if (filters.dataInicio)
                prospectoWhere.criadoem.gte = new Date(filters.dataInicio);
            if (filters.dataFim)
                prospectoWhere.criadoem.lte = new Date(filters.dataFim);
        }
        const [total, leads] = await Promise.all([
            this.prisma.prospecto.count({ where: prospectoWhere }),
            this.prisma.prospecto.findMany({
                where: prospectoWhere,
                orderBy: { criadoem: 'desc' },
                include: {
                    interesse: { include: interestInclude },
                    corretor: true,
                },
                skip,
                take: size,
            }),
        ]);
        const conteudo = leads.map((l) => ({
            id: l.id,
            interest: this.toPropertyInterest(l.interesse),
            brokerId: l.corretorid,
            status: l.status,
            createdAt: l.criadoem.toISOString(),
        }));
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, conteudo);
    }
    async findOne(id) {
        const lead = await this.prisma.prospecto.findUnique({
            where: { id },
            include: {
                interesse: { include: interestInclude },
                corretor: true,
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead não encontrado');
        return {
            id: lead.id,
            interest: this.toPropertyInterest(lead.interesse),
            brokerId: lead.corretorid,
            status: lead.status,
            createdAt: lead.criadoem.toISOString(),
        };
    }
    async update(id, dto, currentBrokerId) {
        const lead = await this.prisma.prospecto.findUnique({
            where: { id },
            include: {
                interesse: { include: interestInclude },
                corretor: true,
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead não encontrado');
        if (dto.brokerId !== undefined && dto.brokerId !== null && dto.brokerId !== currentBrokerId) {
            throw new common_1.ForbiddenException('O corretor só pode atribuir o lead a si mesmo');
        }
        const updated = await this.prisma.prospecto.update({
            where: { id },
            data: {
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.brokerId !== undefined && { corretorid: dto.brokerId }),
            },
            include: {
                interesse: { include: interestInclude },
                corretor: true,
            },
        });
        return {
            id: updated.id,
            interest: this.toPropertyInterest(updated.interesse),
            brokerId: updated.corretorid,
            status: updated.status,
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