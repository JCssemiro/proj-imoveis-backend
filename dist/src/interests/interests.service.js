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
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
const status_lead_1 = require("../common/constants/status-lead");
const decimal_1 = require("../common/utils/decimal");
const includeRelations = {
    client: true,
    finalidadecontratacao: true,
    finalidadeuso: true,
    tipoimovel: true,
    mobilia: true,
    urgencia: true,
    localizacoes: true,
};
const MAX_LOCALIZACOES = 50;
const MAX_OBSERVACOES_LENGTH = 5000;
function normalizeRoomList(arr) {
    if (!arr?.length)
        return [];
    return [...new Set(arr)].sort((a, b) => a - b);
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
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, list.map((i) => this.toPropertyInterest(i)));
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
        const client = await this.prisma.usuario.findUnique({ where: { id: clientid } });
        if (!client)
            throw new common_1.NotFoundException('Cliente não encontrado');
        const localizacoes = dto.localizacoes ?? [];
        if (localizacoes.length > MAX_LOCALIZACOES) {
            throw new common_1.BadRequestException(`Máximo de ${MAX_LOCALIZACOES} localizações por interesse`);
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
        const [fc, fu, tipo, mob, urg] = await Promise.all([
            this.prisma.finalidadecontratacao.findFirst({
                where: { codigo: dto.finalidadeContratacaoCodigo, ativo: true },
            }),
            this.prisma.finalidadeuso.findFirst({ where: { codigo: dto.finalidadeUsoCodigo, ativo: true } }),
            this.prisma.tipoimovel.findFirst({ where: { codigo: dto.tipoImovelCodigo, ativo: true } }),
            this.prisma.mobilia.findFirst({ where: { codigo: dto.mobiliaCodigo, ativo: true } }),
            this.prisma.urgencia.findFirst({ where: { codigo: dto.urgenciaCodigo, ativo: true } }),
        ]);
        if (!fc || !fu || !tipo || !mob || !urg) {
            throw new common_1.BadRequestException('Um ou mais códigos de parâmetros inválidos ou inativos. Consulte GET /parametros.');
        }
        if (tipo.finalidadeusocodigo !== dto.finalidadeUsoCodigo) {
            throw new common_1.BadRequestException('tipoImovelCodigo não pertence à finalidade de uso informada (finalidadeUsoCodigo).');
        }
        const quartos = normalizeRoomList(dto.quartos);
        const suites = normalizeRoomList(dto.suites);
        const created = await this.prisma.$transaction(async (tx) => {
            const interesse = await tx.interesseimovel.create({
                data: {
                    clientid,
                    finalidadecontratacaocodigo: fc.codigo,
                    finalidadeusocodigo: fu.codigo,
                    tipoimovelcodigo: tipo.codigo,
                    mobiliacodigo: mob.codigo,
                    urgenciacodigo: urg.codigo,
                    aceitafinanciamento: dto.aceitaFinanciamento,
                    quartos,
                    suites,
                    metragem: dto.metragem ?? null,
                    minprice: dto.valorMinimo ?? 0,
                    maxprice: dto.valorMaximo ?? 0,
                    observacoes: obs,
                    status: status_lead_1.STATUS_LEAD.NEW,
                },
            });
            if (localizacoes.length > 0) {
                await tx.localizacaointeresse.createMany({
                    data: localizacoes.map((loc) => ({
                        interesseimovelid: interesse.id,
                        cep: loc.cep?.trim() || null,
                        logradouro: loc.logradouro?.trim() || null,
                        bairro: loc.bairro?.trim() || null,
                        cidade: loc.cidade?.trim() || null,
                        uf: loc.uf?.trim().toUpperCase() || null,
                        codibgecidade: loc.codIbgeCidade?.trim() || null,
                    })),
                });
            }
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
        if (dto.observacoes !== undefined && dto.observacoes.length > MAX_OBSERVACOES_LENGTH) {
            throw new common_1.BadRequestException(`Observações com no máximo ${MAX_OBSERVACOES_LENGTH} caracteres`);
        }
        const minP = dto.valorMinimo === null
            ? 0
            : dto.valorMinimo !== undefined
                ? dto.valorMinimo
                : (0, decimal_1.decimalToNumber)(interest.minprice);
        const maxP = dto.valorMaximo === null
            ? 0
            : dto.valorMaximo !== undefined
                ? dto.valorMaximo
                : (0, decimal_1.decimalToNumber)(interest.maxprice);
        if (minP > maxP) {
            throw new common_1.BadRequestException('valorMinimo não pode ser maior que valorMaximo');
        }
        const finalidadeUsoTarget = dto.finalidadeUsoCodigo ?? interest.finalidadeusocodigo;
        const tipoImovelTarget = dto.tipoImovelCodigo ?? interest.tipoimovelcodigo;
        const data = {
            ...(dto.valorMinimo !== undefined && { minprice: dto.valorMinimo ?? 0 }),
            ...(dto.valorMaximo !== undefined && { maxprice: dto.valorMaximo ?? 0 }),
            ...(dto.observacoes !== undefined && { observacoes: dto.observacoes }),
            ...(dto.metragem !== undefined && { metragem: dto.metragem }),
            ...(dto.aceitaFinanciamento !== undefined && { aceitafinanciamento: dto.aceitaFinanciamento }),
            ...(dto.quartos !== undefined && { quartos: normalizeRoomList(dto.quartos) }),
            ...(dto.suites !== undefined && { suites: normalizeRoomList(dto.suites) }),
        };
        if (dto.finalidadeContratacaoCodigo !== undefined) {
            const rec = await this.prisma.finalidadecontratacao.findFirst({
                where: { codigo: dto.finalidadeContratacaoCodigo, ativo: true },
            });
            if (!rec)
                throw new common_1.BadRequestException('finalidadeContratacaoCodigo inválido.');
            data.finalidadecontratacao = { connect: { codigo: rec.codigo } };
        }
        if (dto.finalidadeUsoCodigo !== undefined) {
            const rec = await this.prisma.finalidadeuso.findFirst({
                where: { codigo: dto.finalidadeUsoCodigo, ativo: true },
            });
            if (!rec)
                throw new common_1.BadRequestException('finalidadeUsoCodigo inválido.');
            data.finalidadeuso = { connect: { codigo: rec.codigo } };
        }
        if (dto.tipoImovelCodigo !== undefined) {
            const rec = await this.prisma.tipoimovel.findFirst({
                where: { codigo: dto.tipoImovelCodigo, ativo: true },
            });
            if (!rec)
                throw new common_1.BadRequestException('tipoImovelCodigo inválido.');
            data.tipoimovel = { connect: { codigo: rec.codigo } };
        }
        if (dto.mobiliaCodigo !== undefined) {
            const rec = await this.prisma.mobilia.findFirst({
                where: { codigo: dto.mobiliaCodigo, ativo: true },
            });
            if (!rec)
                throw new common_1.BadRequestException('mobiliaCodigo inválido.');
            data.mobilia = { connect: { codigo: rec.codigo } };
        }
        if (dto.urgenciaCodigo !== undefined) {
            const rec = await this.prisma.urgencia.findFirst({
                where: { codigo: dto.urgenciaCodigo, ativo: true },
            });
            if (!rec)
                throw new common_1.BadRequestException('urgenciaCodigo inválido.');
            data.urgencia = { connect: { codigo: rec.codigo } };
        }
        if (dto.tipoImovelCodigo !== undefined || dto.finalidadeUsoCodigo !== undefined) {
            const tipo = await this.prisma.tipoimovel.findFirst({
                where: { codigo: tipoImovelTarget, ativo: true },
            });
            if (!tipo || tipo.finalidadeusocodigo !== finalidadeUsoTarget) {
                throw new common_1.BadRequestException('tipoImovelCodigo deve pertencer ao finalidadeUsoCodigo informado (ou já associado ao interesse).');
            }
        }
        await this.prisma.$transaction(async (tx) => {
            if (Object.keys(data).length > 0) {
                await tx.interesseimovel.update({ where: { id }, data });
            }
            if (dto.localizacoes !== undefined) {
                await tx.localizacaointeresse.deleteMany({ where: { interesseimovelid: id } });
                if (dto.localizacoes.length > 0) {
                    await tx.localizacaointeresse.createMany({
                        data: dto.localizacoes.map((loc) => ({
                            interesseimovelid: id,
                            cep: loc.cep?.trim() || null,
                            logradouro: loc.logradouro?.trim() || null,
                            bairro: loc.bairro?.trim() || null,
                            cidade: loc.cidade?.trim() || null,
                            uf: loc.uf?.trim().toUpperCase() || null,
                            codibgecidade: loc.codIbgeCidade?.trim() || null,
                        })),
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
        const interest = await this.prisma.interesseimovel.findUnique({ where: { id } });
        if (!interest || interest.clientid !== clientid) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        await this.prisma.interesseimovel.delete({ where: { id } });
    }
    async fecharLead(interesseId, clientid) {
        const interest = await this.prisma.interesseimovel.findUnique({ where: { id: interesseId } });
        if (!interest || interest.clientid !== clientid) {
            throw new common_1.NotFoundException('Interesse não encontrado');
        }
        if (interest.status === status_lead_1.STATUS_LEAD.CLOSED) {
            return { interesseId, status: interest.status };
        }
        await this.prisma.interesseimovel.update({
            where: { id: interesseId },
            data: { status: status_lead_1.STATUS_LEAD.CLOSED },
        });
        return { interesseId, status: status_lead_1.STATUS_LEAD.CLOSED };
    }
    toPropertyInterest(row) {
        const locs = (row.localizacoes ?? []).map((loc) => ({
            cep: loc.cep ?? undefined,
            logradouro: loc.logradouro ?? undefined,
            bairro: loc.bairro ?? undefined,
            cidade: loc.cidade ?? undefined,
            uf: loc.uf ?? undefined,
            codIbgeCidade: loc.codibgecidade ?? undefined,
        }));
        return {
            id: row.id,
            clientId: row.clientid,
            clientName: row.client.nome,
            clientPhone: row.client.telefone,
            clientEmail: row.client.email,
            localizacoes: locs,
            finalidadeContratacaoCodigo: row.finalidadecontratacaocodigo,
            finalidadeContratacao: row.finalidadecontratacao.nome,
            finalidadeUsoCodigo: row.finalidadeusocodigo,
            finalidadeUso: row.finalidadeuso.nome,
            tipoImovelCodigo: row.tipoimovelcodigo,
            tipoImovel: row.tipoimovel.nome,
            mobiliaCodigo: row.mobiliacodigo,
            mobilia: row.mobilia.nome,
            urgenciaCodigo: row.urgenciacodigo,
            urgencia: row.urgencia.nome,
            aceitaFinanciamento: row.aceitafinanciamento,
            quartos: row.quartos ?? [],
            suites: row.suites ?? [],
            metragem: row.metragem,
            minPrice: (0, decimal_1.decimalToNumber)(row.minprice),
            maxPrice: (0, decimal_1.decimalToNumber)(row.maxprice),
            observacoes: row.observacoes,
            status: row.status,
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