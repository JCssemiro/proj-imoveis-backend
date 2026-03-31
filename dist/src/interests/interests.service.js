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
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
const includeRelations = {
    client: true,
    finalidade: true,
    tipoimovel: true,
    tipocasa: true,
    mobilia: true,
    localizacoes: true,
    features: { include: { feature: true } },
};
const MAX_LOCALIZACOES = 50;
const MAX_FEATURES = 30;
const MAX_OBSERVACOES_LENGTH = 5000;
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
    async findAll(clientid, ativo, pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = {
            clientid,
            ...(ativo !== undefined && { ativo }),
        };
        const [total, list] = await Promise.all([
            this.prisma.interesseimovel.count({ where }),
            this.prisma.interesseimovel.findMany({
                where,
                orderBy: { criadoem: 'desc' },
                include: includeRelations,
                skip,
                take: size,
            }),
        ]);
        const conteudo = list.map((i) => this.toPropertyInterest(i));
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, conteudo);
    }
    async findOne(id, clientid) {
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id },
            include: includeRelations,
        });
        if (!interest || interest.clientid !== clientid) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        return this.toPropertyInterest(interest);
    }
    async create(clientid, dto) {
        const client = await this.prisma.usuario.findUnique({
            where: { id: clientid },
        });
        if (!client)
            throw new common_1.NotFoundException('Cliente não encontrado');
        const localizacoes = dto.localizacoes ?? [];
        if (localizacoes.length > MAX_LOCALIZACOES) {
            throw new common_1.BadRequestException(`Máximo de ${MAX_LOCALIZACOES} localizações por interesse`);
        }
        const featureIdsInput = dto.featureIds ?? [];
        if (featureIdsInput.length > MAX_FEATURES) {
            throw new common_1.BadRequestException(`Máximo de ${MAX_FEATURES} características por interesse`);
        }
        const obs = dto.observacoes ?? '';
        if (obs.length > MAX_OBSERVACOES_LENGTH) {
            throw new common_1.BadRequestException(`Observações com no máximo ${MAX_OBSERVACOES_LENGTH} caracteres`);
        }
        const minP = dto.valorMinimo ?? 0;
        const maxP = dto.valorMaximo ?? 0;
        if (minP > maxP) {
            throw new common_1.BadRequestException('valorMinimo não pode ser maior que valorMaximo');
        }
        const compraOuAluguel = dto.compraOuAluguel;
        if (compraOuAluguel !== 'compra' && compraOuAluguel !== 'aluguel') {
            throw new common_1.BadRequestException('compraOuAluguel deve ser compra ou aluguel');
        }
        const [finalidade, tipoImovel, tipoCasa, mobilia] = await Promise.all([
            this.prisma.finalidade.findFirst({ where: { id: dto.finalidadeId, ativo: true } }),
            this.prisma.tipoimovel.findFirst({ where: { id: dto.tipoImovelId, ativo: true } }),
            dto.tipoCasaId
                ? this.prisma.tipocasa.findFirst({ where: { id: dto.tipoCasaId, ativo: true } })
                : this.prisma.tipocasa.findFirst({ where: { ativo: true }, orderBy: { ordem: 'asc' } }),
            dto.mobiliaId
                ? this.prisma.mobilia.findFirst({ where: { id: dto.mobiliaId, ativo: true } })
                : this.prisma.mobilia.findFirst({ where: { ativo: true }, orderBy: { ordem: 'asc' } }),
        ]);
        if (!finalidade || !tipoImovel || !tipoCasa || !mobilia) {
            const missing = [];
            if (!finalidade)
                missing.push('finalidadeId');
            if (!tipoImovel)
                missing.push('tipoImovelId');
            if (!tipoCasa)
                missing.push('tipoCasaId');
            if (!mobilia)
                missing.push('mobiliaId');
            throw new common_1.BadRequestException(`Parâmetros inválidos (${missing.join(', ')}). Use IDs retornados por GET /parametros (finalidade, tipoimovel, tipocasa, mobilia).`);
        }
        let featureIds = [];
        if (featureIdsInput.length > 0) {
            const features = await this.prisma.feature.findMany({
                where: { id: { in: featureIdsInput }, ativo: true },
            });
            if (features.length !== featureIdsInput.length) {
                const foundIds = new Set(features.map((f) => f.id));
                const missingIds = featureIdsInput.filter((id) => !foundIds.has(id));
                throw new common_1.BadRequestException(`Features não encontradas ou inativas (IDs inválidos). Use IDs de GET /parametros/feature.`);
            }
            featureIds = featureIdsInput;
        }
        const created = await this.prisma.$transaction(async (tx) => {
            const interesse = await tx.interesseimovel.create({
                data: {
                    clientid,
                    compraoualuguel: compraOuAluguel,
                    finalidadeid: finalidade.id,
                    tipoimovelid: tipoImovel.id,
                    tipocasaid: tipoCasa.id,
                    mobiliaid: mobilia.id,
                    quartos: parseOptionalInt(dto.quartos),
                    suites: parseOptionalInt(dto.suites),
                    metragemterreno: parseOptionalInt(dto.metragemTerreno),
                    areaconstruida: parseOptionalInt(dto.areaConstruida),
                    minprice: dto.valorMinimo ?? 0,
                    maxprice: dto.valorMaximo ?? 0,
                    observacoes: obs,
                },
            });
            if (localizacoes.length > 0) {
                await tx.localizacaointeresse.createMany({
                    data: localizacoes.map((loc) => ({
                        interesseimovelid: interesse.id,
                        cep: loc.cep ?? null,
                        municipiocodibge: loc.municipiocodibge ?? null,
                        bairro: loc.bairro ?? null,
                    })),
                });
            }
            if (featureIds.length > 0) {
                await tx.interesseimovelfeature.createMany({
                    data: featureIds.map((featureid) => ({
                        interesseimovelid: interesse.id,
                        featureid,
                    })),
                });
            }
            await tx.prospecto.create({
                data: { interesseimovelid: interesse.id, status: client_1.statuslead.new },
            });
            return interesse;
        });
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id: created.id },
            include: includeRelations,
        });
        if (!interest)
            throw new common_1.NotFoundException('Interesse não encontrado após criação');
        return this.toPropertyInterest(interest);
    }
    async update(id, clientid, dto) {
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id },
            include: includeRelations,
        });
        if (!interest || interest.clientid !== clientid) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        if (dto.localizacoes !== undefined && dto.localizacoes.length > MAX_LOCALIZACOES) {
            throw new common_1.BadRequestException(`Máximo de ${MAX_LOCALIZACOES} localizações por interesse`);
        }
        if (dto.featureIds !== undefined && dto.featureIds.length > MAX_FEATURES) {
            throw new common_1.BadRequestException(`Máximo de ${MAX_FEATURES} características por interesse`);
        }
        if (dto.observacoes !== undefined && dto.observacoes.length > MAX_OBSERVACOES_LENGTH) {
            throw new common_1.BadRequestException(`Observações com no máximo ${MAX_OBSERVACOES_LENGTH} caracteres`);
        }
        const minP = dto.valorMinimo === null ? 0 : dto.valorMinimo ?? interest.minprice;
        const maxP = dto.valorMaximo === null ? 0 : dto.valorMaximo ?? interest.maxprice;
        if (minP > maxP) {
            throw new common_1.BadRequestException('valorMinimo não pode ser maior que valorMaximo');
        }
        const data = {
            ...(dto.quartos !== undefined && { quartos: parseOptionalInt(dto.quartos) }),
            ...(dto.suites !== undefined && { suites: parseOptionalInt(dto.suites) }),
            ...(dto.metragemTerreno !== undefined && {
                metragemterreno: parseOptionalInt(dto.metragemTerreno),
            }),
            ...(dto.areaConstruida !== undefined && {
                areaconstruida: parseOptionalInt(dto.areaConstruida),
            }),
            ...(dto.valorMinimo !== undefined && { minprice: dto.valorMinimo ?? 0 }),
            ...(dto.valorMaximo !== undefined && { maxprice: dto.valorMaximo ?? 0 }),
            ...(dto.observacoes !== undefined && { observacoes: dto.observacoes }),
        };
        if (dto.compraOuAluguel !== undefined) {
            if (dto.compraOuAluguel !== 'compra' && dto.compraOuAluguel !== 'aluguel') {
                throw new common_1.BadRequestException('compraOuAluguel deve ser compra ou aluguel');
            }
            data.compraoualuguel = dto.compraOuAluguel;
        }
        if (dto.finalidadeId !== undefined) {
            const rec = await this.prisma.finalidade.findFirst({ where: { id: dto.finalidadeId, ativo: true } });
            if (!rec)
                throw new common_1.BadRequestException('finalidadeId inválido ou inativo. Use ID de GET /parametros/finalidade.');
            data.finalidadeid = rec.id;
        }
        if (dto.tipoImovelId !== undefined) {
            const rec = await this.prisma.tipoimovel.findFirst({ where: { id: dto.tipoImovelId, ativo: true } });
            if (!rec)
                throw new common_1.BadRequestException('tipoImovelId inválido ou inativo. Use ID de GET /parametros/tipoimovel.');
            data.tipoimovelid = rec.id;
        }
        if (dto.tipoCasaId !== undefined) {
            const rec = await this.prisma.tipocasa.findFirst({ where: { id: dto.tipoCasaId, ativo: true } });
            if (!rec)
                throw new common_1.BadRequestException('tipoCasaId inválido ou inativo. Use ID de GET /parametros/tipocasa.');
            data.tipocasaid = rec.id;
        }
        if (dto.mobiliaId !== undefined) {
            const rec = await this.prisma.mobilia.findFirst({ where: { id: dto.mobiliaId, ativo: true } });
            if (!rec)
                throw new common_1.BadRequestException('mobiliaId inválido ou inativo. Use ID de GET /parametros/mobilia.');
            data.mobiliaid = rec.id;
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.interesseimovel.update({ where: { id }, data });
            if (dto.localizacoes !== undefined) {
                await tx.localizacaointeresse.deleteMany({ where: { interesseimovelid: id } });
                if (dto.localizacoes.length > 0) {
                    await tx.localizacaointeresse.createMany({
                        data: dto.localizacoes.map((loc) => ({
                            interesseimovelid: id,
                            cep: loc.cep ?? null,
                            municipiocodibge: loc.municipiocodibge ?? null,
                            bairro: loc.bairro ?? null,
                        })),
                    });
                }
            }
            if (dto.featureIds !== undefined) {
                await tx.interesseimovelfeature.deleteMany({ where: { interesseimovelid: id } });
                if (dto.featureIds.length > 0) {
                    const features = await tx.feature.findMany({
                        where: { id: { in: dto.featureIds }, ativo: true },
                    });
                    if (features.length !== dto.featureIds.length) {
                        throw new common_1.BadRequestException('Um ou mais featureIds inválidos ou inativos. Use IDs de GET /parametros/feature.');
                    }
                    await tx.interesseimovelfeature.createMany({
                        data: dto.featureIds.map((featureid) => ({ interesseimovelid: id, featureid })),
                    });
                }
            }
        });
        const updated = await this.prisma.interesseimovel.findUnique({
            where: { id },
            include: includeRelations,
        });
        if (!updated)
            throw new common_1.NotFoundException('Interesse não encontrado');
        return this.toPropertyInterest(updated);
    }
    async remove(id, clientid) {
        const interest = await this.prisma.interesseimovel.findUnique({
            where: { id },
        });
        if (!interest || interest.clientid !== clientid) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        await this.prisma.interesseimovel.update({
            where: { id },
            data: { ativo: false },
        });
    }
    toPropertyInterest(row) {
        const label = (r) => r?.label ?? r?.codigo ?? '';
        const num = (n) => (n != null ? String(n) : '');
        const localizacoesResposta = row.localizacoes.map((loc) => ({
            cep: loc.cep ?? undefined,
            municipiocodibge: loc.municipiocodibge ?? undefined,
            bairro: loc.bairro ?? undefined,
        }));
        const featuresResposta = row.features.map((f) => f.feature.label ?? f.feature.codigo);
        return {
            id: row.id,
            clientId: row.clientid,
            clientName: row.client.nome,
            clientPhone: row.client.telefone,
            clientEmail: row.client.email,
            localizacoes: localizacoesResposta,
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
            observacoes: row.observacoes,
            createdAt: row.criadoem.toISOString(),
            isActive: row.ativo,
        };
    }
};
exports.InterestsService = InterestsService;
exports.InterestsService = InterestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InterestsService);
//# sourceMappingURL=interests.service.js.map