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
exports.InterestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const includeRelations = {
    client: true,
    compraOuAluguel: true,
    finalidade: true,
    tipoImovel: true,
    tipoCasa: true,
    mobilia: true,
};
function parseOptionalInt(value) {
    if (value === undefined || value === null)
        return null;
    if (typeof value === 'number')
        return isNaN(value) ? null : value;
    const s = String(value).trim();
    if (s === '')
        return null;
    const n = parseInt(s.replace(/\+$/, ''), 10);
    return isNaN(n) ? null : n;
}
let InterestsService = class InterestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(clientId, isActive) {
        const list = await this.prisma.interesseimovel.findMany({
            where: {
                clientId,
                ...(isActive !== undefined && { isActive }),
            },
            orderBy: { createdAt: 'desc' },
            include: includeRelations,
        });
        return list.map((i) => this.toPropertyInterest(i));
    }
    async findOne(id, clientId) {
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id },
            include: includeRelations,
        });
        if (!interest || interest.clientId !== clientId) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        return this.toPropertyInterest(interest);
    }
    async create(clientId, dto) {
        const client = await this.prisma.usuario.findUnique({
            where: { id: clientId },
        });
        if (!client)
            throw new common_1.NotFoundException('Cliente não encontrado');
        const minP = dto.valorMinimo ?? 0;
        const maxP = dto.valorMaximo ?? 0;
        if (minP > maxP) {
            throw new common_1.BadRequestException('valorMinimo não pode ser maior que valorMaximo');
        }
        const [compra, finalidade, tipoImovel, tipoCasa, mobilia] = await Promise.all([
            this.prisma.compraoualuguel.findUnique({ where: { codigo: dto.compraOuAluguel } }),
            this.prisma.finalidade.findUnique({ where: { codigo: dto.finalidade } }),
            this.prisma.tipoimovel.findUnique({ where: { codigo: dto.tipoImovel } }),
            this.prisma.tipocasa.findFirst({ where: { codigo: dto.tipoCasa ?? 'vazio' } }).then((r) => r ?? this.prisma.tipocasa.findFirst()),
            this.prisma.mobilia.findFirst({ where: { codigo: dto.mobilia ?? 'sem_mobilia' } }).then((r) => r ?? this.prisma.mobilia.findFirst()),
        ]);
        if (!compra || !finalidade || !tipoImovel || !tipoCasa || !mobilia) {
            throw new common_1.BadRequestException('Parâmetros de interesse não encontrados. Execute o seed do banco (finalidade, tipoimovel, compraoualuguel, tipocasa, mobilia).');
        }
        const created = await this.prisma.interesseimovel.create({
            data: {
                clientId,
                locations: dto.localizacoes ?? [],
                compraOuAluguelId: compra.id,
                finalidadeId: finalidade.id,
                tipoImovelId: tipoImovel.id,
                tipoCasaId: tipoCasa.id,
                mobiliaId: mobilia.id,
                quartos: parseOptionalInt(dto.quartos),
                suites: parseOptionalInt(dto.suites),
                metragemTerreno: parseOptionalInt(dto.metragemTerreno),
                areaConstruida: parseOptionalInt(dto.areaConstruida),
                minPrice: dto.valorMinimo ?? 0,
                maxPrice: dto.valorMaximo ?? 0,
                features: dto.caracteristicas ?? [],
                notes: dto.observacoes ?? '',
            },
        });
        await this.prisma.prospecto.create({
            data: { interestId: created.id, status: client_1.LeadStatus.new },
        });
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id: created.id },
            include: includeRelations,
        });
        if (!interest)
            throw new common_1.NotFoundException('Interesse não encontrado após criação');
        return this.toPropertyInterest(interest);
    }
    async update(id, clientId, dto) {
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id },
            include: includeRelations,
        });
        if (!interest || interest.clientId !== clientId) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        const minP = dto.valorMinimo ?? interest.minPrice;
        const maxP = dto.valorMaximo ?? interest.maxPrice;
        if (minP > maxP) {
            throw new common_1.BadRequestException('valorMinimo não pode ser maior que valorMaximo');
        }
        const data = {
            ...(dto.localizacoes !== undefined && { locations: dto.localizacoes }),
            ...(dto.quartos !== undefined && { quartos: parseOptionalInt(dto.quartos) }),
            ...(dto.suites !== undefined && { suites: parseOptionalInt(dto.suites) }),
            ...(dto.metragemTerreno !== undefined && {
                metragemTerreno: parseOptionalInt(dto.metragemTerreno),
            }),
            ...(dto.areaConstruida !== undefined && {
                areaConstruida: parseOptionalInt(dto.areaConstruida),
            }),
            ...(dto.valorMinimo !== undefined && { minPrice: dto.valorMinimo }),
            ...(dto.valorMaximo !== undefined && { maxPrice: dto.valorMaximo }),
            ...(dto.caracteristicas !== undefined && { features: dto.caracteristicas }),
            ...(dto.observacoes !== undefined && { notes: dto.observacoes }),
        };
        if (dto.compraOuAluguel !== undefined) {
            const rec = await this.prisma.compraoualuguel.findUnique({ where: { codigo: dto.compraOuAluguel } });
            if (!rec)
                throw new common_1.BadRequestException('compraOuAluguel inválido');
            data.compraOuAluguelId = rec.id;
        }
        if (dto.finalidade !== undefined) {
            const rec = await this.prisma.finalidade.findUnique({ where: { codigo: dto.finalidade } });
            if (!rec)
                throw new common_1.BadRequestException('finalidade inválida');
            data.finalidadeId = rec.id;
        }
        if (dto.tipoImovel !== undefined) {
            const rec = await this.prisma.tipoimovel.findUnique({ where: { codigo: dto.tipoImovel } });
            if (!rec)
                throw new common_1.BadRequestException('tipoImovel inválido');
            data.tipoImovelId = rec.id;
        }
        if (dto.tipoCasa !== undefined) {
            const rec = await this.prisma.tipocasa.findFirst({ where: { codigo: dto.tipoCasa ?? 'vazio' } }).then((r) => r ?? this.prisma.tipocasa.findFirst());
            if (!rec)
                throw new common_1.BadRequestException('tipoCasa inválido');
            data.tipoCasaId = rec.id;
        }
        if (dto.mobilia !== undefined) {
            const rec = await this.prisma.mobilia.findFirst({ where: { codigo: dto.mobilia ?? 'sem_mobilia' } }).then((r) => r ?? this.prisma.mobilia.findFirst());
            if (!rec)
                throw new common_1.BadRequestException('mobilia inválida');
            data.mobiliaId = rec.id;
        }
        const updated = await this.prisma.interesseimovel.update({
            where: { id },
            data,
            include: includeRelations,
        });
        return this.toPropertyInterest(updated);
    }
    async remove(id, clientId) {
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id },
        });
        if (!interest || interest.clientId !== clientId) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        await this.prisma.interesseimovel.update({
            where: { id },
            data: { isActive: false },
        });
    }
    toPropertyInterest(row) {
        const code = (r) => r?.codigo ?? '';
        const label = (r) => r?.label ?? r?.codigo ?? '';
        const num = (n) => (n != null ? String(n) : '');
        return {
            id: row.id,
            clientId: row.clientId,
            clientName: row.client.name,
            clientPhone: row.client.phone,
            clientEmail: row.client.email,
            locations: row.locations,
            compraOuAluguel: label(row.compraOuAluguel) || code(row.compraOuAluguel),
            finalidade: label(row.finalidade) || code(row.finalidade),
            tipoImovel: label(row.tipoImovel) || code(row.tipoImovel),
            tipoCasa: label(row.tipoCasa) || code(row.tipoCasa),
            quartos: num(row.quartos),
            suites: num(row.suites),
            metragemTerreno: num(row.metragemTerreno),
            areaConstruida: num(row.areaConstruida),
            mobilia: label(row.mobilia) || code(row.mobilia),
            minPrice: row.minPrice,
            maxPrice: row.maxPrice,
            features: row.features,
            notes: row.notes,
            createdAt: row.createdAt.toISOString(),
            isActive: row.isActive,
        };
    }
};
exports.InterestsService = InterestsService;
exports.InterestsService = InterestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InterestsService);
//# sourceMappingURL=interests.service.js.map