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
const interestInclude = {
    client: true,
    compraOuAluguel: true,
    finalidade: true,
    tipoImovel: true,
    tipoCasa: true,
    mobilia: true,
};
let LeadsService = class LeadsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    toPropertyInterest(row) {
        const label = (r) => r?.label ?? r?.codigo ?? '';
        const num = (n) => (n != null ? String(n) : '');
        return {
            id: row.id,
            clientId: row.clientId,
            clientName: row.client.name,
            clientPhone: row.client.phone,
            clientEmail: row.client.email,
            locations: row.locations,
            compraOuAluguel: label(row.compraOuAluguel),
            finalidade: label(row.finalidade),
            tipoImovel: label(row.tipoImovel),
            tipoCasa: label(row.tipoCasa),
            quartos: num(row.quartos),
            suites: num(row.suites),
            metragemTerreno: num(row.metragemTerreno),
            areaConstruida: num(row.areaConstruida),
            mobilia: label(row.mobilia),
            minPrice: row.minPrice,
            maxPrice: row.maxPrice,
            features: row.features,
            notes: row.notes,
            createdAt: row.createdAt.toISOString(),
            isActive: row.isActive,
        };
    }
    async findAll(brokerId, filters) {
        const leads = await this.prisma.lead.findMany({
            where: {
                ...(filters.status && { status: filters.status }),
                interest: {
                    ...(filters.tipoImovel && { tipoImovel: { codigo: filters.tipoImovel } }),
                    ...(filters.regiao && { locations: { has: filters.regiao } }),
                    ...(filters.maxPrice !== undefined && filters.maxPrice !== null && {
                        maxPrice: { lte: filters.maxPrice },
                    }),
                },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                interest: { include: interestInclude },
                broker: true,
            },
        });
        return leads.map((l) => ({
            id: l.id,
            interest: this.toPropertyInterest(l.interest),
            brokerId: l.brokerId,
            status: l.status,
            createdAt: l.createdAt.toISOString(),
        }));
    }
    async findOne(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                interest: { include: interestInclude },
                broker: true,
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead não encontrado');
        return {
            id: lead.id,
            interest: this.toPropertyInterest(lead.interest),
            brokerId: lead.brokerId,
            status: lead.status,
            createdAt: lead.createdAt.toISOString(),
        };
    }
    async update(id, dto, currentBrokerId) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                interest: { include: interestInclude },
                broker: true,
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead não encontrado');
        if (dto.brokerId !== undefined && dto.brokerId !== null && dto.brokerId !== currentBrokerId) {
            throw new common_1.ForbiddenException('O corretor só pode atribuir o lead a si mesmo');
        }
        const updated = await this.prisma.lead.update({
            where: { id },
            data: {
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.brokerId !== undefined && { brokerId: dto.brokerId }),
            },
            include: {
                interest: { include: interestInclude },
                broker: true,
            },
        });
        return {
            id: updated.id,
            interest: this.toPropertyInterest(updated.interest),
            brokerId: updated.brokerId,
            status: updated.status,
            createdAt: updated.createdAt.toISOString(),
        };
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map